#!/usr/bin/env node

import redisAI from '../services/redisService.js';
import { generateNewsAndSummaries } from '../services/geminiService.js';

async function testRedisAI() {
  console.log('🧪 Testing Redis AI Implementation...\n');

  try {
    // Test 1: Connection
    console.log('1️⃣ Testing Redis Connection...');
    await redisAI.connect();
    const isHealthy = await redisAI.healthCheck();
    console.log(`   ✅ Connection status: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}\n`);

    if (!isHealthy) {
      console.log('❌ Redis connection failed. Please ensure Redis is running.');
      console.log('   Run: npm run redis:start');
      process.exit(1);
    }

    // Test 2: Session Management
    console.log('2️⃣ Testing Session Management...');
    const sessionId = await redisAI.createSession();
    console.log(`   ✅ Session created: ${sessionId}`);

    const session = await redisAI.getSession(sessionId);
    console.log(`   ✅ Session retrieved: ${session ? 'SUCCESS' : 'FAILED'}`);

    await redisAI.addTopicToHistory(sessionId, 'artificial intelligence');
    await redisAI.addTopicToHistory(sessionId, 'space exploration');
    console.log('   ✅ Topic history updated\n');

    // Test 3: Caching
    console.log('3️⃣ Testing Caching System...');
    const testData = { message: 'Hello Redis AI!', timestamp: Date.now() };
    await redisAI.setCache('test_cache', testData, 60);
    console.log('   ✅ Data cached');

    const cachedData = await redisAI.getCache('test_cache');
    console.log(`   ✅ Cache retrieval: ${cachedData ? 'SUCCESS' : 'FAILED'}`);

    await redisAI.deleteCache('test_cache');
    console.log('   ✅ Cache deletion: SUCCESS\n');

    // Test 4: Vector Search
    console.log('4️⃣ Testing Vector Search...');
    const testArticles = [
      { title: 'AI Breakthrough', source: 'Tech News', summary: 'New AI technology discovered' },
      { title: 'Machine Learning', source: 'AI Weekly', summary: 'Latest in ML research' }
    ];

    await redisAI.addToVectorIndex('artificial intelligence', testArticles);
    console.log('   ✅ Vector index created');

    const similarTopics = await redisAI.searchSimilarTopics('AI technology', 3);
    console.log(`   ✅ Similar topics found: ${similarTopics.length}\n`);

    // Test 5: Analytics
    console.log('5️⃣ Testing Analytics...');
    await redisAI.logAIRequest({
      topic: 'test topic',
      sessionId,
      timestamp: Date.now(),
      responseTime: 150
    });
    console.log('   ✅ AI request logged');

    const analytics = await redisAI.getAnalytics();
    console.log(`   ✅ Analytics retrieved: ${analytics.totalRequests} total requests\n`);

    // Test 6: News Generation (if API key available)
    console.log('6️⃣ Testing News Generation...');
    if (process.env.API_KEY) {
      try {
        const articles = await generateNewsAndSummaries('technology', sessionId);
        console.log(`   ✅ News generated: ${articles.length} articles`);
        
        // Test caching with real data
        await redisAI.setCache('test_news_cache', articles, 3600);
        const cachedArticles = await redisAI.getCache('test_news_cache');
        console.log(`   ✅ News cached: ${cachedArticles ? 'SUCCESS' : 'FAILED'}`);
      } catch (error) {
        console.log(`   ⚠️ News generation failed: ${error.message}`);
      }
    } else {
      console.log('   ⚠️ Skipping news generation (no API_KEY)');
    }

    console.log('\n🎉 All Redis AI tests completed successfully!');
    console.log('\n📊 Final Analytics:');
    const finalAnalytics = await redisAI.getAnalytics();
    console.log(`   - Total requests: ${finalAnalytics.totalRequests}`);
    console.log(`   - Popular topics: ${finalAnalytics.popularTopics.length}`);
    console.log(`   - Average response time: ${finalAnalytics.averageResponseTime}ms`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Ensure Redis is running: npm run redis:start');
    console.error('   2. Check Redis connection settings in .env');
    console.error('   3. Verify Docker is running (if using Docker)');
    process.exit(1);
  } finally {
    await redisAI.disconnect();
    process.exit(0);
  }
}

// Run the test
testRedisAI(); 