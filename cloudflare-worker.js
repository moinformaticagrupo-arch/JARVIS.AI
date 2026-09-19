```js
// ============================================================
// JARVIS — CLOUDFLARE WORKER
// IA + BÚSQUEDA WEB CON SEARXNG + ELEVENLABS TTS
// ============================================================
//
// REQUIERE:
//
// 1. Cloudflare Workers AI binding:
//    AI
//
// 2. Una instancia SearXNG con:
//    /search?q=...&format=json
//
// 3. Cloudflare Secret:
//    ELEVENLABS_API_KEY
//
// ============================================================

const MODEL = "@cf/meta/llama-3.2-3b-instruct";


// ============================================================
// CONFIGURACIÓN SEARXNG
// ============================================================

const SEARXNG_URL =
    "https://search.inetol.net/";


// ============================================================
// CONFIGURACIÓN ELEVENLABS
// ============================================================

const DEFAULT_ELEVENLABS_VOICE_ID =
    "N2HSRirbsHTZ8DE2WqjB";


// ============================================================
// IDENTIDAD DE JARVIS
// ============================================================

const identity = `
Eres JARVIS, asistente personal profesional.

Hablas español rioplatense, de forma breve, clara y precisa.

Te diriges al usuario como "señor".

Tu creador y padre es Fagioli Ruiz Lautaro Joel.

REGLAS IMPORTANTES:

