# Aventura EPIK

Aventura educativa de física con siete pruebas, exploración en primera persona, personajes animados y finales alternativos.

## Ejecutar localmente

Desde esta carpeta:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre http://127.0.0.1:8000 en un navegador moderno. Python solo sirve los archivos: el juego y la física se ejecutan en el navegador con JavaScript, HTML, CSS y Canvas. No necesita una compilación.

## Estructura

- `index.html`: entrada y carga de módulos.
- `src/rooms/`: pruebas, física e interacciones.
- `src/engine/`: renderizado, actores y escenario.
- `src/cinematics/`: escenas, ceremonias y tomas falsas.
- `src/ui/`: diálogos, controles, certificado y métricas.
- `assets/`: imágenes, atlas de animación, fuentes y audio locales.
- `tests/`: verificaciones de lógica y de navegador.

Los atlas listos para jugar están incluidos. Los scripts de generación de sprites en `scripts/` son herramientas opcionales de autoría y algunos requieren la biblioteca de imágenes fuente `../astralia-animation-library`, que se conserva por separado.

## Verificación de animaciones

Con Node.js, Playwright y Chrome disponibles, sirve el juego y ejecuta:

```sh
BASE_URL=http://127.0.0.1:8000 node tests/expression-polish.browser.cjs
```

El test admite `PLAYWRIGHT_MODULE` para una instalación externa de Playwright y utiliza `/usr/bin/google-chrome`.

## Publicación independiente

Esta copia está preparada para el repositorio `aventura-epik`. Conserva por separado el proyecto anterior `Astralia`. Puede alojarse como sitio estático; incluye `.nojekyll` para GitHub Pages.

Las notas históricas se conservan en [docs/HISTORIAL-DESARROLLO.md](docs/HISTORIAL-DESARROLLO.md); describen distintas etapas del desarrollo y pueden mencionar funciones anteriores.
