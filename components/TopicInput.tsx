
import React from 'react';

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  onFetch: (topic: string) => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ topic, setTopic, onFetch, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetch(topic);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g., 'future of space exploration'"
        className="flex-grow w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Get News'}
      </button>
    </form>
  );
};

export default TopicInput;
