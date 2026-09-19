@echo off
title JARVIS - Agente de Windows
cd /d "%~dp0"
echo JARVIS esta preparando el control local de aplicaciones.
echo Deja esta ventana abierta mientras uses JARVIS.
node jarvis-windows-agent.mjs
pause
