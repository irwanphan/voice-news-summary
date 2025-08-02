import React, { useState, useEffect } from 'react';
import redisAI from '../services/redisService';
import { getAIAnalytics } from '../services/geminiService';

interface RedisStatusProps {
  className?: string;
}

const RedisStatus: React.FC<RedisStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<{
    totalRequests: number;
    popularTopics: Array<{ topic: string; count: number }>;
    averageResponseTime: number;
  }>({ totalRequests: 0, popularTopics: [], averageResponseTime: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const health = await redisAI.healthCheck();
        setIsConnected(health);
        
        if (health) {
          const analyticsData = await getAIAnalytics();
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.log('Redis not available in production, running in fallback mode');
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Checking Redis status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h3 className="font-semibold text-gray-800">Redis AI Status</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {isConnected && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalRequests}</div>
              <div className="text-xs text-gray-500">Total Requests</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{analytics.averageResponseTime}ms</div>
              <div className="text-xs text-gray-500">Avg Response</div>
            </div>
          </div>

          {analytics.popularTopics.length > 0 && (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Topics</h4>
              <div className="space-y-1">
                {analytics.popularTopics.slice(0, 3).map((topic, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 truncate">{topic.topic}</span>
                    <span className="text-blue-600 font-medium">{topic.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!isConnected && (
        <div className="text-center py-4">
          <div className="text-red-500 text-sm mb-2">Redis connection failed</div>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}
    </div>
  );
};

export default RedisStatus; 