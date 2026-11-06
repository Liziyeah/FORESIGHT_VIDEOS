// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Esta escena es del VIDEO DEMO: bórrala o cámbiala por la de tu video (y actualiza SCENES en video.config.ts).
// ESCENA 1 — Portada (fondo papel)
// Voz: "Este es el video demo de Futuros Vivos. Aquí te mostramos cómo convertir un insight de Foresight
// en un video corto."
// Un sello naranja VIDEO DEMO cae; "Futuros Vivos" aparece en un papel amarillo con cinta; el título
// entra palabra por palabra, sincronizado con la voz, sobre dos tiras de papel. Valentina (puppet) saluda y
// luego señala el título.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, Puppet, type PupKey, at, clamp, decor, doodle, ease, kinetic, pop, spoken, stampShake, tape, text, tornPaper, burst, type KWordT } from './_kit';

export default class D1 extends Plate {
  char = new Puppet('valentina');
  keys: PupKey[] = [];
  tDemo = 0; tFV = 0; l1: KWordT[] = []; l2: KWordT[] = [];
  override async load() { await this.char.load(); }

  override setup() {
    this.prevBg = C.azul; // entra con un círculo sobre la carátula
    const S = this.S, L1 = 'Este es el video demo', L2 = 'Aquí te mostramos';
    this.tDemo = S.word(L1, 'demo').start;
    this.tFV = S.word(L1, 'Futuros').start;
    // "cómo convertir un insight" / "de Foresight en un video corto."
    this.l1 = spoken(S, L2, 'cómo', 'insight');
    this.l2 = spoken(S, L2, 'de', 'corto.');
    this.keys = [
      { at: -1, pose: 'saluda', head: 'feliz' },
      { at: S.word(L2, 'Aquí').start, pose: 'senala', head: 'habla' },
      { at: S.word(L2, 'corto.').end + 0.2, pose: 'explica', head: 'sonrisa' },
    ];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 11);
    const [sx, sy] = stampShake(t, this.tDemo + 0.2, 8);
    c.save(); c.translate(sx, sy);

    // the presenter
    at(c, 290, 960, { s: pop(t, t0 + 0.15, 0.5) }, () => this.char.draw(c, 0, 0, 570, t, this.keys, { seed: 3 }));

    // "Futuros Vivos" on yellow paper
    const fk = pop(t, this.tFV - 0.05, 0.45);
    at(c, 1160, 250, { s: fk, r: -0.03 }, () => {
      tornPaper(c, 520, 100, C.amarillo, 5);
      text(c, 'Futuros Vivos', 0, 20, { w: 800, size: 56, col: C.azul, align: 'center' });
    });
    if (fk >= 1) tape(c, 925, 215, 110, -0.5, undefined, 2);

    // the title, on two strips of paper, each word on its spoken word
    const strip = (words: KWordT[], y: number, size: number, seed: number) => {
      const k = ease.outBack(clamp((t - words[0]!.at + 0.25) / 0.35), 1.4);
      if (k <= 0) return;
      at(c, 1160, y - size * 0.33, { s: k, r: (seed % 2 ? 1 : -1) * 0.01 }, () => tornPaper(c, 1100, size * 1.55, '#FFFFFF', seed));
      kinetic(c, t, words, 1160, y, { w: 800, size, col: C.azul, align: 'center', cap: seed === 7 });
    };
    strip(this.l1, 470, 78, 7);
    strip(this.l2, 610, 78, 8);
    doodle(c, 'star', 1680, 380, 34, C.naranja, ease.inOutCubic(clamp((t - this.l2[this.l2.length - 1]!.at) / 0.5)));
    doodle(c, 'spark', 560, 360, 22, C.azul, ease.inOutCubic(clamp((t - this.l1[0]!.at) / 0.4)));

    // VIDEO DEMO stamp
    const st = clamp((t - this.tDemo) / 0.22);
    if (st > 0) {
      at(c, 1500, 790, { s: 2.4 - 1.4 * ease.inQuad(st), r: -0.12, a: clamp(st * 2) }, () => {
        c.strokeStyle = C.naranja; c.lineWidth = 9;
        c.beginPath(); c.roundRect(-245, -56, 490, 112, 14); c.stroke();
        c.lineWidth = 3; c.beginPath(); c.roundRect(-233, -44, 466, 88, 10); c.stroke();
        text(c, 'VIDEO DEMO', 0, 22, { w: 800, size: 60, col: C.naranja, align: 'center', ls: 3 });
      });
      burst(c, 1500, 790, t, this.tDemo + 0.22, C.naranja, 230, 12);
    }
    c.restore();
    return {};
  }
}
