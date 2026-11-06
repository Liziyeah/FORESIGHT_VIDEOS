# Video Guide · Foresight — Futuros Vivos

> 📘 **Guía completa paso a paso:** [docs/guia-futuros-vivos.pdf](docs/guia-futuros-vivos.pdf) (o la versión web, [docs/guia-futuros-vivos.html](docs/guia-futuros-vivos.html)).

Plantilla para convertir un **insight del informe de Foresight** en un **video corto animado** (16:9, 1920×1080), hecho con código junto a Claude.

Cada cuadro del video se dibuja con código, y todo lo que se anima está **sincronizado con la voz**: los textos, los íconos y los personajes aparecen en la palabra exacta en que se dicen. Lo que ves en el navegador es exactamente lo que sale en el MP4.

El repo trae un **video demo** de unos 50 s, que explica el propio proceso. Úsalo como ejemplo y como punto de partida.

---

## Lo que trae siempre

- **Carátula de inicio y de cierre** con **Aprendizaje X · Insight Z**: salen solas en todos los videos. Solo cambias los números en `CARATULA` (`app/src/video.config.ts`).
- **Personas animadas (puppets):** Valentina, Andrés y Camila, con brazos que se mueven, gestos con las manos y caras con expresiones. Claude las usa cuando una escena necesita una persona.
- **Marcas `👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO`** en cada archivo que cambias para un video nuevo.

## El proceso en 6 pasos

| Paso | Qué haces | Dónde | Guía |
|---|---|---|---|
| 1. Guion | Escribe el guion en una tabla: tiempo, voz en off, texto en pantalla y visual | `guion/` | [docs/01-guion.md](docs/01-guion.md) |
| 2. Voz | Genera la voz en ElevenLabs y descarga el MP3 | ElevenLabs | [docs/02-voz.md](docs/02-voz.md) |
| 3. Sincronizar | `preparar_voz.py` agrega el silencio de las carátulas y encuentra el momento exacto de cada palabra | `analysis/` → `audio/`, `data/` | [docs/02-voz.md](docs/02-voz.md) |
| 4. Escenas | Con Claude, describe cada escena; él la programa | `app/src/scenes/` | [docs/03-escenas.md](docs/03-escenas.md) |
| 5. Revisar | Míralo en el navegador y pide ajustes | `http://localhost:5173` | [docs/05-trabajar-con-claude.md](docs/05-trabajar-con-claude.md) |
| 6. Exportar | Un comando genera el MP4 | `out/` | [docs/04-exportar.md](docs/04-exportar.md) |

---

## Instalación (una sola vez, en Mac)

1. **Homebrew**, si no lo tienes (en la terminal):
   ```sh
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   Al terminar, corre las 2 líneas que aparecen en "Next steps".
2. **Herramientas:**
   ```sh
   brew install ffmpeg uv
   curl -fsSL https://bun.sh/install | bash
   ```
   Cierra la terminal y abre una nueva.
3. **Google Chrome**: el exportador lo usa.
4. **Dependencias del proyecto:**
   ```sh
   cd app
   bun install
   ```

## Ver el video

```sh
cd app
bunx vite
```
Abre `http://localhost:5173` en Chrome y presiona **espacio**.

| Tecla | Acción |
|---|---|
| espacio | play / pausa |
| `[` y `]` | escena anterior / siguiente |
| `l` | repetir la escena actual |
| ← y → | ±1 s (con shift, ±5 s) |
| `h` | ocultar la barra |

Agrega `?t=20` al link para empezar en el segundo 20.

## Exportar el MP4

```sh
cd app
bun run render        # rápido: out/video.mp4
bun run render:hq     # más suave (desenfoque de movimiento): out/video-hq.mp4
```

---

## Estructura

```
guion/
  voz.txt              ← el texto hablado, frase por frase (fuente de verdad)
  guion.md             ← el guion del video demo (tabla + texto para ElevenLabs)
  plantilla-guion.md   ← plantilla en blanco para un video nuevo
audio/
  voiceover_original.mp3 ← 👉 la voz de ElevenLabs (se reemplaza en cada video)
  voiceover.mp3        ← la voz lista (la crea preparar_voz.py, con el silencio de las carátulas)
data/                  ← tiempos de cada palabra (generados, no se editan a mano)
analysis/
  preparar_voz.py      ← voz nueva → silencio de carátulas → sincronía (un solo comando)
  align_vo.py          ← sincroniza voz.txt con el audio
  audio_vo.py          ← analiza el volumen de la voz
  placeholder_vo.py    ← tiempos provisionales cuando aún no hay voz
app/
  src/video.config.ts  ← 👉 CONFIGURACIÓN: carátula (números), escenas, footer, logos, estilo
  src/scenes/_kit.ts   ← kit de escenas: colores, tipografía, íconos, personajes, efectos
  src/scenes/d*.ts     ← 👉 las escenas del video demo (se reemplazan)
  src/scenes/caratula_*.ts ← carátulas de inicio y cierre (automáticas)
  public/personas/     ← puppets: valentina, andres, camila
  public/              ← fuentes, logos, personaje ilustrado anterior
docs/                  ← las guías
CLAUDE.md              ← instrucciones para Claude cuando trabaja en este repo
```

## Un video nuevo, en resumen

1. Copia `guion/plantilla-guion.md`, escribe tu guion y pon el texto hablado en `guion/voz.txt`.
2. Sin voz todavía: corre `python3 analysis/placeholder_vo.py` para tener tiempos provisionales.
3. Con la voz: `uv run --no-project --with onnxruntime --with numpy python analysis/preparar_voz.py ~/Downloads/tu_voz.mp3` (ver [docs/02-voz.md](docs/02-voz.md)).
4. En `app/src/video.config.ts` cambia los números de la **carátula** (aprendizaje e insight) y define las escenas, el footer y los logos.
5. Busca las marcas `👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO`: son todo lo que cambia de un video a otro.
6. Abre Claude en esta carpeta y pídele las escenas. Él lee `CLAUDE.md` y sigue el proceso.

## Créditos y licencias

- **Motor de render:** basado en [pdoom-video](https://github.com/mexicat/pdoom-video) de Giacomo Magnanini (licencia MIT, ver `LICENSE.pdoom-engine`).
- **Tipografía:** Plus Jakarta Sans (SIL Open Font License).
- **Personajes ilustrados y puppets:** kits de Freepik (`assets/personaje-fuente/`, `assets/personas-fuente/`). La versión gratuita pide atribución: "Ilustración: Freepik".
- **Identidad visual:** manual de marca Universidad Icesi. **Proyecto:** Futuros Vivos, InnLab.
