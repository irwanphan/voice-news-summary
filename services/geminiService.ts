
import { GoogleGenAI, Type } from "@google/genai";
import { Article } from '../types';
import redisAI from './redisService';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const newsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'A concise and engaging headline for the news article.',
      },
      source: {
        type: Type.STRING,
        description: 'A fictional but plausible news source name (e.g., "Tech Today", "Global Affairs Weekly").'
      },
      summary: {
        type: Type.STRING,
        description: 'A detailed summary of the article, about 3-4 sentences long.',
      },
    },
    required: ['title', 'source', 'summary'],
  },
};

export const generateNewsAndSummaries = async (topic: string, sessionId?: string): Promise<Article[]> => {
  const startTime = Date.now();
  
  try {
    // Initialize Redis connection
    await redisAI.connect();
    
    // Check cache first
    const cacheKey = `news_cache:${topic.toLowerCase().replace(/\s+/g, '_')}`;
    const cachedArticles = await redisAI.getCache<Article[]>(cacheKey);
    
    if (cachedArticles && cachedArticles.length > 0) {
      console.log(`🚀 Cache hit for topic: ${topic}`);
      
      // Log analytics
      if (sessionId) {
        await redisAI.logAIRequest({
          topic,
          sessionId,
          timestamp: Date.now(),
          responseTime: Date.now() - startTime,
        });
        await redisAI.addTopicToHistory(sessionId, topic);
      }
      
      return cachedArticles;
    }

    // Check for similar topics using vector search
    const similarTopics = await redisAI.searchSimilarTopics(topic, 3);
    let enhancedPrompt = `Generate 5 fictional but realistic news article summaries about "${topic}".`;
    
    if (similarTopics.length > 0) {
      const similarTopic = similarTopics[0];
      enhancedPrompt += ` Consider related topics like "${similarTopic.content}" for more diverse coverage.`;
      console.log(`🔍 Found similar topic: ${similarTopic.content} (similarity: ${similarTopic.score.toFixed(2)})`);
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enhancedPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: newsSchema,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const jsonText = response.text.trim();
    const articles: Article[] = JSON.parse(jsonText);
    
    if (!Array.isArray(articles) || articles.length === 0) {
        throw new Error("API did not return a valid array of articles.");
    }
    
    // Cache the results
    await redisAI.setCache(cacheKey, articles, 3600); // 1 hour cache
    
    // Add to vector index for future similarity search
    await redisAI.addToVectorIndex(topic, articles);
    
    // Log analytics
    if (sessionId) {
      await redisAI.logAIRequest({
        topic,
        sessionId,
        timestamp: Date.now(),
        responseTime: Date.now() - startTime,
      });
      await redisAI.addTopicToHistory(sessionId, topic);
    }
    
    console.log(`⚡ Generated ${articles.length} articles for topic: ${topic} (${Date.now() - startTime}ms)`);
    return articles;
  } catch (error) {
    console.error("Error generating news with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};

// Enhanced function with session management
export const generateNewsWithSession = async (topic: string, sessionId: string): Promise<Article[]> => {
  try {
    // Get or create session
    let session = await redisAI.getSession(sessionId);
    if (!session) {
      sessionId = await redisAI.createSession();
      session = await redisAI.getSession(sessionId);
    }
    
    // Check if user has searched this topic recently
    if (session?.topicHistory.includes(topic)) {
      console.log(`🔄 User recently searched for: ${topic}`);
    }
    
    const articles = await generateNewsAndSummaries(topic, sessionId);
    return articles;
  } catch (error) {
    console.error("Error in session-based news generation:", error);
    throw error;
  }
};

// Analytics function
export const getAIAnalytics = async () => {
  try {
    await redisAI.connect();
    return await redisAI.getAnalytics();
  } catch (error) {
    console.error("Error getting analytics:", error);
    return { totalRequests: 0, popularTopics: [], averageResponseTime: 0 };
  }
};
