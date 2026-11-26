import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <div className="orb orbOne" aria-hidden="true" />
      <div className="orb orbTwo" aria-hidden="true" />
      <section className="panel" aria-labelledby="page-title">
        <div className="brand"><span className="brandMark" aria-hidden="true">O</span><span>OZLIND</span></div>
        <p className="eyebrow">CORE FOUNDATION · PHASE 01</p>
        <h1 id="page-title">Built with intent.<br /><span>Engineered to grow.</span></h1>
        <p className="intro">
          The engineering foundation is being established before product capabilities are added.
          Reliability, privacy, and clear system boundaries come first.
        </p>
        <div className="status" role="status"><span className="statusDot" />Foundation workspace</div>
        <div className="actions">
          <Link className="primaryAction" href="/api/health">View service health <span aria-hidden="true">↗</span></Link>
          <span className="version">v0.1.0 · Foundation</span>
        </div>
      </section>
      <footer>Ozlind · A platform designed to earn trust.</footer>
    </main>
  );
}
