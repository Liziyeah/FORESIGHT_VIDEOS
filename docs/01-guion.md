# 1. El guion

El guion es una **tabla** y un **texto hablado**:

- La **tabla** (en `guion/<tu-video>.md`, copiada de `guion/plantilla-guion.md`) dice, escena por escena: tiempo aproximado, voz en off, texto en pantalla y sugerencia visual. Es para las personas y para Claude.
- El **texto hablado** (`guion/voz.txt`) es la fuente de verdad para sincronizar. Lleva una frase por línea, escrita **exactamente** como la dice la voz.

## Formato de `guion/voz.txt`

```
## portada
Este es el video demo de Futuros Vivos.
Aquí te mostramos cómo convertir un insight de Foresight en un video corto.

## insight
Todo empieza con un insight del informe.
```

- `## nombre` empieza una escena. Sirve para leerlo fácil y para los tiempos provisionales.
- Escribe **una frase por línea**. Las escenas encuentran sus palabras buscando dentro de la línea.
- Las líneas que empiezan con `#`, las vacías y las etiquetas `<break …/>` se ignoran.
- Si cambias una palabra en la voz, cámbiala también aquí y vuelve a sincronizar.

## Cómo escribir un buen guion de insight

| Momento | Qué hace | Ejemplo |
|---|---|---|
| **Gancho** (0–10 s) | Una pregunta o una imagen cotidiana | "Imagina que manejas con un GPS que no se actualiza…" |
| **Insight** | La idea del informe, en una frase | "La exclusión crediticia es un problema de datos, no de solvencia." |
| **Explicación** | Por qué pasa, con 3–5 factores concretos | "los precios, los ingresos, las normas…" |
| **Evidencia** | Un dato fuerte con su fuente | "+70 % de probabilidad de rechazo (REC-0246)" |
| **Caso** | Un ejemplo humano, una persona | "Un cliente se atrasa en un pago…" |
| **Por qué te importa** | Conectar con quien mira (mandos medios) | "Si tu equipo usa estos modelos…" |
| **Acción** | Una o dos preguntas para la próxima reunión | "¿Cada cuánto revisamos nuestros modelos?" |
| **Cierre** | Una frase que se recuerde + logos | "No evalúes el presente con el mapa del pasado." |

**Reglas prácticas:**
- **Duración:** 130–160 palabras ≈ 1 minuto con una voz ágil; para 90 s, ~220 palabras.
- **Texto en pantalla:** debe repetir palabras de la voz. Así se sincroniza con precisión y se entiende sin audio.
- **Números y siglas:** escríbelos como se ven ("70 %", "GPS"). Cómo se pronuncian se ajusta en `analysis/align_vo.py` (`SPOKEN`).
- **Datos:** uno fuerte por video, con su código de fuente del informe.

## Guía de estilo por defecto (identidad Icesi)

| Uso | Color | HEX |
|---|---|---|
| Protagonista: fondos, líneas principales | Azul Icesi | `#5454E9` |
| Fondos claros, texto sobre azul | Blanco | `#FFFFFF` |
| "Bien / correcto" | Verde | `#4CB979` |
| "Alerta / error" | Naranja | `#E9683B` |
| Resaltados, post-its | Amarillo | `#E4EB60` |
| Secundarios (íconos, avatares) | Morado | `#865CF0` |
| Apagados / ejes | Gris 2 / Gris 1 | `#CECFD4` / `#88898C` |

- **Azul siempre presente:** cada escena lleva el azul en el fondo o en el elemento principal.
- **Fondos:** azul o blanco (papel), alternando por escena.
- **Texto:** blanco sobre azul, o azul o negro sobre blanco. Verde, naranja y amarillo van en formas y subrayados, no en texto pequeño.
- **Tipografía:** Plus Jakarta Sans. Títulos en ExtraBold (800) o Bold (700), de 64–96 px; apoyo en Medium o Regular (500/400), de 36–48 px.
- **Itálica:** solo en palabras en otro idioma (*model drift*). Mayúsculas sostenidas solo en titulares de una a tres palabras (RIESGOSO).