- Nunca inventes información.
- Nunca afirmes haber realizado una acción si no la realizaste.
- Si recibes resultados de búsqueda web, utilízalos como fuente.
- No inventes información que no aparezca en los resultados cuando la pregunta depende de Internet.
- Si las fuentes no son suficientes, dilo claramente.
- Si las fuentes se contradicen, indícalo.
- No inventes URLs.
- No afirmes haber visitado una página si solamente recibiste su resultado de búsqueda.
- Responde siempre en español.
- Sé claro y directo.
- Si corresponde, menciona las fuentes utilizadas.
`;


// ============================================================
// DETECTAR SI LA CONSULTA NECESITA INTERNET
// ============================================================

function shouldSearchWeb(message) {

    const text = message
        .toLowerCase()
        .trim();


    // --------------------------------------------------------
    // BÚSQUEDA EXPLÍCITA
    // --------------------------------------------------------

    const explicitWords = [
        "busca",
        "buscar",
        "buscá",
        "buscame",
        "búscame",
        "investiga",
        "investigá",
        "investigame",
        "investígame",
        "google",
        "en internet",
        "por internet",
        "en la web",
        "busqueda web",
        "búsqueda web",
        "buscar en internet"
    ];


    for (const word of explicitWords) {

        if (text.includes(word)) {
            return true;
        }

    }


    // --------------------------------------------------------
    // PREGUNTAS DE INFORMACIÓN
    // --------------------------------------------------------

    const informationWords = [
        "información sobre",
        "informacion sobre",
        "info sobre",
        "quién es",
        "quien es",
        "quién fue",
        "quien fue",
        "qué es",
        "que es",
        "qué pasó",
        "que paso",
        "historia de",
        "biografía",
        "biografia",
        "datos sobre",
        "dónde está",
        "donde esta",
        "cómo funciona",
        "como funciona"
    ];


    for (const word of informationWords) {

        if (text.includes(word)) {
            return true;
        }

    }


    // --------------------------------------------------------
    // INFORMACIÓN ACTUAL
    // --------------------------------------------------------

    const currentWords = [
        "hoy",
        "ahora",
        "actual",
        "actualmente",
        "último",
        "última",
        "últimos",
        "últimas",
        "ultimo",
        "ultima",
        "ultimos",
        "ultimas",
        "reciente",
        "recientes",
        "noticia",
        "noticias",
        "precio",
        "precios",
        "cotización",
        "cotizacion",
        "dólar",
        "dolar",
        "clima",
        "temperatura",
        "resultado",
        "resultados",
        "horario",
        "fecha"
    ];


    for (const word of currentWords) {

        if (text.includes(word)) {
            return true;
        }

    }


    return false;
}


// ============================================================
// DETECTAR BÚSQUEDA EXPLÍCITA
// ============================================================

function isExplicitSearch(message) {

    return /(^|\s)(busca|buscar|buscá|buscame|búscame|investiga|investigá|investigame|investígame|google)(\s|$)/i
        .test(message);

}


// ============================================================
// LIMPIAR CONSULTA
// ============================================================

function cleanSearchQuery(message) {

    let query = message.trim();


    // Quitar "JARVIS"

    query = query.replace(
        /^jarvis[\s,:-]*/i,
        ""
    );


    // Quitar comandos iniciales

    query = query.replace(
        /^(busca|buscar|buscá|buscame|búscame|investiga|investigá|investigame|investígame|google)\s*/i,
        ""
    );


    query = query.trim();


    // Evitar consultas excesivamente largas

    if (query.length > 300) {

        query =
            query.substring(0, 300);

    }


    return query;
}


// ============================================================
// BUSCAR EN SEARXNG
// ============================================================

async function searchSearXNG(query) {

    if (
        !SEARXNG_URL ||
        SEARXNG_URL.includes("TU-INSTANCIA")
    ) {

        throw new Error(
            "SEARXNG_URL_NOT_CONFIGURED"
        );

    }


    const url = new URL(
        "/search",
        SEARXNG_URL
    );


    // Consulta

    url.searchParams.set(
        "q",
        query
    );


    // JSON

    url.searchParams.set(
        "format",
        "json"
    );


    // Español

    url.searchParams.set(
        "language",
        "es"
    );


    // Primera página

    url.searchParams.set(
        "pageno",
        "1"
    );


    // Safe search moderado

    url.searchParams.set(
        "safesearch",
        "1"
    );


    console.log(
        "[JARVIS] SearXNG:",
        url.toString()
    );


    const response =
        await fetch(
            url.toString(),
            {
                method: "GET",

                headers: {
                    "Accept":
                        "application/json"
                }
            }
        );


    if (!response.ok) {

        let errorText = "";

        try {

            errorText =
                await response.text();

        } catch (_) {}


        console.error(
            "[JARVIS] SearXNG HTTP error:",
            response.status,
            errorText
        );


        throw new Error(
            `SEARXNG_HTTP_${response.status}`
        );

    }


    const data =
        await response.json();


    if (
        !data ||
        !Array.isArray(data.results)
    ) {

        throw new Error(
            "SEARXNG_INVALID_RESPONSE"
        );

    }


    // --------------------------------------------------------
    // NORMALIZAR RESULTADOS
    // --------------------------------------------------------

    const results =
        data.results
            .slice(0, 6)
            .map(result => {

                let title =
                    result.title ||
                    "Sin título";


                let url =
                    result.url ||
                    "";


                let content =
                    result.content ||
                    result.description ||
                    "";


                if (
                    content.length > 600
                ) {

                    content =
                        content.substring(
                            0,
                            600
                        ) + "...";

                }


                return {
                    title,
                    url,
                    content
                };

            })
            .filter(result =>
                result.url
            );


    return results;
}


// ============================================================
// CREAR CONTEXTO PARA LA IA
// ============================================================

function buildWebContext(results) {

    if (
        !results ||
        results.length === 0
    ) {

        return "";

    }


    let context = `
==================================================
RESULTADOS DE INTERNET
==================================================
`;


    results.forEach(
        (result, index) => {

            context += `
FUENTE ${index + 1}

Título:
${result.title}

URL:
${result.url}

Contenido:
${result.content}

--------------------------------------------------
`;

        }
    );


    context += `
