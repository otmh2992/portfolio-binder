// filepath: src/lib/ollama.ts
import type { ChatMessage } from './types';

export interface OllamaResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export interface ChatOptions {
  model?: string;
  messages: ChatMessage[];
  stream?: boolean;
}

const OLLAMA_BASE_URL = import.meta.env.OLLAMA_URL || 'http://localhost:11434';

// Default system prompt for portfolio assistant
const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant for a filmmaker portfolio website. 
You help visitors learn about the filmmaker, their work, and answer questions about projects.
Be concise, friendly, and informative.`;

/**
 * Send a chat message to Ollama
 */
export async function chatWithOllama(
  messages: ChatMessage[],
  options: {
    model?: string;
    stream?: boolean;
    systemPrompt?: string;
  } = {}
): Promise<string> {
  const { model = 'llama3.2', stream = false, systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;

  // Add system prompt as first message if not present
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      stream,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data: OllamaResponse = await response.json();
  return data.message.content;
}

/**
 * Check if Ollama is available and running
 */
export async function checkOllamaStatus(): Promise<{
  available: boolean;
  model?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
    });

    if (!response.ok) {
      return { available: false, error: 'Ollama not responding' };
    }

    const data = await response.json();
    return {
      available: true,
      model: data.models?.[0]?.name || 'llama3.2',
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Generate a streaming chat response
 */
export async function* streamChatWithOllama(
  messages: ChatMessage[],
  options: { model?: string; systemPrompt?: string } = {}
): AsyncGenerator<string> {
  const { model = 'llama3.2', systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;

  // Add system prompt
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        try {
          const data = JSON.parse(line);
          if (data.message?.content) {
            yield data.message.content;
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}

/**
 * Analyze a file and ask AI questions about it
 */
export async function analyzeFile(
  filePath: string,
  question: string,
  options: { model?: string } = {}
): Promise<string> {
  // Read file content (this would be called from an API endpoint with proper file reading)
  const fileContent = `File: ${filePath}\n\nQuestion: ${question}\n\nPlease analyze this file and answer the question.`;

  const messages: ChatMessage[] = [
    { role: 'user', content: fileContent }
  ];

  return chatWithOllama(messages, options);
}

/**
 * Get available models from Ollama
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch {
    return [];
  }
}