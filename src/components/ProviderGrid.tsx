import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { Provider } from '../types';
import './Components.css';

interface ProviderGridProps {
  providers: Provider[];
}

export const ProviderGrid = ({ providers }: ProviderGridProps) => {
  const [copiedProviderId, setCopiedProviderId] = useState<string | null>(null);

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
          {providers.map((provider, index) => (
            <tr key={provider.id} style={{ animationDelay: `${120 + (index * 35)}ms` }} className="animate-fade-in">
              <td data-label="Plugin">
                <div className="provider-name-cell">{provider.name}</div>
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
                  onClick={(e) => handleCopy(e, provider)}
                  className="add-button sora"
                  disabled={!provider.url}
                  style={{ cursor: provider.url ? 'pointer' : 'not-allowed', opacity: provider.url ? 1 : 0.5 }}
                >
                  {copiedProviderId === provider.id ? 'Copied!' : 'Copy'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
