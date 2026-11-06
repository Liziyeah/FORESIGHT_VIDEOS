// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Esta escena es del VIDEO DEMO: bórrala o cámbiala por la de tu video (y actualiza SCENES en video.config.ts).
// ESCENA 3 — El guion (fondo papel)
// Voz: "Primero, escribe el guion en una tabla: tiempo, voz en off, texto en pantalla y lo que se ve."
// Una hoja con una tabla dibujada a marcador. Cada columna aparece cuando la voz la nombra (Tiempo ·
// Voz en off · Texto en pantalla · Visual) y después las filas se escriben solas, como un guion real.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, clamp, decor, ease, kinetic, measureText, pop, spoken, strokeTrim, tape, text, tornPaper, pt, clip, type KWordT } from './_kit';

const X0 = 210, Y0 = 330, ROW = 104, HEAD = 92;
const COLS = [
  { h: 'Tiempo', q: 'tiempo,', w: 230 },
  { h: 'Voz en off', q: 'voz', w: 560 },
  { h: 'Texto en pantalla', q: 'texto', w: 420 },
  { h: 'Visual', q: 've.', w: 290 },
];
const ROWS = [
  ['0:00–0:08', 'Todo empieza con un insight…', 'Insight', 'Página del informe'],
  ['0:08–0:15', 'Una idea clara, con evidencia…', 'Idea · Evidencia · Dato', 'Lista que se marca'],
  ['0:15–0:22', 'Primero, escribe el guion…', 'Tiempo · Voz · Texto', 'Tabla de papel'],
  ['0:22–0:30', 'Después, genera la voz…', 'voz.mp3', 'Onda de audio'],
];

export default class D3 extends Plate {
  tCol: number[] = []; title: KWordT[] = []; tRows = 0;

  override setup() {
    const S = this.S, L = 'escribe el guion en una tabla';
    this.prevBg = C.azul;
    this.tCol = COLS.map((col) => S.word(L, col.q).start);
    this.title = spoken(S, L, 'Primero,', 'tabla:');
    this.tRows = this.tCol[0]! + 0.3;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 13);
    kinetic(c, t, this.title, 960, 170, { w: 800, size: 64, col: C.azul, align: 'center' });

    // the sheet
    const sk = ease.outBack(clamp((t - t0 - 0.2) / 0.5), 1.2);
    const W = COLS.reduce((a, b) => a + b.w, 0), H = HEAD + ROW * ROWS.length;
    at(c, X0 + W / 2, Y0 + H / 2, { s: sk, r: 0.006 }, () => tornPaper(c, W + 60, H + 60, '#FFFFFF', 31));
    if (sk >= 1) { tape(c, X0 + 10, Y0 - 20, 130, -0.5, undefined, 3); clip(c, X0 + W - 30, Y0 - 30, 0.15, 1.3); }

    // grid, drawn with a marker as the columns arrive
    c.save(); c.strokeStyle = C.azul; c.lineWidth = 4;
    const gk = ease.inOutCubic(clamp((t - t0 - 0.5) / 0.6));
    strokeTrim(c, [pt(X0, Y0 + HEAD), pt(X0 + W, Y0 + HEAD)], gk);
    for (let r = 1; r < ROWS.length; r++) { c.lineWidth = 2; c.strokeStyle = 'rgba(84,84,233,0.35)'; strokeTrim(c, [pt(X0, Y0 + HEAD + r * ROW), pt(X0 + W, Y0 + HEAD + r * ROW)], ease.inOutCubic(clamp((t - this.tRows - r * 0.3) / 0.4))); }
    let x = X0;
    COLS.forEach((col, i) => {
      if (i) { c.lineWidth = 3; c.strokeStyle = C.azul; strokeTrim(c, [pt(x, Y0 + 10), pt(x, Y0 + H - 10)], ease.inOutCubic(clamp((t - this.tCol[i]! + 0.1) / 0.4))); }
      x += col.w;
    });
    c.restore();

    // headers: each appears when the voice names it
    x = X0;
    COLS.forEach((col, i) => {
      const k = pop(t, this.tCol[i]! - 0.05, 0.4);
      at(c, x + col.w / 2, Y0 + HEAD / 2, { s: k }, () => {
        const tw = measureText(c, col.h, 800, 34) + 40;
        tornPaper(c, tw, 60, C.azul, 40 + i, { shadow: false });
        text(c, col.h, 0, 12, { w: 800, size: 34, col: C.blanco, align: 'center' });
      });
      x += col.w;
    });

    // rows type themselves in
    ROWS.forEach((row, r) => {
      let cx = X0;
      row.forEach((cell, j) => {
        const start = Math.max(this.tRows + r * 0.55 + j * 0.12, this.tCol[j]! + 0.2);
        const n = Math.floor(clamp((t - start) * 40, 0, cell.length));
        if (n > 0) text(c, cell.slice(0, n), cx + 22, Y0 + HEAD + r * ROW + ROW / 2 + 11, { w: j === 1 ? 500 : 600, size: 30, col: j === 0 ? C.gris1 : C.negro });
        cx += COLS[j]!.w;
      });
    });
    return {};
  }
}
