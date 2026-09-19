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
let companionRecognition;
let pendingLaunch = null;
let currentRecognition = null;

// ============================================================
// 02. CONFIGURACIÓN
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
// 03. ESTADOS REALES DE JARVIS
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

    const info = JARVIS_STATE_INFO[state];

    if (systemReadoutTitle) {
        systemReadoutTitle.textContent = info.title;
    }

    if (systemReadoutDetail) {
        systemReadoutDetail.textContent = info.detail;
    }

    if (statusCardValue) {
        statusCardValue.textContent = info.label;
    }

    if (statusCardBars) {

        switch (state) {

            case JARVIS_STATES.ONLINE:
                statusCardBars.textContent = "▰ ▰ ▰ ▰ ▰";
                break;

            case JARVIS_STATES.LISTENING:
                statusCardBars.textContent = "▰ ▰ ▰ ▰ ▱";
                break;

            case JARVIS_STATES.THINKING:
                statusCardBars.textContent = "▰ ▰ ▱ ▱ ▱";
                break;

            case JARVIS_STATES.SPEAKING:
                statusCardBars.textContent = "▰ ▰ ▰ ▰ ▱";
                break;

            case JARVIS_STATES.OFFLINE:
                statusCardBars.textContent = "▱ ▱ ▱ ▱ ▱";
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
        new CustomEvent("jarvisstatechange", {
            detail: {
                state,
                info
            }
        })
    );

    console.log(
        `[JARVIS] Estado: ${state.toUpperCase()}`
    );
}

// ============================================================
// 04. ESTADO INICIAL
// ============================================================

setJarvisState(JARVIS_STATES.ONLINE);

// ============================================================
// 05. RELOJ
// ============================================================

