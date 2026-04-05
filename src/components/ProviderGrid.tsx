import { useEffect, useState } from 'react';
import type { Provider } from '../types';
import { ProviderCard } from './ProviderCard';
import { ProviderDetailsModal } from './ProviderDetailsModal';
import './Components.css';

interface ProviderGridProps {
  providers: Provider[];
}

export const ProviderGrid = ({ providers }: ProviderGridProps) => {
  const [activeProviderIndex, setActiveProviderIndex] = useState<number | null>(null);
  const activeProvider = activeProviderIndex !== null ? providers[activeProviderIndex] ?? null : null;

  useEffect(() => {
    if (!activeProvider) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeProvider]);

  if (providers.length === 0) {
    return (
      <div className="status-panel animate-fade-in">
        No plugins found matching your search.
      </div>
    );
  }

  return (
    <section className="provider-grid" aria-label="Provider list">
      {providers.map((provider, index) => (
        <ProviderCard
          key={provider.id}
          provider={provider}
          delayMs={180 + index * 35}
          onOpenDetails={() => setActiveProviderIndex(index)}
        />
      ))}

      {activeProvider && (
        <ProviderDetailsModal
          provider={activeProvider}
          onClose={() => setActiveProviderIndex(null)}
          onNext={() => {
            if (activeProviderIndex === null) return;
            setActiveProviderIndex((activeProviderIndex + 1) % providers.length);
          }}
          onPrevious={() => {
            if (activeProviderIndex === null) return;
            setActiveProviderIndex((activeProviderIndex - 1 + providers.length) % providers.length);
          }}
          currentIndex={activeProviderIndex ?? 0}
          totalProviders={providers.length}
        />
      )}
    </section>
  );
};
