// ============================================================
// JARVIS — APP.JS
// Control principal + estados reales del núcleo
// ============================================================

// ============================================================
// 01. ELEMENTOS DEL DOM
// ============================================================

const chat = document.querySelector("#chat");
const promptInput = document.querySelector("#prompt");
const composer = document.querySelector("#composer");
const voiceButton = document.querySelector("#voiceButton");
const soundButton = document.querySelector("#soundButton");
const voiceSettings = document.querySelector("#voiceSettings");
const voiceDialog = document.querySelector("#voiceDialog");
const voiceSelect = document.querySelector("#voiceSelect");
const voiceHint = document.querySelector("#voiceHint");
const voiceStyle = document.querySelector("#voiceStyle");
const voiceRate = document.querySelector("#voiceRate");
const voicePitch = document.querySelector("#voicePitch");
const rateValue = document.querySelector("#rateValue");
const pitchValue = document.querySelector("#pitchValue");
const clock = document.querySelector("#clock");

const taskDialog = document.querySelector("#taskDialog");
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const nextTask = document.querySelector("#nextTask");
const taskList = document.querySelector("#taskList");
const taskProgress = document.querySelector("#taskProgress");

const agentState = document.querySelector("#agentState");
const agentDetail = document.querySelector("#agentDetail");

const memoryDialog = document.querySelector("#memoryDialog");
const memoryForm = document.querySelector("#memoryForm");
const memoryInput = document.querySelector("#memoryInput");
const memoryList = document.querySelector("#memoryList");
const memoryCount = document.querySelector("#memoryCount");

const gestureDialog = document.querySelector("#gestureDialog");
const gestureVideo = document.querySelector("#gestureVideo");
const gestureCanvas = document.querySelector("#gestureCanvas");
const gestureStatus = document.querySelector("#gestureStatus");
const faceStatus = document.querySelector("#faceStatus");

const companionDialog = document.querySelector("#companionDialog");
const companionStatus = document.querySelector("#companionStatus");
const companionTranscript = document.querySelector("#companionTranscript");

const devicesDialog = document.querySelector("#devicesDialog");
const actionDialog = document.querySelector("#actionDialog");
const actionDescription = document.querySelector("#actionDescription");

const systemReadout = document.querySelector(".system-readout");
const systemReadoutTitle = systemReadout?.querySelector("strong");
const systemReadoutDetail = systemReadout?.querySelector("small");

const statusCard = document.querySelector(".status-card");
const statusCardValue = statusCard?.querySelector("b");
const statusCardBars = statusCard?.querySelector("em");

const core = document.querySelector(".core");
const orb = document.querySelector(".orb");

let gestureStream;
let gestureLastActionAt = 0;

// ============================================================
// 01B. JARVIS NEURAL CORE — INTERFAZ VISUAL
// ============================================================
//
// El núcleo central se presenta como un cerebro holográfico.
// No depende de imágenes externas: el cerebro se dibuja como SVG
// para que siga funcionando offline y conserve el estilo HUD.
// ============================================================

function buildNeuralCore() {
    if (!core) return;

    // Renombramos los módulos laterales para que el núcleo represente
    // a JARVIS como sistema propio y no a proveedores externos.
    const labels = core.closest(".command-deck")?.querySelectorAll(".core-label");
    const moduleNames = [
        "PENSAMIENTO",
        "MEMORIA",
        "HERRAMIENTAS",
        "PERCEPCIÓN",
        "ACCIÓN",
        "SEGURIDAD"
    ];

    labels?.forEach((label, index) => {
        const name = moduleNames[index];
        if (!name) return;
        label.innerHTML = `<span>◉</span> ${name}`;
    });

    // Evitamos duplicar el núcleo si el script se inicializa más de una vez.
    if (core.querySelector(".neural-brain")) return;

    const brain = document.createElement("div");
    brain.className = "neural-brain";
    brain.setAttribute("aria-hidden", "true");

    brain.innerHTML = `
        <div class="brain-halo"></div>
        <div class="brain-scan"></div>

        <svg class="brain-svg" viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="brainFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#dffcff" stop-opacity=".92"/>
                    <stop offset=".28" stop-color="#62dcff" stop-opacity=".68"/>
                    <stop offset=".72" stop-color="#287cff" stop-opacity=".48"/>
                    <stop offset="1" stop-color="#092451" stop-opacity=".2"/>
                </linearGradient>
                <linearGradient id="brainStroke" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#efffff"/>
                    <stop offset=".45" stop-color="#49dfff"/>
                    <stop offset="1" stop-color="#287cff"/>
                </linearGradient>
                <filter id="brainGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="3.2" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <g class="brain-energy" filter="url(#brainGlow)">
                <path class="brain-shell" d="M178 48c-10-22-37-28-56-13-10-11-30-10-39 5-19-4-34 9-35 27-19 4-29 22-24 39-12 12-9 35 5 43-3 20 14 35 32 34 8 16 31 20 45 9 13 10 31 8 42-3 12 10 30 8 41-3 14 11 37 5 44-12 19 1 34-17 29-35 13-12 9-35-5-44 5-18-9-35-26-39-4-18-22-28-39-22-4-14-17-23-31-22-9-1-17 4-23 11Z"/>
                <path class="brain-shell brain-shell-right" d="M182 48c10-22 37-28 56-13 10-11 30-10 39 5 19-4 34 9 35 27 19 4 29 22 24 39 12 12 9 35-5 43 3 20-14 35-32 34-8 16-31 20-45 9-13 10-31 8-42-3-12 10-30 8-41-3-14 11-37 5-44-12-19 1-34-17-29-35-13-12-9-35 5-44-5-18 9-35 26-39 4-18 22-28 39-22 4-14 17-23 31-22 9-1 17 4 23 11Z" opacity=".35"/>

                <path class="brain-fold" d="M92 70c18 8 17 25 4 35 18 6 25 20 14 34 15 2 23 14 19 28"/>
                <path class="brain-fold" d="M126 48c-4 14 4 23 17 27-11 11-10 25 4 34-12 12-7 26 6 32-8 11-4 22 5 30"/>
                <path class="brain-fold" d="M153 43c-8 14-2 26 11 32-10 10-8 24 5 31-9 12-5 25 5 33-6 12-2 22 7 28"/>
                <path class="brain-fold" d="M198 43c8 14 2 26-11 32 10 10 8 24-5 31 9 12 5 25-5 33 6 12 2 22-7 28"/>
                <path class="brain-fold" d="M225 48c4 14-4 23-17 27 11 11 10 25-4 34 12 12 7 26-6 32 8 11 4 22-5 30"/>
                <path class="brain-fold" d="M258 70c-18 8-17 25-4 35-18 6-25 20-14 34-15 2-23 14-19 28"/>

                <path class="brain-center" d="M180 45c-9 20-9 39 0 57 9-18 9-37 0-57Zm0 57c-8 18-8 38 0 62"/>

                <g class="neural-lines">
                    <path d="M72 93L108 82L137 101L166 78L180 102"/>
                    <path d="M94 131L122 119L151 139L180 112"/>
                    <path d="M180 102L205 80L235 99L270 87L292 105"/>
                    <path d="M180 128L209 112L240 133L270 120L289 139"/>
                    <path d="M109 82L122 57"/>
                    <path d="M235 99L249 69"/>
                    <path d="M122 119L111 151"/>
                    <path d="M240 133L251 158"/>
                </g>

                <g class="neural-nodes">
                    <circle cx="72" cy="93" r="4"/>
                    <circle cx="108" cy="82" r="3"/>
                    <circle cx="137" cy="101" r="4"/>
                    <circle cx="166" cy="78" r="3"/>
                    <circle cx="180" cy="102" r="5"/>
                    <circle cx="94" cy="131" r="3"/>
                    <circle cx="122" cy="119" r="4"/>
                    <circle cx="151" cy="139" r="3"/>
                    <circle cx="205" cy="80" r="3"/>
                    <circle cx="235" cy="99" r="4"/>
                    <circle cx="270" cy="87" r="3"/>
                    <circle cx="292" cy="105" r="4"/>
                    <circle cx="209" cy="112" r="3"/>
                    <circle cx="240" cy="133" r="4"/>
                    <circle cx="270" cy="120" r="3"/>
                    <circle cx="289" cy="139" r="4"/>
                </g>
            </g>
        </svg>

        <div class="brain-label">
            <span>JARVIS</span>
            <small>NEURAL CORE</small>
        </div>
    `;

    // El cerebro queda detrás del texto JARVIS, pero delante de los anillos.
    core.appendChild(brain);

    // El orb existente conserva los estados de la aplicación y se convierte
    // en una capa de energía muy fina en lugar de tapar el cerebro.
    if (orb) {
        orb.setAttribute("aria-hidden", "true");
        orb.innerHTML = `<span>JARVIS</span>`;
    }

    const deck = core.closest(".command-deck");
    if (deck && !deck.querySelector(".core-caption")) {
        const caption = document.createElement("div");
        caption.className = "core-caption";
        caption.innerHTML = `
            <span class="core-caption-dot"></span>
            <span>NÚCLEO NEURAL ACTIVO</span>
            <i></i>
            <b>LINK SECURE</b>
        `;
        deck.appendChild(caption);
    }
}

buildNeuralCore();


// ============================================================
// 02. ESTADO DEL MODO ACOMPAÑAMIENTO
// ============================================================

let companionRecognition = null;
let companionActive = false;
let companionProcessing = false;
let companionRestartTimer = null;

// Historial específico del acompañamiento.
// Se mantiene como espejo del historial general.
let companionConversation = [];

let companionLastPhrase = "";
let companionLastPhraseAt = 0;

// Identifica cada sesión.
// Evita que una operación antigua vuelva a activar el micrófono.
let companionSessionId = 0;

// Promesa de la voz actualmente en reproducción.
let activeSpeechPromise = Promise.resolve();

// Generación de voz.
// Sirve para invalidar una reproducción anterior.
let speechGeneration = 0;

let pendingLaunch = null;
let currentRecognition = null;

// ============================================================
// 03. MOTOR GENERAL DE CONVERSACIÓN
// ============================================================
//
// IMPORTANTE:
//
// Este historial NO es la memoria permanente.
//
// Sirve para mantener el contexto de la conversación actual:
//
// Usuario: ¿Quién fue Manuel Belgrano?
// JARVIS: ...
// Usuario: Dame más información.
// JARVIS: ...
// Usuario: ¿Dónde nació?
// JARVIS: ...
//
// Funciona en:
// - Chat normal
// - Voz normal
// - Modo acompañamiento
//
// ============================================================

let conversationHistory = [];
let conversationTopic = "";
let conversationEntities = [];
let conversationTurn = 0;

const MAX_CONVERSATION_MESSAGES = 30;

// ------------------------------------------------------------
// NORMALIZAR TEXTO
// ------------------------------------------------------------

