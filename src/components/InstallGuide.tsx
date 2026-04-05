import './Components.css';

export const InstallGuide = () => {
  return (
    <section className="install-guide glass-card animate-fade-in" style={{ animationDelay: '150ms' }}>
      <div className="install-guide-head">
        <span className="eyebrow">Quick Start</span>
        <h2>How to install a plugin in Nuvio</h2>
        <p>
          Every provider includes a manifest URL. Copy it, paste it into Nuvio, and the app loads
          available scrapers automatically.
        </p>
      </div>

      <ol className="install-steps">
        <li>
          Open Nuvio and go to <strong>Settings</strong>.
        </li>
        <li>
          Enter <strong>Plugins</strong> and choose <strong>Add Provider</strong>.
        </li>
        <li>
          Press <strong>Copy</strong> on any provider card below, then paste the URL into Nuvio.
        </li>
        <li>
          Save and test a scraper to confirm the provider is active.
        </li>
      </ol>
    </section>
  );
};
