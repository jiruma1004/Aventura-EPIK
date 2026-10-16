# Primera optimización de carga · 15 de octubre de 2026

## Cambios de juego

- Palma IA del cañón muestra `v₀ = √(g D² / [2 cos²(θ) (D tan(θ) − Δy)])`, sustituyendo los datos del blanco, pero dejando el ángulo a elección del estudiante. El texto termina en «Usa grados en tu calculadora».
- El tutorial tiene cinco pasos: caminar, correr, mirar, saltar e interactuar. Correr requiere desplazarse usando Shift o activar Correr en pantalla; caminar por sí solo no completa ese paso. La práctica mantiene detenido el reloj.
- Plataformas fáciles: de 1,5 × 1,4 a 1,575 × 1,47 unidades (+5% por dimensión, centradas en la misma posición). Las normales conservan 1,35 × 1,26.
- Se conserva el desplazamiento del blanco cada tres disparos fallidos terminados, solo en profundidad. Se verificaron once ciclos, incluida la vuelta a la primera posición; acertar no desplaza el blanco.
- El prólogo muestra completo el periódico B proporcionado por el usuario, con texto alternativo accesible y sin duplicar titulares HTML.

## Rendimiento

| Medición | Antes | Después |
| --- | ---: | ---: |
| Archivos de `assets/` (MB decimales) | 97,93 | 85,29 |
| Nueve pistas largas optimizadas (MB) | 35,58 | 24,13 |
| Periódico cargado por el prólogo (KB) | 1.254 | 64 |
| Audios solicitados al abrir, antes de interacción | 17 | 1 |

Los recursos bajaron 12,64 MB (12,9%). Se recodificaron nueve pistas a MP3 de 128 kbps; los efectos breves y otras pistas quedan intactos. Se conservaron los originales fuera del directorio publicado, en `outputs/backups/before-load-optimization-2026-10-15/` del espacio de trabajo.

Cada audio recibe su URL al necesitarse; al abrir solo se intenta reproducir el tema de entrada. Los cambios de sala mantienen fundidos y bucles. Los controles de volumen se consultan mediante referencias DOM guardadas, evitando búsquedas repetidas por fotograma. El periódico WebP se dibuja una sola vez por página del prólogo, en lugar de repintarse continuamente.

Estas cifras miden archivos y solicitudes locales, no FPS ni una prueba simultánea de 70 equipos. La transferencia efectiva depende de caché, solicitudes parciales del navegador y salas visitadas.

## Verificación

- `tests/guided-assistance.cjs`: fórmulas, 33 fallos consecutivos y comprobación balística del despeje con tres ángulos en todas las posiciones.
- `tests/classroom.cjs`: métricas, penalizaciones, guardado y soluciones dinámicas.
- `tests/control-tutorial.browser.cjs`: cinco pasos en escritorio, correr con botón táctil, reloj detenido y reinicio del jugador.
- `tests/supernova.browser.cjs`: dimensiones de plataformas, dificultad y ataque normal sin regresiones.
- `tests/music-loop.browser.cjs`: bucle y fundidos del tema de batalla.
- `tests/load-performance.browser.cjs`: carga diferida, reproducción de música y efectos, silencio y periódico completo en escritorio y móvil.

Las pruebas de navegador usan Chrome y Playwright con `BASE_URL` apuntando al servidor local; la prueba de bucle usa `EPIK_TEST_URL`.
