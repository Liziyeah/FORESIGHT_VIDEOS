# 5. Trabajar con Claude

Este repo está pensado para trabajarlo **conversando con Claude**. Tú pones el guion, la voz y el criterio de diseño; Claude programa las escenas, las sincroniza, revisa capturas y exporta.

## Cómo conectarlo

- **Claude app (escritorio):** conecta la carpeta del repo (**+ → Add folder**) o abre el repo de GitHub en Claude Code.
- **Claude Code (terminal):** abre la carpeta del repo y escribe `claude`.

Claude lee `CLAUDE.md` automáticamente y sigue el proceso de esta plantilla.

## Pedidos que funcionan bien

**Arrancar un video nuevo**
> Este es el guion del insight 3 de ACH (te lo pego / está en guion/insight-3.md). Prepara voz.txt, la configuración y escenas vacías, y usa tiempos provisionales mientras genero la voz.

**Con la voz lista**
> Te dejé la voz en audio/voiceover_original.mp3. Ponle el silencio final, sincroniza y revisa que los tiempos tengan sentido.

**Escenas (describe lo que ves, no el código)**
> En la escena 2, que aparezca una página del informe y que un marcador amarillo resalte la frase del insight cuando la voz dice "insight". A la derecha, una lista con check que se marque con cada palabra: idea, evidencia, dato.

> Usa a Valentina en la escena 4: saluda al inicio, señala el dato con cara de sorpresa cuando dice "se atrasa", pone las manos en la cintura cuando cae el sello y celebra al final.

> En la escena 2 pon a Camila trabajando en su escritorio, con cara de duda cuando dice "riesgo".

**Ajustes**
> El título de la escena 3 está muy pequeño, súbelo y ponle subrayado amarillo.
> En el segundo 22 algo se tapa con el footer, revísalo.
> Quita el temblor / el estilo scrapbook / el sacudón del sello.
> Verifica que todo el texto en pantalla coincida con lo que dice la voz.

**Carátula**
> Esta es la del aprendizaje 3, insight 2: cambia los números de la carátula.

**Cierre**
> Cambia el footer a "Foresight · ACH Q2 2026 · Tendencia 2 · Insight 3", agrega el logo de ACH y exporta el MP4.

## Lo que Claude hace por su cuenta

- Ancla cada animación a palabras de la voz, nunca a segundos fijos.
- Saca capturas de las escenas para revisar que nada se salga del cuadro ni se tape.
- Mantiene la identidad Icesi y las reglas de `docs/01-guion.md`.
- Corre el chequeo de tipos antes de entregarte un cambio.

## Consejos

- **Un cambio a la vez**, y míralo en el navegador (Cmd + R para recargar).
- Si algo no te gusta, **dile qué ves y en qué segundo** (la barra de abajo muestra el tiempo).
- Imágenes propias (ilustraciones en SVG con capas, fotos PNG sin fondo): ponlas en `app/public/` y dile a Claude qué hacer con ellas.
