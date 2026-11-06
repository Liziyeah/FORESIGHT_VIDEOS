# 3. Las escenas

Cada escena es un archivo en `app/src/scenes/` que **dibuja un cuadro del video en función del tiempo `t`**. Para cualquier `t`, el resultado es siempre el mismo, por eso la vista previa y el MP4 son idénticos.

Normalmente **no escribes este código tú**: describes la escena y Claude la programa (ver [05-trabajar-con-claude.md](05-trabajar-con-claude.md)). Esta página explica cómo está armado, para que sepas qué pedir.

## Registrar las escenas

En `app/src/video.config.ts`:

```ts
export const SCENES = [
  { file: 'v1_gancho' },                                // la primera empieza en 0
  { file: 'v2_insight', from: 'Lo mismo le puede pasar' },  // corta justo antes de esta frase
  …
];
```

`from` es un pedazo de la primera frase de la escena, tal como está en `guion/voz.txt`. Si cambia la voz, los cortes se mueven solos.

En el mismo archivo están **`FOOTER`** (la pastilla de identificación: Foresight · cliente · tendencia · insight), **`LOGOS`** (los logos del cierre, blancos para fondo azul) y **`STYLE`** (`'scrapbook'` o `'limpio'`).

## Esqueleto de una escena

```ts
import type { Frame, PostOverrides } from '../engine/scene';
import { C, Plate, at, inn, pop, text, kinetic, spoken, tornPaper, tape, type KWordT } from './_kit';

export default class V2 extends Plate {
  tDato = 0; titulo: KWordT[] = [];

  // 1) Buscar las palabras de la voz (si el guion cambia y no las encuentra, avisa con un error claro)
  override setup() {
    const S = this.S;
    this.prevBg = C.azul;                                   // abre con un círculo sobre el fondo anterior
    this.tDato = S.word('un dato que haga pensar', 'dato').start;   // segundo exacto en que dice "dato"
    this.titulo = spoken(S, 'Todo empieza con un insight');          // todas las palabras de esa línea
  }

  // 2) Dibujar el cuadro en el tiempo t
  draw(c: CanvasRenderingContext2D, t: number, _f: Frame): PostOverrides {
    c.fillStyle = C.azul; c.fillRect(0, 0, 1920, 1080);      // fondo azul (si no, es papel blanco)
    kinetic(c, t, this.titulo, 960, 140, { size: 64, col: C.blanco, align: 'center' });  // palabra por palabra
    at(c, 1400, 700, { s: pop(t, this.tDato), r: 0.05 }, () => {   // aparece con rebote cuando dice "dato"
      tornPaper(c, 400, 260, C.amarillo, 7);
      text(c, '+70%', 0, 30, { w: 800, size: 120, col: C.azul, align: 'center' });
    });
    return {};
  }
}
```

**Lienzo:** 1920×1080 px, origen arriba a la izquierda. **Tiempo:** `t` en segundos del video; `this.ctx.start` y `this.ctx.end` son el inicio y el fin de la escena.

Para un personaje ilustrado, o imágenes en general, carga los archivos en `override async load() { … }`.

## Referencia del kit (`_kit.ts`)

### Sincronía con la voz
| Función | Qué hace |
|---|---|
| `this.S.word(línea, palabra, n?)` | La palabra (con `.start`/`.end` en segundos) dentro de la línea que contiene `línea`. Ignora tildes y mayúsculas. |
| `this.S.line(texto)` | La línea completa (`.start`, `.end`, `.words`). |
| `spoken(S, línea, desde?, hasta?)` | Lista de palabras con su tiempo, para `kinetic`. |
| `kinetic(c, t, palabras, x, y, {size, w, col, align, cap})` | Texto que entra palabra por palabra, cada una cuando se dice. |

### Tiempo y animación
| Función | Qué hace |
|---|---|
| `inn(t, t0, d=0.4)` | 0→1 con ease-out desde `t0` (entradas). |
| `outk(t, t1)` | 1→0 en 0,25 s (salidas). |
| `vis(t, t0, t1)` | Entra en `t0`, sale en `t1`. |
| `pop(t, t0)` | Escala 0→1 con rebote. |
| `float(t, i, amp, vel)` | Flotación suave (para que nada quede quieto). |
| `ease.*`, `clamp`, `lerp` | Curvas y utilidades. |
| `at(c, x, y, {s, r, a, dx, dy}, () => …)` | Dibuja algo centrado en (x, y) con escala, rotación y opacidad. |

