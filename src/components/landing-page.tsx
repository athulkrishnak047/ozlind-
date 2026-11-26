import Link from "next/link";

const capabilities = [
  { number: "01", title: "Think with clarity", copy: "Turn tangled questions into clear thinking, useful context, and decisions you can stand behind.", icon: "✳" },
  { number: "02", title: "Create with momentum", copy: "Move from a rough thought to a thoughtful draft, a plan, or a working first version.", icon: "↗" },
  { number: "03", title: "Build with confidence", copy: "Work through complex problems with an assistant designed to be direct, careful, and useful.", icon: "⌘" }
];

export function LandingPage() {
  return (
    <main className="landing">
      <div className="landing-ambient landing-ambient-one" aria-hidden="true" />
      <div className="landing-ambient landing-ambient-two" aria-hidden="true" />
      <header className="landing-nav">
        <Link href="/" className="landing-brand" aria-label="Ozlind home">
          <span className="landing-brand-mark"><span /></span>
          <span>ozlind<span className="landing-brand-dot">.</span></span>
        </Link>
        <nav className="landing-links" aria-label="Main navigation">
          <a href="#experience">Experience</a>
          <a href="#principles">Principles</a>
          <a href="#about">About</a>
        </nav>
        <Link className="landing-nav-cta" href="/workspace">Open workspace <span>↗</span></Link>
      </header>

      <section className="landing-hero" id="experience">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow"><span /> A MORE THOUGHTFUL AI WORKSPACE</div>
          <h1>Make room for your <span>next big idea.</span></h1>
          <p className="landing-lede">A calmer space to think, create, and move forward. Bring your questions, explore what is possible, and turn good ideas into meaningful progress.</p>
          <div className="landing-actions">
            <Link href="/workspace" className="landing-primary">Start exploring <span>→</span></Link>
            <a href="#principles" className="landing-secondary">Discover Ozlind <span>↓</span></a>
          </div>
          <div className="landing-proof">
            <span className="landing-proof-icon">✦</span>
            <span>Made for curiosity. Designed for momentum.</span>
          </div>
        </div>

        <div className="landing-visual" aria-label="Preview of the Ozlind AI workspace">
          <div className="landing-orbit orbit-one" />
          <div className="landing-orbit orbit-two" />
          <div className="landing-orb"><span>✳</span></div>
          <div className="landing-glass-card landing-card-main">
            <div className="preview-topline"><span className="preview-brand"><i /> OZLIND</span><span className="preview-live"><i /> READY TO EXPLORE</span></div>
            <div className="preview-greeting">Good ideas start<br /><em>with a question.</em></div>
            <div className="preview-prompt">How can I turn a big idea into a clear first step?</div>
            <div className="preview-response">
              <span className="preview-response-mark">✳</span>
              <div><strong>Start with the outcome.</strong><p>Let&apos;s make the goal concrete, identify what matters most, and find one useful action to take next.</p></div>
            </div>
            <div className="preview-input"><span>Ask Ozlind anything...</span><b>↑</b></div>
          </div>
          <div className="landing-float-chip chip-top"><span>✧</span> Clarity, not clutter</div>
          <div className="landing-float-chip chip-bottom"><span>⌁</span> Ideas into action</div>
        </div>
      </section>

      <section className="landing-capabilities" id="principles">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">A BETTER WAY TO WORK WITH AI</p>
          <h2>Less noise. <span>More possibility.</span></h2>
          <p>Ozlind brings powerful assistance into an experience that feels clear, considered, and human.</p>
        </div>
        <div className="landing-capability-grid">
          {capabilities.map((item) => (
            <article className="landing-capability" key={item.number}>
              <div className="capability-top"><span>{item.number}</span><i>{item.icon}</i></div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="capability-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="landing-manifesto" id="about">
        <div className="manifesto-mark">✳</div>
        <div>
          <p className="landing-eyebrow">BUILT AROUND YOUR THINKING</p>
          <h2>Technology should make the hard things <span>feel possible.</span></h2>
          <p>Ozlind is being shaped around a simple belief: the best tools do more than answer. They help you see clearly, ask better questions, and make progress that matters.</p>
          <Link href="/workspace" className="manifesto-link">Step into Ozlind <span>↗</span></Link>
        </div>
      </section>

      <footer className="landing-footer">
        <Link href="/" className="landing-brand"><span className="landing-brand-mark"><span /></span><span>ozlind<span className="landing-brand-dot">.</span></span></Link>
        <span>Think clearly. Build boldly.</span>
        <span>© {new Date().getFullYear()} Ozlind</span>
      </footer>
    </main>
  );
}