function normalizeConversationText(text) {

    return String(text || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

// ------------------------------------------------------------
// DETECTAR SI ES UNA CONTINUACIÓN
// ------------------------------------------------------------

function isConversationContinuation(text) {

    const normalized =
        normalizeConversationText(text);

    if (!normalized) {
        return false;
    }

    return /^(y |y que|y cual|y cual es|y donde|y cuando|y como|y por que|y porque|y despues|y luego|y el |y la |y los |y las |y eso|y ese|y esa|y ahi|dame mas|dame mas informacion|contame mas|cuentame mas|explicame mas|amplia|ampliame|seguime contando|que mas|algo mas|mas informacion|informacion adicional|explicame eso|hablame mas|decime mas|como fue|que paso despues|y despues que paso|y entonces|ademas|tambien|otra cosa sobre eso)/i
        .test(normalized);
}

// ------------------------------------------------------------
// DETECTAR CAMBIO DE CONVERSACIÓN
// ------------------------------------------------------------

function isNewConversationCommand(text) {

    const normalized =
        normalizeConversationText(text);

    if (!normalized) {
        return false;
    }

    return /^(cambiemos de tema|cambiemos el tema|otro tema|hablemos de otra cosa|hablemos de otro tema|dejemos esto|dejemos ese tema|olvida esto|olvidemos esto|empecemos de nuevo|nueva conversacion|reinicia la conversacion|reiniciar conversacion|borrar conversacion|borra la conversacion|empezar de nuevo)/i
        .test(normalized);
}

// ------------------------------------------------------------
// DETECTAR TEMA
// ------------------------------------------------------------

function detectTopic(text) {

    const clean =
        String(text || "").trim();

    if (!clean) {
        return "";
    }

    // Frases entre comillas.
    const quoted =
        clean.match(/["“](.+?)["”]/g);

    if (quoted?.length) {

        return quoted
            .join(" ")
            .replace(/["“”]/g, "")
            .trim();
    }

    const patterns = [

        /(?:sobre|acerca de|hablame de|hablemos de|informacion sobre|informacion acerca de)\s+(.+)/i,

        /(?:quien es|quién es|quien fue|quién fue|que es|qué es)\s+(.+)/i,

        /(?:donde nacio|dónde nació|cuando murio|cuándo murió)\s+(.+)/i,

        /(?:que sabes de|qué sabes de|contame sobre|cuentame sobre|explícame sobre|explicame sobre)\s+(.+)/i

    ];

    for (const pattern of patterns) {

        const match =
            clean.match(pattern);

        if (match?.[1]) {

            return match[1]
                .replace(/[?.!,;:]+$/g, "")
                .trim();
        }
    }

    return "";
}

// ------------------------------------------------------------
// EXTRAER POSIBLE ENTIDAD
// ------------------------------------------------------------

function detectConversationEntity(text) {

    const topic =
        detectTopic(text);

    if (topic) {
        return topic;
    }

    const clean =
        String(text || "")
            .replace(/[¿?¡!.,;:]/g, "")
            .trim();

    if (
        clean.length >= 3 &&
        clean.split(/\s+/).length <= 8 &&
        !isConversationContinuation(clean)
    ) {
        return clean;
    }

    return "";
}

// ------------------------------------------------------------
// ACTUALIZAR CONTEXTO
// ------------------------------------------------------------

function updateConversationContext(
    userMessage,
    assistantReply = ""
) {

    const userText =
        String(userMessage || "").trim();

    const assistantText =
        String(assistantReply || "").trim();

    if (!userText) {
        return;
    }

    // Si se pidió empezar una conversación nueva,
    // no guardamos la orden de reinicio.
    if (isNewConversationCommand(userText)) {

        clearConversation();

        return;
    }

    conversationTurn += 1;

    const detectedTopic =
        detectTopic(userText);

    if (
        detectedTopic &&
        !isConversationContinuation(userText)
    ) {

        conversationTopic =
            detectedTopic;
    }

    const detectedEntity =
        detectConversationEntity(userText);

    if (
        detectedEntity &&
        !isConversationContinuation(userText)
    ) {

        conversationEntities.push(
            detectedEntity
        );

        conversationEntities =
            [
                ...new Set(
                    conversationEntities
                )
            ].slice(-10);
    }

    conversationHistory.push({
        role: "user",
        text: userText,
        timestamp: Date.now()
    });

    if (assistantText) {

        conversationHistory.push({
            role: "assistant",
            text: assistantText,
            timestamp: Date.now()
        });
    }

    if (
        conversationHistory.length >
        MAX_CONVERSATION_MESSAGES
    ) {

        conversationHistory =
            conversationHistory.slice(
                -MAX_CONVERSATION_MESSAGES
            );
    }
}

// ------------------------------------------------------------
// CONSTRUIR CONTEXTO PARA LA IA
// ------------------------------------------------------------

function buildConversationContext(
    currentMessage = ""
) {

    if (!conversationHistory.length) {
        return "";
    }

    const history =
        conversationHistory
            .slice(-14)
            .map(item => {

                const role =
                    item.role === "user"
                        ? "Usuario"
                        : "JARVIS";

                return `${role}: ${item.text}`;
            })
            .join("\n");

    const topic =
        conversationTopic
            ? `Tema actual de conversación: ${conversationTopic}\n`
            : "";

    const entities =
        conversationEntities.length
            ? `Entidades o personas mencionadas recientemente: ${conversationEntities.join(", ")}\n`
            : "";

    const continuation =
        isConversationContinuation(
            currentMessage
        );

    return `
CONTEXTO DE CONVERSACIÓN:

${topic}${entities}

Historial reciente:
${history}

REGLAS DE CONTEXTO:

- Esta es una conversación continua.
- Utilizá el historial para interpretar la pregunta actual.
- La pregunta actual NO debe confundirse con un mensaje aislado.
- Si el usuario dice "más información", "dame más información", "contame más", "decime más", "¿y después?", "¿y dónde?", "¿y cuándo?", "¿y por qué?", "¿y él?", "¿y ella?", "¿y eso?", "¿qué pasó después?" o expresiones similares, relacioná la pregunta con el tema anterior.
- Si la pregunta actual contiene pronombres como "él", "ella", "eso", "ese", "esa", "ahí", "lo anterior" o "el anterior", resolvé su referencia usando el historial.
- Si el usuario continúa hablando del mismo tema, mantené ese tema.
- Si el usuario hace una pregunta corta que depende claramente del mensaje anterior, respondela utilizando el contexto.
- No preguntes "¿en qué puedo ayudarte?" si la pregunta puede resolverse utilizando el historial.
- No reinicies la conversación en cada mensaje.
- Si el usuario cambia claramente de tema, utilizá el nuevo tema.
- Si el usuario pide información adicional, no repitas exactamente la respuesta anterior: agregá información nueva o profundizá.
- Si el usuario pregunta por una persona, lugar, objeto o acontecimiento mencionado anteriormente, asumí esa referencia salvo que exista una ambigüedad real.
- No menciones este contexto interno.
- No digas que "recordás mensajes internos".
- No expliques estas reglas al usuario.
- Respondé naturalmente como continuación de la conversación.

Estado de la pregunta actual:
${continuation ? "La pregunta parece ser una CONTINUACIÓN del tema anterior." : "La pregunta puede ser nueva o continuar el tema según su contenido."}

`;
}

// ------------------------------------------------------------
// BORRAR CONVERSACIÓN TEMPORAL
// ------------------------------------------------------------

function clearConversation() {

    conversationHistory = [];
    conversationTopic = "";
    conversationEntities = [];
    conversationTurn = 0;

    companionConversation = [];

    console.log(
        "[JARVIS] Conversación temporal reiniciada."
    );
}

// ------------------------------------------------------------
// SINCRONIZAR ACOMPAÑAMIENTO
// ------------------------------------------------------------

function syncCompanionConversation() {

    companionConversation =
        conversationHistory
            .slice(-30)
            .map(item => ({
                role: item.role,
                text: item.text,
                timestamp: item.timestamp
            }));
}

// ============================================================
// 04. CONFIGURACIÓN
// ============================================================

const AI_ENDPOINT =
    localStorage.getItem("jarvis-ai-endpoint") ||
    "https://spring-bread-213b.moinformaticagrupo.workers.dev/";

const WINDOWS_AGENT_ENDPOINT =
    "http://127.0.0.1:8765";

const localApps = {
    "bloc de notas": "bloc",
    "notepad": "bloc",
    "calculadora": "calculadora",
    "explorer": "explorador",
    "explorador": "explorador",
    "edge": "edge",
    "chrome": "chrome",
    "spotify": "musica",
    "música": "musica",
    "musica": "musica",
    "whatsapp": "whatsapp",
    "youtube": "youtube",
    "netflix": "netflix",
    "discord": "discord",
    "telegram": "telegram",
    "gmail": "gmail",
    "google maps": "maps",
    "mapas": "maps",
    "configuración": "configuracion",
    "configuracion": "configuracion",
    "fotos": "fotos",
    "visual studio code": "vscode",
    "vscode": "vscode"
};

const appLabels = {
    bloc: "Bloc de notas",
    calculadora: "Calculadora",
    explorador: "Explorador de archivos",
    edge: "Microsoft Edge",
    chrome: "Google Chrome",
    musica: "Spotify Web",
    whatsapp: "WhatsApp Web",
    youtube: "YouTube",
    netflix: "Netflix",
    discord: "Discord",
    telegram: "Telegram Web",
    gmail: "Gmail",
    maps: "Google Maps",
    configuracion: "Configuración de Windows",
    fotos: "Fotos de Windows",
    vscode: "Visual Studio Code"
};

// ============================================================
// 05. ESTADOS REALES DE JARVIS
// ============================================================

const JARVIS_STATES = {
    ONLINE: "online",
    LISTENING: "listening",
    THINKING: "thinking",
    SPEAKING: "speaking",
    OFFLINE: "offline"
};

const JARVIS_STATE_INFO = {
    online: {
        label: "OPERATIVO",
        title: "LISTO PARA AYUDAR",
        detail: "VOZ · ORGANIZACIÓN · INFORMACIÓN"
    },

    listening: {
        label: "ESCUCHANDO",
        title: "ESCUCHANDO...",
        detail: "MICRÓFONO ACTIVO · ESPERANDO ORDEN"
    },

    thinking: {
        label: "PROCESANDO",
        title: "PROCESANDO...",
        detail: "ANALIZANDO SU SOLICITUD"
    },

    speaking: {
        label: "RESPONDIENDO",
        title: "RESPONDIENDO...",
        detail: "JARVIS ESTÁ HABLANDO"
    },

    offline: {
        label: "DESCONECTADO",
        title: "SISTEMA OFFLINE",
        detail: "NO SE PUDO CONTACTAR CON LA IA"
    }
};

let jarvisState = JARVIS_STATES.ONLINE;

function setJarvisState(state) {

    if (!Object.values(JARVIS_STATES).includes(state)) {
        state = JARVIS_STATES.ONLINE;
    }

    jarvisState = state;

    document.body.dataset.aiState = state;

    const info =
        JARVIS_STATE_INFO[state];

    if (systemReadoutTitle) {
        systemReadoutTitle.textContent =
            info.title;
    }

    if (systemReadoutDetail) {
        systemReadoutDetail.textContent =
            info.detail;
    }

    if (statusCardValue) {
        statusCardValue.textContent =
            info.label;
    }

    if (statusCardBars) {

        switch (state) {

            case JARVIS_STATES.ONLINE:
                statusCardBars.textContent =
                    "▰ ▰ ▰ ▰ ▰";
                break;

            case JARVIS_STATES.LISTENING:
                statusCardBars.textContent =
                    "▰ ▰ ▰ ▰ ▱";
                break;

            case JARVIS_STATES.THINKING:
                statusCardBars.textContent =
                    "▰ ▰ ▱ ▱ ▱";
                break;

            case JARVIS_STATES.SPEAKING:
                statusCardBars.textContent =
                    "▰ ▰ ▰ ▰ ▱";
                break;

            case JARVIS_STATES.OFFLINE:
                statusCardBars.textContent =
                    "▱ ▱ ▱ ▱ ▱";
                break;
        }
    }

    if (core) {

        core.setAttribute(
            "aria-label",
            `Estado de JARVIS: ${info.label}`
        );
    }

    window.dispatchEvent(
        new CustomEvent(
            "jarvisstatechange",
            {
                detail: {
                    state,
                    info
                }
            }
        )
    );

    console.log(
        `[JARVIS] Estado: ${state.toUpperCase()}`
    );
}

// ============================================================
// 06. ESTADO INICIAL
// ============================================================

setJarvisState(
    JARVIS_STATES.ONLINE
);

// ============================================================
// 07. RELOJ
// ============================================================

function renderClock() {

    if (!clock) {
        return;
    }

    clock.textContent =
        new Intl.DateTimeFormat(
            "es-AR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        ).format(new Date());
}

renderClock();

window.setInterval(
    renderClock,
    1000
);

// ============================================================
// 08. TAREAS
// ============================================================

function tasks() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "jarvis-tasks"
            ) || "[]"
        );

    } catch {

        return [];
    }
}

function saveTasks(items) {

    localStorage.setItem(
        "jarvis-tasks",
        JSON.stringify(items)
    );

    renderTasks();
}

function renderTasks() {

    if (
        !taskProgress ||
        !nextTask ||
        !taskList
    ) {
        return;
    }

    const items =
        tasks();

    const completed =
        items.filter(
            item => item.done
        ).length;

    taskProgress.textContent =
        `${completed} / ${items.length}`;

    const active =
        items.find(
            item => !item.done
        );

    nextTask.textContent =
        active?.text ||
        "Sin recordatorios";

    taskList.replaceChildren();

    if (!items.length) {

        const empty =
            document.createElement("p");

        empty.className =
            "empty";

        empty.textContent =
            "Sin tareas activas, señor.";

        taskList.append(empty);

        return;
    }

    items.forEach(item => {

        const row =
            document.createElement("div");

        row.className =
            `task-row${item.done ? " done" : ""}`;

        const check =
            document.createElement("input");

        check.type =
            "checkbox";

        check.checked =
            item.done;

        check.setAttribute(
            "aria-label",
            `Completar ${item.text}`
        );

        check.addEventListener(
            "change",
            () => {

                saveTasks(
                    tasks().map(task =>
                        task.id === item.id
                            ? {
                                ...task,
                                done:
                                    check.checked
                            }
                            : task
                    )
                );
            }
        );

        const label =
            document.createElement("span");

        label.textContent =
            item.text;

        const remove =
            document.createElement("button");

        remove.type =
            "button";

        remove.textContent =
            "×";

        remove.title =
            "Eliminar tarea";

        remove.addEventListener(
            "click",
            () => {

                saveTasks(
                    tasks().filter(
                        task =>
                            task.id !== item.id
                    )
                );
            }
        );

        row.append(
            check,
            label,
            remove
        );

        taskList.append(row);
    });
}

renderTasks();

// ============================================================
// 09. AGENTE WINDOWS
// ============================================================

async function checkWindowsAgent() {

    if (
        !agentState ||
        !agentDetail
    ) {
        return;
    }

    try {

        const response =
            await fetch(
                `${WINDOWS_AGENT_ENDPOINT}/api/status`,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            data.status !== "operational"
        ) {
            throw new Error("offline");
        }

        agentState.innerHTML =
            '<i class="online-dot"></i> CONECTADO';

        agentDetail.textContent =
            `${data.applications?.length || 0} acciones autorizadas en esta PC`;

    } catch {

        agentState.innerHTML =
            '<i class="online-dot offline-dot"></i> DESCONECTADO';

        agentDetail.textContent =
            "Inicie jarvis-windows-agent.mjs para abrir apps";
    }
}

checkWindowsAgent();

window.setInterval(
    checkWindowsAgent,
    15000
);

// ============================================================
// 10. TAREAS — EVENTOS
// ============================================================

document
    .querySelector("#addTask")
    ?.addEventListener(
        "click",
        () => {

            if (!taskDialog) {
                return;
            }

            taskInput.value =
                "";

            taskDialog.showModal();

            taskInput.focus();
        }
    );

taskForm?.addEventListener(
    "submit",
    event => {

        if (
            event.submitter?.value !==
            "save"
        ) {
            return;
        }

        const task =
            taskInput.value.trim();

        if (!task) {

            event.preventDefault();

            return;
        }

        saveTasks([
            ...tasks(),
            {
                id:
                    crypto.randomUUID(),
                text:
                    task,
                done:
                    false
            }
        ]);

        addMessage(
            `Tarea guardada, señor: ${task}.`,
            "assistant"
        );
    }
);

// ============================================================
// 11. MEMORIA LOCAL
// ============================================================

function memories() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "jarvis-memories"
            ) || "[]"
        );

    } catch {

        return [];
    }
}

