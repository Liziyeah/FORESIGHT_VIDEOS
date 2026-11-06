// CARÁTULA DE CIERRE (automática, papel blanco): la misma carátula al final, después de los logos.
// Ocupa los últimos 3,6 s de silencio. No la agregues a SCENES: timeline.ts la pone sola.
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate } from './_kit';
import { caratula } from './_caratula';

export default class CaratulaFinal extends Plate {
  override footer = false;
  override setup() { this.prevBg = C.azul; }
  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    caratula(c, t, this.ctx.start + 0.25, false);
    return {};
  }
}
