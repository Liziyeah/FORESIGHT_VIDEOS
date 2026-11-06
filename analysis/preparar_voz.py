"""Prepara la voz de ElevenLabs para el video, en un solo paso.

1. Guarda el original en audio/voiceover_original.mp3 (si le pasas un archivo).
2. Crea audio/voiceover.mp3 con silencio al inicio (para la carátula de inicio) y al final
   (para ver los logos y la carátula de cierre).
3. Sincroniza: encuentra el segundo exacto de cada palabra (align_vo.py) y analiza el audio (audio_vo.py).

    uv run --no-project --with onnxruntime --with numpy python analysis/preparar_voz.py ~/Downloads/mi_voz.mp3
    (sin archivo, vuelve a preparar audio/voiceover_original.mp3)
"""
import shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INICIO = 3.2   # segundos de silencio antes de la voz: carátula de inicio
FINAL = 7.1    # segundos de silencio al final: logos (3,5 s) + carátula de cierre (3,6 s)

orig = ROOT / "audio" / "voiceover_original.mp3"
if len(sys.argv) > 1:
    src = Path(sys.argv[1]).expanduser()
    if not src.exists():
        sys.exit(f"No encuentro el archivo: {src}")
    orig.parent.mkdir(exist_ok=True)
    if src.resolve() != orig.resolve():
        shutil.copyfile(src, orig)
if not orig.exists():
    sys.exit("Falta audio/voiceover_original.mp3: pásame la ruta del mp3 de ElevenLabs.")

out = ROOT / "audio" / "voiceover.mp3"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(orig),
                "-af", f"adelay=delays={int(INICIO * 1000)}:all=1,apad=pad_dur={FINAL}",
                "-b:a", "192k", str(out)], check=True)
print(f"Voz lista: {out.relative_to(ROOT)} (+{INICIO} s al inicio, +{FINAL} s al final)\n")
for script in ["align_vo.py", "audio_vo.py"]:
    subprocess.run([sys.executable, str(ROOT / "analysis" / script)], check=True)
print("\n¡Listo! Recarga el navegador: las escenas y las carátulas se acomodan solas.")