function renderMemories() {

    if (
        !memoryCount ||
        !memoryList
    ) {
        return;
    }

    const items =
        memories();

    memoryCount.textContent =
        `${items.length} ${
            items.length === 1
                ? "DATO"
                : "DATOS"
        }`;

    memoryList.replaceChildren();

    if (!items.length) {

        const empty =
            document.createElement("div");

        empty.className =
            "empty";

        empty.textContent =
            "No hay datos guardados.";

        memoryList.append(empty);

        return;
    }

    items.forEach(item => {

        const row =
            document.createElement("div");

        row.textContent =
            `◈ ${item}`;

        memoryList.append(row);
    });
}

renderMemories();

document
    .querySelector("#openMemory")
    ?.addEventListener(
        "click",
        () => {

            renderMemories();

            memoryInput.value =
                "";

            memoryDialog.showModal();
        }
    );

memoryForm?.addEventListener(
    "submit",
    event => {

        if (
            event.submitter?.value !==
            "save"
        ) {
            return;
        }

        const value =
            memoryInput.value.trim();

        if (!value) {

            event.preventDefault();

            return;
        }

        const updated = [
            ...memories(),
            value
        ].slice(-30);

        localStorage.setItem(
            "jarvis-memories",
            JSON.stringify(updated)
        );

        renderMemories();

        addMessage(
            `Lo recordaré en este dispositivo, señor: ${value}.`,
            "assistant"
        );
    }
);

document
    .querySelector("#clearMemory")
    ?.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "jarvis-memories"
            );

            renderMemories();
        }
    );

// ============================================================
// 12. BÚSQUEDA WEB — ESTADO
// ============================================================

window.jarvisLastWebSearch = {
    enabled: false,
    query: "",
    sources: []
};

// ============================================================
// 13. MENSAJES
// ============================================================

function addMessage(
    text,
    type,
    options = {}
) {

    if (!chat) {
        return;
    }

    const item =
        document.createElement("article");

    item.className =
        `message ${type}`;

    const messageText =
        document.createElement("div");

    messageText.className =
        "message-text";

    messageText.textContent =
        text;

    item.appendChild(
        messageText
    );

    // --------------------------------------------------------
    // FUENTES WEB
    // --------------------------------------------------------

    if (
        type === "assistant" &&
        options.webSearch === true &&
        Array.isArray(options.sources) &&
        options.sources.length > 0
    ) {

        const validSources =
            options.sources.filter(
                source => {

                    if (
                        !source ||
                        typeof source.url !==
                            "string"
                    ) {
                        return false;
                    }

                    try {

                        const url =
                            new URL(
                                source.url
                            );

                        return (
                            url.protocol ===
                                "http:" ||
                            url.protocol ===
                                "https:"
                        );

                    } catch {

                        return false;
                    }
                }
            );

        if (validSources.length > 0) {

            const sourcesBox =
                document.createElement(
                    "div"
                );

            sourcesBox.className =
                "web-sources";

            const title =
                document.createElement(
                    "div"
                );

            title.className =
                "web-sources-title";

            title.textContent =
                "🌐 Fuentes de Internet";

            sourcesBox.appendChild(
                title
            );

            if (
                typeof options.query ===
                    "string" &&
                options.query.trim()
            ) {

                const query =
                    document.createElement(
                        "div"
                    );

                query.className =
                    "web-search-query";

                query.textContent =
                    `Búsqueda: ${options.query}`;

                sourcesBox.appendChild(
                    query
                );
            }

            validSources.forEach(
                (source, index) => {

                    let parsedUrl;

                    try {

                        parsedUrl =
                            new URL(
                                source.url
                            );

                    } catch {

                        return;
                    }

                    const sourceItem =
                        document.createElement(
                            "div"
                        );

                    sourceItem.className =
                        "web-source";

                    const sourceNumber =
                        document.createElement(
                            "span"
                        );

                    sourceNumber.className =
                        "web-source-number";

                    sourceNumber.textContent =
                        `${index + 1}.`;

                    const sourceContent =
                        document.createElement(
                            "div"
                        );

                    sourceContent.className =
                        "web-source-content";

                    const link =
                        document.createElement(
                            "a"
                        );

                    link.className =
                        "web-source-link";

                    link.href =
                        parsedUrl.href;

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";

                    link.textContent =
                        source.title ||
                        parsedUrl.hostname;

                    sourceContent.appendChild(
                        link
                    );

                    if (
                        typeof source.snippet ===
                            "string" &&
                        source.snippet.trim()
                    ) {

                        const snippet =
                            document.createElement(
                                "div"
                            );

                        snippet.className =
                            "web-source-snippet";

                        snippet.textContent =
                            source.snippet;

                        sourceContent.appendChild(
                            snippet
                        );
                    }

                    sourceItem.append(
                        sourceNumber,
                        sourceContent
                    );

                    sourcesBox.appendChild(
                        sourceItem
                    );
                }
            );

            item.appendChild(
                sourcesBox
            );
        }
    }

    chat.appendChild(item);

    chat.scrollTop =
        chat.scrollHeight;

    // --------------------------------------------------------
    // VOZ
    // --------------------------------------------------------

    if (
        type === "assistant" &&
        text
    ) {

        activeSpeechPromise =
            speak(text);
    }
}

// ============================================================
// 14. VOZ — SPEECH SYNTHESIS
// ============================================================

let voiceEnabled =
    localStorage.getItem(
        "jarvis-voice"
    ) !== "off";

let availableVoices = [];

function refreshVoices() {

    availableVoices =
        window.speechSynthesis?.getVoices?.() ||
        [];
}

refreshVoices();

if (
    "speechSynthesis" in window
) {

    window.speechSynthesis.onvoiceschanged =
        refreshVoices;
}

function voiceSettingsData() {

    return {

        style:
            localStorage.getItem(
                "jarvis-voice-style"
            ) || "professional",

        rate:
            Number(
                localStorage.getItem(
                    "jarvis-voice-rate"
                ) || 0.98
            ),

        pitch:
            Number(
                localStorage.getItem(
                    "jarvis-voice-pitch"
                ) || 0.96
            )
    };
}

function updateVoiceLabels() {

    if (
        !voiceRate ||
        !voicePitch
    ) {
        return;
    }

    const rate =
        Number(
            voiceRate.value
        );

    const pitch =
        Number(
            voicePitch.value
        );

    if (rateValue) {

        rateValue.textContent =
            rate < 0.93
                ? "Pausada"
                : rate > 1.05
                    ? "Ágil"
                    : "Normal";
    }

    if (pitchValue) {

        pitchValue.textContent =
            pitch < 0.91
                ? "Grave"
                : pitch > 1.04
                    ? "Alto"
                    : "Natural";
    }
}

function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}