function renderClock() {

    if (!clock) return;

    clock.textContent =
        new Intl.DateTimeFormat("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }).format(new Date());
}

renderClock();

window.setInterval(
    renderClock,
    1000
);

// ============================================================
// 06. TAREAS
// ============================================================

function tasks() {

    try {

        return JSON.parse(
            localStorage.getItem("jarvis-tasks") || "[]"
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

    if (!taskProgress || !nextTask || !taskList) {
        return;
    }

    const items = tasks();

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
        active?.text || "Sin recordatorios";

    taskList.replaceChildren();

    if (!items.length) {

        const empty =
            document.createElement("p");

        empty.className = "empty";

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

        check.type = "checkbox";
        check.checked = item.done;

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
                                done: check.checked
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

        remove.type = "button";
        remove.textContent = "×";
        remove.title = "Eliminar tarea";

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
// 07. AGENTE WINDOWS
// ============================================================

async function checkWindowsAgent() {

    if (!agentState || !agentDetail) {
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
// 08. TAREAS — EVENTOS
// ============================================================

document
    .querySelector("#addTask")
    ?.addEventListener(
        "click",
        () => {

            if (!taskDialog) return;

            taskInput.value = "";

            taskDialog.showModal();

            taskInput.focus();
        }
    );

taskForm?.addEventListener(
    "submit",
    event => {

        if (
            event.submitter?.value !== "save"
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
                id: crypto.randomUUID(),
                text: task,
                done: false
            }
        ]);

        addMessage(
            `Tarea guardada, señor: ${task}.`,
            "assistant"
        );
    }
);

// ============================================================
// 09. MEMORIA LOCAL
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

    if (!memoryCount || !memoryList) {
        return;
    }

    const items = memories();

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

        empty.className = "empty";

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

            memoryInput.value = "";

            memoryDialog.showModal();
        }
    );

memoryForm?.addEventListener(
    "submit",
    event => {

        if (
            event.submitter?.value !== "save"
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
// 10. BÚSQUEDA WEB — ESTADO
// ============================================================

window.jarvisLastWebSearch = {
    enabled: false,
    query: "",
    sources: []
};

// ============================================================
// 11. MENSAJES
// ============================================================

function addMessage(
    text,
    type,
    options = {}
) {

    if (!chat) return;

    const item =
        document.createElement("article");

    item.className =
        `message ${type}`;

    // --------------------------------------------------------
    // TEXTO PRINCIPAL
    // --------------------------------------------------------

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
                        typeof source.url !== "string"
                    ) {
                        return false;
                    }

                    try {

                        const url =
                            new URL(source.url);

                        return (
                            url.protocol === "http:" ||
                            url.protocol === "https:"
                        );

                    } catch {

                        return false;
                    }
                }
            );

        if (validSources.length > 0) {

            const sourcesBox =
                document.createElement("div");

            sourcesBox.className =
                "web-sources";

            const title =
                document.createElement("div");

            title.className =
                "web-sources-title";

            title.textContent =
                "🌐 Fuentes de Internet";

            sourcesBox.appendChild(title);

            // ------------------------------------------------
            // CONSULTA
            // ------------------------------------------------

            if (
                typeof options.query === "string" &&
                options.query.trim()
            ) {

                const query =
                    document.createElement("div");

                query.className =
                    "web-search-query";

                query.textContent =
                    `Búsqueda: ${options.query}`;

                sourcesBox.appendChild(query);
            }

            // ------------------------------------------------
            // FUENTES
            // ------------------------------------------------

            validSources.forEach(
                (source, index) => {

                    let parsedUrl;

                    try {

                        parsedUrl =
                            new URL(source.url);

                    } catch {

                        return;
                    }

                    const sourceItem =
                        document.createElement("div");

                    sourceItem.className =
                        "web-source";

                    const sourceNumber =
                        document.createElement("span");

                    sourceNumber.className =
                        "web-source-number";

                    sourceNumber.textContent =
                        `${index + 1}.`;

                    const sourceContent =
                        document.createElement("div");

                    sourceContent.className =
                        "web-source-content";

                    const link =
                        document.createElement("a");

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
                        typeof source.snippet === "string" &&
                        source.snippet.trim()
                    ) {

                        const snippet =
                            document.createElement("div");

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

    // Las fuentes NO se envían a speechSynthesis.
    if (
        type === "assistant" &&
        text
    ) {

        speak(text);
    }
}

// ============================================================
// 12. VOZ — SPEECH SYNTHESIS
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
        style: localStorage.getItem("jarvis-voice-style") || "professional",
        rate: Number(localStorage.getItem("jarvis-voice-rate") || 0.98),
        pitch: Number(localStorage.getItem("jarvis-voice-pitch") || 0.96)
    };
}

function updateVoiceLabels() {
    if (!voiceRate || !voicePitch) return;
    const rate = Number(voiceRate.value);
    const pitch = Number(voicePitch.value);
    if (rateValue) rateValue.textContent = rate < 0.93 ? "Pausada" : rate > 1.05 ? "Ágil" : "Normal";
    if (pitchValue) pitchValue.textContent = pitch < 0.91 ? "Grave" : pitch > 1.04 ? "Alto" : "Natural";
}

function speak(text) {
    if (!voiceEnabled || !("speechSynthesis" in window)) {
        if (jarvisState === JARVIS_STATES.SPEAKING) setJarvisState(JARVIS_STATES.ONLINE);
        return;
    }
    window.speechSynthesis.cancel();
    refreshVoices();

    const voices = availableVoices.filter(voice => /^es/i.test(voice.lang));
    const natural = /natural|neural|online|enhanced/i;
    const male = /raul|pablo|jorge|diego|miguel|carlos|david|javier|tomas|tomás|alvaro|álvaro|male|hombre/i;
    const saved = localStorage.getItem("jarvis-voice-name");
    const selected = voices.find(voice => voice.name === saved) ||
        voices.find(voice => natural.test(voice.name) && male.test(voice.name)) ||
        voices.find(voice => natural.test(voice.name) && /^es-AR/i.test(voice.lang)) ||
        voices.find(voice => male.test(voice.name)) ||
        voices.find(voice => /^es-AR/i.test(voice.lang)) || voices[0] || null;

    const settings = voiceSettingsData();
    const tuning = { professional: [0, -0.01], warm: [-0.02, 0.02], brief: [0.06, 0] }[settings.style] || [0, 0];
    const phrases = String(text).replace(/https?:\/\/\S+/g, " enlace disponible en pantalla ").replace(/[•*_#]/g, "").match(/[^.!?;:]+[.!?;:]*/g) || [text];
    let position = 0;

    const next = () => {
        if (position >= phrases.length) {
            setJarvisState(JARVIS_STATES.ONLINE);
            return;
        }
        const utterance = new SpeechSynthesisUtterance(phrases[position++].trim());
        utterance.voice = selected;
        utterance.lang = selected?.lang || "es-AR";
        const kidRate = document.body.classList.contains("kids-mode") ? Math.min(settings.rate, 0.9) : settings.rate;
        utterance.rate = Math.min(1.2, Math.max(0.7, kidRate + tuning[0]));
        utterance.pitch = Math.min(1.2, Math.max(0.7, settings.pitch + tuning[1]));
        utterance.onstart = () => setJarvisState(JARVIS_STATES.SPEAKING);
        utterance.onend = next;
        utterance.onerror = () => setJarvisState(JARVIS_STATES.ONLINE);
        window.speechSynthesis.speak(utterance);
    };
    next();
}

// ============================================================
// 13. ESTUDIO DE VOZ
// ============================================================

function saveVoiceSettings() {
    if (voiceSelect?.value) localStorage.setItem("jarvis-voice-name", voiceSelect.value);
    if (voiceStyle) localStorage.setItem("jarvis-voice-style", voiceStyle.value);
    if (voiceRate) localStorage.setItem("jarvis-voice-rate", voiceRate.value);
    if (voicePitch) localStorage.setItem("jarvis-voice-pitch", voicePitch.value);
}

function showVoicePicker() {
    refreshVoices();
    const spanish = availableVoices.filter(voice => /^es/i.test(voice.lang));
    if (!voiceSelect) return;
    voiceSelect.replaceChildren();
    spanish.forEach(voice => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = `${voice.name} — ${voice.lang}`;
        voiceSelect.append(option);
    });
    const saved = localStorage.getItem("jarvis-voice-name");
    if (saved) voiceSelect.value = saved;
    const settings = voiceSettingsData();
    if (voiceStyle) voiceStyle.value = settings.style;
    if (voiceRate) voiceRate.value = settings.rate;
    if (voicePitch) voicePitch.value = settings.pitch;
    updateVoiceLabels();
    if (voiceHint) voiceHint.textContent = spanish.length ? `${spanish.length} voces en español disponibles. Elegí una y probala antes de guardar.` : "No se detectaron voces en español. Instale una voz de español en Windows.";
    voiceDialog?.showModal();
}

voiceSettings?.addEventListener("click", showVoicePicker);
voiceRate?.addEventListener("input", updateVoiceLabels);
voicePitch?.addEventListener("input", updateVoiceLabels);
document.querySelector("#testVoice")?.addEventListener("click", () => {
    saveVoiceSettings();
    speak("Buenas, señor. Sistemas listos. Estoy a su disposición.");
});
voiceDialog?.addEventListener("close", () => {
    if (voiceDialog.returnValue === "save") saveVoiceSettings();
});

// ============================================================
// 14. BOTÓN DE SONIDO
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

            speak(
                "Voz de JARVIS activada."
            );

        } else {

            window.speechSynthesis?.cancel();

            setJarvisState(
                JARVIS_STATES.ONLINE
            );
        }
    }
);

// ============================================================
// 15. RESPUESTA LOCAL DE RESPALDO
// ============================================================

function answer(raw) {

    const text =
        raw.toLowerCase();

    if (
        /quien.*cre|quién.*cre|creador|padre/.test(
            text
        )
    ) {

        return "Mi creador es Fagioli Ruiz Lautaro Joel; él es mi creador y mi padre, señor.";
    }

    if (
        /que puedes|qué puedes|funciones/.test(
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
        /musica|música|cancion|canción|spotify|youtube/.test(
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
        /abr[ií].*(app|aplicaci)|abrir.*(whatsapp|google|mapa)/.test(
            text
        )
    ) {

        return "Puedo abrir servicios web desde aquí, señor. Para abrir aplicaciones instaladas necesitaré el conector seguro de JARVIS en cada dispositivo.";
    }

    return "Entendido, señor. Estoy listo para asistirlo.";
}

// ============================================================
// 16. DETECTAR APPS LOCALES
// ============================================================

function findLocalAppCommand(raw) {

    const text = String(raw)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const requested =
        Object.entries(localApps)
            .find(
                ([name]) =>
                    text.includes(
                        name.normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                    )
            );

    return /abr[ií]|abrir|abre|ábreme|abreme|inicia|ejecuta|pon[eé]|mostra|muestra|lanz[aá]/.test(
        text
    )
        ? requested?.[1]
        : null;
}

// ============================================================
// 17. ABRIR APP LOCAL
// ============================================================

function requestLaunch(app) {

    pendingLaunch = app;

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
                    body: JSON.stringify({
                        app: pendingLaunch
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

    pendingLaunch = null;

    actionDialog?.close();
}

document
    .querySelector("#confirmAction")
    ?.addEventListener(
        "click",
        launchLocalApp
    );

// ============================================================
// 18. CONEXIÓN CON IA / OLLAMA / BACKEND
// ============================================================

async function requestAssistant(message) {

    setJarvisState(
        JARVIS_STATES.THINKING
    );

    // --------------------------------------------------------
    // LIMPIAR RESULTADOS ANTERIORES
    // --------------------------------------------------------

    window.jarvisLastWebSearch = {
        enabled: false,
        query: "",
        sources: []
    };

    try {

        const context =
            memories();

        const childInstructions =
            document.body.classList.contains("kids-mode")
                ? "MODO INFANTIL ACCESIBLE: responde con frases cortas, amables y claras. Usa palabras sencillas, una idea por vez, no uses tono infantilizador, y nunca des consejos médicos ni sustituyas a un adulto responsable. Si la situación puede ser peligrosa, pide hablar con un adulto de confianza.\n\n"
                : "";

        const enrichedMessage =
            context.length
                ? `${childInstructions}Memoria local autorizada: ${context.join(" | ")}\n\nMensaje: ${message}`
                : `${childInstructions}${message}`;

        const response =
            await fetch(
                AI_ENDPOINT,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message:
                            enrichedMessage
                    })
                }
            );

        // ----------------------------------------------------
        // CUOTA
        // ----------------------------------------------------

        if (
            response.status === 429
        ) {

            setJarvisState(
                JARVIS_STATES.ONLINE
            );

            return "Señor, se alcanzó la cuota gratuita diaria de IA. JARVIS no realizará ningún cobro; podrá volver a intentarlo cuando se reinicie la cuota.";
        }

        // ----------------------------------------------------
        // ERROR DEL SERVIDOR
        // ----------------------------------------------------

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const result =
            await response.json();

        // ----------------------------------------------------
        // RESPUESTA VACÍA
        // ----------------------------------------------------

        if (
            !result ||
            typeof result.reply !== "string" ||
            !result.reply.trim()
        ) {

            throw new Error(
                "Respuesta de IA vacía"
            );
        }

        // ----------------------------------------------------
        // GUARDAR INFORMACIÓN DE BÚSQUEDA WEB
        // ----------------------------------------------------

        window.jarvisLastWebSearch = {
            enabled:
                result.webSearch === true,

            query:
                typeof result.searchQuery === "string"
                    ? result.searchQuery
                    : "",

            sources:
                Array.isArray(result.sources)
                    ? result.sources
                    : []
        };

        console.log(
            "[JARVIS] Resultado web:",
            window.jarvisLastWebSearch
        );

        // ----------------------------------------------------
        // RESPUESTA CORRECTA
        // ----------------------------------------------------

        return result.reply.trim();

    } catch (error) {

        console.error(
            "[JARVIS] Error de IA:",
            error
        );

        // ----------------------------------------------------
        // LIMPIAR FUENTES
        // ----------------------------------------------------

        window.jarvisLastWebSearch = {
            enabled: false,
            query: "",
            sources: []
        };

        // ----------------------------------------------------
        // BACKEND OFFLINE
        // ----------------------------------------------------

        setJarvisState(
            JARVIS_STATES.OFFLINE
        );

        return null;
    }
}

// ============================================================
// 19. ENVÍO DE MENSAJES
// ============================================================

let requestInProgress = false;

async function send(text) {

    const clean =
        text.trim();

    if (
        !clean ||
        requestInProgress
    ) {
        return;
    }

    requestInProgress = true;

    // --------------------------------------------------------
    // MENSAJE DEL USUARIO
    // --------------------------------------------------------

    addMessage(
        clean,
        "user"
    );

    if (promptInput) {
        promptInput.value = "";
    }

    // --------------------------------------------------------
    // APP LOCAL
    // --------------------------------------------------------

    const localApp =
        findLocalAppCommand(clean);

    if (localApp) {

        requestLaunch(localApp);

        addMessage(
            "Listo para abrirlo. Confirme la acción, señor.",
            "assistant"
        );

        requestInProgress = false;

        return;
    }

    // --------------------------------------------------------
    // MENSAJE DE PROCESAMIENTO
    // --------------------------------------------------------

    const pending =
        document.createElement("article");

    pending.className =
        "message assistant pending";

    pending.textContent =
        "Procesando su orden, señor…";

    chat.appendChild(pending);

    chat.scrollTop =
        chat.scrollHeight;

    // --------------------------------------------------------
    // IA
    // --------------------------------------------------------

    const smartReply =
        await requestAssistant(clean);

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

        // No mostrar fuentes viejas
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

    requestInProgress = false;
}

// ============================================================
// 20. COMPOSER
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
// 21. SUGERENCIAS
// ============================================================

document
    .querySelectorAll("[data-prompt]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    send(
                        button.dataset.prompt
                    );
                }
            );
        }
    );

