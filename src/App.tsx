import { useState, useMemo } from 'react';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { ProviderGrid } from './components/ProviderGrid';
import { Footer } from './components/Footer';
import { useNotionProviders } from './hooks/useNotionProviders';

// The Notion Page ID containing the plugin table
const NOTION_PAGE_ID = '326981dcb87e80f6b9f6f23469a00fd3';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const { providers, loading, error } = useNotionProviders(NOTION_PAGE_ID);

  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) return providers;
    
    const query = searchQuery.toLowerCase();
    return providers.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.author.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    );
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