function speak(text) {

    if (
        !voiceEnabled ||
        !("speechSynthesis" in window)
    ) {

        if (
            jarvisState ===
            JARVIS_STATES.SPEAKING
        ) {

            setJarvisState(
                JARVIS_STATES.ONLINE
            );
        }

        return Promise.resolve();
    }

    const generation =
        ++speechGeneration;

    window.speechSynthesis.cancel();

    refreshVoices();

    const voices =
        availableVoices.filter(
            voice =>
                /^es/i.test(
                    voice.lang
                )
        );

    const natural =
        /natural|neural|online|enhanced/i;

    const male =
        /raul|pablo|jorge|diego|miguel|carlos|david|javier|tomas|tomás|alvaro|álvaro|male|hombre/i;

    const saved =
        localStorage.getItem(
            "jarvis-voice-name"
        );

    const selected =
        voices.find(
            voice =>
                voice.name === saved
        ) ||

        voices.find(
            voice =>
                natural.test(
                    voice.name
                ) &&
                male.test(
                    voice.name
                )
        ) ||

        voices.find(
            voice =>
                natural.test(
                    voice.name
                ) &&
                /^es-AR/i.test(
                    voice.lang
                )
        ) ||

        voices.find(
            voice =>
                male.test(
                    voice.name
                )
        ) ||

        voices.find(
            voice =>
                /^es-AR/i.test(
                    voice.lang
                )
        ) ||

        voices[0] ||

        null;

    const settings =
        voiceSettingsData();

    const tuning =
        {
            professional: [0, -0.01],
            warm: [-0.02, 0.02],
            brief: [0.06, 0]
        }[
            settings.style
        ] || [0, 0];

    const phrases =
        String(text)
            .replace(
                /https?:\/\/\S+/g,
                " enlace disponible en pantalla "
            )
            .replace(
                /[•*_#]/g,
                ""
            )
            .match(
                /[^.!?;:]+[.!?;:]*/g
            ) ||
        [text];

    return new Promise(
        resolve => {

            let position = 0;
            let finished = false;

            const finish = () => {

                if (finished) {
                    return;
                }

                finished = true;

                if (
                    generation ===
                    speechGeneration
                ) {

                    setJarvisState(
                        JARVIS_STATES.ONLINE
                    );
                }

                resolve();
            };

            const next = () => {

                if (
                    generation !==
                    speechGeneration
                ) {

                    finish();

                    return;
                }

                if (
                    position >=
                    phrases.length
                ) {

                    finish();

                    return;
                }

                const phrase =
                    phrases[position++]
                        .trim();

                if (!phrase) {

                    next();

                    return;
                }

                const utterance =
                    new SpeechSynthesisUtterance(
                        phrase
                    );

                utterance.voice =
                    selected;

                utterance.lang =
                    selected?.lang ||
                    "es-AR";

                const kidRate =
                    document.body.classList.contains(
                        "kids-mode"
                    )
                        ? Math.min(
                            settings.rate,
                            0.9
                        )
                        : settings.rate;

                utterance.rate =
                    Math.min(
                        1.2,
                        Math.max(
                            0.7,
                            kidRate +
                                tuning[0]
                        )
                    );

                utterance.pitch =
                    Math.min(
                        1.2,
                        Math.max(
                            0.7,
                            settings.pitch +
                                tuning[1]
                        )
                    );

                utterance.onstart =
                    () => {

                        if (
                            generation !==
                            speechGeneration
                        ) {
                            return;
                        }

                        setJarvisState(
                            JARVIS_STATES.SPEAKING
                        );

                        if (
                            companionRecognition
                        ) {

                            try {
                                companionRecognition.stop();
                            } catch {}
                        }
                    };

                utterance.onend =
                    () => {

                        if (
                            generation !==
                            speechGeneration
                        ) {

                            finish();

                            return;
                        }

                        next();
                    };

                utterance.onerror =
                    event => {

                        console.warn(
                            "[JARVIS] Error de síntesis:",
                            event.error
                        );

                        finish();
                    };

                try {

                    window.speechSynthesis.speak(
                        utterance
                    );

                } catch (error) {

                    console.error(
                        "[JARVIS] No se pudo reproducir la voz:",
                        error
                    );

                    finish();
                }
            };

            next();
        }
    );
}

// ============================================================
// 15. ESTUDIO DE VOZ
// ============================================================

function saveVoiceSettings() {

    if (voiceSelect?.value) {

        localStorage.setItem(
            "jarvis-voice-name",
            voiceSelect.value
        );
    }

    if (voiceStyle) {

        localStorage.setItem(
            "jarvis-voice-style",
            voiceStyle.value
        );
    }

    if (voiceRate) {

        localStorage.setItem(
            "jarvis-voice-rate",
            voiceRate.value
        );
    }

    if (voicePitch) {

        localStorage.setItem(
            "jarvis-voice-pitch",
            voicePitch.value
        );
    }
}

function showVoicePicker() {

    refreshVoices();

    const spanish =
        availableVoices.filter(
            voice =>
                /^es/i.test(
                    voice.lang
                )
        );

    if (!voiceSelect) {
        return;
    }

    voiceSelect.replaceChildren();

    spanish.forEach(
        voice => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                voice.name;

            option.textContent =
                `${voice.name} — ${voice.lang}`;

            voiceSelect.append(
                option
            );
        }
    );

    const saved =
        localStorage.getItem(
            "jarvis-voice-name"
        );

    if (saved) {
        voiceSelect.value =
            saved;
    }

    const settings =
        voiceSettingsData();

    if (voiceStyle) {
        voiceStyle.value =
            settings.style;
    }

    if (voiceRate) {
        voiceRate.value =
            settings.rate;
    }

    if (voicePitch) {
        voicePitch.value =
            settings.pitch;
    }

    updateVoiceLabels();

    if (voiceHint) {

        voiceHint.textContent =
            spanish.length
                ? `${spanish.length} voces en español disponibles. Elegí una y probala antes de guardar.`
                : "No se detectaron voces en español. Instale una voz de español en Windows.";
    }

    voiceDialog?.showModal();
}

voiceSettings?.addEventListener(
    "click",
    showVoicePicker
);

voiceRate?.addEventListener(
    "input",
    updateVoiceLabels
);

voicePitch?.addEventListener(
    "input",
    updateVoiceLabels
);

document
    .querySelector("#testVoice")
    ?.addEventListener(
        "click",
        () => {

            saveVoiceSettings();

            activeSpeechPromise =
                speak(
                    "Buenas, señor. Sistemas listos. Estoy a su disposición."
                );
        }
    );

voiceDialog?.addEventListener(
    "close",
    () => {

        if (
            voiceDialog.returnValue ===
            "save"
        ) {

            saveVoiceSettings();
        }
    }
);

// ============================================================
// 16. BOTÓN DE SONIDO
// ============================================================

function updateSoundButton() {

    if (!soundButton) {
        return;
    }

    soundButton.textContent =
        voiceEnabled
            ? "◖))"
            : "◖×";

    soundButton.title =
        voiceEnabled
            ? "Voz activada"
            : "Voz silenciada";
}

updateSoundButton();

soundButton?.addEventListener(
    "click",
    () => {

        voiceEnabled =
            !voiceEnabled;

        localStorage.setItem(
            "jarvis-voice",
            voiceEnabled
                ? "on"
                : "off"
        );

        updateSoundButton();

        if (voiceEnabled) {

            activeSpeechPromise =
                speak(
                    "Voz de JARVIS activada."
                );

        } else {

            speechGeneration += 1;

            window.speechSynthesis?.cancel();

            setJarvisState(
                JARVIS_STATES.ONLINE
            );

            if (
                companionActive &&
                !companionProcessing
            ) {

                scheduleCompanionRecognition(
                    500
                );
            }
        }
    }
);

// ============================================================
// 17. RESPUESTA LOCAL DE RESPALDO
// ============================================================

function answer(raw) {

    const text =
        normalizeConversationText(raw);

    // --------------------------------------------------------
    // CONTINUACIÓN DE CONVERSACIÓN
    // --------------------------------------------------------

    if (
        isConversationContinuation(raw) &&
        conversationTopic
    ) {

        return `Claro, señor. Continuando con ${conversationTopic}, puedo ampliar la información anterior y explicarle más detalles sobre ese tema.`;
    }

    if (
        /quien.*cre|creador|padre/.test(
            text
        )
    ) {

        return "Mi creador es Fagioli Ruiz Lautaro Joel; él es mi creador y mi padre, señor.";
    }

    if (
        /que puedes|funciones/.test(
            text
        )
    ) {

        return "Puedo ayudarlo a organizar tareas y recordatorios, responder preguntas, buscar información y, al conectar servicios, manejar calendario, música y hogar inteligente, señor.";
    }

    if (
        /recuerd|recordatorio/.test(
            text
        )
    ) {

        return "Entendido, señor. La versión inicial ya interpreta recordatorios; el siguiente paso es conectarla a notificaciones y a su calendario para guardarlos de verdad.";
    }

    if (
        /musica|cancion|spotify|youtube/.test(
            text
        )
    ) {

        window.open(
            "https://open.spotify.com/",
            "_blank",
            "noopener"
        );

        return "Abriendo el módulo de música, señor. Dígame qué artista, álbum o lista quiere reproducir.";
    }

    if (
        /abri.*(app|aplicaci)|abrir.*(whatsapp|google|mapa)/.test(
            text
        )
    ) {

        return "Puedo abrir servicios web desde aquí, señor. Para abrir aplicaciones instaladas necesitaré el conector seguro de JARVIS en cada dispositivo.";
    }

    return "Entendido, señor. Estoy listo para asistirlo.";
}

// ============================================================
// 18. DETECTAR APPS LOCALES
// ============================================================

function findLocalAppCommand(raw) {

    const text =
        String(raw)
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase();

    const requested =
        Object.entries(
            localApps
        ).find(
            ([name]) =>
                text.includes(
                    name
                        .normalize("NFD")
                        .replace(
                            /[\u0300-\u036f]/g,
                            ""
                        )
                        .toLowerCase()
                )
        );

    return /abri|abrir|abre|abreme|inicia|ejecuta|pone|mostra|muestra|lanza/.test(
        text
    )
        ? requested?.[1]
        : null;
}

// ============================================================
// 19. ABRIR APP LOCAL
// ============================================================

function requestLaunch(app) {

    pendingLaunch =
        app;

    if (actionDescription) {

        actionDescription.textContent =
            `JARVIS abrirá ${appLabels[app]} en esta PC mediante su agente local.`;
    }

    actionDialog?.showModal();
}

async function launchLocalApp() {

    if (!pendingLaunch) {
        return;
    }

    try {

        const response =
            await fetch(
                `${WINDOWS_AGENT_ENDPOINT}/api/launch`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            app:
                                pendingLaunch
                        })
                }
            );

        const result =
            await response.json();

        addMessage(
            response.ok
                ? `${result.launched} abierto, señor.`
                : "El agente no autorizó esa aplicación.",
            "assistant"
        );

    } catch {

        addMessage(
            "El agente Windows no está activo. Ejecute jarvis-windows-agent.mjs en esta PC.",
            "assistant"
        );
    }

    pendingLaunch =
        null;

    actionDialog?.close();
}

document
    .querySelector("#confirmAction")
    ?.addEventListener(
        "click",
        launchLocalApp
    );

// ============================================================
// 20. CONEXIÓN CON IA / OLLAMA / BACKEND
// ============================================================

