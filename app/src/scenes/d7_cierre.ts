// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Esta escena es del VIDEO DEMO: bórrala o cámbiala por la de tu video (y actualiza SCENES en video.config.ts).
// ESCENA 7 — Cierre (fondo azul)
// Voz: "Del informe a un video, en una tarde. Futuros Vivos, por InnLab."
// La frase final llega palabra por palabra sobre tiras de papel rasgado pegadas con cinta; "tarde" se
// marca con resaltador. Luego "Futuros Vivos" en papel amarillo y los logos de video.config.ts.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, clamp, decor, doodle, drawLogos, ease, inn, kinetic, loadLogos, measureText, pop, spoken, strokeTrim, tape, text, tornPaper, pt, type KWordT } from './_kit';

export default class D7 extends Plate {
  logos: (HTMLImageElement | null)[] = [];
  l1: KWordT[] = []; l2: KWordT[] = []; tFV = 0; tLogos = 0;
  override async load() { this.logos = await loadLogos(); }

  override setup() {
    const S = this.S, L1 = 'Del informe a un video', L2 = 'Futuros Vivos, por';
    this.l1 = spoken(S, L1, 'Del', 'video,');
    this.l2 = spoken(S, L1, 'en', 'tarde.');
    this.tFV = S.word(L2, 'Futuros').start;
    this.tLogos = S.word(L2, 'InnLab.').start;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 17);
    const strip = (words: KWordT[], y: number, size: number, seed: number) => {
      const k = ease.outBack(clamp((t - words[0]!.at + 0.2) / 0.35), 1.4);
      if (k <= 0) return 0;
      const tw = words.reduce((a, w) => a + measureText(c, w.s, 800, size), 0) + measureText(c, ' ', 800, size) * (words.length - 1);
      at(c, 960, y - size * 0.33, { s: k, r: (seed % 2 ? 1 : -1) * 0.012 }, () => tornPaper(c, tw + 80, size * 1.5, '#FFFFFF', seed));
      if (k >= 1) tape(c, 960 - tw / 2 - 34, y - size * 0.85, 100, -0.5, undefined, seed + 1);
      kinetic(c, t, words, 960, y, { w: 800, size, col: C.azul, align: 'center' });
      return tw;
    };
    strip(this.l1, 330, 92, 91);
    const tw2 = strip(this.l2, 480, 92, 92);
    // highlight "tarde"
    const last = this.l2[this.l2.length - 1]!;
    const hk = ease.inOutCubic(clamp((t - last.at - 0.35) / 0.4));
    if (hk > 0 && tw2) {
      const pw = measureText(c, 'tarde', 800, 92), px = 960 + tw2 / 2 - measureText(c, 'tarde.', 800, 92);
      c.save(); c.globalCompositeOperation = 'multiply'; c.strokeStyle = C.amarillo; c.lineWidth = 46; strokeTrim(c, [pt(px - 6, 452), pt(px + pw + 6, 448)], hk); c.restore();
    }
    doodle(c, 'star', 1520, 300, 40, C.amarillo, ease.inOutCubic(clamp((t - last.at - 0.5) / 0.5)));
    doodle(c, 'heart', 400, 470, 30, C.naranja, ease.inOutCubic(clamp((t - last.at - 0.7) / 0.5)));

    // Futuros Vivos
    const fk = pop(t, this.tFV - 0.05, 0.45);
    at(c, 960, 680, { s: fk, r: -0.02 }, () => {
      tornPaper(c, 560, 100, C.amarillo, 93);
      text(c, 'Futuros Vivos', 0, 20, { w: 800, size: 58, col: C.azul, align: 'center' });
    });
    // logos
    drawLogos(c, this.logos, 960, 880, inn(t, this.tLogos - 0.1, 0.5));
    return {};
  }
}
