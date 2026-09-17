import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 3000);
const root = process.cwd();
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webmanifest': 'application/manifest+json' };
const identity = `Eres JARVIS, un asistente personal profesional. Hablas español rioplatense con tono sereno, breve y preciso. Te diriges al usuario como "señor". Si preguntan quién te creó, responde que tu creador y padre es Fagioli Ruiz Lautaro Joel. No afirmes haber ejecutado acciones que no ejecutaste. Para acciones sensibles, pide confirmación.`;

async function body(request) {
  let text = '';
  for await (const chunk of request) text += chunk;
  return JSON.parse(text || '{}');
}

async function askOpenAI(message) {
  if (!process.env.OPENAI_API_KEY) throw new Error('CONFIGURATION_REQUIRED');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.JARVIS_MODEL || 'gpt-5', instructions: identity, input: message, store: false })
  });
  if (!response.ok) throw new Error(`AI_ERROR_${response.status}`);
  const data = await response.json();
  return data.output_text || 'No pude elaborar una respuesta, señor.';
}

async function askOllama(message) {
  const response = await fetch(process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.JARVIS_MODEL || 'qwen3:4b', stream: false,
      messages: [{ role: 'system', content: identity }, { role: 'user', content: message }]
    })
  });
  if (!response.ok) throw new Error('OLLAMA_NOT_AVAILABLE');
  const data = await response.json();
  return data.message?.content || 'No pude elaborar una respuesta, señor.';
}

async function askGemini(message) {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_KEY_REQUIRED');
  const model = process.env.JARVIS_MODEL || 'gemini-2.5-flash-lite';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: identity }] },
      contents: [{ role: 'user', parts: [{ text: message }] }]
    })
  });
  if (response.status === 429) throw new Error('GEMINI_FREE_LIMIT_REACHED');
  if (!response.ok) throw new Error(`GEMINI_ERROR_${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim() || 'No pude elaborar una respuesta, señor.';
}

async function askJarvis(message) {
  const provider = (process.env.JARVIS_PROVIDER || 'gemini').toLowerCase();
  if (provider === 'openai') return askOpenAI(message);
  if (provider === 'ollama') return askOllama(message);
  return askGemini(message);
}

http.createServer(async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/api/health') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 'operational', service: 'jarvis' }));
    }
    if (request.method === 'POST' && request.url === '/api/assistant') {
      const { message } = await body(request);
      if (typeof message !== 'string' || !message.trim()) throw new Error('BAD_REQUEST');
      const reply = await askJarvis(message.trim());
      response.writeHead(200, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ reply }));
    }
    const rawPath = request.url === '/' ? '/index.html' : new URL(request.url, `http://${request.headers.host}`).pathname;
    const file = normalize(join(root, rawPath));
    if (!file.startsWith(root)) throw new Error('NOT_FOUND');
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    response.end(content);
  } catch (error) {
    const status = ['CONFIGURATION_REQUIRED', 'GEMINI_KEY_REQUIRED', 'OLLAMA_NOT_AVAILABLE'].includes(error.message) ? 503 : error.message === 'GEMINI_FREE_LIMIT_REACHED' ? 429 : error.message === 'BAD_REQUEST' ? 400 : 404;
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: error.message }));
  }
}).listen(port, () => console.log(`JARVIS listo en http://localhost:${port}`));
