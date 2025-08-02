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

    // Fetch the RSS feed
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS-Proxy/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch RSS feed: ${response.statusText}` 
      });
    }

    const contentType = response.headers.get('content-type');
    
    // Set appropriate content type
    if (contentType && contentType.includes('xml')) {
      res.setHeader('Content-Type', 'application/xml');
    } else {
      res.setHeader('Content-Type', 'text/plain');
    }

    // Stream the response
    const data = await response.text();
    res.status(200).send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 