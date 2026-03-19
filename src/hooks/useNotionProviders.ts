import { useState, useEffect } from 'react';
import type { Provider } from '../types';

export const useNotionProviders = (pageId: string) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(`/api/notion/${pageId}`);
        if (!response.ok) throw new Error('Failed to fetch Notion data');
        const data = await response.json();
        
        const blocks = Object.values(data).map((b: any) => b.value).filter(Boolean);
        const tableRows = blocks.filter((b: any) => b.type === 'table_row');
        
        if (tableRows.length < 2) {
          setProviders([]);
          setLoading(false);
          return;
        }

        const headerRow = tableRows[0].properties;
        let repoKey = '';
        let langKey = '';

        for (const [key, value] of Object.entries(headerRow)) {
          const text = (value as any)[0][0] as string;
          if (text.includes('Repo')) repoKey = key;
          if (text.includes('Language')) langKey = key;
        }

        const parsedProviders: Provider[] = [];

        for (let i = 1; i < tableRows.length; i++) {
          const rowProps = tableRows[i].properties;
          if (!rowProps) continue;

          const repoCell = rowProps[repoKey];
          const langCell = rowProps[langKey];

          if (repoCell && repoCell[0]) {
            const name = repoCell[0][0];
            let url = '';
            if (repoCell[0][1] && repoCell[0][1][0][0] === 'a') {
              url = repoCell[0][1][0][1];
            }
            
            let language = 'Unknown';
            if (langCell && langCell[0]) {
               language = langCell[0][0];
            }
            
            // Extract author from GitHub raw URL if possible
            let author = 'Community';
            if (url.includes('githubusercontent.com')) {
               const parts = url.split('/');
               if (parts.length > 3) author = parts[3];
            }

            parsedProviders.push({
              id: tableRows[i].id,
              name,
              description: '',
              author,
              url,
              tags: [language]
            });
          }
        }

        setProviders(parsedProviders);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [pageId]);

  return { providers, loading, error };
};
