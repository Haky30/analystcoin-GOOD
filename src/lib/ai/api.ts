import axios from 'axios';
import { AIAnalysisRequest, Analysis, ChatMessage } from './types';
import { auth } from '../firebase';

const API_BASE_URL = '/api/ai';

export async function analyzePortfolio(request: AIAnalysisRequest): Promise<Analysis> {
  try {
    const token = await auth.currentUser?.getIdToken();
    const response = await axios.post(
      `${API_BASE_URL}/analyze`,
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error('Failed to analyze portfolio. Please try again later.');
  }
}

export async function sendChatMessage(
  messages: ChatMessage[],
  portfolioContext = true
): Promise<string> {
  try {
    const token = await auth.currentUser?.getIdToken();
    const response = await axios.post(
      `${API_BASE_URL}/chat`,
      { messages, includePortfolio: portfolioContext },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.message;
  } catch (error) {
    console.error('AI chat error:', error);
    throw new Error('Unable to process your request. Please try again.');
  }
}