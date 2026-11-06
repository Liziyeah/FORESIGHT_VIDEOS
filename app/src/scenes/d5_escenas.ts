// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Esta escena es del VIDEO DEMO: bórrala o cámbiala por la de tu video (y actualiza SCENES en video.config.ts).
// ESCENA 5 — Las escenas con Claude (fondo papel)
// Voz: "Luego, con Claude, describe cada escena con tus palabras. Claude la programa: textos, íconos,
// personajes y animaciones, sincronizados con la voz."
// A la izquierda, un chat: se escribe un pedido en lenguaje natural y Claude responde. A la derecha, la
// vista previa se arma sola con cada palabra de la voz: textos, íconos, personaje, animaciones, y al
// final una línea de tiempo con la onda de la voz.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, Puppet, type PupKey, at, burst, clamp, decor, doodle, ease, hexA, icon, inn, pop, rrect, tape, text, tornPaper, wrap, float, vnoise, measureText } from './_kit';

const CHAT = { x: 450, y: 560, w: 600, h: 660 };
const PREV = { x: 1270, y: 520, w: 860, h: 560 };

export default class D5 extends Plate {
  char = new Puppet('andres');
  keys: PupKey[] = [];
  tAsk = 0; tProg = 0; tTxt = 0; tIco = 0; tPer = 0; tAni = 0; tSync = 0; tEnd = 0;
  override async load() { await this.char.load(); }

