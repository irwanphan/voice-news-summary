
import React, { useState, useEffect } from 'react';
import { generateNewsWithSession } from '../services/geminiService';
import { Article, VectorSearchResult } from '../types';
import redisAI from '../services/redisService';
import VectorSearchResults from './VectorSearchResults';
import CacheIndicator from './CacheIndicator';

interface TopicInputProps {
  onArticlesGenerated: (articles: Article[]) => void;
  onLoading: (loading: boolean) => void;
  className?: string;
}

const TopicInput: React.FC<TopicInputProps> = ({ 
  onArticlesGenerated, 
  onLoading, 
  className = '' 
}) => {
  const [topic, setTopic] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [similarTopics, setSimilarTopics] = useState<VectorSearchResult[]>([]);
  const [isCacheHit, setIsCacheHit] = useState(false);
  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    // Initialize session on component mount
    const initSession = async () => {
      try {
        const newSessionId = await redisAI.createSession();
        setSessionId(newSessionId);
        
        // Get recent topics from session
        const session = await redisAI.getSession(newSessionId);
        if (session?.topicHistory) {
          setRecentTopics(session.topicHistory);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    initSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isSubmitting) return;

    setIsSubmitting(true);
    onLoading(true);
    const startTime = Date.now();

    try {
      // Check for similar topics first
      const similar = await redisAI.searchSimilarTopics(topic.trim(), 3);
      setSimilarTopics(similar);

      const articles = await generateNewsWithSession(topic.trim(), sessionId);
      onArticlesGenerated(articles);
      
      // Update recent topics
      setRecentTopics(prev => [topic.trim(), ...prev.filter(t => t !== topic.trim())].slice(0, 5));
      
      // Set performance metrics
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setIsCacheHit(false); // Will be updated by the service
      
      // Clear input
      setTopic('');
    } catch (error) {
      console.error('Error generating articles:', error);
      alert('Failed to generate articles. Please try again.');
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  const handleRecentTopicClick = (recentTopic: string) => {
    setTopic(recentTopic);
  };

  const handleSimilarTopicClick = (similarTopic: string) => {
    setTopic(similarTopic);
    setSimilarTopics([]); // Clear similar topics when one is selected
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic for news articles..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            disabled={isSubmitting}
          />
          {isSubmitting && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!topic.trim() || isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isSubmitting ? 'Generating Articles...' : 'Generate News Articles'}
        </button>
      </form>

      {recentTopics.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Topics</h3>
          <div className="flex flex-wrap gap-2">
            {recentTopics.map((recentTopic, index) => (
              <button
                key={index}
                onClick={() => handleRecentTopicClick(recentTopic)}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 cursor-pointer"
              >
                {recentTopic}
              </button>
            ))}
          </div>
        </div>
      )}

      {similarTopics.length > 0 && (
        <VectorSearchResults 
          results={similarTopics}
          onTopicSelect={handleSimilarTopicClick}
          className="mt-4"
        />
      )}

      {responseTime > 0 && (
        <div className="flex justify-center mt-4">
          <CacheIndicator 
            isCacheHit={isCacheHit}
            responseTime={responseTime}
          />
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        Powered by Redis AI for enhanced performance and caching
      </div>
    </div>
  );
};

export default TopicInput;
