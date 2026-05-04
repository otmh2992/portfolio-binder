// filepath: src/pages/api/chat.ts
import type { APIRoute } from 'astro';
import { chatWithOllama, checkOllamaStatus, getAvailableModels, streamChatWithOllama } from '../../lib/ollama';
import { read_file } from 'fs/promises';
import { join } from 'path';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if Ollama is available
    const status = await checkOllamaStatus();
    if (!status.available) {
      return new Response(JSON.stringify({
        error: 'Ollama is not available. Make sure Ollama is running on your machine.',
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const body = await request.json();
    const { messages, model, stream, systemPrompt, analyzeFile: fileToAnalyze, question } = body;

    // Handle file analysis request
    if (fileToAnalyze && question) {
      try {
        const filePath = join(process.cwd(), 'src', fileToAnalyze);
        const content = await read_file(filePath, 'utf-8');
        
        const analysisMessages = [
          { role: 'system', content: systemPrompt || 'You are a helpful code assistant. Analyze the provided file and answer questions about it.' },
          { role: 'user', content: `File: ${fileToAnalyze}\n\n\`\`\`\n${content}\n\`\`\`\n\nQuestion: ${question}` }
        ];
        
        const response = await chatWithOllama(analysisMessages, { model, systemPrompt: '' });
        
        return new Response(JSON.stringify({
          response,
          type: 'file-analysis',
          file: fileToAnalyze,
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (fileError) {
        return new Response(JSON.stringify({
          error: `Could not read file: ${fileToAnalyze}`,
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({
        error: 'Invalid request: messages array required',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle streaming response
    if (stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamChatWithOllama(messages, { model, systemPrompt })) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }
            controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Regular non-streaming response
    const response = await chatWithOllama(messages, { model, systemPrompt });

    return new Response(JSON.stringify({
      response,
      model: model || 'llama3.2',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  const action = url.searchParams.get('action');
  
  try {
    const status = await checkOllamaStatus();
    
    if (action === 'models') {
      const models = await getAvailableModels();
      return new Response(JSON.stringify({ ...status, models }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};