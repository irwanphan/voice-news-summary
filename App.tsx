
import React, { useState } from 'react';
import Header from './components/Header';
import RedisStatus from './components/RedisStatus';
import { Article } from './types';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('latest breakthroughs in AI');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockArticles: Article[] = [
        {
          title: "QuantumLeap AI Unveils Groundbreaking Personalized Drug Discovery Platform",
          source: "BioTech Insights Daily",
          summary: "QuantumLeap AI has launched 'GeneRx', a revolutionary platform that uses advanced AI algorithms to analyze genomic data and predict drug responses with 95% accuracy. The system can identify personalized treatment options for complex diseases within hours, significantly reducing the time and cost of drug development."
        },
        {
          title: "New Neural Network Enables Robots to Perform Delicate Surgical Tasks",
          source: "Robotics Weekly",
          summary: "Researchers have developed 'SynapseHand', a neural network that gives robots unprecedented dexterity and precision for surgical procedures. The AI system can perform microsurgery with accuracy surpassing human surgeons, opening new possibilities for automated medical procedures."
        },
        {
          title: "OmniGen AI Releases 'Nexus' - First True Multimodal Generative Model",
          source: "AI Innovation Hub",
          summary: "OmniGen AI has unveiled 'Nexus', a breakthrough generative model that can create cohesive content across text, image, and video from a single prompt. This represents the first truly unified multimodal AI system, revolutionizing content creation workflows."
        },
        {
          title: "GridFlow AI's 'EcoGrid' Optimizes Renewable Energy Management",
          source: "GreenTech Today",
          summary: "GridFlow AI's new 'EcoGrid' predictive algorithm is transforming renewable energy management by balancing supply and demand on national grids in real-time. The system has already reduced energy waste by 40% in pilot programs across Europe."
        },
        {
          title: "Breakthrough in Explainable AI: 'ClarityNet' Provides Transparency for Complex Models",
          source: "AI Ethics Journal",
          summary: "A new framework called 'ClarityNet' is making complex AI models transparent and interpretable. This breakthrough addresses the 'black box' problem in AI, allowing users to understand how AI systems make decisions, crucial for healthcare and legal applications."
        }
      ];
      
      setArticles(mockArticles);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <RedisStatus />
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Topics</h3>
                <div className="space-y-2">
                  {[
                    'latest breakthroughs in AI',
                    'quantum computing advances',
                    'space exploration news',
                    'climate change solutions',
                    'medical technology innovations'
                  ].map((suggestedTopic, index) => (
                    <button
                      key={index}
                      onClick={() => setTopic(suggestedTopic)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      {suggestedTopic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  AI-Powered News Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter a topic to get AI-generated news summaries, read aloud on demand.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic for news articles..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={!topic.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? 'Generating Articles...' : 'Get News'}
                </button>
              </form>
            </div>

            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="text-blue-600 dark:text-blue-400">Generating articles...</div>
              </div>
            )}

            {articles.length > 0 && !isLoading && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Generated Articles ({articles.length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {article.source}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-end mt-4 space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {articles.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No articles yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Enter a topic above to generate news articles
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
