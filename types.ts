
export interface Article {
  title: string;
  source: string;
  summary: string;
  url?: string;
  publishedAt?: string;
  author?: string;
}

// Redis AI Types
export interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  content: string;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  topics: string[];
  createdAt: number;
  lastActivity: number;
}

export interface AIRequest {
  id: string;
  topic: string;
  timestamp: number;
  responseTime: number;
  success: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}
