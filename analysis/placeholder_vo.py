"""Provisional timings while there is no voiceover yet.

Reads guion/voz.txt, estimates when each word is said (at ~2.7 words per second, with pauses between
lines and longer ones between scenes) and writes data/lyrics.json + data/audio.json, plus a silent
audio/voiceover.mp3 of the same length. The scenes find their words by content, so once the real
voice is recorded, run align_vo.py + audio_vo.py and everything re-times itself.

    python3 analysis/placeholder_vo.py
"""
import json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WPS = 2.7                      # words per second
LINE_GAP, SCENE_GAP, LEAD, TAIL = 0.35, 0.75, 3.2, 7.1   # LEAD/TAIL: silencio para las carátulas


def main():
    scenes, cur = [], None
    for raw in (ROOT / "guion" / "voz.txt").read_text(encoding="utf-8").splitlines():
        line = re.sub(r"<break[^>]*/>", "", raw).strip()
        if line.startswith("##"):
            cur = []; scenes.append(cur); continue
        if not line or line.startswith("#"):
            continue
        if cur is None:
            cur = []; scenes.append(cur)
        cur.append(line)
    t, lines = LEAD, []
    for si, sc in enumerate(scenes):
        if si:
            t += SCENE_GAP - LINE_GAP
        for text in sc:
            words = text.split(" ")
            total = sum(len(w) + 2 for w in words)
            dur = len(words) / WPS
            ws, wt = [], t
            for w in words:
                d = dur * (len(w) + 2) / total
                ws.append({"w": w, "start": round(wt, 3), "end": round(wt + d * 0.92, 3)})
                wt += d
            lines.append({"text": text, "start": ws[0]["start"], "end": ws[-1]["end"], "words": ws})
            t = wt + LINE_GAP
    dur = round(lines[-1]["end"] + TAIL, 2)
    (ROOT / "data").mkdir(exist_ok=True)
    (ROOT / "data" / "lyrics.json").write_text(json.dumps({"source": "placeholder_vo.py (provisional, no voiceover yet)", "lines": lines}, ensure_ascii=False, indent=1), encoding="utf-8")
    fps, n = 100, int(dur * 100)
    env = [0.0] * n
    for l in lines:
        for w in l["words"]:
            for i in range(int(w["start"] * fps), min(n, int(w["end"] * fps))):
                env[i] = 0.5
    beats = [i * 0.5 for i in range(int(dur / 0.5))]
    audio = {"duration": dur, "bpm": 120.0, "beat_period": 0.5, "time_signature": 4, "beats": beats, "downbeats": beats[::4],
             "sections": [], "fps": fps, "rms": env, "vocal": env, "mid": env,
             **{k: [0.0] * n for k in ["low", "high", "drums", "bass", "other"]},
             "onsets": {"kick": [[l["start"], 1.0] for l in lines], "vocal": [[w["start"], 1.0] for l in lines for w in l["words"]], "snare": [], "hat": []},
             "notes": "Provisional: no voiceover yet."}
    (ROOT / "data" / "audio.json").write_text(json.dumps(audio))
    mp3 = ROOT / "audio" / "voiceover.mp3"
    mp3.parent.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(dur), "-q:a", "9", str(mp3)], check=True)
    print(f"{len(lines)} líneas, {sum(len(l['words']) for l in lines)} palabras, {dur:.1f} s (provisional)")


if __name__ == "__main__":
    main()
