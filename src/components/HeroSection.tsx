import { FaDiscord, FaDownload } from 'react-icons/fa';
import './Components.css';

interface HeroSectionProps {
  totalProviders: number;
  totalScrapers: number;
}

export const HeroSection = ({ totalProviders, totalScrapers }: HeroSectionProps) => {
  return (
    <section className="hero animate-fade-in">
      <div className="hero-badge-row" aria-label="Community links and status">
        <span className="eyebrow hero-eyebrow">Nuvio</span>
        <span className="eyebrow hero-eyebrow hero-badge-neutral">Official</span>
        <a
          className="eyebrow hero-eyebrow hero-link-badge"
          href="https://nuvioapp.space"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download Nuvio"
        >
          <FaDownload aria-hidden="true" />
          Download Nuvio
        </a>
        <a
          className="eyebrow hero-eyebrow hero-link-badge"
          href="https://discord.gg/Nps9Ye2HNs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nuvio Discord server"
        >
          <FaDiscord aria-hidden="true" />
          Discord
        </a>
      </div>
      <div className="hero-title-container">
        <img src="/NuvioLogo.png" alt="Nuvio Logo" className="hero-logo" />
        <h1 className="hero-title">Community Plugins and Add-ons</h1>
      </div>
      <p className="hero-subtitle">
        Get the most out of Nuvio with plugins created by our community. Officially verified by the community and developers.
      </p>
      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-label">Total Providers</span>
          <span className="hero-stat-value">{totalProviders}</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-label">Scrapers Listed</span>
          <span className="hero-stat-value">{totalScrapers}</span>
        </div>
      </div>
    </section>
  );
};
