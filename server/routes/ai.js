const express = require('express');
const router = express.Router();
const { MistralClient } = require('@mistralai/mistralai');
const { admin } = require('../config/firebase');
const { redisClient } = require('../config/redis');
const { rateLimiter } = require('../utils/rateLimiter');

const mistral = new MistralClient(process.env.MISTRAL_API_KEY);

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();
    
    if (!userDoc.exists || !userDoc.data().subscribed) {
      return res.status(403).json({ 
        error: 'Subscription required',
        code: 'subscription_required'
      });
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid authentication' });
  }
};

router.post('/analyze', authenticate, async (req, res) => {
  try {
    const { portfolioData, marketContext, analysisType, timeframe } = req.body;
    const userId = req.user.uid;

    await rateLimiter.checkRateLimit(userId, 'ai_analyze', 5, 3600);

    const cacheKey = `analysis:${userId}:${analysisType}:${timeframe}`;
    const cachedResult = await redisClient.get(cacheKey);
    
    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    const systemPrompt = `You are a crypto investment analyst providing ${analysisType} analysis for a ${timeframe} timeframe.
    Format your response as a JSON object with:
    - score: number from 0-100 indicating portfolio health
    - recommendations: array of objects with title and description
    - insights: array of key insights
    - warnings: array of potential risks`;

    const userPrompt = `Analyze this portfolio:
    ${JSON.stringify(portfolioData, null, 2)}
    ${marketContext ? `Market context: ${JSON.stringify(marketContext, null, 2)}` : ''}`;

    const response = await mistral.chat({
      model: 'mistral-medium',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      maxTokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 1800);
    
    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze portfolio' });
  }
});

router.post('/chat', authenticate, async (req, res) => {
  try {
    const { messages, includePortfolio } = req.body;
    const userId = req.user.uid;

    await rateLimiter.checkRateLimit(userId, 'ai_chat', 30, 3600);

    let context = '';
    if (includePortfolio) {
      const portfolioDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('portfolio')
        .doc('summary')
        .get();

      if (portfolioDoc.exists) {
        context = `Portfolio context: ${JSON.stringify(portfolioDoc.data())}`;
      }
    }

    const systemMessage = {
      role: 'system',
      content: `You are a crypto investment assistant. Provide accurate, helpful information about cryptocurrencies and trading. ${context}`
    };

    const response = await mistral.chat({
      model: 'mistral-medium',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      maxTokens: 1000
    });

    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router;