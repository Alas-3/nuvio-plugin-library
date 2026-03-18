import type { ChangeEvent } from 'react';
import './Components.css';

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="search-container animate-fade-in" style={{ animationDelay: '100ms' }}>
      <input
        type="text"
        className="search-input"
        placeholder="Search plugins by name, author, or tag..."
        value={value}
        onChange={onChange}
      />
      <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
  );
};
