# Voice News Summary

An AI-powered news generator that fetches real-time articles from RSS feeds and provides text-to-speech functionality.

## 🚀 Features

- **Real-time RSS Integration**: Fetches articles from Google News RSS feeds and NewsAPI
- **Topic-based Search**: Find articles related to specific topics
- **Text-to-Speech**: Listen to articles with voice controls
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile
- **Redis AI Integration**: Caching, session management, and analytics (optional)

## 📰 News Sources

- **Google News RSS**: Technology, Science, Health, Business categories
- **NewsAPI**: Additional real-time news sources
- **Real-time Updates**: Fresh content from multiple sources

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Inline styles (professional design)
- **RSS Parsing**: rss-parser
- **HTTP Client**: Axios
- **Text-to-Speech**: Web Speech API
- **Caching**: Redis (optional)
- **AI**: Google Gemini API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-news-summary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   # Google Gemini API (optional for AI summaries)
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # NewsAPI (optional for additional news sources)
   VITE_NEWS_API_KEY=your_newsapi_key_here
   
   # Redis Configuration (optional)
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   REDIS_DB=0
   REDIS_URL=
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🎯 Usage

1. **Enter a topic** in the search field
2. **Click "Get News"** to fetch real-time articles
3. **Browse articles** from multiple sources
4. **Click play button** to listen to articles
5. **Click "Read Full Article"** to open original source

## 📋 Available Topics

- Technology & AI
- Science & Research
- Health & Medicine
- Business & Economy
- Space Exploration
- Climate Change
- And any custom topic you want to search

## 🔧 Development

### Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Redis management (optional)
npm run redis:start
npm run redis:stop
npm run redis:logs
npm run redis:test
```

### Project Structure

```
voice-news-summary/
├── components/          # React components
│   ├── VoiceControls.tsx
│   ├── ThemeToggle.tsx
│   └── ...
├── services/           # API services
│   ├── rssService.ts   # RSS integration
│   ├── geminiService.ts
│   └── redisService.ts
├── hooks/              # Custom React hooks
│   └── useTextToSpeech.ts
├── types.ts            # TypeScript interfaces
└── App.tsx            # Main application
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔑 API Keys

### NewsAPI (Optional)
- Get free API key from [newsapi.org](https://newsapi.org)
- Add to `VITE_NEWS_API_KEY` environment variable
- Provides additional news sources

### Google Gemini API (Optional)
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Add to `VITE_GEMINI_API_KEY` environment variable
- Used for AI-generated summaries

## 🎨 Features

### Real-time News
- Fetches articles from Google News RSS feeds
- Filters by topic relevance
- Removes duplicates automatically
- Shows publication dates

### Voice Controls
- Play/Stop/Pause functionality
- Browser-native text-to-speech
- Works with any article content

### Responsive Design
- Professional styling with inline CSS
- Dark/Light theme toggle
- Mobile-friendly layout
- Accessible design

### Error Handling
- Graceful fallbacks when APIs fail
- User-friendly error messages
- Loading states and indicators

## 📊 Performance

- **Fast Loading**: Optimized bundle size
- **Caching**: Redis integration for performance
- **Real-time**: Fresh content from RSS feeds
- **Responsive**: Works on all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your environment variables
3. Ensure you have a stable internet connection
4. Try refreshing the page

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
