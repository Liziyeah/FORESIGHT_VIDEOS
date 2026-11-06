// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Esta escena es del VIDEO DEMO: bórrala o cámbiala por la de tu video (y actualiza SCENES en video.config.ts).
// ESCENA 6 — Revisar y exportar (fondo azul)
// Voz: "Revisa el resultado en el navegador, pide ajustes, y exporta el video con un solo comando."
// Tres pasos de papel, uno por cada verbo: 1 Revisa (navegador con play), 2 Ajusta (post-it con un pedido),
// 3 Exporta (terminal con `bun run render` que se escribe solo, barra de progreso y sale video.mp4).
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodleArrow, ease, hexA, icon, pop, pt, rrect, tape, text, tornPaper, float } from './_kit';

const XS = [380, 960, 1540], Y = 520;

export default class D6 extends Plate {
  tRev = 0; tAju = 0; tExp = 0; tCmd = 0; tEnd = 0;

  override setup() {
    const S = this.S, L = 'Revisa el resultado';
    this.prevBg = C.blanco;
    this.tRev = S.word(L, 'Revisa').start;
    this.tAju = S.word(L, 'pide').start;
    this.tExp = S.word(L, 'exporta').start;
    this.tCmd = S.word(L, 'comando.').start;
    this.tEnd = this.ctx.end;
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 16);
    const steps = [
      { n: '1', s: 'Revisa', at: this.tRev },
      { n: '2', s: 'Ajusta', at: this.tAju },
      { n: '3', s: 'Exporta', at: this.tExp },
    ];
    steps.forEach((st, i) => {
      const k = pop(t, st.at - 0.05, 0.45);
      at(c, XS[i]!, 210, { s: k }, () => {
        c.fillStyle = C.amarillo; c.beginPath(); c.arc(-110, -16, 34, 0, Math.PI * 2); c.fill();
        text(c, st.n, -110, 2, { w: 800, size: 44, col: C.azul, align: 'center' });
        text(c, st.s, -60, 2, { w: 800, size: 64, col: C.blanco });
      });
    });
    doodleArrow(c, pt(560, 520), pt(660, 430), pt(740, 500), ease.inOutCubic(clamp((t - this.tAju + 0.2) / 0.4)), C.amarillo, 7);
    doodleArrow(c, pt(1150, 520), pt(1250, 430), pt(1320, 500), ease.inOutCubic(clamp((t - this.tExp + 0.2) / 0.4)), C.amarillo, 7);

    // 1 — the browser
    const bk = ease.outBack(clamp((t - this.tRev) / 0.45), 1.4);
    at(c, XS[0]!, Y + float(t, 0, 4, 1.3), { s: bk, r: -0.03 }, () => {
      tornPaper(c, 400, 300, '#FFFFFF', 81);
      c.fillStyle = C.gris2; rrect(c, -180, -130, 360, 34, 8); c.fill();
      for (let i = 0; i < 3; i++) { c.fillStyle = [C.naranja, C.amarillo, C.verde][i]!; c.beginPath(); c.arc(-160 + i * 20, -113, 6, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = C.azul; rrect(c, -180, -84, 360, 190, 8); c.fill();
      c.fillStyle = C.blanco; c.beginPath(); c.moveTo(-20, -24); c.lineTo(30, 6); c.lineTo(-20, 36); c.closePath(); c.fill();
      c.fillStyle = hexA(C.blanco, 0.4); rrect(c, -160, 82, 320, 8, 4); c.fill();
      c.fillStyle = C.amarillo; rrect(c, -160, 82, 320 * (((t - this.tRev) * 0.25) % 1), 8, 4); c.fill();
    });
    if (bk >= 1) tape(c, XS[0]! - 150, Y - 160, 100, -0.5, undefined, 82);

    // 2 — the request note
    const nk = ease.outBack(clamp((t - this.tAju) / 0.4), 1.8);
    at(c, XS[1]!, Y + float(t, 1, 4, 1.5), { s: nk, r: 0.04 }, () => {
      c.save(); c.shadowColor = 'rgba(0,0,0,0.25)'; c.shadowBlur = 18; c.shadowOffsetY = 10;
      c.fillStyle = C.amarillo; c.fillRect(-180, -150, 360, 300); c.restore();
      text(c, '“Haz el título', -150, -50, { w: 700, size: 38, col: C.negro });
      text(c, 'más grande y', -150, 0, { w: 700, size: 38, col: C.negro });
      text(c, 'en naranja”', -150, 50, { w: 700, size: 38, col: C.naranja });
    });
    if (nk >= 1) tape(c, XS[1]!, Y - 160, 120, 0.05, undefined, 83);

    // 3 — the terminal and the mp4
    const tk = ease.outBack(clamp((t - this.tExp) / 0.45), 1.4);
    at(c, XS[2]!, Y + float(t, 2, 4, 1.2), { s: tk, r: 0.02 }, () => {
      c.save(); c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 20; c.shadowOffsetY = 10;
      c.fillStyle = '#1E1B3A'; rrect(c, -200, -140, 400, 280, 16); c.fill(); c.restore();
      const cmd = '$ bun run render';
      const n = Math.floor(clamp((t - this.tExp - 0.1) * 22, 0, cmd.length));
      text(c, cmd.slice(0, n) + (n < cmd.length && Math.floor(t * 3) % 2 ? '▌' : ''), -170, -80, { w: 600, size: 32, col: C.verde });
      const pr = clamp((t - this.tCmd + 0.4) / 0.6);
      if (pr > 0) {
        c.fillStyle = hexA(C.blanco, 0.2); rrect(c, -170, -20, 340, 18, 9); c.fill();
        c.fillStyle = C.amarillo; rrect(c, -170, -20, 340 * pr, 18, 9); c.fill();
        text(c, `${Math.round(pr * 100)}%  cuadros`, -170, 40, { w: 500, size: 24, col: hexA(C.blanco, 0.8) });
      }
    });
    // the file that comes out
    const fk = pop(t, this.tCmd + 0.25, 0.4);
    at(c, XS[2]! + 40, Y + 280, { s: fk, r: -0.06 }, () => {
      tornPaper(c, 350, 110, '#FFFFFF', 84);
      at(c, -100, 0, {}, () => icon.check(c, 26, C.verde));
      text(c, 'video.mp4', -60, 14, { w: 800, size: 40, col: C.azul });
    });
    burst(c, XS[2]! + 40, Y + 280, t, this.tCmd + 0.35, C.amarillo, 190, 12);
    return {};
  }
}
