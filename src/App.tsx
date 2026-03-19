import { useState, useMemo } from 'react';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { ProviderGrid } from './components/ProviderGrid';
import { Footer } from './components/Footer';
import { useNotionProviders } from './hooks/useNotionProviders';

// The Notion Page ID containing the plugin table
const NOTION_PAGE_ID = '326981dcb87e80f6b9f6f23469a00fd3';

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const { providers, loading, error } = useNotionProviders(NOTION_PAGE_ID);

  const filteredProviders = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);
    if (!normalizedQuery) return providers;

    return providers
      .map((provider) => {
        const normalizedName = normalizeText(provider.name);
        if (!normalizedName.includes(normalizedQuery)) {
          return null;
        }

        let score = 0;
        if (normalizedName === normalizedQuery) score += 200;
        if (normalizedName.startsWith(normalizedQuery)) score += 100;
        score += Math.max(0, 60 - normalizedName.indexOf(normalizedQuery));

        return { provider, score };
      })
      .filter((entry): entry is { provider: (typeof providers)[number]; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.provider);
  }, [searchQuery, providers]);

  return (
    <div className="container">
      <HeroSection />
      <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      
      {loading ? (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <div className="loading-spinner"></div>
          <p>Syncing plugins from Notion...</p>
        </div>
      ) : error ? (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px 0', color: '#FF453A' }}>
          <p>Error loading plugins from Notion: {error}</p>
        </div>
      ) : (
        <ProviderGrid providers={filteredProviders} />
      )}
      
      <Footer />
    </div>
  );
}

export default App;
