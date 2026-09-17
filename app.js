const chat = document.querySelector('#chat');
const promptInput = document.querySelector('#prompt');
const composer = document.querySelector('#composer');
const voiceButton = document.querySelector('#voiceButton');
const soundButton = document.querySelector('#soundButton');
const clock = document.querySelector('#clock');
let voiceEnabled = localStorage.getItem('jarvis-voice') !== 'off';

function renderClock() { clock.textContent = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()); }
renderClock(); window.setInterval(renderClock, 1000);

function addMessage(text, type) {
  const item = document.createElement('article');
  item.className = `message ${type}`;
  item.textContent = text;
  chat.append(item);
  chat.scrollTop = chat.scrollHeight;
  if (type === 'assistant') speak(text);
}

function speak(text) {
  if (!voiceEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  // Los navegadores no indican un género fiable; se priorizan voces masculinas conocidas.
  const maleNames = /raul|pablo|jorge|diego|miguel|carlos|david|javier|male|hombre/i;
  const spanishVoices = voices.filter(voice => /^es/i.test(voice.lang));
  utterance.voice = spanishVoices.find(voice => maleNames.test(voice.name)) || spanishVoices.find(voice => /^es-AR/i.test(voice.lang)) || spanishVoices[0] || null;
  utterance.lang = utterance.voice?.lang || 'es-AR';
  utterance.rate = .98; utterance.pitch = .88;
  window.speechSynthesis.speak(utterance);
}

function updateSoundButton() { soundButton.textContent = voiceEnabled ? '◖))' : '◖×'; soundButton.title = voiceEnabled ? 'Voz activada' : 'Voz silenciada'; }
updateSoundButton();
soundButton.addEventListener('click', () => { voiceEnabled = !voiceEnabled; localStorage.setItem('jarvis-voice', voiceEnabled ? 'on' : 'off'); updateSoundButton(); if (voiceEnabled) speak('Voz de JARVIS activada.'); });

function answer(raw) {
  const text = raw.toLowerCase();
  if (/quien.*cre|quién.*cre|creador|padre/.test(text)) {
    return 'Mi creador es Fagioli Ruiz Lautaro Joel; él es mi creador y mi padre, señor.';
  }
  if (/que puedes|qué puedes|funciones/.test(text)) {
    return 'Puedo ayudarlo a organizar tareas y recordatorios, responder preguntas, buscar información y, al conectar servicios, manejar calendario, música y hogar inteligente, señor.';
  }
  if (/recuerd|recordatorio/.test(text)) {
    return 'Entendido, señor. La versión inicial ya interpreta recordatorios; el siguiente paso es conectarla a notificaciones y a su calendario para guardarlos de verdad.';
  }
  if (/musica|música|cancion|canción|spotify|youtube/.test(text)) {
    window.open('https://open.spotify.com/', '_blank', 'noopener');
    return 'Abriendo el módulo de música, señor. Dígame qué artista, álbum o lista quiere reproducir.';
  }
  if (/abr[ií].*(app|aplicaci)|abrir.*(whatsapp|google|mapa)/.test(text)) {
    return 'Puedo abrir servicios web desde aquí, señor. Para abrir aplicaciones instaladas necesitaré el conector seguro de JARVIS en cada dispositivo; será el próximo módulo.';
  }
  return 'Entendido, señor. Estoy listo para asistirlo. En la siguiente etapa conectaré inteligencia, calendario y automatizaciones reales.';
}

async function requestAssistant(message) {
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message })
    });
    if (response.status === 429) return 'Señor, se alcanzó la cuota gratuita diaria de IA. JARVIS no realizará ningún cobro; podrá volver a intentarlo cuando se reinicie la cuota.';
    if (!response.ok) return null;
    const result = await response.json();
    return result.reply;
  } catch { return null; }
}

async function send(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, 'user');
  promptInput.value = '';
  const pending = document.createElement('article');
  pending.className = 'message assistant pending';
  pending.textContent = 'Procesando su orden, señor…';
  chat.append(pending); chat.scrollTop = chat.scrollHeight;
  const smartReply = await requestAssistant(clean);
  pending.remove();
  addMessage(smartReply || answer(clean), 'assistant');
}

composer.addEventListener('submit', event => { event.preventDefault(); send(promptInput.value); });
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => send(button.dataset.prompt)));

voiceButton.addEventListener('click', () => {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) { addMessage('El reconocimiento de voz aún no está disponible en este navegador.', 'assistant'); return; }
  const recognition = new Recognition();
  recognition.lang = 'es-AR'; recognition.interimResults = false;
  recognition.onresult = event => send(event.results[0][0].transcript);
  recognition.onerror = () => addMessage('No pude oírte. Revisá el permiso de micrófono e intentá nuevamente.', 'assistant');
  recognition.start();
});

document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  const action = button.dataset.action;
  if (action === 'music') send('Quiero reproducir música');
  else if (action === 'calendar') addMessage('La agenda se conectará con tu cuenta de calendario en la fase de integraciones.', 'assistant');
  else addMessage('El módulo de aplicaciones requiere instalar un conector seguro en Windows, Android TV y tu celular. Así JARVIS solo ejecutará órdenes que vos autorices.', 'assistant');
}));

if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