  override setup() {
    const S = this.S, L1 = 'describe cada escena', L2 = 'Claude la programa';
    this.prevBg = C.azul;
    this.tAsk = S.word(L1, 'describe').start;
    this.tProg = S.word(L2, 'programa:').start;
    this.tTxt = S.word(L2, 'textos,').start;
    this.tIco = S.word(L2, 'íconos,').start;
    this.tPer = S.word(L2, 'personajes').start;
    this.tAni = S.word(L2, 'animaciones,').start;
    this.tSync = S.word(L2, 'sincronizados').start;
    this.tEnd = S.line(L2).end;
    this.keys = [
      { at: -1, pose: 'neutral', head: 'sonrisa' },
      { at: this.tAni, pose: 'saluda', head: 'feliz' },
      { at: this.tSync + 0.4, pose: 'paz', head: 'feliz' },
    ];
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    decor(c, t, false, 15);

    // ---- the chat
    const ck = ease.outBack(clamp((t - t0 - 0.1) / 0.5), 1.2);
    at(c, CHAT.x, CHAT.y, { s: ck, r: -0.015 }, () => {
      tornPaper(c, CHAT.w, CHAT.h, '#FFFFFF', 71);
      const L = -CHAT.w / 2 + 40, T = -CHAT.h / 2 + 60;
      text(c, 'Chat con Claude', L, T, { w: 800, size: 30, col: C.azul });
      c.fillStyle = C.gris2; rrect(c, L, T + 18, CHAT.w - 80, 3, 1.5); c.fill();
      // the request, typed
      const ask = 'Que el título entre palabra por palabra y que Andrés salude al final.';
      const n = Math.floor(clamp((t - this.tAsk) * 34, 0, ask.length));
      if (n > 0) {
        const lines = wrap(c, ask, 500, 30, CHAT.w - 200);
        const h = lines.length * 40 + 36;
        c.fillStyle = C.azul; rrect(c, -CHAT.w / 2 + 110, T + 50, CHAT.w - 150, h, 20); c.fill();
        let left = n;
        lines.forEach((l, i) => { const s = l.slice(0, Math.max(0, left)); left -= l.length + 1; if (s) text(c, s, -CHAT.w / 2 + 132, T + 92 + i * 40, { w: 500, size: 30, col: C.blanco }); });
      }
      // Claude answers
      const rk = pop(t, this.tProg, 0.4);
      at(c, 0, T + 400, { s: rk }, () => {
        c.fillStyle = hexA(C.amarillo, 0.9); rrect(c, -CHAT.w / 2 + 40, -60, CHAT.w - 150, 150, 20); c.fill();
        text(c, '¡Listo! Escena actualizada', -CHAT.w / 2 + 64, -12, { w: 700, size: 30, col: C.negro });
        // code lines being written
        const cols = [C.morado, C.azul, C.verde, C.naranja];
        for (let i = 0; i < 4; i++) {
          const w = (160 + ((i * 97) % 180)) * clamp((t - this.tProg - 0.2 - i * 0.12) / 0.35);
          c.fillStyle = cols[i]!; rrect(c, -CHAT.w / 2 + 64 + (i % 2) * 30, 18 + i * 16, w + 0.01, 9, 4.5); c.fill();
        }
      });
    });
    if (ck >= 1) tape(c, CHAT.x - 200, CHAT.y - CHAT.h / 2 - 4, 120, -0.4, undefined, 72);

    // ---- the preview builds itself, one spoken word at a time
    const pk = ease.outBack(clamp((t - t0 - 0.25) / 0.5), 1.2);
    at(c, PREV.x, PREV.y, { s: pk, r: 0.01 }, () => {
      c.save(); c.shadowColor = 'rgba(0,0,0,0.2)'; c.shadowBlur = 24; c.shadowOffsetY = 12;
      c.fillStyle = C.azul; rrect(c, -PREV.w / 2 - 16, -PREV.h / 2 - 50, PREV.w + 32, PREV.h + 66, 22); c.fill(); c.restore();
      for (let i = 0; i < 3; i++) { c.fillStyle = hexA(C.blanco, 0.6); c.beginPath(); c.arc(-PREV.w / 2 + 14 + i * 26, -PREV.h / 2 - 24, 8, 0, Math.PI * 2); c.fill(); }
      text(c, 'vista previa', PREV.w / 2 - 10, -PREV.h / 2 - 16, { w: 600, size: 24, col: C.blanco, align: 'right' });
      c.fillStyle = '#FFFFFF'; rrect(c, -PREV.w / 2, -PREV.h / 2, PREV.w, PREV.h, 10); c.fill();

      // texts
      let tx = -PREV.w / 2 + 60;
      ['Futuros', 'Vivos'].forEach((w, i) => {
        const k = inn(t, this.tTxt + i * 0.15, 0.35);
        if (k > 0) text(c, w, tx, -PREV.h / 2 + 110 + (1 - k) * 30, { w: 800, size: 72, col: C.azul, alpha: k });
        tx += measureText(c, w + ' ', 800, 72);
      });
      // icons
      const ics = [(s: number) => icon.pin(c, s, C.naranja, true), (s: number) => icon.check(c, s * 0.42, C.verde), (s: number) => icon.clock(c, s, C.morado)];
      ics.forEach((f, i) => at(c, -PREV.w / 2 + 110 + i * 130, 30 + float(t, i, 6, 2), { s: pop(t, this.tIco + i * 0.1, 0.4) }, () => f(80)));
      // the character
      at(c, PREV.w / 2 - 230, PREV.h / 2 - 20, { s: pop(t, this.tPer, 0.45) }, () => this.char.draw(c, 0, 0, 470, t, this.keys, { seed: 5 }));
      // animations: sparkles
      for (let i = 0; i < 3; i++) doodle(c, 'spark', -PREV.w / 2 + 520 + i * 40, -PREV.h / 2 + 90 + i * 30, 14 + i * 4, [C.amarillo, C.naranja, C.verde][i]!, clamp((t - this.tAni - i * 0.1) / 0.25));
      burst(c, -PREV.w / 2 + 110, 30, t, this.tAni + 0.1, C.amarillo, 70, 8);
      // synced: a little timeline with the voice and a playhead
      const sk = inn(t, this.tSync, 0.4);
      if (sk > 0) {
        c.save(); c.globalAlpha = sk;
        const y = PREV.h / 2 - 70, x0 = -PREV.w / 2 + 50, x1 = 60;
        c.fillStyle = hexA(C.azul, 0.12); rrect(c, x0 - 14, y - 44, x1 - x0 + 28, 88, 14); c.fill();
        c.fillStyle = C.azul;
        for (let i = 0; i < 40; i++) { const h = 8 + Math.abs(vnoise(i * 0.4, 3)) * 50; rrect(c, x0 + i * ((x1 - x0) / 40), y - h / 2, 5, h, 2.5); c.fill(); }
        const ph = x0 + (x1 - x0) * clamp((t - this.tSync) / Math.max(0.5, this.tEnd - this.tSync + 1));
        c.fillStyle = C.naranja; c.fillRect(ph - 2, y - 44, 4, 88);
        c.restore();
      }
    });
    return {};
  }
}
