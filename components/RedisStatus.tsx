import React, { useState, useEffect } from 'react';
import redisAI from '../services/redisService';

interface RedisStatusProps {
  className?: string;
}

const RedisStatus: React.FC<RedisStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkRedisStatus = async () => {
      try {
        setIsChecking(true);
        const health = await redisAI.healthCheck();
        setIsConnected(health);
      } catch (error) {
        console.log('Redis not available, running in fallback mode');
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkRedisStatus();
    const interval = setInterval(checkRedisStatus, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
          Redis Status
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isChecking 
              ? 'bg-yellow-500 animate-pulse' 
              : isConnected 
                ? 'bg-green-500' 
                : 'bg-red-500'
          }`}></div>
          <span className={`text-xs font-medium ${
            isChecking 
              ? 'text-yellow-600 dark:text-yellow-400' 
              : isConnected 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
          }`}>
            {isChecking ? 'Checking...' : isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {isConnected ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              <span>Caching enabled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              <span>Session management active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              <span>Vector search available</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Running in fallback mode</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Using localStorage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Basic functionality only</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedisStatus; 