async function requestAssistant(
    message,
    options = {}
) {

    setJarvisState(
        JARVIS_STATES.THINKING
    );

    window.jarvisLastWebSearch = {
        enabled: false,
        query: "",
        sources: []
    };

    try {

        const context =
            memories();

        const childInstructions =
            document.body.classList.contains(
                "kids-mode"
            )
                ? "MODO INFANTIL ACCESIBLE: responde con frases cortas, amables y claras. Usa palabras sencillas, una idea por vez, no uses tono infantilizador, y nunca des consejos médicos ni sustituyas a un adulto responsable. Si la situación puede ser peligrosa, pide hablar con un adulto de confianza.\n\n"
                : "";

        // ----------------------------------------------------
        // CONTEXTO GENERAL DE CONVERSACIÓN
        // ----------------------------------------------------
        //
        // ANTES:
        // El historial solamente se enviaba si:
        // options.companion === true
        //
        // AHORA:
        // Se utiliza siempre.
        //
        // Esto permite continuidad en todo JARVIS.
        // ----------------------------------------------------

        const conversationContext =
            buildConversationContext(
                message
            );

        // ----------------------------------------------------
        // MEMORIA LOCAL
        // ----------------------------------------------------

        const memoryContext =
            context.length
                ? `MEMORIA LOCAL AUTORIZADA:
${context.join(" | ")}

`
                : "";

        // ----------------------------------------------------
        // MENSAJE FINAL
        // ----------------------------------------------------

        const enrichedMessage =
            `${childInstructions}${memoryContext}${conversationContext}MENSAJE ACTUAL DEL USUARIO:
${message}`;

        console.log(
            "[JARVIS] Enviando contexto a IA:",
            {
                companion:
                    options.companion === true,

                conversationHistory:
                    conversationHistory.length,

                topic:
                    conversationTopic,

                entities:
                    conversationEntities
            }
        );

        const response =
            await fetch(
                AI_ENDPOINT,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            message:
                                enrichedMessage
                        })
                }
            );

        if (
            response.status === 429
        ) {

            setJarvisState(
                JARVIS_STATES.ONLINE
            );

            return "Señor, se alcanzó la cuota gratuita diaria de IA. JARVIS no realizará ningún cobro; podrá volver a intentarlo cuando se reinicie la cuota.";
        }

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const result =
            await response.json();

        if (
            !result ||
            typeof result.reply !==
                "string" ||
            !result.reply.trim()
        ) {

            throw new Error(
                "Respuesta de IA vacía"
            );
        }

        // ----------------------------------------------------
        // BÚSQUEDA WEB
        // ----------------------------------------------------
        //
        // NO SE MODIFICA.
        // ----------------------------------------------------

        window.jarvisLastWebSearch = {

            enabled:
                result.webSearch === true,

            query:
                typeof result.searchQuery ===
                    "string"
                    ? result.searchQuery
                    : "",

            sources:
                Array.isArray(
                    result.sources
                )
                    ? result.sources
                    : []
        };

        console.log(
            "[JARVIS] Resultado web:",
            window.jarvisLastWebSearch
        );

        return result.reply.trim();

    } catch (error) {

        console.error(
            "[JARVIS] Error de IA:",
            error
        );

        window.jarvisLastWebSearch = {
            enabled: false,
            query: "",
            sources: []
        };

        setJarvisState(
            JARVIS_STATES.OFFLINE
        );

        return null;
    }
}

// ============================================================
// 21. ENVÍO DE MENSAJES
// ============================================================

let requestInProgress = false;

async function send(
    text,
    options = {}
) {

    const clean =
        String(text || "").trim();

    if (!clean) {
        return null;
    }

    // --------------------------------------------------------
    // NUEVA CONVERSACIÓN
    // --------------------------------------------------------

    if (
        isNewConversationCommand(
            clean
        )
    ) {

        clearConversation();

        addMessage(
            "Entendido, señor. Comenzamos una nueva conversación.",
            "assistant"
        );

        if (promptInput) {
            promptInput.value =
                "";
        }

        return "conversation-reset";
    }

    // --------------------------------------------------------
    // BLOQUEO NORMAL
    // --------------------------------------------------------

    if (
        requestInProgress &&
        !options.companion
    ) {

        return null;
    }

    if (!options.companion) {

        requestInProgress =
            true;
    }

    // --------------------------------------------------------
    // MOSTRAR USUARIO
    // --------------------------------------------------------

    addMessage(
        clean,
        "user"
    );

    if (promptInput) {

        promptInput.value =
            "";
    }

    // --------------------------------------------------------
    // APP LOCAL
    // --------------------------------------------------------

    const localApp =
        findLocalAppCommand(
            clean
        );

    if (localApp) {

        requestLaunch(
            localApp
        );

        addMessage(
            "Listo para abrirlo. Confirme la acción, señor.",
            "assistant"
        );

        // También registramos la interacción
        // en la conversación general.
        updateConversationContext(
            clean,
            "Listo para abrirlo. Confirme la acción, señor."
        );

        syncCompanionConversation();

        if (!options.companion) {

            requestInProgress =
                false;
        }

        return "local-app";
    }

    // --------------------------------------------------------
    // MENSAJE DE PROCESAMIENTO
    // --------------------------------------------------------

    const pending =
        document.createElement(
            "article"
        );

    pending.className =
        "message assistant pending";

    pending.textContent =
        "Procesando su orden, señor…";

    chat?.appendChild(
        pending
    );

    if (chat) {

        chat.scrollTop =
            chat.scrollHeight;
    }

    // --------------------------------------------------------
    // IA
    // --------------------------------------------------------

    const smartReply =
        await requestAssistant(
            clean,
            {
                companion:
                    options.companion === true
            }
        );

    pending.remove();

    // --------------------------------------------------------
    // FALLBACK
    // --------------------------------------------------------

    const finalReply =
        smartReply ||
        answer(clean);

    if (!smartReply) {

        console.warn(
            "[JARVIS] Utilizando respuesta local de respaldo."
        );

        window.jarvisLastWebSearch = {
            enabled: false,
            query: "",
            sources: []
        };

        setJarvisState(
            JARVIS_STATES.ONLINE
        );
    }

    // --------------------------------------------------------
    // ACTUALIZAR CONVERSACIÓN
    // --------------------------------------------------------
    //
    // MUY IMPORTANTE:
    //
    // Se hace DESPUÉS de recibir la respuesta.
    //
    // Así la pregunta actual NO se duplica dentro
    // del contexto que acaba de recibir la IA.
    // --------------------------------------------------------

    if (
        finalReply &&
        finalReply !== "local-app"
    ) {

        updateConversationContext(
            clean,
            finalReply
        );

        syncCompanionConversation();
    }

    // --------------------------------------------------------
    // DATOS DE BÚSQUEDA WEB
    // --------------------------------------------------------

    const webData =
        smartReply
            ? window.jarvisLastWebSearch
            : {
                enabled: false,
                query: "",
                sources: []
            };

    // --------------------------------------------------------
    // RESPUESTA
    // --------------------------------------------------------

    addMessage(
        finalReply,
        "assistant",
        {
            webSearch:
                webData.enabled,

            query:
                webData.query,

            sources:
                webData.sources
        }
    );

    if (!options.companion) {

        requestInProgress =
            false;
    }

    return finalReply;
}

// ============================================================
// 22. COMPOSER
// ============================================================

composer?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        send(
            promptInput?.value || ""
        );
    }
);

// ============================================================
// 23. SUGERENCIAS
// ============================================================

document
    .querySelectorAll(
        "[data-prompt]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                send(
                    button.dataset.prompt
                );
            }
        );
    });

// ============================================================
// 24. RECONOCIMIENTO DE VOZ
// ============================================================

voiceButton?.addEventListener(
    "click",
    () => {

        const Recognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!Recognition) {

            addMessage(
                "El reconocimiento de voz aún no está disponible en este navegador.",
                "assistant"
            );

            return;
        }

        if (currentRecognition) {
            return;
        }

        const recognition =
            new Recognition();

        currentRecognition =
            recognition;

        recognition.lang =
            "es-AR";

        recognition.interimResults =
            false;

        recognition.continuous =
            false;

        recognition.onstart =
            () => {

                setJarvisState(
                    JARVIS_STATES.LISTENING
                );

                voiceButton.classList.add(
                    "is-listening"
                );
            };

        recognition.onresult =
            event => {

                const transcript =
                    event.results[0][0]
                        .transcript
                        .trim();

                send(
                    transcript
                );
            };

        recognition.onerror =
            event => {

                console.warn(
                    "[JARVIS] Error de reconocimiento:",
                    event.error
                );

                setJarvisState(
                    JARVIS_STATES.ONLINE
                );

                addMessage(
                    "No pude oírte. Revisá el permiso de micrófono e intentá nuevamente.",
                    "assistant"
                );
            };

        recognition.onend =
            () => {

                currentRecognition =
                    null;

                voiceButton.classList.remove(
                    "is-listening"
                );

                if (
                    jarvisState ===
                    JARVIS_STATES.LISTENING
                ) {

                    setJarvisState(
                        JARVIS_STATES.ONLINE
                    );
                }
            };

        try {

            recognition.start();

        } catch (error) {

            console.warn(
                "[JARVIS] No se pudo iniciar el micrófono:",
                error
            );

            currentRecognition =
                null;

            setJarvisState(
                JARVIS_STATES.ONLINE
            );
        }
    }
);

// ============================================================
// 25. MÓDULOS
// ============================================================

document
    .querySelectorAll(
        "[data-action]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;

                if (
                    action === "music"
                ) {

                    send(
                        "Quiero reproducir música"
                    );

                } else if (
                    action === "calendar"
                ) {

                    addMessage(
                        "La agenda se conectará con tu cuenta de calendario en la fase de integraciones.",
                        "assistant"
                    );

                } else if (
                    action === "gestures"
                ) {

                    startGestures();

                } else if (
                    action === "devices"
                ) {

                    devicesDialog?.showModal();
                }
            }
        );
    });

// ============================================================
// 26. RUTINAS
// ============================================================

document
    .querySelectorAll(
        "[data-routine]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                send(
                    `Activar ${button.dataset.routine}`
                );
            }
        );
    });

// ============================================================
// 27. MODO ACCESIBLE
// ============================================================

function setAccessibleMode(
    enabled
) {

    document.body.classList.toggle(
        "accessible",
        enabled
    );

    localStorage.setItem(
        "jarvis-accessible",
        enabled
            ? "on"
            : "off"
    );

    const button =
        document.querySelector(
            "#seniorMode"
        );

    if (button) {

        button.textContent =
            enabled
                ? "Aa MODO NORMAL"
                : "Aa MODO CLARO";
    }
}

setAccessibleMode(
    localStorage.getItem(
        "jarvis-accessible"
    ) === "on"
);

document
    .querySelector(
        "#seniorMode"
    )
    ?.addEventListener(
        "click",
        () =>
            setAccessibleMode(
                !document.body.classList.contains(
                    "accessible"
                )
            )
    );

function setKidsMode(
    enabled
) {

    document.body.classList.toggle(
        "kids-mode",
        enabled
    );

    localStorage.setItem(
        "jarvis-kids-mode",
        enabled
            ? "on"
            : "off"
    );

    const button =
        document.querySelector(
            "#kidsMode"
        );

    if (button) {

        button.textContent =
            enabled
                ? "★ MODO ADULTO"
                : "★ MODO INFANTIL";
    }

    if (promptInput) {

        promptInput.placeholder =
            enabled
                ? "Decime qué necesitás o tocá el micrófono…"
                : "Escribe una orden o pregunta…";
    }
}

setKidsMode(
    localStorage.getItem(
        "jarvis-kids-mode"
    ) === "on"
);

document
    .querySelector(
        "#kidsMode"
    )
    ?.addEventListener(
        "click",
        () =>
            setKidsMode(
                !document.body.classList.contains(
                    "kids-mode"
                )
            )
    );

// ============================================================
// 28. MODO ACOMPAÑAMIENTO — JARVIS CONTINUO
// ============================================================
//
// Ahora el acompañamiento utiliza el MISMO motor general
// de conversación que el chat normal.
//
// Ya no existe un contexto separado para la IA.
//
// ============================================================

// ------------------------------------------------------------
// ABRIR MODO ACOMPAÑAMIENTO
// ------------------------------------------------------------

document
    .querySelector(
        "#companionMode"
    )
    ?.addEventListener(
        "click",
        () => {

            companionDialog?.showModal();

            if (companionStatus) {

                companionStatus.textContent =
                    "Listo para iniciar una conversación continua.";
            }

            if (companionTranscript) {

                companionTranscript.textContent =
                    "Activá la sesión para comenzar.";
            }
        }
    );

// ------------------------------------------------------------
// OBTENER SPEECH RECOGNITION
// ------------------------------------------------------------

function getSpeechRecognitionClass() {

    return (
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        null
    );
}

// ------------------------------------------------------------
// CANCELAR REINICIO
// ------------------------------------------------------------

