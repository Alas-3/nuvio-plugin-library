import type { ChangeEvent } from 'react';
import './Components.css';

type SortOption = 'relevance' | 'name' | 'author' | 'scrapers';

interface CountryOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  resultCount: number;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  languageFilter: string;
  onLanguageFilterChange: (value: string) => void;
  languageOptions: CountryOption[];
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name', label: 'Name' },
  { value: 'author', label: 'Author' },
  { value: 'scrapers', label: 'Scrapers' },
];

export const SearchBar = ({
  value,
  onChange,
  onClear,
  resultCount,
  sortBy,
  onSortChange,
  languageFilter,
  onLanguageFilterChange,
  languageOptions,
}: SearchBarProps) => {
  return (
    <div className="search-stack">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by plugin, author, or language..."
          value={value}
          onChange={onChange}
          aria-label="Search providers"
        />
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        {value && (
          <button type="button" className="search-clear" onClick={onClear} aria-label="Clear search input">
            Clear
          </button>
        )}
      </div>
      <p className="result-meta">{resultCount} provider{resultCount === 1 ? '' : 's'} found</p>

      <div className="search-controls-row">
        <div className="sort-pill-group" role="tablist" aria-label="Sort providers">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`sort-pill ${sortBy === option.value ? 'active' : ''}`}
              onClick={() => onSortChange(option.value)}
              role="tab"
              aria-selected={sortBy === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="country-filter-wrap" aria-label="Language filter">
          <button
            type="button"
            className={`country-chip ${languageFilter === 'all' ? 'active' : ''}`}
            onClick={() => onLanguageFilterChange('all')}
          >
            All Languages
          </button>
          {languageOptions.map((language) => (
            <button
              key={language.value}
              type="button"
              className={`country-chip ${languageFilter === language.value ? 'active' : ''}`}
              onClick={() => onLanguageFilterChange(language.value)}
            >
              {language.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