// ============================================================
// 22. RECONOCIMIENTO DE VOZ
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

        // ----------------------------------------------------
        // COMIENZA A ESCUCHAR
        // ----------------------------------------------------

        recognition.onstart = () => {

            setJarvisState(
                JARVIS_STATES.LISTENING
            );

            voiceButton.classList.add(
                "is-listening"
            );
        };

        // ----------------------------------------------------
        // RESULTADO
        // ----------------------------------------------------

        recognition.onresult =
            event => {

                const transcript =
                    event.results[0][0]
                        .transcript
                        .trim();

                send(transcript);
            };

        // ----------------------------------------------------
        // ERROR
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // FIN
        // ----------------------------------------------------

        recognition.onend = () => {

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
// 23. MÓDULOS
// ============================================================

document
    .querySelectorAll("[data-action]")
    .forEach(
        button => {

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
        }
    );

// ============================================================
// 24. RUTINAS
// ============================================================

document
    .querySelectorAll("[data-routine]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    send(
                        `Activar ${button.dataset.routine}`
                    );
                }
            );
        }
    );

// ============================================================
// 25. MODO ACCESIBLE
// ============================================================

function setAccessibleMode(enabled) {

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
    .querySelector("#seniorMode")
    ?.addEventListener(
        "click",
        () =>
            setAccessibleMode(
                !document.body.classList.contains(
                    "accessible"
                )
            )
    );

function setKidsMode(enabled) {

    document.body.classList.toggle(
        "kids-mode",
        enabled
    );

    localStorage.setItem(
        "jarvis-kids-mode",
        enabled ? "on" : "off"
    );

    const button =
        document.querySelector("#kidsMode");

    if (button) {
        button.textContent = enabled
            ? "★ MODO ADULTO"
            : "★ MODO INFANTIL";
    }

    if (promptInput) {
        promptInput.placeholder = enabled
            ? "Decime qué necesitás o tocá el micrófono…"
            : "Escribe una orden o pregunta…";
    }
}

setKidsMode(
    localStorage.getItem("jarvis-kids-mode") === "on"
);

document
    .querySelector("#kidsMode")
    ?.addEventListener(
        "click",
        () => setKidsMode(
            !document.body.classList.contains("kids-mode")
        )
    );

// ============================================================
// 26. MODO ACOMPAÑAMIENTO
// ============================================================

document
    .querySelector("#companionMode")
    ?.addEventListener(
        "click",
        () =>
            companionDialog?.showModal()
    );

document
    .querySelector("#startCompanion")
    ?.addEventListener(
        "click",
        () => {

            if (companionRecognition) {
                return;
            }

            const Recognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;

            if (!Recognition) {

                companionStatus.textContent =
                    "Este navegador no admite conversación por voz.";

                return;
            }

            companionRecognition =
                new Recognition();

            companionRecognition.lang =
                "es-AR";

            companionRecognition.continuous =
                true;

            companionRecognition.interimResults =
                false;

            companionRecognition.onstart =
                () => {

                    setJarvisState(
                        JARVIS_STATES.LISTENING
                    );

                    companionStatus.textContent =
                        "Escucha activa. Diga “Jarvis” para pedir ayuda.";

                    if (companionTranscript) {
                        companionTranscript.textContent =
                            "Estoy escuchando. Podés detener la sesión cuando quieras.";
                    }
                };

            companionRecognition.onresult =
                event => {

                    const phrase =
                        event.results[
                            event.results.length - 1
                        ][0]
                            .transcript
                            .trim();

                    companionStatus.textContent =
                        `Escuchado: “${phrase}”`;

                    if (companionTranscript) {
                        companionTranscript.textContent =
                            `Última frase: “${phrase}”`;
                    }

                    if (
                        /jarvis|consejo|ayuda|qué opinás|que opinas/i.test(
                            phrase
                        )
                    ) {

                        companionStatus.textContent =
                            "Orden detectada. Preparando una respuesta…";

                        send(phrase);
                    }
                };

            companionRecognition.onerror =
                () => {

                    setJarvisState(
                        JARVIS_STATES.ONLINE
                    );

                    companionStatus.textContent =
                        "La sesión se interrumpió. Puede iniciarla otra vez.";
                };

            companionRecognition.onend =
                () => {

                    if (companionRecognition) {

                        setJarvisState(
                            JARVIS_STATES.ONLINE
                        );
                    }
                };

            try {

                companionRecognition.start();

                document
                    .querySelector(
                        "#startCompanion"
                    )
                    .disabled = true;

                document
                    .querySelector(
                        "#stopCompanion"
                    )
                    .disabled = false;

            } catch {

                companionRecognition =
                    null;

                setJarvisState(
                    JARVIS_STATES.ONLINE
                );
            }
        }
    );

function stopCompanion() {

    companionRecognition?.stop();

    companionRecognition =
        null;

    if (companionStatus) {

        companionStatus.textContent =
            "Micrófono desactivado.";
    }

    if (companionTranscript) {
        companionTranscript.textContent =
            "La sesión terminó. No se guardó audio.";
    }

    document
        .querySelector("#startCompanion")
        ?.removeAttribute("disabled");

    document
        .querySelector("#stopCompanion")
        ?.setAttribute(
            "disabled",
            ""
        );

    if (
        jarvisState ===
        JARVIS_STATES.LISTENING
    ) {

        setJarvisState(
            JARVIS_STATES.ONLINE
        );
    }
}

document
    .querySelector("#stopCompanion")
    ?.addEventListener(
        "click",
        stopCompanion
    );

companionDialog?.addEventListener(
    "close",
    stopCompanion
);

// ============================================================
// 27. CONTROL GESTUAL
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
                        facingMode: "user"
                    },
                    audio: false
                }
            );

        gestureVideo.srcObject =
            gestureStream;

        await gestureVideo.play();

        const context =
            gestureCanvas.getContext("2d");

        const hands =
            new Hands({
                locateFile: file =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.65,
            minTrackingConfidence: 0.6
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

                const points =
                    results.multiHandLandmarks?.[0];

                if (!points) {

                    gestureStatus.textContent =
                        "Mostrá una mano frente a la cámara, señor.";

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
                            color: "#50e3ff",
                            lineWidth: 3
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
                            color: "#50e3ff",
                            radius: 4
                        }
                    );
                }

                const thumb =
                    points[4];

                const index =
                    points[8];

                const pinched =
                    Math.hypot(
                        thumb.x - index.x,
                        thumb.y - index.y
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
                    pinched ? 18 : 10,
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
                    Date.now() - gestureLastActionAt > 1200
                ) {

                    const stage =
                        gestureCanvas.parentElement
                            ?.getBoundingClientRect();

                    const displayX =
                        (1 - index.x) *
                        (stage?.width || 0);

                    const displayY =
                        index.y *
                        (stage?.height || 0);

                    const target =
                        [...document.querySelectorAll(
                            "[data-gesture-command]"
                        )].find(button => {

                            const rect =
                                button.getBoundingClientRect();

                            return stage &&
                                displayX >= rect.left - stage.left &&
                                displayX <= rect.right - stage.left &&
                                displayY >= rect.top - stage.top &&
                                displayY <= rect.bottom - stage.top;
                        });

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
                        async () =>
                            hands.send({
                                image:
                                    gestureVideo
                            }),

                    width: 1280,
                    height: 720
                }
            );

        camera.start();

    } catch {

        gestureStatus.textContent =
            "No se pudo acceder a la cámara. Revise el permiso del navegador.";
    }
}

function stopGestures() {

    gestureLastActionAt = 0;

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
    .querySelector("#closeGestures")
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
// 28. BOTONES DE GESTOS
// ============================================================

document
    .querySelectorAll(
        "[data-gesture-command]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    addMessage(
                        `Orden gestual recibida, señor: ${button.dataset.gestureCommand}.`,
                        "assistant"
                    );
                }
            );
        }
    );

// ============================================================
// 29. SERVICIO WORKER
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
// 30. DIAGNÓSTICO DEL SISTEMA
// ============================================================

window.JARVIS = {

    getState() {
        return jarvisState;
    },

    setState(state) {
        setJarvisState(state);
    },

    states:
        JARVIS_STATES,

    speak,

    send,

    checkWindowsAgent
};

// ============================================================
// 31. INICIALIZACIÓN FINAL
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
