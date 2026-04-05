import type { KeyboardEvent, MouseEvent } from 'react';
import type { Provider } from '../types';
import './Components.css';

interface ProviderDetailsModalProps {
  provider: Provider;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalProviders: number;
}

export const ProviderDetailsModal = ({
  provider,
  onClose,
  onNext,
  onPrevious,
  currentIndex,
  totalProviders,
}: ProviderDetailsModalProps) => {
  const stopBubble = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }

    if (event.key === 'ArrowRight') {
      onNext();
    }

    if (event.key === 'ArrowLeft') {
      onPrevious();
    }
  };

  const supportedLanguages = Array.from(
    new Set(provider.scrapers.flatMap((scraper) => scraper.contentLanguage).filter(Boolean))
  );

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${provider.name} details`}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-card glass-card" onClick={stopBubble}>
        <div className="modal-head">
          <div>
            <h3 className="modal-title">{provider.name}</h3>
            <p className="modal-subtitle">
              by {provider.author}
            </p>
            <p className="modal-position">Provider {currentIndex + 1} of {totalProviders}</p>
          </div>
          <div className="modal-head-actions">
            <button type="button" className="modal-nav" onClick={onPrevious} aria-label="Previous provider">
              ← Prev
            </button>
            <button type="button" className="modal-nav" onClick={onNext} aria-label="Next provider">
              Next →
            </button>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close details">
              Close
            </button>
          </div>
        </div>

        <div className="modal-stats">
          <div className="modal-stat">
            <span className="modal-stat-label">Scrapers</span>
            <span className="modal-stat-value">{provider.scrapers.length}</span>
          </div>
          <div className="modal-stat">
            <span className="modal-stat-label">Primary Tag</span>
            <span className="modal-stat-value">{provider.tags[0] || 'Unknown'}</span>
          </div>
          <div className="modal-stat">
            <span className="modal-stat-label">Languages</span>
            <span className="modal-stat-value">{supportedLanguages.length || 0}</span>
          </div>
        </div>

        <div className="provider-tags modal-tags">
          {provider.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="modal-section">
          <h4>Scraper Catalog</h4>
          {provider.scrapers.length === 0 ? (
            <div className="scraper-empty">No scrapers found in this plugin manifest.</div>
          ) : (
            <ul className="scraper-list">
              {provider.scrapers.map((scraper) => (
                <li key={scraper.id} className="scraper-item">
                  <div className="scraper-header">
                    {scraper.logo ? (
                      <img
                        src={scraper.logo}
                        alt={`${scraper.name} logo`}
                        className="scraper-logo"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="scraper-logo-fallback" aria-hidden="true">
                        {scraper.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="scraper-name">{scraper.name}</div>
                  </div>
                  {scraper.description && <div className="scraper-desc">{scraper.description}</div>}
                  <div className="scraper-meta">
                    <span className="scraper-meta-label">Types:</span>
                    <span>{scraper.supportedTypes.length > 0 ? scraper.supportedTypes.join(', ') : 'Unknown'}</span>
                    <span className="scraper-meta-label">Language:</span>
                    <span>{scraper.contentLanguage.length > 0 ? scraper.contentLanguage.join(', ') : 'Unknown'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
