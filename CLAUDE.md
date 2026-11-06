# CLAUDE.md — Video Guide · Foresight (Futuros Vivos, InnLab)

Plantilla para convertir insights del informe de Foresight en videos cortos animados por código (TypeScript + three.js + Canvas2D, bun + Vite), sincronizados con una voz en off. La usuaria habla español; responde en español, sin jerga, y explica los comandos de terminal paso a paso.

## Flujo de un video
1. **Guion** → `guion/<video>.md` (tabla) y `guion/voz.txt`: una frase por línea, exactamente como la dice la voz; `## nombre` separa escenas.
2. **Sin voz aún** → `python3 analysis/placeholder_vo.py` (tiempos provisionales + audio en silencio).
3. **Con voz** → `uv run --no-project --with onnxruntime --with numpy python analysis/preparar_voz.py <mp3>`: guarda el original, agrega el silencio de las carátulas (3,2 s al inicio, 7,1 s al final) y sincroniza. Revisa la salida: tiempos en orden y palabras con sentido. Las siglas, números y palabras en inglés van en `SPOKEN`.
4. **Configuración** → `app/src/video.config.ts`: `CARATULA` (números de aprendizaje e insight), `SCENES` (archivo + frase `from`), `FOOTER`, `LOGOS`, `STYLE`.
5. **Escenas** → `app/src/scenes/<archivo>.ts`. Cada una extiende `Plate`, resuelve sus tiempos en `setup()` con `this.S.word(...)` / `spoken(...)` y dibuja en `draw(c, t)`. Toda la API está en `_kit.ts` (referencia en `docs/03-escenas.md`). Las escenas `d1`…`d7` son el demo y sirven de ejemplo.
6. **Exportar** → `cd app && bun run render` → `out/video.mp4`.

## Reglas
- **Carátulas SIEMPRE:** todos los videos abren y cierran con "Aprendizaje X · Insight Z" (`caratula_inicio` / `caratula_final`). `timeline.ts` las agrega sola; no las pongas en `SCENES` ni las quites. Solo se cambian los números en `CARATULA`. Si la voz no tiene el silencio inicial, corre `preparar_voz.py`.
- **Personas = puppets:** cuando una escena necesite una persona, usa SIEMPRE `Puppet` (`valentina`, `andres`, `camila`; poses en `POSES`, caras sonrisa/feliz/habla/sorpresa/guino/duda/enojada). `camila` es la persona sentada en su escritorio. Usa `Cutout` o `person()` solo si la usuaria lo pide. Revisa en capturas que los brazos no tapen textos ni se salgan del cuadro.
- **Marcas de reemplazo:** los archivos que cambian en cada video llevan `👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO`. Al crear archivos nuevos que se reemplacen por video (escenas, guion), ponles la misma marca.
- **Sincronía:** ancla todo a palabras de la voz, nunca a segundos fijos. El texto en pantalla debe usar palabras que la voz dice.
- **Identidad Icesi:** azul `#5454E9` presente en cada escena; texto blanco sobre azul, o azul o negro sobre blanco; Plus Jakarta Sans. Las reglas completas están en `docs/01-guion.md`.
- **Movimiento:** nada queda quieto (`float`, personajes que respiran). Entradas de 0,3–0,5 s con ease-out; nada de temblor de cámara salvo un impacto puntual (`stampShake`).
- **Footer:** deja libre la esquina inferior izquierda (y ≈ 990–1040).
- **Determinismo:** las escenas deben ser funciones puras del tiempo, sin `Math.random()` ni `Date.now()`. Usa semillas (`vnoise`, `seed`).
- No toques `app/src/engine/` salvo que sea necesario. Ahí está el motor de pdoom-video (licencia MIT).

## Verificar antes de entregar
- Tipos: `cd app && npx tsc --noEmit -p tsconfig.json`.
- **Revisión visual:** levanta `bunx vite --port 5199` y captura cuadros con Playwright (`window.__pdoom.still(t)` y luego `window.__pdoom.png()` en `/?export=1`). Revisa que nada se salga del cuadro, choque con el footer o se tape. Con Chromium headless usa `--use-angle=swiftshader`.
- Al terminar, dile a la usuaria cómo verlo: `cd app && bunx vite`, luego Cmd + R en `http://localhost:5173`.

## Mapa del repo
- `guion/`: guiones y `voz.txt`.
- `audio/`, `data/`: la voz y los tiempos generados.
- `analysis/`: alineación (modelo wav2vec2 cuantizado en `analysis/models/`).
- `app/src/video.config.ts`: la configuración del video.
- `app/src/scenes/_kit.ts`: el kit (paleta, tipografía, `Plate`, `Script`, `kinetic`, íconos, `Puppet`/`POSES` (personas), `person`, `Cutout`, scrapbook, efectos, footer, logos).
- `app/public/`: fuentes, `logos/` (blancos, para fondo azul), `personas/` (puppets: rig.json + piezas) y `personaje/` (kit ilustrado anterior).
- `analysis/preparar_voz.py`: voz → silencio de carátulas → sincronía. `analysis/personas/`: script que arma puppets nuevos desde un .ai de Freepik.
- `docs/`: guías para personas.
