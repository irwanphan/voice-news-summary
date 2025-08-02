import axios from 'axios';
import { Article } from '../types';

export interface RSSSource {
  name: string;
  url: string;
  category?: string;
}

export class RSSService {
  private newsApiKey: string;
  private isProduction: boolean;

  constructor() {
    this.newsApiKey = import.meta.env.VITE_NEWS_API_KEY || '';
    this.isProduction = import.meta.env.PROD || false;
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

  // Mock data as fallback
  private generateMockArticles(topic: string): Article[] {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('ai') || topicLower.includes('artificial intelligence')) {
      return [
        {
          title: "OpenAI Releases GPT-5 with Revolutionary Multimodal Capabilities",
          source: "Tech Innovation Daily",
          summary: "OpenAI has unveiled GPT-5, featuring unprecedented multimodal understanding that can process text, images, audio, and video simultaneously. The new model demonstrates human-level reasoning across multiple domains.",
          publishedAt: new Date().toISOString(),
          author: "Tech Reporter"
        },
        {
          title: "Google DeepMind Achieves Breakthrough in Protein Folding Prediction",
          source: "Science & Technology Weekly",
          summary: "DeepMind's AlphaFold 3 has solved complex protein structures with 99% accuracy, revolutionizing drug discovery and biotechnology research worldwide.",
          publishedAt: new Date().toISOString(),
          author: "Science Editor"
        }
      ];
    }
    
    if (topicLower.includes('quantum')) {
      return [
        {
          title: "IBM Achieves 1000+ Qubit Quantum Processor Milestone",
          source: "Quantum Computing Today",
          summary: "IBM has successfully built a 1,121-qubit Condor processor, marking a significant step toward quantum advantage in solving complex computational problems.",
          publishedAt: new Date().toISOString(),
          author: "Quantum Researcher"
        },
        {
          title: "Microsoft's Topological Qubits Show 99.8% Error Correction",
          source: "Advanced Computing Journal",
          summary: "Microsoft's topological qubit approach demonstrates unprecedented error rates, bringing fault-tolerant quantum computing closer to reality.",
          publishedAt: new Date().toISOString(),
          author: "Computing Expert"
        }
      ];
    }
    
    if (topicLower.includes('space') || topicLower.includes('exploration')) {
      return [
        {
          title: "NASA's Artemis III Mission Confirms First Woman on Moon",
          source: "Space Exploration News",
          summary: "NASA has announced the Artemis III mission will land the first woman and next man on the lunar surface, marking humanity's return to the Moon after 50 years.",
          publishedAt: new Date().toISOString(),
          author: "Space Reporter"
        },
        {
          title: "SpaceX Starship Completes Successful Mars Simulation Mission",
          source: "Interplanetary Weekly",
          summary: "SpaceX's Starship prototype has completed a full Mars mission simulation, including landing and return procedures, advancing human Mars exploration timeline.",
          publishedAt: new Date().toISOString(),
          author: "Mars Expert"
        }
      ];
    }
    
    if (topicLower.includes('climate') || topicLower.includes('environment')) {
      return [
        {
          title: "Global Carbon Capture Technology Reaches 90% Efficiency",
          source: "Environmental Science Today",
          summary: "New carbon capture and storage technology has achieved 90% efficiency rates, potentially removing billions of tons of CO2 from the atmosphere annually.",
          publishedAt: new Date().toISOString(),
          author: "Climate Scientist"
        },
        {
          title: "Renewable Energy Surpasses Fossil Fuels in Global Electricity Generation",
          source: "Green Energy Weekly",
          summary: "For the first time in history, renewable energy sources have generated more electricity than fossil fuels globally, marking a major milestone in the energy transition.",
          publishedAt: new Date().toISOString(),
          author: "Energy Analyst"
        }
      ];
    }
    
    if (topicLower.includes('medical') || topicLower.includes('health') || topicLower.includes('medicine')) {
      return [
        {
          title: "CRISPR Gene Editing Successfully Treats Sickle Cell Disease",
          source: "Medical Breakthroughs Daily",
          summary: "Scientists have successfully used CRISPR gene editing to cure sickle cell disease in clinical trials, offering hope to millions of patients worldwide.",
          publishedAt: new Date().toISOString(),
          author: "Medical Researcher"
        },
        {
          title: "AI-Powered Cancer Detection Achieves 99.5% Accuracy",
          source: "Healthcare Innovation Journal",
          summary: "New AI algorithms can detect early-stage cancer with 99.5% accuracy, potentially saving millions of lives through early intervention and treatment.",
          publishedAt: new Date().toISOString(),
          author: "Healthcare Expert"
        }
      ];
    }
    
    // Default articles for any topic
    return [
      {
        title: `Latest Developments in ${topic}`,
        source: "Global News Network",
        summary: `Recent advancements in ${topic} have shown promising results, with researchers making significant breakthroughs in understanding and application of this field.`,
        publishedAt: new Date().toISOString(),
        author: "News Reporter"
      },
      {
        title: `${topic} Revolutionizes Industry Standards`,
        source: "Innovation Today",
        summary: `The field of ${topic} continues to evolve rapidly, with new technologies and methodologies emerging that could transform how we approach related challenges.`,
        publishedAt: new Date().toISOString(),
        author: "Industry Analyst"
      }
    ];
  }

