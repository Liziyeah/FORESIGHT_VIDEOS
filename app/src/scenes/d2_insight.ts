// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO
// Esta escena es del VIDEO DEMO: bórrala o cámbiala por la de tu video (y actualiza SCENES en video.config.ts).
// ESCENA 2 — El insight (fondo azul)
// Voz: "Todo empieza con un insight del informe. Una idea clara, con evidencia, y un dato que haga pensar."
// Una página del informe de Foresight (papel rasgado) con líneas de texto; un marcador amarillo resalta
// una frase y aparece la etiqueta "Insight". A la derecha, una lista que se marca con la voz: idea clara,
// evidencia, un dato; el dato aparece grande en un post-it (+70 %).
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, burst, clamp, decor, doodle, ease, float, hexA, icon, inn, pop, rrect, strokeTrim, tape, text, tornPaper, pt, kinetic, spoken, type KWordT, staple } from './_kit';

const PAGE = { x: 560, y: 560, w: 700, h: 760 };

export default class D2 extends Plate {
  tInsight = 0; tInforme = 0; tIdea = 0; tEvid = 0; tDato = 0; title: KWordT[] = [];

  override setup() {
    const S = this.S, L1 = 'Todo empieza con un insight', L2 = 'Una idea clara';
    this.prevBg = C.blanco;
    this.tInsight = S.word(L1, 'insight').start;
    this.tInforme = S.word(L1, 'informe.').start;
    this.tIdea = S.word(L2, 'idea').start;
    this.tEvid = S.word(L2, 'evidencia,').start;
    this.tDato = S.word(L2, 'dato').start;
    this.title = spoken(S, L1);
  }

  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    const t0 = this.ctx.start;
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);
    decor(c, t, true, 12);

    // the report page
    const pk = ease.outBack(clamp((t - t0 - 0.1) / 0.5), 1.3);
    at(c, PAGE.x, PAGE.y + (1 - pk) * 120 + float(t, 1, 3, 1), { r: -0.035, a: clamp(pk * 2) }, () => {
      tornPaper(c, PAGE.w, PAGE.h, '#FFFFFF', 13);
      const L = -PAGE.w / 2 + 60, T = -PAGE.h / 2 + 70;
      text(c, 'INFORME FORESIGHT', L, T + 10, { w: 800, size: 26, col: C.azul, ls: 3 });
      c.fillStyle = C.azul; rrect(c, L, T + 26, 120, 8, 4); c.fill();
      // body text lines
      const widths = [520, 560, 480, 540, 300, 0, 560, 500, 540, 420, 0, 520, 460];
      widths.forEach((w, i) => {
        if (!w) return;
        const y = T + 80 + i * 44;
        const k = clamp((t - t0 - 0.35 - i * 0.04) / 0.25);
        // the insight line gets highlighted
        if (i === 6 || i === 7) {
          const hk = ease.inOutCubic(clamp((t - this.tInsight - (i - 6) * 0.35) / 0.45));
          if (hk > 0) { c.save(); c.globalCompositeOperation = 'multiply'; c.strokeStyle = C.amarillo; c.lineWidth = 30; strokeTrim(c, [pt(L - 6, y + 7), pt(L + w * 1.02, y + 5)], hk); c.restore(); }
          c.fillStyle = C.negro;
        } else c.fillStyle = C.gris2;
        rrect(c, L, y, w * k + 0.01, 14, 7); c.fill();
      });
      staple(c, PAGE.w / 2 - 70, -PAGE.h / 2 + 22, 0.2);
    });
    // "Insight" tag on the highlighted lines
    const ik = pop(t, this.tInsight + 0.4, 0.45);
    at(c, PAGE.x + 330, PAGE.y + 50, { s: ik, r: 0.08 }, () => {
      tornPaper(c, 220, 76, C.naranja, 17);
      text(c, 'Insight', 0, 14, { w: 800, size: 40, col: C.blanco, align: 'center' });
    });

    // headline (the spoken sentence)
    kinetic(c, t, this.title, 960, 118, { w: 800, size: 60, col: C.blanco, cap: true, align: 'center' });

    // checklist
    const items = [
      { s: 'Una idea clara', at: this.tIdea },
      { s: 'Con evidencia', at: this.tEvid },
      { s: 'Un dato que haga pensar', at: this.tDato },
    ];
    items.forEach((it, i) => {
      const k = inn(t, it.at - 0.05, 0.4);
      if (k <= 0) return;
      const y = 330 + i * 110;
      at(c, 1060 + (1 - k) * 80, y, { a: k }, () => {
        at(c, 30, -18, { s: pop(t, it.at + 0.25, 0.4) }, () => icon.check(c, 26, C.verde));
        text(c, it.s, 90, 0, { w: 700, size: 48, col: C.blanco });
      });
      burst(c, 1090, y - 18, t, it.at + 0.3, C.amarillo, 46, 8, i);
    });

    // the number, big, on a post-it
    const dk = ease.outBack(clamp((t - this.tDato - 0.2) / 0.4), 1.8);
    if (dk > 0) {
      at(c, 1440, 790 + float(t, 3, 5, 1.4), { s: dk, r: 0.05 }, () => {
        c.save(); c.shadowColor = hexA('#000000', 0.25); c.shadowBlur = 20; c.shadowOffsetY = 10;
        c.fillStyle = C.amarillo; c.fillRect(-210, -150, 420, 300); c.restore();
        text(c, '+70%', 0, 30, { w: 800, size: 130, col: C.azul, align: 'center' });
        text(c, 'el dato que sorprende', 0, 100, { w: 600, size: 30, col: C.negro, align: 'center' });
      });
      if (dk >= 1) tape(c, 1440, 640, 140, -0.06, undefined, 21);
      doodle(c, 'spark', 1700, 650, 26, C.amarillo, clamp((t - this.tDato - 0.6) / 0.3));
    }
    return {};
  }
}
