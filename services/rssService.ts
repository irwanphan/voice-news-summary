import axios from 'axios';
import Parser from 'rss-parser';
import { Article } from '../types';

export interface RSSSource {
  name: string;
  url: string;
  category?: string;
}

export class RSSService {
  private parser: Parser;
  private newsApiKey: string;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'media'],
          ['media:thumbnail', 'thumbnail'],
          ['dc:creator', 'author'],
          ['pubDate', 'publishedAt']
        ]
      }
    });
    this.newsApiKey = import.meta.env.VITE_NEWS_API_KEY || '';
  }

  // Google News RSS feeds
  private googleNewsSources: RSSSource[] = [
    {
      name: 'Google News - Technology',
      url: 'https://news.google.com/rss/search?q=technology&hl=en-US&gl=US&ceid=US:en',
      category: 'technology'
    },
    {
      name: 'Google News - Science',
      url: 'https://news.google.com/rss/search?q=science&hl=en-US&gl=US&ceid=US:en',
      category: 'science'
    },
    {
      name: 'Google News - Health',
      url: 'https://news.google.com/rss/search?q=health&hl=en-US&gl=US&ceid=US:en',
      category: 'health'
    },
    {
      name: 'Google News - Business',
      url: 'https://news.google.com/rss/search?q=business&hl=en-US&gl=US&ceid=US:en',
      category: 'business'
    }
  ];

  // NewsAPI sources
  private newsApiSources = {
    technology: 'https://newsapi.org/v2/top-headlines?country=us&category=technology',
    science: 'https://newsapi.org/v2/everything?q=science&language=en&sortBy=publishedAt',
    health: 'https://newsapi.org/v2/top-headlines?country=us&category=health',
    business: 'https://newsapi.org/v2/top-headlines?country=us&category=business'
  };

  async getArticlesFromRSS(topic: string, limit: number = 5): Promise<Article[]> {
    try {
      const articles: Article[] = [];
      const topicLower = topic.toLowerCase();

      // Determine which sources to use based on topic
      const relevantSources = this.getRelevantSources(topicLower);
      
      // Fetch from multiple sources
      const promises = relevantSources.map(source => this.fetchFromSource(source, topicLower));
      const results = await Promise.allSettled(promises);
      
      // Combine and filter results
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          articles.push(...result.value);
        }
      });

      // Remove duplicates and limit results
      const uniqueArticles = this.removeDuplicates(articles);
      return uniqueArticles.slice(0, limit);

    } catch (error) {
      console.error('Error fetching RSS articles:', error);
      return [];
    }
  }

  private getRelevantSources(topic: string): RSSSource[] {
    if (topic.includes('ai') || topic.includes('artificial intelligence') || topic.includes('technology')) {
      return this.googleNewsSources.filter(source => source.category === 'technology');
    }
    if (topic.includes('health') || topic.includes('medical') || topic.includes('medicine')) {
      return this.googleNewsSources.filter(source => source.category === 'health');
    }
    if (topic.includes('science') || topic.includes('research')) {
      return this.googleNewsSources.filter(source => source.category === 'science');
    }
    if (topic.includes('business') || topic.includes('economy')) {
      return this.googleNewsSources.filter(source => source.category === 'business');
    }
    
    // Default to all sources for general topics
    return this.googleNewsSources;
  }

  private async fetchFromSource(source: RSSSource, topic: string): Promise<Article[]> {
    try {
      const feed = await this.parser.parseURL(source.url);
      
      return feed.items
        .filter(item => {
          const title = item.title?.toLowerCase() || '';
          const content = item.contentSnippet?.toLowerCase() || '';
          return title.includes(topic) || content.includes(topic);
        })
        .map(item => ({
          title: item.title || 'No Title',
          source: source.name,
          summary: this.cleanContent(item.contentSnippet || item.content || ''),
          url: item.link || '',
          publishedAt: item.pubDate || item.isoDate || '',
          author: item.creator || item.author || 'Unknown'
        }))
        .slice(0, 3); // Limit per source

    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
      return [];
    }
  }

  async getArticlesFromNewsAPI(topic: string, limit: number = 5): Promise<Article[]> {
    if (!this.newsApiKey) {
      console.warn('NewsAPI key not found, skipping NewsAPI fetch');
      return [];
    }

    try {
      const category = this.getNewsAPICategory(topic);
      const url = this.newsApiSources[category] || this.newsApiSources.technology;
      
      const response = await axios.get(`${url}&apiKey=${this.newsApiKey}&pageSize=${limit}`);
      
      return response.data.articles.map((article: any) => ({
        title: article.title,
        source: article.source.name,
        summary: this.cleanContent(article.description || article.content || ''),
        url: article.url,
        publishedAt: article.publishedAt,
        author: article.author || 'Unknown'
      }));

    } catch (error) {
      console.error('Error fetching from NewsAPI:', error);
      return [];
    }
  }

  private getNewsAPICategory(topic: string): keyof typeof this.newsApiSources {
    if (topic.includes('health') || topic.includes('medical')) return 'health';
    if (topic.includes('science')) return 'science';
    if (topic.includes('business')) return 'business';
    return 'technology';
  }

  private cleanContent(content: string): string {
    return content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[a-zA-Z]+;/g, '') // Remove HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 200) + '...'; // Limit length
  }

  private removeDuplicates(articles: Article[]): Article[] {
    const seen = new Set();
    return articles.filter(article => {
      const key = article.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async getArticles(topic: string, limit: number = 5): Promise<Article[]> {
    try {
      // Try RSS first
      const rssArticles = await this.getArticlesFromRSS(topic, limit);
      
      // If we have enough articles, return them
      if (rssArticles.length >= limit) {
        return rssArticles.slice(0, limit);
      }

      // Otherwise, try NewsAPI to fill the gap
      const newsApiArticles = await this.getArticlesFromNewsAPI(topic, limit - rssArticles.length);
      
      return [...rssArticles, ...newsApiArticles].slice(0, limit);

    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }
}

export default new RSSService(); 