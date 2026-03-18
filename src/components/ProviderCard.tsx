import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { Provider } from '../types';
import './Components.css';

interface ProviderCardProps {
  provider: Provider;
  delayMs: number;
}

export const ProviderCard = ({ provider, delayMs }: ProviderCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!provider.url) return;
    navigator.clipboard.writeText(provider.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div 
      className="glass-card provider-card animate-fade-in" 
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="provider-header">
        <div>
          <h3 className="provider-title">{provider.name}</h3>
          <span className="provider-author">by {provider.author}</span>
        </div>
      </div>
      <p className="provider-desc">{provider.description}</p>
      <div className="provider-footer">
        <div className="provider-tags">
          {provider.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <button 
          onClick={handleCopy} 
          className="add-button sora"
          disabled={!provider.url}
          style={{ cursor: provider.url ? 'pointer' : 'not-allowed', opacity: provider.url ? 1 : 0.5 }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};
