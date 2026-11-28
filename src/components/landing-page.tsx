import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { OzlindMark } from "./ozlind-mark";

const capabilities = [
  {
    number: "01",
    name: "AI conversations",
    description: "Think, write, learn and solve problems with Gemini and Groq-powered chat.",
    status: "Available",
    icon: "✳"
  },
  {
    number: "02",
    name: "Live research",
    description: "Explore current information with web search and source links.",
    status: "Available",
    icon: "⌕"
  },
  {
    number: "03",
    name: "File understanding",
    description: "Ask questions about supported images, PDFs and short video clips.",
    status: "Available",
    icon: "▤"
  },
  {
    number: "04",
    name: "Voice input",
    description: "Speak naturally and turn recordings into text for your conversation.",
    status: "Available",
    icon: "◖"
  }
];

export function LandingPage() {
  return (
    <main className="site-shell">
      <header className="site-nav">
        <Link href="/" className="site-brand" aria-label="Ozlind home">
          <OzlindMark className="site-brand-mark-svg" />
          <span>ozlind<span className="site-brand-period">.</span></span>
        </Link>
        <nav className="site-nav-links" aria-label="Main navigation">
          <a href="#capabilities">Capabilities</a>
          <a href="#approach">Our approach</a>
        </nav>
        <div className="site-nav-actions"><ThemeToggle /><Link className="site-nav-cta" href="/workspace">Open Ozlind <span>↗</span></Link></div>
      </header>

      <section className="site-hero">
        <div className="site-hero-copy">
          <div className="site-overline"><span className="site-status-dot" /> AN AI WORKSPACE, BUILT FOR REAL WORK</div>
          <h1>Make your next<br /><span>move matter.</span></h1>
          <p className="site-hero-description">
            One considered workspace for thinking, research, writing and understanding the world around your work.
          </p>
          <div className="site-hero-actions">
            <Link href="/workspace" className="site-primary-cta">Start a conversation <span>→</span></Link>
            <a href="#capabilities" className="site-secondary-cta">Explore capabilities</a>
          </div>
          <div className="site-hero-meta">
            <span><i /> No account required</span>
            <span><i /> History stays in this browser</span>
          </div>
        </div>

        <div className="site-product-preview" aria-label="Ozlind workspace preview">
          <div className="site-preview-window">
            <div className="site-preview-bar">
              <div className="site-preview-brand"><OzlindMark className="site-brand-mark-svg" /> ozlind</div>
              <span className="site-preview-label">WORKSPACE PREVIEW</span>
              <span className="site-preview-dots"><i /><i /><i /></span>
            </div>
            <div className="site-preview-content">
              <div className="site-preview-kicker">YOUR AI WORKSPACE</div>
              <h2>Where would you<br /><span>like to begin?</span></h2>
              <p>Bring a question, a document, or an idea worth exploring.</p>
              <div className="site-preview-prompt">
                <span>Help me make sense of a complex idea…</span>
                <b>↑</b>
              </div>
              <div className="site-preview-tools">
                <span><i>✳</i> Chat</span>
                <span><i>⌕</i> Research</span>
                <span><i>▤</i> Files</span>
              </div>
            </div>
            <div className="site-preview-footer"><span /> Gemini + Groq models <span className="site-preview-footer-right">Designed for focus</span></div>
          </div>
          <div className="site-preview-caption"><span>01 / 04</span> A focused space for meaningful work</div>
        </div>
      </section>

      <section className="site-capabilities" id="capabilities">
        <div className="site-section-heading">
          <div>
            <p className="site-overline">THE TOOLKIT</p>
            <h2>Useful capabilities.<br /><span>One coherent experience.</span></h2>
          </div>
          <p>Ozlind brings its available AI tools into one workspace. Each capability is presented clearly, without pretending unfinished features are ready.</p>
        </div>
        <div className="site-capability-grid">
          {capabilities.map((capability) => (
            <article className="site-capability-card" key={capability.number}>
              <div className="site-capability-top">
                <span>{capability.number}</span>
                <span className="site-capability-icon" aria-hidden="true">{capability.icon}</span>
              </div>
              <div className="site-capability-status"><i /> {capability.status}</div>
              <h3>{capability.name}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-approach" id="approach">
        <div className="site-approach-mark"><OzlindMark className="site-brand-mark-svg" /></div>
        <div className="site-approach-copy">
          <p className="site-overline">THE OZLIND STANDARD</p>
          <h2>Less theatre.<br /><span>More intelligence.</span></h2>
          <p>A great AI product is not a collection of buttons. It is a reliable experience: clear controls, useful answers, honest limitations, thoughtful details and performance that earns trust.</p>
          <Link href="/workspace" className="site-text-link">Experience the workspace <span>↗</span></Link>
        </div>
        <div className="site-approach-aside">
          <span>OUR PRINCIPLES</span>
          <p><b>01</b> Clarity before complexity</p>
          <p><b>02</b> Function before decoration</p>
          <p><b>03</b> Reliability before claims</p>
        </div>
      </section>

      <footer className="site-footer">
        <Link href="/" className="site-brand" aria-label="Ozlind home">
          <span className="site-brand-mark"><i /></span>
          <span>ozlind<span className="site-brand-period">.</span></span>
        </Link>
        <span>Built for what comes next.</span>
        <span>© {new Date().getFullYear()} Ozlind</span>
      </footer>
    </main>
  );
}
