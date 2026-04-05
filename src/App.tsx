import { useState, useMemo } from 'react';
import { HeroSection } from './components/HeroSection';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { SearchBar } from './components/SearchBar';
import { ProviderGrid } from './components/ProviderGrid';
import { InstallGuide } from './components/InstallGuide';
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

type SortOption = 'relevance' | 'name' | 'author' | 'scrapers';

const ANNOUNCEMENT = {
  status: 'ann' as const,
  message: 'This is the only trusted and official plugins/add-ons indexing site. Do NOT trust any other sites claiming to offer a plugin directory, as they may contain inaccurate information or malicious links.',
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [languageFilter, setLanguageFilter] = useState('all');
  const { providers, loading, error } = useNotionProviders(NOTION_PAGE_ID);

  const languageOptions = useMemo(() => {
    const deduped = new Set<string>();

    for (const provider of providers) {
      for (const tag of provider.tags) {
        const normalizedTag = tag.trim();
        if (normalizedTag) {
          deduped.add(normalizedTag);
        }
      }
    }

    return Array.from(deduped)
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value, label: value }));
  }, [providers]);

  const filteredProviders = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);

    const rankedProviders = providers
      .map((provider) => {
        const normalizedName = normalizeText(provider.name);
        const normalizedAuthor = normalizeText(provider.author);
        const normalizedTags = normalizeText(provider.tags.join(' '));
        const normalizedCountry = normalizeText(`${provider.countryName} ${provider.countryCode}`);

        const passesLanguage = languageFilter === 'all'
          || provider.tags.some((tag) => tag.toLowerCase() === languageFilter.toLowerCase());
        if (!passesLanguage) {
          return null;
        }

        const isMatch = !normalizedQuery
          || normalizedName.includes(normalizedQuery)
          || normalizedAuthor.includes(normalizedQuery)
          || normalizedTags.includes(normalizedQuery)
          || normalizedCountry.includes(normalizedQuery);

        if (!isMatch) {
          return null;
        }

        let score = 0;
        if (normalizedQuery) {
          if (normalizedName === normalizedQuery) score += 250;
          if (normalizedName.startsWith(normalizedQuery)) score += 120;
          if (normalizedAuthor.includes(normalizedQuery)) score += 50;
          if (normalizedTags.includes(normalizedQuery)) score += 30;
          if (normalizedCountry.includes(normalizedQuery)) score += 25;
          const matchIndex = normalizedName.indexOf(normalizedQuery);
          if (matchIndex >= 0) {
            score += Math.max(0, 80 - matchIndex);
          }
        }

        score += provider.scrapers.length * 8;

        return { provider, score };
      })
      .filter((entry): entry is { provider: (typeof providers)[number]; score: number } => entry !== null);

    if (sortBy === 'name') {
      return rankedProviders
        .sort((a, b) => a.provider.name.localeCompare(b.provider.name))
        .map((entry) => entry.provider);
    }

    if (sortBy === 'author') {
      return rankedProviders
        .sort((a, b) => a.provider.author.localeCompare(b.provider.author))
        .map((entry) => entry.provider);
    }

    if (sortBy === 'scrapers') {
      return rankedProviders
        .sort((a, b) => b.provider.scrapers.length - a.provider.scrapers.length)
        .map((entry) => entry.provider);
    }

    return rankedProviders
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.provider);
  }, [languageFilter, providers, searchQuery, sortBy]);

  const scraperCount = useMemo(
    () => filteredProviders.reduce((count, provider) => count + provider.scrapers.length, 0),
    [filteredProviders]
  );

  return (
    <div className="container app-shell">
      <AnnouncementBanner status={ANNOUNCEMENT.status} message={ANNOUNCEMENT.message} />

      <HeroSection
        totalProviders={providers.length}
        totalScrapers={scraperCount}
      />

      <section className="toolbar-panel glass-card animate-fade-in" style={{ animationDelay: '120ms' }}>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          resultCount={filteredProviders.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          languageFilter={languageFilter}
          onLanguageFilterChange={setLanguageFilter}
          languageOptions={languageOptions}
        />
      </section>

      <InstallGuide />

      {loading ? (
        <section className="status-panel animate-fade-in" style={{ animationDelay: '180ms' }}>
          <div className="loading-spinner"></div>
          <p>Syncing plugins from Notion...</p>
        </section>
      ) : error ? (
        <section className="status-panel error animate-fade-in" style={{ animationDelay: '180ms' }}>
          <p>Error loading plugins from Notion: {error}</p>
        </section>
      ) : (
        <ProviderGrid providers={filteredProviders} />
      )}

      <Footer />
    </div>
  );
}

export default App;
