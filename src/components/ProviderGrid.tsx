import { ProviderCard } from './ProviderCard';
import type { Provider } from '../types';
import './Components.css';

interface ProviderGridProps {
  providers: Provider[];
}

export const ProviderGrid = ({ providers }: ProviderGridProps) => {
  if (providers.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0' }} className="animate-fade-in">
        No plugins found matching your search.
      </div>
    );
  }

  return (
    <div className="provider-grid">
      {providers.map((provider, index) => (
        <ProviderCard 
          key={provider.id} 
          provider={provider} 
          delayMs={200 + (index * 50)} 
        />
      ))}
    </div>
  );
};