function clearCompanionRestartTimer() {

    if (companionRestartTimer) {

        clearTimeout(
            companionRestartTimer
        );

        companionRestartTimer =
            null;
    }
}

// ------------------------------------------------------------
// PROGRAMAR ESCUCHA
// ------------------------------------------------------------

function scheduleCompanionRecognition(
    delay = 800,
    sessionId = companionSessionId
) {

    if (!companionActive) {
        return;
    }

    if (
        sessionId !==
        companionSessionId
    ) {
        return;
    }

    if (companionProcessing) {
        return;
    }

    clearCompanionRestartTimer();

    companionRestartTimer =
        setTimeout(
            () => {

                companionRestartTimer =
                    null;

                if (
                    !companionActive ||
                    sessionId !==
                        companionSessionId ||
                    companionProcessing
                ) {
                    return;
                }

                startCompanionRecognition(
                    sessionId
                );

            },
            delay
        );
}

// ------------------------------------------------------------
// INICIAR RECONOCIMIENTO
// ------------------------------------------------------------

function startCompanionRecognition(
    sessionId = companionSessionId
) {

    if (!companionActive) {
        return;
    }

    if (
        sessionId !==
        companionSessionId
    ) {
        return;
    }

    if (companionProcessing) {
        return;
    }

    if (
        window.speechSynthesis?.speaking ||
        window.speechSynthesis?.pending
    ) {
        return;
    }

    const Recognition =
        getSpeechRecognitionClass();

    if (!Recognition) {

        if (companionStatus) {

            companionStatus.textContent =
                "Este navegador no admite conversación por voz.";
        }

        return;
    }

    if (companionRecognition) {
        return;
    }

    const recognition =
        new Recognition();

    companionRecognition =
        recognition;

    recognition.lang =
        "es-AR";

    recognition.continuous =
        false;

    recognition.interimResults =
        false;

    recognition.maxAlternatives =
        1;

    let resultReceived =
        false;

    // --------------------------------------------------------
    // START
    // --------------------------------------------------------

    recognition.onstart =
        () => {

            if (
                !companionActive ||
                sessionId !==
                    companionSessionId
            ) {

                try {
                    recognition.stop();
                } catch {}

                return;
            }

            setJarvisState(
                JARVIS_STATES.LISTENING
            );

            if (companionStatus) {

                companionStatus.textContent =
                    "Escuchando... Podés hablar normalmente.";
            }
        };

    // --------------------------------------------------------
    // RESULT
    // --------------------------------------------------------

    recognition.onresult =
        event => {

            if (
                !companionActive ||
                sessionId !==
                    companionSessionId
            ) {
                return;
            }

            for (
                let i =
                    event.resultIndex;
                i <
                    event.results.length;
                i++
            ) {

                const result =
                    event.results[i];

                if (!result.isFinal) {
                    continue;
                }

                const phrase =
                    result[0]
                        ?.transcript
                        ?.trim();

                if (!phrase) {
                    continue;
                }

                resultReceived =
                    true;

                const now =
                    Date.now();

                if (
                    phrase.toLowerCase() ===
                        companionLastPhrase.toLowerCase() &&
                    now -
                        companionLastPhraseAt <
                        2500
                ) {

                    return;
                }

                companionLastPhrase =
                    phrase;

                companionLastPhraseAt =
                    now;

                if (companionTranscript) {

                    companionTranscript.textContent =
                        `Última frase: "${phrase}"`;
                }

                if (companionStatus) {

                    companionStatus.textContent =
                        "Te escuché. Procesando...";
                }

                processCompanionPhrase(
                    phrase,
                    sessionId
                );

                return;
            }
        };

    // --------------------------------------------------------
    // ERROR
    // --------------------------------------------------------

    recognition.onerror =
        event => {

            console.warn(
                "[JARVIS] Acompañamiento:",
                event.error
            );

            if (
                !companionActive ||
                sessionId !==
                    companionSessionId
            ) {
                return;
            }

            if (
                event.error ===
                    "not-allowed" ||
                event.error ===
                    "service-not-allowed"
            ) {

                companionRecognition =
                    null;

                companionActive =
                    false;

                clearCompanionRestartTimer();

                if (companionStatus) {

                    companionStatus.textContent =
                        "El navegador bloqueó el micrófono. Revisá los permisos.";
                }

                setJarvisState(
                    JARVIS_STATES.ONLINE
                );

                document
                    .querySelector(
                        "#startCompanion"
                    )
                    ?.removeAttribute(
                        "disabled"
                    );

                document
                    .querySelector(
                        "#stopCompanion"
                    )
                    ?.setAttribute(
                        "disabled",
                        ""
                    );

                return;
            }

            if (
                event.error ===
                    "no-speech" ||
                event.error ===
                    "network" ||
                event.error ===
                    "aborted" ||
                event.error ===
                    "audio-capture"
            ) {

                companionRecognition =
                    null;

                if (
                    !companionProcessing &&
                    companionActive
                ) {

                    scheduleCompanionRecognition(
                        event.error ===
                            "no-speech"
                            ? 500
                            : 1200,
                        sessionId
                    );
                }

                return;
            }

            companionRecognition =
                null;

            if (
                companionActive &&
                !companionProcessing
            ) {

                scheduleCompanionRecognition(
                    1200,
                    sessionId
                );
            }
        };

    // --------------------------------------------------------
    // END
    // --------------------------------------------------------

    recognition.onend =
        () => {

            if (
                companionRecognition ===
                recognition
            ) {

                companionRecognition =
                    null;
            }

            if (
                !companionActive ||
                sessionId !==
                    companionSessionId
            ) {

                return;
            }

            if (resultReceived) {
                return;
            }

            if (
                companionProcessing ||
                window.speechSynthesis?.speaking ||
                window.speechSynthesis?.pending
            ) {

                return;
            }

            scheduleCompanionRecognition(
                500,
                sessionId
            );
        };

    // --------------------------------------------------------
    // START REAL
    // --------------------------------------------------------

    try {

        recognition.start();

    } catch (error) {

        console.warn(
            "[JARVIS] No se pudo iniciar acompañamiento:",
            error
        );

        if (
            companionRecognition ===
            recognition
        ) {

            companionRecognition =
                null;
        }

        if (
            companionActive &&
            sessionId ===
                companionSessionId
        ) {

            scheduleCompanionRecognition(
                1200,
                sessionId
            );
        }
    }
}

// ------------------------------------------------------------
// PROCESAR FRASE
// ------------------------------------------------------------

async function processCompanionPhrase(
    phrase,
    sessionId = companionSessionId
) {

    if (
        !companionActive ||
        sessionId !==
            companionSessionId
    ) {
        return;
    }

    if (!phrase?.trim()) {
        return;
    }

    if (companionProcessing) {

        if (companionStatus) {

            companionStatus.textContent =
                "Estoy terminando la respuesta anterior...";
        }

        return;
    }

    // Bloqueamos inmediatamente.
    companionProcessing =
        true;

    // Detener reconocimiento actual.
    if (companionRecognition) {

        try {
            companionRecognition.stop();
        } catch {}
    }

    companionRecognition =
        null;

    setJarvisState(
        JARVIS_STATES.THINKING
    );

    if (companionStatus) {

        companionStatus.textContent =
            "Procesando tu pregunta...";
    }

    // --------------------------------------------------------
    // IMPORTANTE:
    //
    // YA NO HACEMOS:
    //
    // companionConversation.push(user)
    //
    // antes de send().
    //
    // El motor general registra la interacción DESPUÉS
    // de obtener la respuesta.
    // --------------------------------------------------------

    let reply =
        null;

    try {

        reply =
            await send(
                phrase,
                {
                    companion: true
                }
            );

    } catch (error) {

        console.error(
            "[JARVIS] Error en acompañamiento:",
            error
        );

        reply =
            null;
    }

    /*
        El usuario puede haber detenido JARVIS mientras
        la IA estaba procesando.
    */

    if (
        !companionActive ||
        sessionId !==
            companionSessionId
    ) {

        companionProcessing =
            false;

        return;
    }

    // Sincronizar el historial del acompañamiento
    // con la conversación general.
    syncCompanionConversation();

    companionProcessing =
        false;

    if (
        !companionActive ||
        sessionId !==
            companionSessionId
    ) {

        return;
    }

    if (companionStatus) {

        companionStatus.textContent =
            "Respuesta lista. Esperando que termine la voz...";
    }

    /*
        Esperamos a que JARVIS termine REALMENTE de hablar.
    */

    try {

        await activeSpeechPromise;

    } catch {}

    /*
        Pequeña pausa para que Chrome no capture
        el final de la propia voz de JARVIS.
    */

    await wait(850);

    if (
        !companionActive ||
        sessionId !==
            companionSessionId
    ) {

        return;
    }

    if (companionProcessing) {
        return;
    }

    setJarvisState(
        JARVIS_STATES.ONLINE
    );

    if (companionStatus) {

        companionStatus.textContent =
            "Escuchando... Podés hacer otra pregunta.";
    }

    scheduleCompanionRecognition(
        250,
        sessionId
    );
}

// ------------------------------------------------------------
// INICIAR SESIÓN
// ------------------------------------------------------------

document
    .querySelector(
        "#startCompanion"
    )
    ?.addEventListener(
        "click",
        () => {

            if (companionActive) {
                return;
            }

            const Recognition =
                getSpeechRecognitionClass();

            if (!Recognition) {

                if (companionStatus) {

                    companionStatus.textContent =
                        "Este navegador no admite conversación por voz.";
                }

                return;
            }

            // Nueva sesión.
            companionSessionId += 1;

            const sessionId =
                companionSessionId;

            clearCompanionRestartTimer();

            // Cancelar voz anterior.
            speechGeneration += 1;

            window.speechSynthesis?.cancel();

            companionActive =
                true;

            companionProcessing =
                false;

            companionRecognition =
                null;

            // ------------------------------------------------
            // IMPORTANTE:
            //
            // NO borramos conversationHistory.
            //
            // El acompañamiento continúa utilizando el
            // contexto general de JARVIS.
            // ------------------------------------------------

            syncCompanionConversation();

            companionLastPhrase =
                "";

            companionLastPhraseAt =
                0;

            if (companionStatus) {

                companionStatus.textContent =
                    "Iniciando conversación continua...";
            }

            if (companionTranscript) {

                companionTranscript.textContent =
                    conversationHistory.length
                        ? "JARVIS retomó el contexto de la conversación. Hablá cuando quieras."
                        : "JARVIS está listo. Hablá cuando quieras.";
            }

            const startButton =
                document.querySelector(
                    "#startCompanion"
                );

            const stopButton =
                document.querySelector(
                    "#stopCompanion"
                );

            if (startButton) {

                startButton.disabled =
                    true;
            }

            if (stopButton) {

                stopButton.disabled =
                    false;
            }

            scheduleCompanionRecognition(
                500,
                sessionId
            );
        }
    );

// ------------------------------------------------------------
// DETENER SESIÓN
// ------------------------------------------------------------

function stopCompanion() {

    /*
        Invalidamos inmediatamente todas las operaciones
        pendientes.
    */

    companionSessionId += 1;

    companionActive =
        false;

    companionProcessing =
        false;

    clearCompanionRestartTimer();

    // Invalidar voz anterior.
    speechGeneration += 1;

    // Detener reconocimiento.
    if (companionRecognition) {

        try {
            companionRecognition.stop();
        } catch {}
    }

    companionRecognition =
        null;

    // Detener voz.
    window.speechSynthesis?.cancel();

    /*
        IMPORTANTE:
        NO borramos conversationHistory.

        Detener el micrófono no debe borrar la conversación
        general.
    */

    syncCompanionConversation();

    companionLastPhrase =
        "";

    companionLastPhraseAt =
        0;

    if (companionStatus) {

        companionStatus.textContent =
            "Micrófono desactivado.";
    }

    if (companionTranscript) {

        companionTranscript.textContent =
            "La sesión terminó. No se guardó audio.";
    }

    document
        .querySelector(
            "#startCompanion"
        )
        ?.removeAttribute(
            "disabled"
        );

    document
        .querySelector(
            "#stopCompanion"
        )
        ?.setAttribute(
            "disabled",
            ""
        );

    setJarvisState(
        JARVIS_STATES.ONLINE
    );

    console.log(
        "[JARVIS] Modo acompañamiento detenido."
    );
}

