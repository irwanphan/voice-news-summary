
import React, { useState } from 'react';
import Header from './components/Header';
import TopicInput from './components/TopicInput';
import ArticleCard from './components/ArticleCard';
import Spinner from './components/Spinner';
import RedisStatus from './components/RedisStatus';
import { Article } from './types';

function App() {
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
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Redis Status */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <RedisStatus className="mb-6" />
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Redis AI Features</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Intelligent Caching</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Vector Search</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Session Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Real-time Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  AI-Powered News Generator
                </h1>
                <p className="text-gray-600">
                  Generate realistic news articles with Redis AI for enhanced performance
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
                  <div className="text-sm text-gray-500">
                    Powered by Redis AI
                  </div>
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
                  Enter a topic above to generate news articles with Redis AI
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
