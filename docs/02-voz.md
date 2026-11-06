# 2. La voz y la sincronización

## Generar la voz en ElevenLabs

1. Pega el texto de tu guion (la sección "Texto para ElevenLabs"). Entre escenas pon pausas como `<break time="0.7s" />`.
2. **Voz usada en el demo:** *Lina – Colombian, Warm & Confident*. Ajustes: velocidad 1.0, estabilidad 50, similitud 75.
3. Descarga el MP3.

## Ponerla en el proyecto y sincronizar (un solo comando)

Desde la raíz del repo:

```sh
uv run --no-project --with onnxruntime --with numpy python analysis/preparar_voz.py ~/Downloads/TU_ARCHIVO.mp3
```

`preparar_voz.py` hace todo:
1. Guarda el original en `audio/voiceover_original.mp3`.
2. Crea `audio/voiceover.mp3` con **3,2 s de silencio al inicio** (ahí va la carátula de inicio) y **7,1 s al final** (logos + carátula de cierre).
3. Sincroniza: encuentra el momento de cada palabra (`align_vo.py`) y analiza el audio (`audio_vo.py`).

> En Windows la ruta se escribe así: `$HOME\Downloads\TU_ARCHIVO.mp3`. Si `uv` no se reconoce en Mac, usa `python -m uv run …`.

Para volver a sincronizar sin cambiar la voz (por ejemplo, después de corregir `voz.txt`), córrelo sin archivo:

```sh
uv run --no-project --with onnxruntime --with numpy python analysis/preparar_voz.py
```

- `align_vo.py` lee `guion/voz.txt`, escucha el audio y escribe `data/lyrics.json`, con el inicio y el fin de cada palabra. Imprime cada línea con sus tiempos: revisa que vayan en orden y tengan sentido.
- `audio_vo.py` escribe `data/audio.json`, con el volumen de la voz y la duración total.
- Recarga el navegador: las escenas se re-sincronizan solas, porque buscan sus palabras por contenido y no por segundos fijos.

**Si una palabra queda mal sincronizada**, normalmente es una sigla, un número o una palabra en inglés. Agrégala a `SPOKEN` en `analysis/align_vo.py`, escrita como suena:

```python
SPOKEN = {
    "GPS": ["JE", "PE", "ESE"],
    "REC-0246": ["REC", "CERO", "DOS", "CUATRO", "SEIS"],
}
```

> El modelo de alineación (`analysis/models/`) está entrenado en inglés, pero funciona bien con voces en español.

## Sin voz todavía

Puedes trabajar las escenas antes de tener la voz:

```sh
python3 analysis/placeholder_vo.py
```

Calcula tiempos provisionales a partir de `guion/voz.txt` (unas 2,7 palabras por segundo, con el mismo silencio de las carátulas) y crea un audio en silencio de la misma duración. Cuando llegue la voz real, sincroniza y todo se re-acomoda.
