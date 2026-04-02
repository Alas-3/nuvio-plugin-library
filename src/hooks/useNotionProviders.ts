import { useState, useEffect } from 'react';
import type { Provider, ScraperInfo } from '../types';

type NotionRecord = Record<string, unknown>;

interface NotionBlock {
  id: string;
  type: string;
  properties?: Record<string, unknown>;
  content?: string[];
}

const getObject = (value: unknown): NotionRecord | null => {
  if (!value || typeof value !== 'object') return null;
  return value as NotionRecord;
};

const unwrapBlock = (entry: unknown): NotionBlock | null => {
  const level1 = getObject(entry);
  if (!level1) return null;

  const level2 = getObject(level1.value);
  const level3 = level2 ? getObject(level2.value) : null;

  const candidate = level3 ?? level2 ?? level1;
  if (!candidate || typeof candidate.type !== 'string') {
    return null;
  }

  return candidate as unknown as NotionBlock;
};

const getCellText = (cell: unknown): string => {
  if (!Array.isArray(cell)) return '';

  return cell
    .map((chunk) => (Array.isArray(chunk) && typeof chunk[0] === 'string' ? chunk[0] : ''))
    .join('')
    .trim();
};

const getCellLink = (cell: unknown): string => {
  if (!Array.isArray(cell)) return '';

  for (const chunk of cell) {
    if (!Array.isArray(chunk) || !Array.isArray(chunk[1])) continue;

    for (const mark of chunk[1]) {
      if (Array.isArray(mark) && mark[0] === 'a' && typeof mark[1] === 'string') {
        return mark[1];
      }
    }
  }

  const plainText = getCellText(cell);
  return /^https?:\/\//i.test(plainText) ? plainText : '';
};

const findColumnKeys = (headerRow: Record<string, unknown> = {}) => {
  let repoKey = '';
  let langKey = '';

  for (const [key, value] of Object.entries(headerRow)) {
    const text = getCellText(value).toLowerCase();
    if (!repoKey && text.includes('repo')) repoKey = key;
    if (!langKey && text.includes('language')) langKey = key;
  }

  return { repoKey, langKey };
};

const extractAuthor = (url: string): string => {
  if (!url) return 'Community';

  try {
    const { hostname, pathname } = new URL(url);

    // GitHub raw URLs and standard GitHub URLs store owner as the first path segment.
    if (hostname.includes('github')) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        return segments[0];
      }
    }
  } catch {
    // Ignore malformed URLs and keep the fallback author.
  }

  return 'Community';
};

const toManifestUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (trimmed.endsWith('/manifest.json')) return trimmed;
  if (trimmed.endsWith('/')) return `${trimmed}manifest.json`;
  return trimmed;
};

const parseStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
};

const fetchScrapersFromManifest = async (manifestUrl: string): Promise<ScraperInfo[]> => {
  if (!manifestUrl) return [];

  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) return [];

    const manifest = await response.json();
    const scrapers = Array.isArray(manifest?.scrapers) ? manifest.scrapers : [];

    return scrapers
      .filter((scraper: any) => scraper && typeof scraper === 'object')
      .map((scraper: any, index: number): ScraperInfo => ({
        id: typeof scraper.id === 'string' ? scraper.id : `${manifestUrl}-${index}`,
        name: typeof scraper.name === 'string' ? scraper.name : 'Unnamed scraper',
        description: typeof scraper.description === 'string' ? scraper.description : '',
        supportedTypes: parseStringArray(scraper.supportedTypes),
        contentLanguage: parseStringArray(scraper.contentLanguage),
        logo: typeof scraper.logo === 'string' ? scraper.logo : '',
      }));
  } catch {
    return [];
  }
};

export const useNotionProviders = (pageId: string) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/notion/${pageId}`);
        if (!response.ok) throw new Error('Failed to fetch Notion data');

        const data = await response.json();
        const blockMap = Object.fromEntries(
          Object.entries(data)
            .map(([id, entry]) => [id, unwrapBlock(entry)])
            .filter(([, block]) => block !== null)
        ) as Record<string, NotionBlock>;

        const tableBlock = Object.values(blockMap).find((block) => block.type === 'table');
        const tableRows = Array.isArray(tableBlock?.content)
          ? tableBlock.content
              .map((rowId) => blockMap[rowId])
              .filter((block): block is NotionBlock => Boolean(block) && block.type === 'table_row')
          : Object.values(blockMap).filter((block) => block.type === 'table_row');

        if (tableRows.length < 2) {
          setProviders([]);
          return;
        }

        const headerRow = (tableRows[0].properties ?? {}) as Record<string, unknown>;
        const { repoKey, langKey } = findColumnKeys(headerRow);

        if (!repoKey) {
          throw new Error('Repo column not found in Notion table');
        }

        const parsedProviders: Provider[] = [];

        for (let i = 1; i < tableRows.length; i++) {
          const rowProps = (tableRows[i].properties ?? {}) as Record<string, unknown>;
          if (!rowProps) continue;

          const repoCell = rowProps[repoKey];
          const langCell = langKey ? rowProps[langKey] : undefined;

          const name = getCellText(repoCell);
          if (!name) continue;

          const url = getCellLink(repoCell);
          const language = getCellText(langCell) || 'Unknown';
          const author = extractAuthor(url);

          parsedProviders.push({
            id: tableRows[i].id,
            name,
            description: '',
            author,
            url,
            tags: [language],
            scrapers: []
          });
        }

        const providersWithScrapers = await Promise.all(
          parsedProviders.map(async (provider) => {
            const manifestUrl = toManifestUrl(provider.url);
            const scrapers = await fetchScrapersFromManifest(manifestUrl);
            return {
              ...provider,
              url: manifestUrl,
              scrapers,
            };
          })
        );

        setProviders(providersWithScrapers);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load providers';
        setError(message);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [pageId]);

  return { providers, loading, error };
};
