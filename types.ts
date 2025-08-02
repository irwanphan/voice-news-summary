
export interface Article {
  id?: string;
  title: string;
  source: string;
  summary: string;
}

// Redis AI Types
export interface CacheEntry {
  key: string;
  data: any;
  ttl?: number;
  timestamp: number;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  content: string;
  metadata?: Record<string, any>;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  topicHistory: string[];
  lastActivity: number;
  preferences?: Record<string, any>;
}

export interface AIRequest {
  topic: string;
  sessionId: string;
  timestamp: number;
  responseTime?: number;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}
