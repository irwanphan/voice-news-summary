
import { GoogleGenAI, Type } from "@google/genai";
import { Article } from '../types';

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

export const generateNewsAndSummaries = async (topic: string): Promise<Article[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 fictional but realistic news article summaries about "${topic}". Each summary should be unique and well-written.`,
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
    
    return articles;
  } catch (error) {
    console.error("Error generating news with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