==================================================
FIN DE RESULTADOS
==================================================
`;


    return context;
}


// ============================================================
// RESPUESTA JSON
// ============================================================

function jsonResponse(
    data,
    status,
    headers
) {

    return new Response(
        JSON.stringify(data),
        {
            status,
            headers
        }
    );

}


// ============================================================
// ELEVENLABS — TEXT TO SPEECH
// ============================================================

async function handleTTS(
    request,
    env,
    headers
) {

    try {

        // ----------------------------------------------------
        // COMPROBAR API KEY
        // ----------------------------------------------------

        if (!env.ELEVENLABS_API_KEY) {

            console.error(
                "[JARVIS] Falta ELEVENLABS_API_KEY"
            );


            return jsonResponse(
                {
                    error:
                        "ELEVENLABS_API_KEY_NOT_CONFIGURED"
                },
                500,
                headers
            );

        }


        // ----------------------------------------------------
        // LEER BODY
        // ----------------------------------------------------

        const body =
            await request.json();


        const text =
            String(
                body?.text || ""
            ).trim();


        const voiceId =
            String(
                body?.voiceId ||
                DEFAULT_ELEVENLABS_VOICE_ID
            ).trim();


        // ----------------------------------------------------
        // VALIDAR TEXTO
        // ----------------------------------------------------

        if (!text) {

            return jsonResponse(
                {
                    error:
                        "TEXT_REQUIRED"
                },
                400,
                headers
            );

        }


        console.log(
            "[JARVIS] ElevenLabs TTS:",
            voiceId
        );


        // ----------------------------------------------------
        // LLAMAR A ELEVENLABS
        // ----------------------------------------------------

        const elevenResponse =
            await fetch(
                `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
                {
                    method: "POST",

                    headers: {
                        "xi-api-key":
                            env.ELEVENLABS_API_KEY,

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "audio/mpeg"
                    },

                    body: JSON.stringify({

                        text:
                            text.slice(0, 5000),

                        model_id:
                            "eleven_multilingual_v2"

                    })
                }
            );


        // ----------------------------------------------------
        // ERROR ELEVENLABS
        // ----------------------------------------------------

        if (!elevenResponse.ok) {

            const errorText =
                await elevenResponse.text();


            console.error(
                "[JARVIS] ElevenLabs error:",
                elevenResponse.status,
                errorText
            );


            return jsonResponse(
                {
                    error:
                        "ELEVENLABS_ERROR",

                    status:
                        elevenResponse.status,

                    details:
                        errorText
                },
                elevenResponse.status,
                headers
            );

        }


        // ----------------------------------------------------
        // DEVOLVER AUDIO
        // ----------------------------------------------------

        return new Response(
            elevenResponse.body,
            {
                status: 200,

                headers: {
                    ...headers,

                    "Content-Type":
                        elevenResponse.headers.get(
                            "content-type"
                        ) || "audio/mpeg",

                    "Cache-Control":
                        "no-store"
                }
            }
        );


    } catch (error) {

        console.error(
            "[JARVIS] ElevenLabs TTS exception:",
            error
        );


        return jsonResponse(
            {
                error:
                    "TTS_INTERNAL_ERROR"
            },
            500,
            headers
        );

    }
}


// ============================================================
// WORKER PRINCIPAL
// ============================================================

