import { useState } from 'react';
import {
  ALL_ENDINGS,
  type Ending,
  endingCategoryLabel,
  endingHints
} from '../endings/era-1956';
import { useGameStore } from '../state/store';

type EndingGroup = {
  label: string;
  endings: Ending[];
};

const endingGroups: EndingGroup[] = [
  { label: 'Three main endings', endings: ALL_ENDINGS.filter((ending) => ending.kind === 'main') },
  {
    label: 'Twelve boundary endings',
    endings: ALL_ENDINGS.filter((ending) => ending.kind === 'boundary')
  }
];

function excerptFor(narrative: string) {
  return narrative.match(/.*?[.!?](?:\s|$)/)?.[0].trim() ?? narrative;
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(isoDate));
}

function reachCountLabel(count: number) {
  return `Reached ${count} ${count === 1 ? 'time' : 'times'}`;
}

function EndingsArchive() {
  const [isOpen, setIsOpen] = useState(false);
  const endingStats = useGameStore((state) => state.endingStats);

  return (
    <details
      className="endings-archive"
      data-testid="endings-archive"
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="endings-archive-summary">
        {isOpen ? 'Hide all endings' : 'Show all endings'}
      </summary>
      <div className="endings-archive-content">
        {endingGroups.map((group) => {
          const discoveredCount = group.endings.filter(
            (ending) => endingStats.discovered[ending.id]
          ).length;

          return (
            <section className="ending-category" key={group.label}>
              <h2>
                {group.label} ({discoveredCount} / {group.endings.length})
              </h2>
              <ol className="ending-list">
                {group.endings.map((ending) => {
                  const record = endingStats.discovered[ending.id];
                  const categoryLabel = endingCategoryLabel(ending);

                  return (
                    <li
                      className={`ending-row${record ? '' : ' ending-row--locked'}`}
                      key={ending.id}
                    >
                      {record ? (
                        <>
                          <h3>
                            <span aria-hidden="true">✦</span> {ending.title}
                          </h3>
                          <p>{excerptFor(ending.narrative)}</p>
                          <p className="ending-row-meta">
                            {reachCountLabel(record.count)} · First on {formatDate(record.firstSeen)}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3>???</h3>
                          <p className="ending-row-meta">
                            {categoryLabel} · {endingHints[ending.id]}
                          </p>
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </details>
  );
}

export default EndingsArchive;
