export interface ScraperInfo {
  id: string;
  name: string;
  description: string;
  supportedTypes: string[];
  contentLanguage: string[];
  logo: string;
}

export interface Provider {
  id: string;
  name: string;
  description: string;
  author: string;
  url: string;
  countryCode: string;
  countryName: string;
  countryEmoji: string;
  tags: string[];
  scrapers: ScraperInfo[];
}