document
    .querySelector(
        "#stopCompanion"
    )
    ?.addEventListener(
        "click",
        stopCompanion
    );

companionDialog?.addEventListener(
    "close",
    stopCompanion
);

// ============================================================
// 29. CONTROL GESTUAL
// ============================================================

async function startGestures() {

    if (
        !navigator.mediaDevices?.getUserMedia ||
        !window.Hands
    ) {

        addMessage(
            "El control gestual requiere cámara web y un navegador moderno, señor.",
            "assistant"
        );

        return;
    }

    gestureDialog?.showModal();

    if (gestureStatus) {

        gestureStatus.textContent =
            "Solicitando acceso a cámara…";
    }

    try {

        gestureStream =
            await navigator.mediaDevices.getUserMedia(
                {
                    video: {
                        facingMode:
                            "user"
                    },
                    audio:
                        false
                }
            );

        gestureVideo.srcObject =
            gestureStream;

        await gestureVideo.play();

        const context =
            gestureCanvas.getContext(
                "2d"
            );

        let facePoints =
            null;

        let faceLastSeen =
            0;

        const drawFaceHud =
            () => {

                if (
                    !facePoints ||
                    Date.now() -
                        faceLastSeen >
                        1200
                ) {

                    if (faceStatus) {

                        faceStatus.textContent =
                            "ROSTRO · BUSCANDO";
                    }

                    return false;
                }

                const xs =
                    facePoints.map(
                        point =>
                            point.x *
                            gestureCanvas.width
                    );

                const ys =
                    facePoints.map(
                        point =>
                            point.y *
                            gestureCanvas.height
                    );

                const left =
                    Math.min(
                        ...xs
                    );

                const right =
                    Math.max(
                        ...xs
                    );

                const top =
                    Math.min(
                        ...ys
                    );

                const bottom =
                    Math.max(
                        ...ys
                    );

                context.save();

                context.strokeStyle =
                    "#ff6258";

                context.lineWidth =
                    2;

                context.setLineDash(
                    [7, 5]
                );

                context.strokeRect(
                    left,
                    top,
                    right - left,
                    bottom - top
                );

                context.setLineDash(
                    []
                );

                if (
                    typeof drawConnectors ===
                        "function" &&
                    window.FACEMESH_TESSELATION
                ) {

                    drawConnectors(
                        context,
                        facePoints,
                        FACEMESH_TESSELATION,
                        {
                            color:
                                "#ff625844",
                            lineWidth:
                                1
                        }
                    );
                }

                context.restore();

                if (faceStatus) {

                    faceStatus.textContent =
                        "ROSTRO · DETECTADO LOCALMENTE";
                }

                return true;
            };

        const faceMesh =
            window.FaceMesh
                ? new FaceMesh({
                    locateFile:
                        file =>
                            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
                })
                : null;

        faceMesh?.setOptions({
            maxNumFaces:
                1,
            refineLandmarks:
                false,
            minDetectionConfidence:
                0.55,
            minTrackingConfidence:
                0.55
        });

        faceMesh?.onResults(
            results => {

                facePoints =
                    results.multiFaceLandmarks?.[0] ||
                    null;

                if (facePoints) {

                    faceLastSeen =
                        Date.now();
                }
            }
        );

        const hands =
            new Hands({
                locateFile:
                    file =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });

        hands.setOptions({
            maxNumHands:
                2,
            modelComplexity:
                1,
            minDetectionConfidence:
                0.65,
            minTrackingConfidence:
                0.6
        });

        hands.onResults(
            results => {

                gestureCanvas.width =
                    gestureVideo.videoWidth;

                gestureCanvas.height =
                    gestureVideo.videoHeight;

                context.clearRect(
                    0,
                    0,
                    gestureCanvas.width,
                    gestureCanvas.height
                );

                const faceDetected =
                    drawFaceHud();

                const points =
                    results.multiHandLandmarks?.[0];

                if (!points) {

                    gestureStatus.textContent =
                        faceDetected
                            ? "Rostro detectado · mostrá una mano para usar gestos."
                            : "Mostrá una mano frente a la cámara, señor.";

                    return;
                }

                if (
                    typeof drawConnectors ===
                    "function"
                ) {

                    drawConnectors(
                        context,
                        points,
                        HAND_CONNECTIONS,
                        {
                            color:
                                "#50e3ff",
                            lineWidth:
                                3
                        }
                    );
                }

                if (
                    typeof drawLandmarks ===
                    "function"
                ) {

                    drawLandmarks(
                        context,
                        points,
                        {
                            color:
                                "#50e3ff",
                            radius:
                                4
                        }
                    );
                }

                const thumb =
                    points[4];

                const index =
                    points[8];

                const pinched =
                    Math.hypot(
                        thumb.x -
                            index.x,
                        thumb.y -
                            index.y
                    ) < 0.06;

                const x =
                    (1 - index.x) *
                    gestureCanvas.width;

                const y =
                    index.y *
                    gestureCanvas.height;

                context.beginPath();

                context.arc(
                    x,
                    y,
                    pinched
                        ? 18
                        : 10,
                    0,
                    Math.PI * 2
                );

                context.fillStyle =
                    pinched
                        ? "#4be2b1"
                        : "#50e3ff";

                context.fill();

                gestureStatus.textContent =
                    pinched
                        ? "PINZA DETECTADA · apuntá a un botón para activarlo"
                        : "Mano detectada · junte pulgar e índice para seleccionar";

                if (
                    pinched &&
                    Date.now() -
                        gestureLastActionAt >
                        1200
                ) {

                    const stage =
                        gestureCanvas
                            .parentElement
                            ?.getBoundingClientRect();

                    const displayX =
                        (1 - index.x) *
                        (stage?.width ||
                            0);

                    const displayY =
                        index.y *
                        (stage?.height ||
                            0);

                    const target =
                        [
                            ...document.querySelectorAll(
                                "[data-gesture-command]"
                            )
                        ].find(
                            button => {

                                const rect =
                                    button.getBoundingClientRect();

                                return (
                                    stage &&
                                    displayX >=
                                        rect.left -
                                        stage.left &&
                                    displayX <=
                                        rect.right -
                                        stage.left &&
                                    displayY >=
                                        rect.top -
                                        stage.top &&
                                    displayY <=
                                        rect.bottom -
                                        stage.top
                                );
                            }
                        );

                    if (target) {

                        gestureLastActionAt =
                            Date.now();

                        target.click();

                        gestureStatus.textContent =
                            `ORDEN ACTIVADA: ${target.dataset.gestureCommand}`;
                    }
                }
            }
        );

        const camera =
            new Camera(
                gestureVideo,
                {
                    onFrame:
                        async () => {

                            const frame =
                                {
                                    image:
                                        gestureVideo
                                };

                            await Promise.all(
                                [
                                    hands.send(
                                        frame
                                    ),
                                    faceMesh?.send(
                                        frame
                                    )
                                ].filter(
                                    Boolean
                                )
                            );
                        },

                    width:
                        1280,

                    height:
                        720
                }
            );

        camera.start();

    } catch {

        gestureStatus.textContent =
            "No se pudo acceder a la cámara. Revise el permiso del navegador.";
    }
}

function stopGestures() {

    gestureLastActionAt =
        0;

    gestureStream
        ?.getTracks()
        .forEach(
            track =>
                track.stop()
        );

    gestureStream =
        null;

    if (gestureVideo) {

        gestureVideo.srcObject =
            null;
    }
}

document
    .querySelector(
        "#closeGestures"
    )
    ?.addEventListener(
        "click",
        () => {

            stopGestures();

            gestureDialog?.close();
        }
    );

gestureDialog?.addEventListener(
    "close",
    stopGestures
);

// ============================================================
// 30. BOTONES DE GESTOS
// ============================================================

document
    .querySelectorAll(
        "[data-gesture-command]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                addMessage(
                    `Orden gestual recibida, señor: ${button.dataset.gestureCommand}.`,
                    "assistant"
                );
            }
        );
    });

// ============================================================
// 31. SERVICE WORKER
// ============================================================

if (
    "serviceWorker" in navigator
) {

    navigator.serviceWorker
        .register(
            "service-worker.js"
        )
        .catch(
            error => {

                console.warn(
                    "[JARVIS] Service Worker no registrado:",
                    error
                );
            }
        );
}

// ============================================================
// 32. DIAGNÓSTICO DEL SISTEMA
// ============================================================

window.JARVIS = {

    getState() {

        return jarvisState;
    },

    setState(state) {

        setJarvisState(
            state
        );
    },

    states:
        JARVIS_STATES,

    speak,

    send,

    checkWindowsAgent,

    // --------------------------------------------------------
    // CONVERSACIÓN
    // --------------------------------------------------------

    conversation: {

        getHistory() {

            return [
                ...conversationHistory
            ];
        },

        getTopic() {

            return conversationTopic;
        },

        getEntities() {

            return [
                ...conversationEntities
            ];
        },

        getTurn() {

            return conversationTurn;
        },

        clear() {

            clearConversation();
        },

        getStatus() {

            return {
                messages:
                    conversationHistory.length,

                topic:
                    conversationTopic,

                entities:
                    [
                        ...conversationEntities
                    ],

                turn:
                    conversationTurn
            };
        }
    },

    // --------------------------------------------------------
    // ACOMPAÑAMIENTO
    // --------------------------------------------------------

    companion: {

        start() {

            document
                .querySelector(
                    "#startCompanion"
                )
                ?.click();
        },

        stop() {

            stopCompanion();
        },

        isActive() {

            return companionActive;
        },

        isProcessing() {

            return companionProcessing;
        },

        getSessionId() {

            return companionSessionId;
        },

        getConversation() {

            return [
                ...companionConversation
            ];
        },

        getStatus() {

            return {

                active:
                    companionActive,

                processing:
                    companionProcessing,

                session:
                    companionSessionId,

                listening:
                    Boolean(
                        companionRecognition
                    ),

                speaking:
                    Boolean(
                        window.speechSynthesis
                            ?.speaking
                    ),

                conversationLength:
                    companionConversation.length
            };
        }
    }
};

// ============================================================
// 33. INICIALIZACIÓN FINAL
// ============================================================

console.log(
    "%c JARVIS ",
    "background:#e94b42;color:#fff;font-weight:bold;padding:4px 10px;"
);

console.log(
    "[JARVIS] Sistema inicializado."
);

console.log(
    "[JARVIS] Estado:",
    jarvisState
);

console.log(
    "[JARVIS] Endpoint:",
    AI_ENDPOINT
);

console.log(
    "[JARVIS] Búsqueda web:",
    "ACTIVA mediante el backend"
);

console.log(
    "[JARVIS] Conversación:",
    "ACTIVA · CONTEXTO GENERAL"
);

