
import React, { useState, useCallback, useEffect } from 'react';
import { Article } from './types';
import { generateNewsAndSummaries } from './services/geminiService';
import Header from './components/Header';
import TopicInput from './components/TopicInput';
import ArticleCard from './components/ArticleCard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('latest breakthroughs in AI');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const handleFetchNews = useCallback(async (currentTopic: string) => {
    if (!currentTopic.trim()) {
      setError('Please enter a topic.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setArticles([]); // Clear previous articles
    setActiveArticleId(null); // Reset active article

    try {
      // Check cache first
      const cachedData = localStorage.getItem(`news_${currentTopic}`);
      if (cachedData) {
        const parsedData: Article[] = JSON.parse(cachedData);
        setArticles(parsedData);
      } else {
        const generatedArticles = await generateNewsAndSummaries(currentTopic);
        // Add a unique ID to each article
        const articlesWithIds = generatedArticles.map((art, index) => ({ ...art, id: `${Date.now()}-${index}`}));
        setArticles(articlesWithIds);
        // Cache the result
        localStorage.setItem(`news_${currentTopic}`, JSON.stringify(articlesWithIds));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch news. The topic might be too restrictive or there was an API error.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch initial news on mount
  useEffect(() => {
    handleFetchNews(topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSetActiveArticle = (id: string) => {
    setActiveArticleId(currentId => currentId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 dark:text-white mb-4">
            Voice News Summary
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Enter a topic to get AI-generated news summaries, read aloud on demand.
          </p>
          
          <TopicInput
            topic={topic}
            setTopic={setTopic}
            onFetch={handleFetchNews}
            isLoading={isLoading}
          />

          {isLoading && (
            <div className="flex justify-center items-center mt-12">
              <Spinner />
              <p className="ml-4 text-lg">Generating news, please wait...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 text-center bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!isLoading && articles.length > 0 && (
            <div className="mt-12 space-y-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isActive={activeArticleId === article.id}
                  onPlayClick={() => handleSetActiveArticle(article.id!)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
