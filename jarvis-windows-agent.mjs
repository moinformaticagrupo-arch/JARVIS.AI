// JARVIS Windows Agent: control local limitado a acciones autorizadas.
// Escucha solo en esta PC (127.0.0.1); nunca expone control de Windows a Internet.
import http from 'node:http';
import { spawn } from 'node:child_process';

const port = Number(process.env.JARVIS_AGENT_PORT || 8765);
const applications = {
  bloc: { label: 'Bloc de notas', command: 'notepad.exe', args: [] },
  calculadora: { label: 'Calculadora', command: 'calc.exe', args: [] },
  explorador: { label: 'Explorador de archivos', command: 'explorer.exe', args: [] },
  edge: { label: 'Microsoft Edge', command: 'msedge.exe', args: [] },
  chrome: { label: 'Google Chrome', command: 'cmd.exe', args: ['/c', 'start', '', 'chrome'] },
  musica: { label: 'Spotify Web', command: 'cmd.exe', args: ['/c', 'start', '', 'https://open.spotify.com/'] },
  whatsapp: { label: 'WhatsApp Web', command: 'cmd.exe', args: ['/c', 'start', '', 'https://web.whatsapp.com/'] },
  youtube: { label: 'YouTube', command: 'cmd.exe', args: ['/c', 'start', '', 'https://www.youtube.com/'] },
  netflix: { label: 'Netflix', command: 'cmd.exe', args: ['/c', 'start', '', 'https://www.netflix.com/'] },
  discord: { label: 'Discord', command: 'cmd.exe', args: ['/c', 'start', '', 'discord:'] },
  telegram: { label: 'Telegram Web', command: 'cmd.exe', args: ['/c', 'start', '', 'https://web.telegram.org/'] },
  gmail: { label: 'Gmail', command: 'cmd.exe', args: ['/c', 'start', '', 'https://mail.google.com/'] },
  maps: { label: 'Google Maps', command: 'cmd.exe', args: ['/c', 'start', '', 'https://maps.google.com/'] },
  configuracion: { label: 'Configuración de Windows', command: 'cmd.exe', args: ['/c', 'start', '', 'ms-settings:'] },
  fotos: { label: 'Fotos de Windows', command: 'cmd.exe', args: ['/c', 'start', '', 'ms-photos:'] },
  vscode: { label: 'Visual Studio Code', command: 'cmd.exe', args: ['/c', 'start', '', 'code'] }
};

function reply(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  response.end(JSON.stringify(data));
}
async function readBody(request) { let body = ''; for await (const part of request) body += part; return JSON.parse(body || '{}'); }

http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return reply(response, 204, {});
  if (request.method === 'GET' && request.url === '/api/status') return reply(response, 200, { status: 'operational', applications: Object.keys(applications) });
  if (request.method === 'POST' && request.url === '/api/launch') {
    try {
      const { app } = await readBody(request); const target = applications[app];
      if (!target) return reply(response, 400, { error: 'APP_NOT_AUTHORIZED' });
      const child = spawn(target.command, target.args, { detached: true, stdio: 'ignore', windowsHide: true });
      child.unref(); return reply(response, 200, { launched: target.label });
    } catch { return reply(response, 400, { error: 'BAD_REQUEST' }); }
  }
  return reply(response, 404, { error: 'NOT_FOUND' });
}).listen(port, '127.0.0.1', () => console.log(`JARVIS Windows Agent listo en http://127.0.0.1:${port}`));
