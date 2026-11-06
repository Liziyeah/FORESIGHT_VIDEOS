// CARÁTULA DE INICIO (automática, fondo azul): Aprendizaje X · Insight Z · título.
// Ocupa el silencio antes de la voz; la primera escena entra con un círculo sobre ella.
// No la agregues a SCENES: timeline.ts la pone sola. Los textos están en CARATULA (video.config.ts).
import type { Frame, PostOverrides } from '../engine/scene';
import { Plate } from './_kit';
import { caratula } from './_caratula';

export default class CaratulaInicio extends Plate {
  override footer = false;
  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    caratula(c, t, this.ctx.start, true);
    return {};
  }
}