export default {

    async fetch(
        request,
        env
    ) {

        // ----------------------------------------------------
        // URL
        // ----------------------------------------------------

        const url =
            new URL(request.url);


        // ----------------------------------------------------
        // HEADERS
        // ----------------------------------------------------

        const headers = {

            "Access-Control-Allow-Origin":
                env.ALLOWED_ORIGIN || "*",

            "Access-Control-Allow-Methods":
                "POST, OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type",

            "Content-Type":
                "application/json; charset=UTF-8",

            "Cache-Control":
                "no-store"

        };


        // ----------------------------------------------------
        // CORS
        // ----------------------------------------------------

        if (
            request.method ===
            "OPTIONS"
        ) {

            return new Response(
                null,
                {
                    status: 204,
                    headers
                }
            );

        }


        // ----------------------------------------------------
        // ELEVENLABS TTS
        // ----------------------------------------------------

        if (
            url.pathname === "/tts"
        ) {

            if (
                request.method !==
                "POST"
            ) {

                return jsonResponse(
                    {
                        error:
                            "METHOD_NOT_ALLOWED"
                    },
                    405,
                    headers
                );

            }


            return handleTTS(
                request,
                env,
                headers
            );

        }


        // ----------------------------------------------------
        // SOLO POST PARA IA
        // ----------------------------------------------------

        if (
            request.method !==
            "POST"
        ) {

            return jsonResponse(
                {
                    error:
                        "METHOD_NOT_ALLOWED"
                },
                405,
                headers
            );

        }


        try {

            // ------------------------------------------------
            // LEER MENSAJE
            // ------------------------------------------------

            const body =
                await request.json();


            const message =
                body?.message;


            if (
                typeof message !==
                    "string" ||
                !message.trim()
            ) {

                return jsonResponse(
                    {
                        error:
                            "BAD_REQUEST"
                    },
                    400,
                    headers
                );

            }


            const cleanMessage =
                message.trim();


            console.log(
                "[JARVIS] Mensaje:",
                cleanMessage
            );


            // ------------------------------------------------
            // VER SI NECESITA INTERNET
            // ------------------------------------------------

            const needsWeb =
                shouldSearchWeb(
                    cleanMessage
                );


            const explicitSearch =
                isExplicitSearch(
                    cleanMessage
                );


            let webResults = [];

            let searchQuery = "";


            // ------------------------------------------------
            // BÚSQUEDA SEARXNG
            // ------------------------------------------------

            if (needsWeb) {

                searchQuery =
                    cleanSearchQuery(
                        cleanMessage
                    );


                try {

                    webResults =
                        await searchSearXNG(
                            searchQuery
                        );


                    console.log(
                        "[JARVIS] Resultados:",
                        webResults.length
                    );


                } catch (searchError) {

                    console.error(
                        "[JARVIS] Error SearXNG:",
                        searchError
                    );


                    // Si el usuario pidió
                    // explícitamente buscar,
                    // no fingimos que buscamos.

                    if (explicitSearch) {

                        return jsonResponse(
                            {
                                reply:
                                    "Señor, intenté realizar la búsqueda en Internet, pero SearXNG no está disponible o la instancia configurada no permite búsquedas JSON.",

                                webSearch:
                                    false,

                                sources:
                                    [],

                                error:
                                    "SEARXNG_UNAVAILABLE"
                            },
                            503,
                            headers
                        );

                    }


                    // Si era una búsqueda automática,
                    // continuamos con la IA.

                    webResults = [];

                }

            }


            // ------------------------------------------------
            // PREPARAR MENSAJE PARA LLAMA
            // ------------------------------------------------

            let userMessage =
                cleanMessage;


            if (
                webResults.length > 0
            ) {

                const webContext =
                    buildWebContext(
                        webResults
                    );


                userMessage = `
La consulta original del señor es:

"${cleanMessage}"

${webContext}

Utiliza los resultados de Internet
para responder la consulta.

IMPORTANTE:

- No inventes datos.
- No inventes fuentes.
- No inventes URLs.
- Utiliza la información encontrada.
- Si los resultados no son suficientes,
  dilo claramente.
- Puedes mencionar las fuentes por su título.
- Responde en español.
- Sé breve pero útil.
`;

            }


            // ------------------------------------------------
            // COMPROBAR WORKERS AI
            // ------------------------------------------------

            if (!env.AI) {

                throw new Error(
                    "AI_BINDING_NOT_CONFIGURED"
                );

            }


            // ------------------------------------------------
            // LLAMA
            // ------------------------------------------------

            const result =
                await env.AI.run(
                    MODEL,
                    {
                        messages: [

                            {
                                role:
                                    "system",

                                content:
                                    identity
                            },

                            {
                                role:
                                    "user",

                                content:
                                    userMessage
                            }

                        ],

                        max_tokens:
                            600
                    }
                );


            // ------------------------------------------------
            // RESPUESTA
            // ------------------------------------------------

            const reply =
                result?.response;


            if (
                typeof reply !==
                    "string" ||
                !reply.trim()
            ) {

                throw new Error(
                    "EMPTY_AI_RESPONSE"
                );

            }


            // ------------------------------------------------
            // RESPUESTA AL FRONTEND
            // ------------------------------------------------

            return jsonResponse(
                {
                    reply:
                        reply.trim(),

                    webSearch:
                        webResults.length > 0,

                    searchQuery:
                        webResults.length > 0
                            ? searchQuery
                            : null,

                    sources:
                        webResults.map(
                            result => ({
                                title:
                                    result.title,

                                url:
                                    result.url,

                                snippet:
                                    result.content
                            })
                        )
                },

                200,

                headers
            );


        } catch (error) {

            console.error(
                "[JARVIS] ERROR GENERAL:",
                error
            );


            return jsonResponse(
                {
                    error:
                        "AI_UNAVAILABLE",

                    reply:
                        "Señor, tuve un problema al procesar su solicitud."
                },

                503,

                headers
            );

        }

    }

};
```
