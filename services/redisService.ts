import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { 
  CacheEntry, 
  VectorSearchResult, 
  UserSession, 
  AIRequest, 
  RedisConfig,
  Article 
} from '../types';

class RedisAIService {
  private redis: Redis;
  private isConnected: boolean = false;

  constructor(config?: RedisConfig) {
    // Support Redis Cloud URL
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL, {
        lazyConnect: true,
      });
    } else {
      const defaultConfig: RedisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
      };

      this.redis = new Redis({
        ...defaultConfig,
        ...config,
        lazyConnect: true,
      });
    }

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.redis.on('connect', () => {
      console.log('✅ Redis AI Service connected');
      this.isConnected = true;
    });

    this.redis.on('error', (error) => {
      console.error('❌ Redis AI Service error:', error);
      this.isConnected = false;
    });

    this.redis.on('disconnect', () => {
      console.log('⚠️ Redis AI Service disconnected');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.redis.connect();
      }
    } catch (error) {
      console.log('⚠️ Redis not available, running in fallback mode');
      // Continue without Redis
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.redis.disconnect();
    }
  }

  // Cache Management
  async setCache(key: string, data: any, ttl: number = 3600): Promise<void> {
    try {
      if (!this.isConnected) return;
      
      const cacheEntry: CacheEntry = {
        data,
        ttl,
        timestamp: Date.now(),
      };
      
      await this.redis.setex(key, ttl, JSON.stringify(cacheEntry));
      console.log(`💾 Cached: ${key}`);
    } catch (error) {
      console.log('⚠️ Cache not available, skipping');
    }
  }

  async getCache<T>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) return null;
      
      const cached = await this.redis.get(key);
      if (!cached) return null;

      const cacheEntry: CacheEntry = JSON.parse(cached);
      console.log(`📖 Cache hit: ${key}`);
      return cacheEntry.data as T;
    } catch (error) {
      console.log('⚠️ Cache not available, returning null');
      return null;
    }
  }

  async deleteCache(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      console.log(`🗑️ Cache deleted: ${key}`);
    } catch (error) {
      console.error('Cache delete error:', error);
      throw error;
    }
  }

  // Vector Search for Similar Topics
  async addToVectorIndex(topic: string, articles: Article[]): Promise<void> {
    try {
      const vectorKey = `vector:${topic.toLowerCase().replace(/\s+/g, '_')}`;
      const vectorData = {
        topic,
        articles,
        embedding: await this.generateSimpleEmbedding(topic),
        timestamp: Date.now(),
      };
      
      await this.redis.setex(vectorKey, 86400, JSON.stringify(vectorData));
      console.log(`🔍 Vector indexed: ${topic}`);
    } catch (error) {
      console.error('Vector indexing error:', error);
      throw error;
    }
  }

  async searchSimilarTopics(query: string, limit: number = 5): Promise<VectorSearchResult[]> {
    try {
      const queryEmbedding = await this.generateSimpleEmbedding(query);
      const pattern = 'vector:*';
      const keys = await this.redis.keys(pattern);
      
      const results: VectorSearchResult[] = [];
      
      for (const key of keys) {
        const vectorData = await this.redis.get(key);
        if (!vectorData) continue;
        
        const parsed = JSON.parse(vectorData);
        const similarity = this.calculateSimilarity(queryEmbedding, parsed.embedding);
        
        if (similarity > 0.3) { // Threshold for similarity
          results.push({
            id: key,
            score: similarity,
            content: parsed.topic,
          });
        }
      }
      
      return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Vector search error:', error);
      return [];
    }
  }

  private async generateSimpleEmbedding(text: string): Promise<number[]> {
    // Simple character-based embedding for demo
    // In production, use proper embedding models
    const chars = text.toLowerCase().split('');
    const embedding = new Array(26).fill(0);
    
    chars.forEach(char => {
      const index = char.charCodeAt(0) - 97;
      if (index >= 0 && index < 26) {
        embedding[index]++;
      }
    });
    
    return embedding;
  }

  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  // Session Management
  async createSession(userId?: string): Promise<string> {
    try {
      const sessionId = uuidv4();
      const session: UserSession = {
        sessionId,
        userId,
        topics: [],
        createdAt: Date.now(),
        lastActivity: Date.now(),
      };
      
      await this.redis.setex(`session:${sessionId}`, 86400, JSON.stringify(session));
      console.log(`👤 Session created: ${sessionId}`);
      return sessionId;
    } catch (error) {
      console.error('Session creation error:', error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<UserSession | null> {
    try {
      const sessionData = await this.redis.get(`session:${sessionId}`);
      if (!sessionData) return null;
      
      const session: UserSession = JSON.parse(sessionData);
      session.lastActivity = Date.now();
      
      // Update last activity
      await this.redis.setex(`session:${sessionId}`, 86400, JSON.stringify(session));
      return session;
    } catch (error) {
      console.error('Session get error:', error);
      return null;
    }
  }

  async updateSession(sessionId: string, updates: Partial<UserSession>): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) throw new Error('Session not found');
      
      const updatedSession = { ...session, ...updates, lastActivity: Date.now() };
      await this.redis.setex(`session:${sessionId}`, 86400, JSON.stringify(updatedSession));
    } catch (error) {
      console.error('Session update error:', error);
      throw error;
    }
  }

  async addTopicToHistory(sessionId: string, topic: string): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) return;
      
      session.topics = [topic, ...session.topics.filter(t => t !== topic)].slice(0, 10);
      await this.updateSession(sessionId, { topics: session.topics });
    } catch (error) {
      console.error('Topic history update error:', error);
    }
  }

  // AI Request Analytics
  async logAIRequest(request: AIRequest): Promise<void> {
    try {
      const requestKey = `ai_request:${request.id}:${Date.now()}`;
      await this.redis.setex(requestKey, 604800, JSON.stringify(request)); // 7 days TTL
      
      // Update analytics
      await this.redis.incr('ai_requests_total');
      await this.redis.incr(`ai_requests_topic:${request.topic}`);
      
      console.log(`📊 AI request logged: ${request.topic}`);
    } catch (error) {
      console.error('AI request logging error:', error);
    }
  }

  async getAnalytics(): Promise<{
    totalRequests: number;
    popularTopics: Array<{ topic: string; count: number }>;
    averageResponseTime: number;
  }> {
    try {
      const totalRequests = await this.redis.get('ai_requests_total') || '0';
      
      const topicKeys = await this.redis.keys('ai_requests_topic:*');
      const popularTopics = await Promise.all(
        topicKeys.map(async (key) => {
          const count = await this.redis.get(key) || '0';
          const topic = key.replace('ai_requests_topic:', '');
          return { topic, count: parseInt(count) };
        })
      );
      
      return {
        totalRequests: parseInt(totalRequests),
        popularTopics: popularTopics.sort((a, b) => b.count - a.count).slice(0, 10),
        averageResponseTime: 0, // Would need to calculate from actual request data
      };
    } catch (error) {
      console.error('Analytics error:', error);
      return { totalRequests: 0, popularTopics: [], averageResponseTime: 0 };
    }
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return this.isConnected;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const redisAI = new RedisAIService();
export default redisAI; 