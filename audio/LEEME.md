# Carpeta de la voz

> 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO

- `voiceover_original.mp3` → la voz de ElevenLabs tal cual. **Reemplázala** por la de tu video.
- `voiceover.mp3` → NO la edites a mano: la crea `analysis/preparar_voz.py` (agrega el silencio de las carátulas y sincroniza).

```sh
uv run --no-project --with onnxruntime --with numpy python analysis/preparar_voz.py ~/Downloads/mi_voz.mp3
```
