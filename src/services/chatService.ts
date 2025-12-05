import { getFunctions, httpsCallable } from 'firebase/functions';
import { ChatRequest, ChatResponse } from '@/types/chat';

const functions = getFunctions();
const vaultChatFn = httpsCallable<ChatRequest, ChatResponse>(functions, 'vaultChat');

export async function sendChatMessage(
  message: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<ChatResponse> {
  const result = await vaultChatFn({ message, conversationHistory });
  return result.data;
}
