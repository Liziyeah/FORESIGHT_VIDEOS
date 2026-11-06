// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL VIDEO — lo único que cambias para un video nuevo (además de
// guion/voz.txt, el audio y las escenas en src/scenes/).
// ─────────────────────────────────────────────────────────────────────────────

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → los números del aprendizaje y del insight, y el título.
/**
 * CARÁTULA de inicio y de cierre (salen solas en todos los videos).
 * Solo cambia los números: quedan como "Aprendizaje 3" e "Insight 2".
 */
export const CARATULA = {
  aprendizaje: 'X',
  insight: 'Z',
  /** Título del video (debajo de los números). */
  titulo: 'Cómo hacer videos de insights',
  /** Línea pequeña de arriba: cliente y trimestre, o el proyecto. */
  cliente: 'Futuros Vivos',
};

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → cliente, trimestre, tendencia/aprendizaje e insight.
/** Footer de identificación (pastilla abajo a la izquierda en todas las escenas). [] para ocultarlo. */
export const FOOTER: string[] = ['Foresight', 'Futuros Vivos', 'Video demo'];

/** Estilo: 'scrapbook' (papel, cinta, marcador) o 'limpio' (flat, colores exactos de la marca). */
export const STYLE: 'scrapbook' | 'limpio' = 'scrapbook';

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → agrega el logo del cliente (en app/public/logos/).
/** Logos del cierre (archivos en app/public/logos/, blancos para fondo azul). Agrega aquí el del cliente. */
export const LOGOS: { file: string; height: number }[] = [
  { file: 'logos/innlab_logo.svg', height: 62 },
  { file: 'logos/icesi_logo.svg', height: 115 },
];

// 👉 AQUÍ SE REEMPLAZA ESTE CONTENIDO → tus escenas y la primera frase de cada una (las d1…d7 son del demo).
/**
 * Escenas en orden. `file` = archivo en src/scenes/ (sin .ts).
 * `from` = un pedazo de la primera frase de la escena tal como está en guion/voz.txt:
 * el corte se hace justo antes de que la voz la diga (la primera escena no lo necesita).
 */
export const SCENES: { file: string; from?: string }[] = [
  { file: 'd1_portada' },
  { file: 'd2_insight', from: 'Todo empieza con un insight' },
  { file: 'd3_guion', from: 'escribe el guion en una tabla' },
  { file: 'd4_voz', from: 'genera la voz en ElevenLabs' },
  { file: 'd5_escenas', from: 'describe cada escena' },
  { file: 'd6_exportar', from: 'Revisa el resultado' },
  { file: 'd7_cierre', from: 'Del informe a un video' },
];
