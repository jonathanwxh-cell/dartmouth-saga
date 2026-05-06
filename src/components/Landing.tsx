import { useGameStore } from '../state/store';

function Landing() {
  const init = useGameStore((state) => state.init);

  return (
    <main className="landing-screen" aria-labelledby="project-title">
      <section className="landing-panel">
        <h1 id="project-title">The Dartmouth Saga</h1>
        <p>A card-swipe game about 70 years of AI history. v0.1 — coming soon.</p>
        <button className="primary-action" type="button" onClick={() => init()}>
          Begin
        </button>
      </section>
      <footer>Hanover, NH · Summer 1956</footer>
    </main>
  );
}

export default Landing;
