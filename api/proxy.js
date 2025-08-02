export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Validate URL
    const urlObj = new URL(url);
    const allowedDomains = [
      'news.google.com',
      'rss.cnn.com',
      'feeds.bbci.co.uk',
      'rss.nytimes.com',
      'feeds.reuters.com',
      'rss.sciencedaily.com',
      'feeds.nature.com'
    ];

    if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return res.status(400).json({ error: 'Domain not allowed' });
    }

    console.log('🔍 Proxy fetching:', url);

    // Fetch the RSS feed with better headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS-Proxy/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 seconds timeout
    });

    if (!response.ok) {
      console.error('❌ Proxy error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: `Failed to fetch RSS feed: ${response.statusText}`,
        status: response.status
      });
    }

    const contentType = response.headers.get('content-type');
    const data = await response.text();
    
    console.log('✅ Proxy success:', data.length, 'characters');

    // Set appropriate content type
    if (contentType && contentType.includes('xml')) {
      res.setHeader('Content-Type', 'application/xml');
    } else {
      res.setHeader('Content-Type', 'text/plain');
    }

    // Stream the response
    res.status(200).send(data);

  } catch (error) {
    console.error('❌ Proxy error:', error);
    
    if (error.name === 'AbortError') {
      res.status(408).json({ 
        error: 'Request timeout',
        message: 'RSS feed took too long to respond'
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
} 