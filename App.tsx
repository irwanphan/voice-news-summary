
import React, { useState } from 'react';
import { Article } from './types';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockArticles: Article[] = [
        {
          title: "Test Article 1",
          source: "Test News",
          summary: "This is a test article generated for debugging purposes."
        },
        {
          title: "Test Article 2", 
          source: "Test News",
          summary: "Another test article to verify the application is working."
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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f9ff', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          color: '#1f2937',
          marginBottom: '2rem'
        }}>
          AI News Generator
        </h1>
        
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                opacity: (!topic.trim() || isLoading) ? 0.5 : 1
              }}
            >
              {isLoading ? 'Generating...' : 'Generate Articles'}
            </button>
          </form>
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ color: '#2563eb' }}>Loading...</div>
          </div>
        )}

        {articles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
              Generated Articles ({articles.length})
            </h2>
            {articles.map((article, index) => (
              <div key={index} style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                padding: '1rem',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                  {article.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {article.source}
                </p>
                <p style={{ color: '#374151' }}>
                  {article.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
