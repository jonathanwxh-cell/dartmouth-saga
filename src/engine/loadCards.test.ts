import { parseCardModules } from './loadCards';
import { makeCard } from './testFixtures';

describe('parseCardModules', () => {
  it('loads all card JSONs and validates them', () => {
    const modules = {
      '/fixtures/one.json': { default: makeCard({ id: 'one' }) },
      '/fixtures/two.json': { default: makeCard({ id: 'two' }) }
    };

    expect(parseCardModules(modules).map((card) => card.id)).toEqual(['one', 'two']);
  });

  it('throws with the offending filename when validation fails', () => {
    const modules = {
      '/fixtures/bad.json': { default: { id: 'bad-card' } }
    };

    expect(() => parseCardModules(modules)).toThrow(/bad\.json/);
  });
});
