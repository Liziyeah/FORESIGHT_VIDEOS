# Personas (puppets)

`build_rig.py` arma los puppets de `app/public/personas/` a partir de los kits de Freepik en `assets/personas-fuente/`.
Corta las piezas del archivo `.ai`: cuerpo, brazo, antebrazo y mano de cada lado, las caras y las manos con gestos.
Calcula también las articulaciones: hombro, codo y muñeca.

```sh
cd analysis/personas
uv run --no-project --with pymupdf --with numpy --with pillow --with scipy python build_rig.py
```

## Agregar otra persona

1. Necesitas un kit de Freepik **con piezas separadas**: los que traen "base model", "structure info" y "facial expressions".
   Ponlo en `assets/personas-fuente/<nombre>/`.
2. En `build_rig.py`, agrega una entrada a `CFG`. Esa entrada indica qué trazos del vector (números `seqno`) forman cada parte:
   - las capas del cuerpo,
   - la cabeza,
   - cada brazo: brazo, antebrazo y mano,
   - y qué grupo es cada cara y cada mano con gesto.

   Para ver los números, usa `labels()` de `vec.py` y `clusters()` de `clus.py`.
3. Corre el script y agrega el id a `PersonaId` en `app/src/scenes/_kit.ts`.

Lo más fácil es pedírselo a Claude: "agrega este kit de Freepik como persona nueva".