### Texto y formas
`text(c, s, x, y, {w, size, col, align, italic, alpha, ls})` · `measureText` · `fit` · `wrap` · `rrect` · `pill` · `labelPill` · colores `C.azul`, `C.blanco`, `C.verde`, `C.naranja`, `C.amarillo`, `C.morado`, `C.gris1`, `C.gris2`, `C.negro` · `hexA(color, alpha)` · `mixHex(a, b, k)`.

### Íconos de línea (`icon.*`)
`check` · `person` · `car` · `roadClosed` · `bill` · `wallet` · `scale` · `brokenLock` · `phone` · `pin` · `group` · `clock` · `bubble` · `magnifier` · `refresh`.

### Personas (puppets) — úsalas SIEMPRE que el video necesite una persona
`Puppet` dibuja personas ilustradas con **brazos articulados** (hombro, codo y muñeca), **manos con gestos** y **caras con expresiones**. Respiran, se balancean y cambian de pose con un rebote suave. Viven en `app/public/personas/<id>/`.

| Id | Quién | Qué puede hacer |
|---|---|---|
| `valentina` | Joven de pelo rosado, camiseta verde, de pie | Todas las poses y caras |
| `andres` | Joven rubio, camiseta azul, de pie | Todas las poses y caras |
| `camila` | Mujer de gafas, **sentada en su escritorio** con portátil | Solo cambia la cara (ideal para "alguien trabajando") |

- **Poses:** `neutral`, `saluda` (agita la mano), `senala` (señala a la derecha; con `flip: true` a la izquierda), `idea` (índice arriba), `celebra` (puños arriba), `explica` (mano abierta), `jarras` (manos en la cintura), `paz`, `piensa` (puño en el mentón), `encoge` (no sé), `rock`.
- **Caras:** `sonrisa`, `feliz`, `habla`, `sorpresa`, `guino`, `duda`, `enojada`.
- **Que hable:** pasa `talk` con los tramos en que la persona habla, y abre y cierra la boca.

```ts
vale = new Puppet('valentina');
override async load() { await this.vale.load(); }
// setup:
this.keys = [
  { at: -1, pose: 'saluda', head: 'feliz' },
  { at: S.word('un dato que haga pensar', 'dato').start, pose: 'senala', head: 'sorpresa' },
];
// draw: pies en (420, 980), 640 px de alto
this.vale.draw(c, 420, 980, 640, t, this.keys, { talk: [[S.line('Todo empieza').start, S.line('Todo empieza').end]] });
```

Las poses están en `POSES` (`_kit.ts`): son ángulos de hombro y codo, así que se pueden crear nuevas.
Para agregar otra persona (un kit de Freepik con piezas separadas), mira `analysis/personas/LEEME.md`.

**Otros (solo si se piden):** `Cutout` (el kit ilustrado anterior, en `app/public/personaje/`) y `person(…)` (personaje plano dibujado con código).

### Efectos
`glow` (resplandor) · `burst` (destello de rayos) · `ripple` (onda) · `stampShake` (sacudón de sello) · `decor` (garabatos de fondo) · `strokeTrim` (línea que se dibuja; en scrapbook parece marcador).

### Scrapbook
`tornPaper` (papel rasgado con sombra) · `tape` (cinta) · `staple` (grapa) · `clip` (clip) · `doodleArrow` (flecha a mano) · `scribbleCircle` (óvalo de marcador) · `scratchOut` (tachón) · `doodle('star' | 'spiral' | 'spark' | 'heart')`.
La textura de papel se aplica sola a todo el cuadro cuando `STYLE = 'scrapbook'`.

### Logos
`loadLogos()` en `load()` y `drawLogos(c, imgs, cx, cy, alpha)` en el cierre. Los archivos se configuran en `LOGOS`.

## Carátulas (automáticas)

Todos los videos empiezan y terminan con la carátula **Aprendizaje X · Insight Z** (`caratula_inicio.ts` y `caratula_final.ts`). `timeline.ts` las agrega sola, en el silencio que pone `preparar_voz.py`. **No van en `SCENES`.** Para cambiar los números, edita `CARATULA` en `video.config.ts`.

## Buenas prácticas

- **Sincronía:** ancla todo a palabras (`S.word`), nunca a segundos fijos.
- **Movimiento:** nada debe quedar quieto. Usa `float`, personajes que respiran y garabatos.
- **Tiempos:** entradas de 0,3–0,5 s con ease-out y salidas de 0,25 s.
- **Fondos:** alterna escenas azules y blancas, y abre con `prevBg` para una transición circular.
- **Pie de pantalla:** deja libre el área del footer (abajo a la izquierda, y ≈ 990–1040).
