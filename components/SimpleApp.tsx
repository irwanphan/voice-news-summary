import React, { useState } from 'react';
import Header from './Header';
import TopicInput from './TopicInput';
import ArticleCard from './ArticleCard';
import Spinner from './Spinner';
import { Article } from '../types';

function SimpleApp() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleArticlesGenerated = (newArticles: Article[]) => {
    setArticles(newArticles);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI-Powered News Generator
            </h1>
            <p className="text-gray-600">
              Generate realistic news articles with AI
            </p>
          </div>
          
          <TopicInput 
            onArticlesGenerated={handleArticlesGenerated}
            onLoading={handleLoading}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {articles.length > 0 && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Generated Articles ({articles.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article, index) => (
                <ArticleCard 
                  key={index} 
                  article={article} 
                  className="h-full"
                />
              ))}
            </div>
          </div>
        )}

        {articles.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No articles yet
            </h3>
            <p className="text-gray-500">
              Enter a topic above to generate news articles
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default SimpleApp; 