# Conectores de dispositivos de JARVIS

## PC Windows

El archivo `jarvis-windows-agent.mjs` abre solo aplicaciones autorizadas. Inícialo con `INICIAR-JARVIS-WINDOWS.cmd` y déjalo abierto. Para sumar una aplicación se agrega explícitamente a la lista `applications`; esto evita que una orden inesperada ejecute programas o comandos no autorizados.

## Android y Android TV / Google TV

Se necesita una aplicación compañera de JARVIS instalada en cada equipo. La aplicación recibe una orden autenticada, muestra confirmación cuando corresponde y abre apps mediante los paquetes instalados o enlaces profundos. Para TV, el conector también puede usar la API del fabricante o Google Cast cuando el televisor lo permita.

## iPhone / iPad / Apple TV

iOS no permite que una web abra cualquier app arbitrariamente. El camino compatible es una aplicación nativa o Atajos de Siri, que abren solamente apps o enlaces registrados y autorizados por el usuario. Apple TV requiere un conector propio o la API del servicio compatible.

## Seguridad

Cada dispositivo debe vincularse con un código de un solo uso y conservar su propia lista de permisos. JARVIS no debe aceptar órdenes de abrir apps desde Internet sin autenticación ni confirmación del dueño.
