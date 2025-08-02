import React from 'react';
import { VectorSearchResult } from '../types';

interface VectorSearchResultsProps {
  results: VectorSearchResult[];
  onTopicSelect: (topic: string) => void;
  className?: string;
}

const VectorSearchResults: React.FC<VectorSearchResultsProps> = ({ 
  results, 
  onTopicSelect, 
  className = '' 
}) => {
  if (results.length === 0) return null;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-blue-800 mb-3">
        🔍 Similar Topics Found
      </h4>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div 
            key={result.id}
            className="flex items-center justify-between p-2 bg-white rounded border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={() => onTopicSelect(result.content)}
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">
                {result.content}
              </div>
              <div className="text-xs text-gray-500">
                Similarity: {(result.score * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-xs text-blue-600 font-medium">
              {result.metadata?.articles?.length || 0} articles
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-blue-600 mt-2">
        Click to use similar topic for enhanced results
      </div>
    </div>
  );
};

export default VectorSearchResults; 