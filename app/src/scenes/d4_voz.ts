// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Esta escena es del VIDEO DEMO: bórrala o cámbiala por la de tu video (y actualiza SCENES en video.config.ts).
// ESCENA 4 — La voz (fondo azul)
// Voz: "Después, genera la voz en ElevenLabs y guárdala en la carpeta de audio. El sistema encuentra el
// momento exacto de cada palabra."
// Un archivo voz.mp3 aparece y cae en la carpeta audio/. Se dibuja la forma de onda de la voz y, sobre
// ella, cada palabra de la segunda frase se pega justo en el instante en que se dice: la escena muestra
// la sincronización haciéndola.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, ease, hexA, inn, measureText, pop, rrect, tape, text, tornPaper, vnoise, float } from './_kit';
import type { Word } from '../engine/lyrics';

const WY = 700, WX0 = 170, WX1 = 1750;

export default class D4 extends Plate {
  tVoz = 0; tCarpeta = 0; tGuarda = 0; ws: Word[] = []; a0 = 0; a1 = 1;

  override setup() {
    const S = this.S, L1 = 'genera la voz en ElevenLabs', L2 = 'El sistema encuentra';
    this.prevBg = C.blanco; this.revealFrom = { x: 960, y: 1080 };
    this.tVoz = S.word(L1, 'voz').start;
    this.tGuarda = S.word(L1, 'guárdala').start;
    this.tCarpeta = S.word(L1, 'carpeta').start;
    this.ws = S.line(L2).words;
    this.a0 = this.ws[0]!.start; this.a1 = this.ws[this.ws.length - 1]!.end;
  }
  xOf(time: number) { return WX0 + 60 + ((time - this.a0) / (this.a1 - this.a0)) * (WX1 - WX0 - 120); }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 14);

    // the audio folder
    const fk = pop(t, this.ctx.start + 0.2, 0.45);
    at(c, 1420, 330, { s: fk }, () => {
      c.fillStyle = '#F6D96B'; rrect(c, -180, -120, 140, 50, 14); c.fill();
      c.fillStyle = C.amarillo; rrect(c, -180, -96, 360, 230, 18); c.fill();
      text(c, 'audio/', 0, 36, { w: 800, size: 50, col: C.azul, align: 'center' });
    });

    // the voz.mp3 file: appears on "voz", drops into the folder on "carpeta"
    const vk = pop(t, this.tVoz - 0.05, 0.45);
    if (vk > 0) {
      const drop = ease.inOutCubic(clamp((t - this.tCarpeta + 0.1) / 0.55));
      const x = 560 + (1420 - 560) * drop, y = 320 - Math.sin(drop * Math.PI) * 120 + drop * 30;
      const s = vk * (1 - drop * 0.35), a = 1 - clamp((drop - 0.85) / 0.15);
      at(c, x, y + (drop ? 0 : float(t, 1, 5, 1.6)), { s, r: -0.05 + drop * 0.3, a }, () => {
        tornPaper(c, 420, 180, '#FFFFFF', 51);
        // a little waveform icon
        c.fillStyle = C.azul;
        for (let i = 0; i < 9; i++) { const h = 14 + Math.abs(Math.sin(i * 1.7)) * 46; rrect(c, -170 + i * 16, -h / 2, 9, h, 4); c.fill(); }
        text(c, 'voz.mp3', -10, -4, { w: 800, size: 40, col: C.azul });
        text(c, 'ElevenLabs', -10, 40, { w: 500, size: 26, col: C.gris1 });
      });
      if (vk >= 1 && drop === 0) tape(c, 380, 240, 100, -0.6, undefined, 52);
      burst(c, 1420, 330, t, this.tCarpeta + 0.5, C.amarillo, 170, 12);
    }

    // the waveform, drawn left to right
    const wk = ease.inOutCubic(clamp((t - this.tGuarda) / 1.2));
    if (wk > 0) {
      c.save(); c.fillStyle = hexA(C.blanco, 0.9);
      const n = 150, step = (WX1 - WX0) / n;
      for (let i = 0; i < n * wk; i++) {
        const x = WX0 + i * step;
        const env = 0.25 + 0.75 * Math.abs(vnoise(i * 0.22, 2)) * (0.6 + 0.4 * Math.abs(Math.sin(i * 0.13)));
        const live = 1 + 0.08 * Math.sin(t * 9 + i);
        const h = 12 + env * 150 * live;
        rrect(c, x, WY - h / 2, step * 0.55, h, 3); c.fill();
      }
      c.restore();
    }

    // each word lands on the wave at the instant it is said
    this.ws.forEach((w, i) => {
      const k = ease.outBack(clamp((t - w.start + 0.05) / 0.3), 1.6);
      if (k <= 0) return;
      const x = this.xOf(w.start), y = i % 2 ? WY + 170 : WY - 170;
      const tw = measureText(c, w.w, 700, 34) + 30;
      c.save(); c.strokeStyle = hexA(C.amarillo, 0.9 * k); c.lineWidth = 4; c.setLineDash([6, 8]);
      c.beginPath(); c.moveTo(x, WY); c.lineTo(x, y + (i % 2 ? -26 : 26)); c.stroke(); c.restore();
      c.fillStyle = C.amarillo; c.beginPath(); c.arc(x, WY, 9 * k, 0, Math.PI * 2); c.fill();
      at(c, x, y - (1 - k) * (i % 2 ? -40 : 40), { s: k, r: (i % 3 - 1) * 0.04 }, () => {
        tornPaper(c, tw, 56, '#FFFFFF', 60 + i, { shadow: true, tear: 4 });
        text(c, w.w, 0, 12, { w: 700, size: 34, col: C.azul, align: 'center' });
      });
      text(c, `${w.start.toFixed(2)} s`, x, i % 2 ? y + 56 : y - 44, { w: 600, size: 20, col: hexA(C.blanco, 0.75), align: 'center', alpha: inn(t, w.start + 0.15) });
    });
    return {};
  }
}
