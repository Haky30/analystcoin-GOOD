import { useState, useCallback } from 'react';
import { sendChatMessage, type ChatMessage } from '../lib/ai/api';

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your crypto investment assistant. How can I help you today?' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userMessage: ChatMessage = { role: 'user', content };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      const response = await sendChatMessage(updatedMessages);
      setMessages([...updatedMessages, { role: 'assistant', content: response }]);
      
      return true;
    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      return false;
    } finally {
      setLoading(false);
    }
  }, [messages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearError: () => setError(null)
  };
}