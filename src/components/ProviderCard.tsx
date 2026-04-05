import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { Provider } from '../types';
import './Components.css';

interface ProviderCardProps {
  provider: Provider;
  delayMs: number;
  onOpenDetails: () => void;
}

export const ProviderCard = ({ provider, delayMs, onOpenDetails }: ProviderCardProps) => {
  const [copied, setCopied] = useState(false);
  const previewScrapers = provider.scrapers.slice(0, 4);

  const handleCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!provider.url) return;

    navigator.clipboard.writeText(provider.url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  return (
    <article
      className="glass-card provider-card animate-fade-in"
      style={{ animationDelay: `${delayMs}ms` }}
      onClick={onOpenDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenDetails();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="provider-mobile-compact" aria-hidden="true">
        <div className="provider-mobile-main">
          <span className="provider-mobile-title">{provider.name}</span>
          <span className="provider-mobile-sub">{provider.tags[0] || 'Unknown'} • {provider.scrapers.length} scrapers</span>
        </div>
        <span className="provider-mobile-arrow">→</span>
      </div>

      <header className="provider-header">
        <div className="provider-title-wrap">
          <h3 className="provider-title">{provider.name}</h3>
          <span className="provider-author">by {provider.author}</span>
        </div>
      </header>

      {provider.description && <p className="provider-desc">{provider.description}</p>}

      <div className="provider-scraper-preview" aria-label="Scraper previews">
        {previewScrapers.length > 0 ? (
          previewScrapers.map((scraper) => (
            scraper.logo ? (
              <img
                key={scraper.id}
                src={scraper.logo}
                alt={scraper.name}
                className="provider-scraper-dot"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span key={scraper.id} className="provider-scraper-dot fallback" aria-hidden="true">
                {scraper.name.charAt(0).toUpperCase()}
              </span>
            )
          ))
        ) : (
          <span className="provider-scraper-empty">No scrapers listed yet</span>
        )}
      </div>

      <div className="provider-tags">
        {provider.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="provider-meta-row">
        <span>{provider.scrapers.length} scraper{provider.scrapers.length === 1 ? '' : 's'}</span>
        <span>{provider.author}</span>
      </div>

      <div className="provider-footer">
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleCopy(event);
          }}
          className="add-button sora"
          disabled={!provider.url}
          style={{ cursor: provider.url ? 'pointer' : 'not-allowed', opacity: provider.url ? 1 : 0.5 }}
        >
          {copied ? 'Copied!' : 'Copy Manifest'}
        </button>

        <span className="details-hint">Tap card for details</span>
      </div>
    </article>
  );
};
