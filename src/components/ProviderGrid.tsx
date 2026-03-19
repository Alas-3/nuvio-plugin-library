import { Fragment, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { Provider } from '../types';
import './Components.css';

interface ProviderGridProps {
  providers: Provider[];
}

export const ProviderGrid = ({ providers }: ProviderGridProps) => {
  const [copiedProviderId, setCopiedProviderId] = useState<string | null>(null);
  const [expandedProviderIds, setExpandedProviderIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (providerId: string) => {
    setExpandedProviderIds((prev) => {
      const next = new Set(prev);
      if (next.has(providerId)) {
        next.delete(providerId);
      } else {
        next.add(providerId);
      }
      return next;
    });
  };

  const handleRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>, providerId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpanded(providerId);
    }
  };

  const handleCopy = (e: MouseEvent<HTMLButtonElement>, provider: Provider) => {
    e.preventDefault();
    if (!provider.url) return;

    navigator.clipboard.writeText(provider.url).then(() => {
      setCopiedProviderId(provider.id);
      setTimeout(() => setCopiedProviderId(null), 2000);
    });
  };

  if (providers.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0' }} className="animate-fade-in">
        No plugins found matching your search.
      </div>
    );
  }

  return (
    <div className="provider-table-wrap glass-card animate-fade-in">
      <table className="provider-table">
        <thead>
          <tr>
            <th>Plugin</th>
            <th className="provider-author-col">Author</th>
            <th className="provider-tags-col">Tags</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider, index) => {
            const isExpanded = expandedProviderIds.has(provider.id);
            return (
              <Fragment key={provider.id}>
                <tr
                  style={{ animationDelay: `${120 + (index * 35)}ms` }}
                  className={`animate-fade-in provider-row-clickable ${isExpanded ? 'is-expanded' : ''}`}
                  onClick={() => toggleExpanded(provider.id)}
                  onKeyDown={(e) => handleRowKeyDown(e, provider.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                >
                  <td data-label="Plugin">
                    <div className="provider-name-row">
                      <span className={`expand-toggle ${isExpanded ? 'expanded' : ''}`} aria-hidden="true">
                        <svg viewBox="0 0 20 20" className="expand-toggle-icon" focusable="false">
                          <path d="M7 4.5L13 10L7 15.5" />
                        </svg>
                      </span>
                      <div className="provider-name-cell">{provider.name}</div>
                    </div>
                    <div className="mobile-meta-inline">
                      By: {provider.author}
                      {provider.tags[0] ? ` • ${provider.tags[0]}` : ''}
                    </div>
                  </td>
                  <td data-label="Author" className="provider-author-cell provider-author-col">{provider.author}</td>
                  <td data-label="Tags" className="provider-tags-col">
                    <div className="provider-tags">
                      {provider.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td data-label="Action" className="provider-action-cell">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(e, provider);
                      }}
                      className="add-button sora"
                      disabled={!provider.url}
                      style={{ cursor: provider.url ? 'pointer' : 'not-allowed', opacity: provider.url ? 1 : 0.5 }}
                    >
                      {copiedProviderId === provider.id ? 'Copied!' : 'Copy'}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="provider-details-row">
                    <td colSpan={4}>
                      <div className="provider-details-wrap">
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
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
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
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
