# 4. Exportar el MP4

1. Apaga cualquier `bunx vite` que tengas corriendo (**Ctrl + C**). El exportador abre su propio servidor.
2. Exporta:
   ```sh
   cd app
   bun run render
   ```
   Verás el avance: cuadros, velocidad y tiempo restante (`eta`). Un video de 1 minuto tarda unos 2 minutos.
3. El archivo queda en **`out/video.mp4`**: 1920×1080, 30 fps, con la voz. Para abrirlo: `open ../out/video.mp4`.

| Comando | Para qué |
|---|---|
| `bun run render` | Versión normal: 4 sub-cuadros por cuadro, rápido. |
| `bun run render:hq` | Más suave, con desenfoque de movimiento (8 sub-cuadros); tarda el doble. |
| `bun scripts/render.ts video --fps 30 --samples 4 --scale 2 --out ../out/video-4k.mp4` | 4K. |
| `bun scripts/render.ts stills --t 5,12.5,30` | Capturas PNG de esos segundos, para revisar o hacer la miniatura. |

**Cambiar el nombre del archivo:** `bun scripts/render.ts video --fps 30 --samples 4 --crf 17 --out ../out/insight-3-ach.mp4`.

**Si sale un error en rojo:**
- `Failed to load resource: 404` al final es inofensivo (un ícono que el navegador no encuentra).
- `app failed to boot` u otro error de una escena: abre la vista previa (`bunx vite`). Arriba se muestra el error en rojo; pásaselo a Claude.
- Si se conecta a otro proyecto por error, apaga los otros `vite` que tengas abiertos.