console.log(
    "[JARVIS] Modo acompañamiento:",
    "CONVERSACIÓN CONTINUA + CONTEXTO GENERAL"
);
// Ejemplo de integración en tu manejador de comandos
function ejecutarComando(texto) {
    const comando = texto.toLowerCase();

    if (comando.startsWith("abrir ")) {
        const app = comando.replace("abrir ", "").trim();
        
        // Intentamos abrir como app móvil
        const ejecutado = abrirAppCelular(app);

        if (ejecutado) {
            agregarMensajeJarvis(`Abriendo ${app} en el dispositivo...`);
        } else {
            agregarMensajeJarvis(`No encontré una app compatible con el nombre "${app}".`);
        }
    }
}
// ============================================================
// 34. INFORMACIÓN GLOBAL — UBICACIÓN + HORA + CLIMA REAL
// ============================================================
(() => {
    const countrySelect = document.getElementById("globalCountry");
    const provinceSelect = document.getElementById("globalProvince");

    if (!countrySelect || !provinceSelect) return;

    // ------------------------------------------------------------
    // Datos de interfaz. La ciudad se geocodifica con Open-Meteo,
    // por lo que coordenadas, zona horaria y clima son reales.
    // ------------------------------------------------------------
    const locations = {
        AR: {
            label: "ARGENTINA",
            code: "AR",
            provinces: {
                "BUENOS AIRES": ["Buenos Aires", "La Plata", "Mar del Plata", "Bahía Blanca"],
                "CÓRDOBA": ["Córdoba", "Villa María", "Río Cuarto", "Villa Carlos Paz"],
                "SANTA FE": ["Santa Fe", "Rosario", "Rafaela", "Reconquista"],
                "MENDOZA": ["Mendoza", "San Rafael", "Godoy Cruz", "Luján de Cuyo"],
                "TUCUMÁN": ["San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo", "Concepción"],
                "SALTA": ["Salta", "San Ramón de la Nueva Orán", "Tartagal", "Cafayate"],
                "NEUQUÉN": ["Neuquén", "Cutral Có", "Zapala", "San Martín de los Andes"],
                "RÍO NEGRO": ["Viedma", "San Carlos de Bariloche", "General Roca", "Cipolletti"],
                "CHUBUT": ["Rawson", "Comodoro Rivadavia", "Puerto Madryn", "Trelew"],
                "ENTRE RÍOS": ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay"]
            }
        },
        UY: {
            label: "URUGUAY", code: "UY",
            provinces: {
                "MONTEVIDEO": ["Montevideo"],
                "CANELONES": ["Canelones", "Ciudad de la Costa", "Las Piedras"],
                "MALDONADO": ["Maldonado", "Punta del Este", "San Carlos"],
                "SALTO": ["Salto"],
                "COLONIA": ["Colonia del Sacramento", "Carmelo", "Nueva Helvecia"]
            }
        },
        CL: {
            label: "CHILE", code: "CL",
            provinces: {
                "SANTIAGO": ["Santiago", "Puente Alto", "Maipú", "Las Condes"],
                "VALPARAÍSO": ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"],
                "BIOBÍO": ["Concepción", "Los Ángeles", "Talcahuano", "Coronel"],
                "MAULE": ["Talca", "Curicó", "Linares", "Constitución"],
                "ARAUCANÍA": ["Temuco", "Villarrica", "Angol", "Pucón"]
            }
        },
        BR: {
            label: "BRASIL", code: "BR",
            provinces: {
                "SÃO PAULO": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto"],
                "RIO DE JANEIRO": ["Rio de Janeiro", "Niterói", "Petrópolis", "Nova Iguaçu"],
                "MINAS GERAIS": ["Belo Horizonte", "Uberlândia", "Juiz de Fora", "Contagem"],
                "BAHÍA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Ilhéus"],
                "PARANÁ": ["Curitiba", "Londrina", "Maringá", "Foz do Iguaçu"]
            }
        },
        US: {
            label: "ESTADOS UNIDOS", code: "US",
            provinces: {
                "CALIFORNIA": ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
                "TEXAS": ["Houston", "Dallas", "Austin", "San Antonio"],
                "FLORIDA": ["Miami", "Orlando", "Tampa", "Jacksonville"],
                "NUEVA YORK": ["New York", "Buffalo", "Rochester", "Yonkers"],
                "WASHINGTON": ["Seattle", "Spokane", "Tacoma", "Vancouver"]
            }
        }
    };

    const telemetryItems = [...document.querySelectorAll(".telemetry-item")];
    const locationText = document.getElementById("globalLocationText")
        || telemetryItems[0]?.querySelector("p");
    const weatherText = document.getElementById("globalWeatherText")
        || telemetryItems[1]?.querySelector("p");
    const localTime = document.getElementById("localTime")
        || telemetryItems[2]?.querySelector("#localTime")
        || telemetryItems[2]?.querySelector("p");

    // Si el HTML todavía no tiene ciudad, la insertamos sin exigir
    // cambios manuales en el index.html.
    let citySelect = document.getElementById("globalCity");
    const selectorRow = countrySelect.closest(".global-selector-row");

    if (!citySelect && selectorRow) {
        const label = document.createElement("label");
        label.htmlFor = "globalCity";
        label.textContent = "CIUDAD";

        citySelect = document.createElement("select");
        citySelect.id = "globalCity";
        citySelect.setAttribute("aria-label", "Ciudad");

        selectorRow.append(label, citySelect);
    }

    if (!citySelect) return;

    const state = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Argentina/Buenos_Aires",
        latitude: null,
        longitude: null,
        city: "Buenos Aires",
        requestId: 0
    };

    function fillSelect(select, values, selectedValue = "") {
        select.replaceChildren();
        values.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
        if (selectedValue && values.includes(selectedValue)) {
            select.value = selectedValue;
        }
    }

    function currentCountry() {
        return locations[countrySelect.value] || locations.AR;
    }

    function currentProvince() {
        const country = currentCountry();
        return provinceSelect.value || Object.keys(country.provinces)[0];
    }

    function refreshProvinces() {
        const country = currentCountry();
        const previous = provinceSelect.value;
        const provinces = Object.keys(country.provinces);
        fillSelect(provinceSelect, provinces, previous);
        refreshCities();
    }

    function refreshCities() {
        const country = currentCountry();
        const province = currentProvince();
        const cities = country.provinces[province] || [];
        const previous = citySelect.value;
        fillSelect(citySelect, cities, previous);
        updateLocationAndWeather();
    }

    function setLocationText(city, province, code) {
        if (!locationText) return;
        locationText.innerHTML = "";
        const strong = document.createElement("strong");
        strong.textContent = `${city}, ${code}`;
        const small = document.createElement("small");
        small.textContent = province;
        locationText.append(strong, small);
    }

    function setWeatherLoading() {
        if (!weatherText) return;
        weatherText.innerHTML = "";
        const main = document.createElement("strong");
        main.textContent = "⟳ CARGANDO…";
        const small = document.createElement("small");
        small.textContent = "Consultando clima real";
        weatherText.append(main, small);
    }

    function setWeatherError() {
        if (!weatherText) return;
        weatherText.innerHTML = "";
        const main = document.createElement("strong");
        main.textContent = "— °C";
        const small = document.createElement("small");
        small.textContent = "Clima no disponible";
        weatherText.append(main, small);
    }

    async function geocodeCity(city, province, countryCode) {
        const params = new URLSearchParams({
            name: `${city}, ${province}`,
            count: "5",
            language: "es",
            format: "json",
            countryCode
        });

        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
            cache: "no-store"
        });
        if (!response.ok) throw new Error("geocoding_failed");

        const data = await response.json();
        const result = data.results?.find(item =>
            item.country_code === countryCode
            && String(item.name).toLowerCase() === city.toLowerCase()
        ) || data.results?.[0];

        if (!result) throw new Error("city_not_found");
        return result;
    }

    const weatherDescriptions = {
        0: "Despejado",
        1: "Mayormente despejado",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Niebla",
        48: "Niebla con escarcha",
        51: "Llovizna ligera",
        53: "Llovizna moderada",
        55: "Llovizna intensa",
        56: "Llovizna helada ligera",
        57: "Llovizna helada intensa",
        61: "Lluvia ligera",
        63: "Lluvia moderada",
        65: "Lluvia intensa",
        66: "Lluvia helada ligera",
        67: "Lluvia helada intensa",
        71: "Nieve ligera",
        73: "Nieve moderada",
        75: "Nieve intensa",
        77: "Granos de nieve",
        80: "Chaparrones ligeros",
        81: "Chaparrones moderados",
        82: "Chaparrones intensos",
        85: "Nevadas ligeras",
        86: "Nevadas intensas",
        95: "Tormenta",
        96: "Tormenta con granizo",
        99: "Tormenta fuerte con granizo"
    };

    function weatherIcon(code) {
        if (code === 0) return "☀️";
        if ([1, 2].includes(code)) return "⛅";
        if ([3].includes(code)) return "☁️";
        if ([45, 48].includes(code)) return "🌫️";
        if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
        if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
        if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
        if ([95, 96, 99].includes(code)) return "⛈️";
        return "🌡️";
    }

    async function loadWeather(city, province, countryCode) {
        const requestId = ++state.requestId;
        setWeatherLoading();

        try {
            const geo = await geocodeCity(city, province, countryCode);
            if (requestId !== state.requestId) return;

            state.latitude = geo.latitude;
            state.longitude = geo.longitude;
            state.timezone = geo.timezone || "America/Argentina/Buenos_Aires";
            state.city = city;

            const params = new URLSearchParams({
                latitude: String(geo.latitude),
                longitude: String(geo.longitude),
                current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
                temperature_unit: "celsius",
                wind_speed_unit: "kmh",
                timezone: "auto"
            });

            const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
                cache: "no-store"
            });
            if (!response.ok) throw new Error("weather_failed");

            const data = await response.json();
            if (requestId !== state.requestId) return;

            const current = data.current || {};
            const code = Number(current.weather_code);
            const temperature = Number(current.temperature_2m);
            const humidity = Number(current.relative_humidity_2m);
            const apparent = Number(current.apparent_temperature);
            const wind = Number(current.wind_speed_10m);
            const description = weatherDescriptions[code] || "Condiciones actuales";

            if (weatherText) {
                weatherText.innerHTML = "";
                const main = document.createElement("strong");
                main.textContent = `${weatherIcon(code)} ${Number.isFinite(temperature) ? temperature.toFixed(1) : "—"} °C`;
                const small = document.createElement("small");
                const extras = [];
                if (Number.isFinite(apparent)) extras.push(`Sensación ${apparent.toFixed(1)} °C`);
                if (Number.isFinite(humidity)) extras.push(`Humedad ${Math.round(humidity)}%`);
                if (Number.isFinite(wind)) extras.push(`Viento ${Math.round(wind)} km/h`);
                small.textContent = `${description}${extras.length ? ` · ${extras.join(" · ")}` : ""}`;
                weatherText.append(main, small);
            }
        } catch (error) {
            console.warn("[JARVIS] No se pudo obtener el clima:", error);
            if (requestId === state.requestId) setWeatherError();
        }
    }

    function renderLocalTime() {
        const formatter = new Intl.DateTimeFormat("es-AR", {
            timeZone: state.timezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });

        const value = formatter.format(new Date());
        if (localTime) {
            localTime.textContent = value;
        }
        if (clock) {
            clock.textContent = value;
        }
    }

    function updateLocationAndWeather() {
        const country = currentCountry();
        const province = currentProvince();
        const city = citySelect.value || country.provinces[province]?.[0] || province;
        setLocationText(city, province, country.code);
        loadWeather(city, province, country.code);
    }

    countrySelect.addEventListener("change", refreshProvinces);
    provinceSelect.addEventListener("change", refreshCities);
    citySelect.addEventListener("change", updateLocationAndWeather);

    refreshProvinces();
    renderLocalTime();
    window.setInterval(renderLocalTime, 1000);
    window.setInterval(() => {
        const country = currentCountry();
        const province = currentProvince();
        const city = citySelect.value || country.provinces[province]?.[0] || province;
        loadWeather(city, province, country.code);
    }, 10 * 60 * 1000);
})();
