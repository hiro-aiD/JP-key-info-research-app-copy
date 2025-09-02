
export interface Source {
  uri: string;
  title: string;
}

export interface SearchResult {
  keyPoints: string[];
  details: string;
  summary: string;
  sources: Source[];
  timestamp: string;
}
