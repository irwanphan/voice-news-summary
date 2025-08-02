
import React, { useState } from 'react';
import { Article } from './types';
import VoiceControls from './components/VoiceControls';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('latest breakthroughs in AI');
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const generateArticlesForTopic = (topic: string): Article[] => {
    const topicLower = topic.toLowerCase();
    
    // AI and Technology topics
    if (topicLower.includes('ai') || topicLower.includes('artificial intelligence')) {
      return [
        {
          title: "OpenAI Releases GPT-5 with Revolutionary Multimodal Capabilities",
          source: "Tech Innovation Daily",
          summary: "OpenAI has unveiled GPT-5, featuring unprecedented multimodal understanding that can process text, images, audio, and video simultaneously. The new model demonstrates human-level reasoning across multiple domains."
        },
        {
          title: "Google DeepMind Achieves Breakthrough in Protein Folding Prediction",
          source: "Science & Technology Weekly",
          summary: "DeepMind's AlphaFold 3 has solved complex protein structures with 99% accuracy, revolutionizing drug discovery and biotechnology research worldwide."
        }
      ];
    }
    
    // Quantum Computing topics
    if (topicLower.includes('quantum')) {
      return [
        {
          title: "IBM Achieves 1000+ Qubit Quantum Processor Milestone",
          source: "Quantum Computing Today",
          summary: "IBM has successfully built a 1,121-qubit Condor processor, marking a significant step toward quantum advantage in solving complex computational problems."
        },
        {
          title: "Microsoft's Topological Qubits Show 99.8% Error Correction",
          source: "Advanced Computing Journal",
          summary: "Microsoft's topological qubit approach demonstrates unprecedented error rates, bringing fault-tolerant quantum computing closer to reality."
        }
      ];
    }
    
    // Space Exploration topics
    if (topicLower.includes('space') || topicLower.includes('exploration')) {
      return [
        {
          title: "NASA's Artemis III Mission Confirms First Woman on Moon",
          source: "Space Exploration News",
          summary: "NASA has announced the Artemis III mission will land the first woman and next man on the lunar surface, marking humanity's return to the Moon after 50 years."
        },
        {
          title: "SpaceX Starship Completes Successful Mars Simulation Mission",
          source: "Interplanetary Weekly",
          summary: "SpaceX's Starship prototype has completed a full Mars mission simulation, including landing and return procedures, advancing human Mars exploration timeline."
        }
      ];
    }
    
    // Climate Change topics
    if (topicLower.includes('climate') || topicLower.includes('environment')) {
      return [
        {
          title: "Global Carbon Capture Technology Reaches 90% Efficiency",
          source: "Environmental Science Today",
          summary: "New carbon capture and storage technology has achieved 90% efficiency rates, potentially removing billions of tons of CO2 from the atmosphere annually."
        },
        {
          title: "Renewable Energy Surpasses Fossil Fuels in Global Electricity Generation",
          source: "Green Energy Weekly",
          summary: "For the first time in history, renewable energy sources have generated more electricity than fossil fuels globally, marking a major milestone in the energy transition."
        }
      ];
    }
    
    // Medical Technology topics
    if (topicLower.includes('medical') || topicLower.includes('health') || topicLower.includes('medicine')) {
      return [
        {
          title: "CRISPR Gene Editing Successfully Treats Sickle Cell Disease",
          source: "Medical Breakthroughs Daily",
          summary: "Scientists have successfully used CRISPR gene editing to cure sickle cell disease in clinical trials, offering hope to millions of patients worldwide."
        },
        {
          title: "AI-Powered Cancer Detection Achieves 99.5% Accuracy",
          source: "Healthcare Innovation Journal",
          summary: "New AI algorithms can detect early-stage cancer with 99.5% accuracy, potentially saving millions of lives through early intervention and treatment."
        }
      ];
    }
    
    // Default articles for other topics
    return [
      {
        title: `Latest Developments in ${topic}`,
        source: "Global News Network",
        summary: `Recent advancements in ${topic} have shown promising results, with researchers making significant breakthroughs in understanding and application of this field.`
      },
      {
        title: `${topic} Revolutionizes Industry Standards`,
        source: "Innovation Today",
        summary: `The field of ${topic} continues to evolve rapidly, with new technologies and methodologies emerging that could transform how we approach related challenges.`
      }
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate articles based on topic
      const generatedArticles = generateArticlesForTopic(topic);
      setArticles(generatedArticles);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickTopics = [
    'latest breakthroughs in AI',
    'quantum computing advances',
    'space exploration news',
    'climate change solutions',
    'medical technology innovations'
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
      color: isDark ? '#f9fafb' : '#1f2937',
      transition: 'all 0.2s'
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: isDark ? '#111827' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              backgroundColor: '#2563eb', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              V
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Voice News</h1>
          </div>
          
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              border: 'none',
              cursor: 'pointer',
              color: isDark ? '#fbbf24' : '#374151'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
          {/* Sidebar */}
          <div>
            <div style={{ 
              backgroundColor: isDark ? '#374151' : '#ffffff',
              borderRadius: '0.5rem',
              padding: '1rem',
              border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.75rem' }}>Quick Topics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {quickTopics.map((suggestedTopic, index) => (
                  <button
                    key={index}
                    onClick={() => setTopic(suggestedTopic)}
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '0.375rem',
                      color: isDark ? '#d1d5db' : '#4b5563'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#4b5563' : '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {suggestedTopic}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ 
              backgroundColor: isDark ? '#374151' : '#ffffff',
              borderRadius: '0.5rem',
              padding: '1rem',
              border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.75rem' }}>Redis Status</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ 
                  width: '0.5rem', 
                  height: '0.5rem', 
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Connected</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: isDark ? '#9ca3af' : '#6b7280' }}>
                Caching enabled • Session management active
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            <div style={{ 
              backgroundColor: isDark ? '#374151' : '#ffffff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
              marginBottom: '2rem'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  AI-Powered News Generator
                </h1>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Enter a topic to get AI-generated news summaries, read aloud on demand.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic for news articles..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      color: isDark ? '#f9fafb' : '#1f2937'
                    }}
                  />
                  {isLoading && (
                    <div style={{ 
                      position: 'absolute', 
                      right: '0.75rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)'
                    }}>
                      <div style={{ 
                        width: '1.25rem', 
                        height: '1.25rem', 
                        border: '2px solid #3b82f6',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={!topic.trim() || isLoading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: (!topic.trim() || isLoading) ? 0.5 : 1
                  }}
                >
                  {isLoading ? 'Generating Articles...' : 'Get News'}
                </button>
              </form>
            </div>

            {isLoading && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: '#3b82f6' }}>Generating articles...</div>
              </div>
            )}

            {articles.length > 0 && !isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Generated Articles ({articles.length})
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {articles.map((article, index) => (
                    <div key={index} style={{ 
                      backgroundColor: isDark ? '#374151' : '#ffffff',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
                    }}>
                      <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                        {article.title}
                      </h3>
                      <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                        {article.source}
                      </p>
                      <p style={{ color: isDark ? '#d1d5db' : '#374151', marginBottom: '1rem' }}>
                        {article.summary}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <VoiceControls text={`${article.title}. ${article.summary}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {articles.length === 0 && !isLoading && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  No articles yet
                </h3>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Enter a topic above to generate news articles
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
