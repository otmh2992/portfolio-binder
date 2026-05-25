// filepath: src/pages/api/chat.ts

import type { APIRoute } from 'astro';
import {
  chatWithOllama,
  checkOllamaStatus,
  getAvailableModels,
  streamChatWithOllama
} from '../../../lib/ollama';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if Ollama is available
    const status = await checkOllamaStatus();

    if (!status.available) {
      return new Response(
        JSON.stringify({
          error: 'Ollama is not available.',
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();

    const {
      messages,
      model,
      stream,
      systemPrompt,
    } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: 'Messages array required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // STREAMING
    if (stream) {
      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamChatWithOllama(messages, {
              model,
              systemPrompt,
            })) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    content: chunk,
                  })}\n\n`
                )
              );
            }

            controller.enqueue(
              encoder.encode(`data: {"done": true}\n\n`)
            );

            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // NORMAL RESPONSE
    const response = await chatWithOllama(messages, {
      model,
      systemPrompt,
    });

    return new Response(
      JSON.stringify({
        response,
        model: model || 'llama3.2',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Chat API Error:', error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const GET: APIRoute = async ({ url }) => {
  const action = url.searchParams.get('action');

  try {
    const status = await checkOllamaStatus();

    if (action === 'models') {
      const models = await getAvailableModels();

      return new Response(
        JSON.stringify({
          ...status,
          models,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        available: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};