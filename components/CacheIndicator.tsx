import React from 'react';

interface CacheIndicatorProps {
  isCacheHit: boolean;
  responseTime: number;
  className?: string;
}

const CacheIndicator: React.FC<CacheIndicatorProps> = ({ 
  isCacheHit, 
  responseTime, 
  className = '' 
}) => {
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isCacheHit ? 'bg-green-500' : 'bg-blue-500'}`}></div>
      <span className={isCacheHit ? 'text-green-700' : 'text-blue-700'}>
        {isCacheHit ? 'Cache Hit' : 'Cache Miss'}
      </span>
      <span className="text-gray-500">
        {responseTime}ms
      </span>
    </div>
  );
};

export default CacheIndicator; 