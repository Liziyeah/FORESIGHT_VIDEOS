// Qué escena se ve cuándo. Las escenas y sus frases de entrada están en video.config.ts; cada corte cae
// en la pausa antes de su primera frase, buscada por contenido en data/lyrics.json (así, si cambia la
// voz, los cortes se mueven solos).
// Además, SIEMPRE agrega la carátula de inicio (en el silencio antes de la voz) y la de cierre (en los
// últimos segundos de silencio). Ese silencio lo pone analysis/preparar_voz.py.
import type { TimelineEntry } from './engine/engine';
import type { SceneClass } from './engine/scene';
import type { Lyrics } from './engine/lyrics';
import type { AudioData } from './engine/audio';
import { SCENES } from './video.config';

/** Mínimo de silencio inicial para mostrar la carátula, y duración de la carátula final (segundos). */
const CARATULA_MIN = 1.5, CARATULA_FINAL = 3.6;

const modules = import.meta.glob<{ default: SceneClass }>('./scenes/*.ts');
const scene = (name: string) => () => {
  const m = modules[`./scenes/${name}.ts`];
  return m ? m() : Promise.reject(new Error(`no existe la escena: src/scenes/${name}.ts`));
};

export function makeTimeline(ly: Lyrics, au: AudioData): TimelineEntry[] {
  /** Corte en la pausa antes de la línea que contiene q: 0.18 s antes de su primera palabra (menos si la pausa es corta). */
  const cut = (q: string) => {
    const l = ly.get(q);
    const prev = ly.lines[l.i - 1];
    const gap = prev ? l.start - prev.end : 1;
    return l.start - Math.min(0.18, Math.max(0.04, gap * 0.45));
  };
  // carátula de inicio: desde 0 hasta justo antes de la primera frase
  const first = ly.lines[0]!;
  const t0 = first.start >= CARATULA_MIN ? first.start - 0.2 : 0;
  if (t0 === 0) console.warn('[carátula] la voz empieza muy pronto: corre analysis/preparar_voz.py para agregar el silencio inicial');
  // carátula final: los últimos CARATULA_FINAL segundos, siempre después de la última frase
  const last = ly.lines[ly.lines.length - 1]!;
  const tEnd = au.duration - CARATULA_FINAL >= last.end + 1 ? au.duration - CARATULA_FINAL : au.duration;
  if (tEnd === au.duration) console.warn('[carátula] falta silencio al final: corre analysis/preparar_voz.py');

  const starts = SCENES.map((s, i) => (i === 0 || !s.from ? t0 : cut(s.from)));
  const body = SCENES.map((s, i) => ({ id: s.file, load: scene(s.file), start: starts[i]!, end: i + 1 < SCENES.length ? starts[i + 1]! : tEnd }));
  return [
    ...(t0 > 0 ? [{ id: 'caratula_inicio', load: scene('caratula_inicio'), start: 0, end: t0 }] : []),
    ...body,
    ...(tEnd < au.duration ? [{ id: 'caratula_final', load: scene('caratula_final'), start: tEnd, end: au.duration }] : []),
  ];
}
