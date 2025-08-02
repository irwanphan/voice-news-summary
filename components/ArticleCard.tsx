
import React from 'react';
import { Article } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { PlayIcon, PauseIcon, StopIcon, VolumeUpIcon } from './icons';

interface ArticleCardProps {
  article: Article;
  isActive: boolean;
  onPlayClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isActive, onPlayClick }) => {
  const { isSpeaking, isPaused, play, pause, stop } = useTextToSpeech({
    onEnd: () => onPlayClick() // Deactivate when speech finishes
  });

  const handlePlay = () => {
    if (!isActive) {
      onPlayClick(); // This will make the card active
      play(article.summary);
    } else {
      if (isSpeaking && !isPaused) {
        pause();
      } else {
        play(article.summary);
      }
    }
  };

  const handleStop = () => {
    stop();
    onPlayClick(); // Deactivate
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ${isActive ? 'ring-2 ring-primary-500' : 'ring-1 ring-transparent'}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{article.title}</h3>
            {isSpeaking && <VolumeUpIcon className="w-5 h-5 text-primary-500 animate-pulse ml-4" />}
        </div>
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-4">{article.source}</p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{article.summary}</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 rounded-b-xl flex items-center space-x-3">
        <button
          onClick={handlePlay}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-primary-500 transition-colors"
          aria-label={isSpeaking && !isPaused ? 'Pause' : 'Play'}
        >
          {isSpeaking && !isPaused ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
        </button>
        <button
          onClick={handleStop}
          disabled={!isSpeaking}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Stop"
        >
          <StopIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
