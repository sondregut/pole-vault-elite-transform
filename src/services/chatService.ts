import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { firebaseApp } from '@/utils/firebase';
import { ChatRequest, ChatResponse } from '@/types/chat';

const functions = getFunctions(firebaseApp);

// Connect to local emulator in development (only once)
let emulatorConnected = false;
if (import.meta.env.DEV && !emulatorConnected) {
  try {
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    emulatorConnected = true;
    console.log('[Chat] Connected to functions emulator at 127.0.0.1:5001');
  } catch (e) {
    // Already connected, ignore
  }
}

const vaultChatFn = httpsCallable<ChatRequest, ChatResponse>(functions, 'vaultChat');

export async function sendChatMessage(
  message: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<ChatResponse> {
  const result = await vaultChatFn({ message, conversationHistory });
  return result.data;
}
