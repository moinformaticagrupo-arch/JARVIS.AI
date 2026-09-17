# JARVIS Personal OS

## Modo gratuito recomendado (IA en la nube)

JARVIS está configurado para usar **Gemini API Free Tier**. La IA responde aunque el PC esté apagado, mientras la aplicación esté publicada en la nube.

1. Cree una clave gratuita en [Google AI Studio](https://aistudio.google.com/).
2. En la nube, guarde `GEMINI_API_KEY` como secreto de entorno.
3. No agregue una tarjeta ni active facturación.
4. JARVIS usa `gemini-2.5-flash-lite` y mostrará un aviso si se alcanza la cuota gratuita, sin intentar cobrar.

Para probarlo localmente en PowerShell:

```powershell
$env:GEMINI_API_KEY="su_clave_de_google"
node server.mjs
```

La clave queda solo en la sesión de PowerShell y nunca se guarda en el proyecto ni se envía al navegador.

## Alternativa gratuita privada (IA en su PC)

JARVIS puede usar **Ollama**, un motor que ejecuta modelos abiertos en su propio PC. No necesita clave ni créditos de IA; requiere Node.js 18 o posterior y que el PC permanezca encendido mientras JARVIS se use desde otros dispositivos.

1. Instale [Ollama para Windows](https://ollama.com/download/windows).
2. Abra PowerShell y descargue el modelo inicial:

```powershell
ollama pull qwen3:4b
```

3. En esta carpeta, inicie JARVIS:

```powershell
node server.mjs
```

Abra `http://localhost:3000`. Si el equipo tiene poca memoria, use un modelo más pequeño; si tiene una PC potente, podremos usar uno de mayor calidad.

## Alternativa de pago: OpenAI

Para usar OpenAI, mantenga la clave solamente en el servidor y defina `JARVIS_PROVIDER=openai` junto con `OPENAI_API_KEY`. La clave no se guarda en el proyecto ni se envía al navegador.

Sin servidor, `index.html` conserva un modo demostración con voz y órdenes locales.

## Alcance por dispositivo

- Navegador/PWA: voz, interfaz y servicios web.
- Conector Windows/Android/TV: necesario para abrir aplicaciones instaladas y controlar el dispositivo.
- Integraciones autorizadas: calendario, música y hogar inteligente se conectan cuenta por cuenta.

## Publicar JARVIS en la nube

El proyecto está listo para ejecutarse como contenedor Docker. Esta opción es para un servidor pago o una instancia que ya tenga Ollama instalado. Para el modo 100% gratuito, mantenga el servidor en su PC y conéctelo en privado desde celular/TV mediante una red personal como Tailscale.

Si usa una nube con OpenAI, configure estas variables de entorno **como secretos**:

```
JARVIS_PROVIDER = openai
OPENAI_API_KEY = su clave privada
JARVIS_MODEL = gpt-5.6-luna
PORT = 3000
```

El comando de inicio es `node server.mjs` y el puerto es `3000`. El proveedor debe comprobar la ruta `/api/health` para saber que JARVIS está operativo. Nunca copie la clave en `app.js`, `index.html` ni en una conversación.

Una vez publicado, se accede mediante la URL segura `https://...` del proveedor y se puede instalar desde el navegador en celular y PC.
