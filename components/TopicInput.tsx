
import React, { useState, useEffect } from 'react';
import { generateNewsAndSummaries } from '../services/geminiService';
import { Article } from '../types';

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
  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load recent topics from localStorage
    const storedTopics = localStorage.getItem('recentTopics');
    if (storedTopics) {
      setRecentTopics(JSON.parse(storedTopics));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isSubmitting) return;

    setIsSubmitting(true);
    onLoading(true);

    try {
      const articles = await generateNewsAndSummaries(topic.trim());
      onArticlesGenerated(articles);
      
      // Update recent topics
      const updatedTopics = [topic.trim(), ...recentTopics.filter(t => t !== topic.trim())].slice(0, 5);
      setRecentTopics(updatedTopics);
      
      // Save to localStorage
      localStorage.setItem('recentTopics', JSON.stringify(updatedTopics));
      
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

      <div className="text-xs text-gray-500 text-center">
        Powered by AI for enhanced performance
      </div>
    </div>
  );
};

export default TopicInput;