  private async parseRSSFeed(xmlText: string): Promise<Article[]> {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const items = xmlDoc.querySelectorAll('item');
      
      const articles: Article[] = [];
      
      items.forEach((item, index) => {
        if (index >= 3) return; // Limit to 3 articles per source
        
        const title = item.querySelector('title')?.textContent || 'No Title';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        
        articles.push({
          title,
          source: 'RSS Feed',
          summary: this.cleanContent(description),
          url: link,
          publishedAt: pubDate,
          author: 'Unknown'
        });
      });
      
      return articles;
    } catch (error) {
      console.error('Error parsing RSS feed:', error);
      return [];
    }
  }

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
      let xmlText: string;
      
      if (this.isProduction) {
        // Use Vercel proxy in production
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(source.url)}`;
        const response = await axios.get(proxyUrl);
        xmlText = response.data;
      } else {
        // Direct fetch in development (may have CORS issues)
        const response = await fetch(source.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        xmlText = await response.text();
      }
      
      const articles = await this.parseRSSFeed(xmlText);
      
      // Filter by topic relevance
      return articles.filter(article => {
        const title = article.title.toLowerCase();
        const summary = article.summary.toLowerCase();
        return title.includes(topic) || summary.includes(topic);
      });

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
      console.log('🔍 Attempting to fetch RSS articles for:', topic);
      console.log('🌍 Environment:', this.isProduction ? 'Production' : 'Development');
      
      // Try RSS first
      const rssArticles = await this.getArticlesFromRSS(topic, limit);
      console.log('📰 RSS articles found:', rssArticles.length);
      
      // If we have enough articles, return them
      if (rssArticles.length >= limit) {
        console.log('✅ Using RSS articles');
        return rssArticles.slice(0, limit);
      }

      // Otherwise, try NewsAPI to fill the gap
      const newsApiArticles = await this.getArticlesFromNewsAPI(topic, limit - rssArticles.length);
      console.log('🌐 NewsAPI articles found:', newsApiArticles.length);
      
      const combinedArticles = [...rssArticles, ...newsApiArticles].slice(0, limit);
      
      if (combinedArticles.length > 0) {
        console.log('✅ Using combined RSS + NewsAPI articles');
        return combinedArticles;
      }

      // Fallback to mock data if no RSS articles found
      console.log('⚠️ No RSS articles found, using mock data');
      return this.generateMockArticles(topic);

    } catch (error) {
      console.error('Error fetching articles:', error);
      console.log('⚠️ Falling back to mock data due to error');
      return this.generateMockArticles(topic);
    }
  }
}

export default new RSSService(); 