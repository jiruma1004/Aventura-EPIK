# Ajustes arcade — 13 de octubre de 2026

La pregunta «¿Acostumbras jugar videojuegos?» aparece junto al nombre: Sí selecciona normal; No selecciona fácil. Es obligatoria también al omitir el relato. La recuperación de siete minutos conserva el modo. Los guardados anteriores usan normal. Los ejercicios, soluciones, estrellas y CSV no cambian sus reglas.

| Parámetro | Anterior | Normal actualizado | Fácil |
|---|---:|---:|---:|
| Congelamiento del botón azul | 10 s reales en código | 8 s | 8 s |
| Espera al salir del calabozo | 5 s | 5 s | 5 s |
| Iván, celdas/s | 0.8751645 | 0.8751645 | 0.7001316 |
| Símbolos, celdas/s | 1.6 | 1.6 | 1.28 |
| Intervalo entre símbolos | 1.3244 s | 1.3244 s | 2.0694 s |
| Radio de colisión del símbolo | 0.432 celdas | 0.3888 celdas | 0.3888 celdas |
| Altura de colisión del símbolo | 0.27 celdas | 0.243 celdas | 0.243 celdas |
| Primera poción | 8 s | 9.6 s | 11.52 s |
| Intervalo entre pociones | 9 s | 10.8 s | 12.96 s |
| Espera inicial de onda de fuego | 15 s | 18 s | Sin onda |
| Espera entre ciclos de fuego | 19 s | 22.8 s | Sin onda |
| Reaparición en sendero | Antes del puente | Antes del puente | Último tablón correcto |

Los intervalos de ataque son esperas de simulación: se detienen cuando el juego no está activo. La onda espera a que no haya pociones ni charcos; conserva su aviso de 2.2 s, velocidad de 4 celdas/s y cinco segundos de recuperación sin pociones al terminar. Los tiempos reales entre ataques pueden ser mayores por esa coordinación. Los charcos siguen durando dos segundos. El radio y la altura de las figuras se redujeron otro 10 %, además de la reducción ya existente; no cambian los obstáculos de madera ni la lava.

El aviso de persecución se centra durante 3.5 s, luego se desplaza y encoge hacia la esquina en 0.8 s. Ocurre una vez por partida; no pausa el juego. Con movimiento reducido del sistema se omite la transición y los destellos se muestran estáticos.

Los paneles de juego usan fondos con transparencia sin filtros de desenfoque. El texto y los campos mantienen su opacidad. El nuevo retrato de Iván tiene cuatro fotogramas en `assets/cast/ivan-chase-demonic-v3.webp`; el anterior se conserva. Al encenderse la luz de la cabaña se utiliza la animación de risa de cuerpo completo.

El certificado conserva su paginación: 1 estrella roja, 2–3 verdes, 4 amarillas, 5 amarillas con destellos. Se mantienen etiquetas accesibles y no se modifica la puntuación.

Verificación: pruebas de lógica de laberinto, congelamiento, corredor, pociones, onda, progreso, puntuación, traducción y tablones; `tests/arcade.browser.cjs` verifica los modos, recuperación, colisión, ausencia de fuego en fácil, aviso, interfaz móvil y estrellas; `tests/certificate-reverse.browser.cjs` verifica ambas rutas y el CSV.

Ajuste posterior: en fácil, el intervalo entre símbolos sube otro 25 % (20 % menos apariciones). Iván espera 10 s al entrar al calabozo por error, al volver del calabozo y al restaurar un punto de control con persecución activa; su primera aparición normal conserva 2.5 s. Supernova de Eric: solo normal, una vez por intento a los 180 s de juego activo, 8 s de efecto: origen detrás de Eric (0–2 s), verde totalmente opaco (2–7 s), recuperación (7–8 s). Durante el cegamiento se bloquea el desplazamiento y se permite saltar; los láseres quedan bloqueados durante el ataque. Limpia pociones/charcos y lanza una barra de fuego dañina al comenzar el verde opaco; respeta movimiento reducido y se reinicia al morir.

Solo normal: hitbox de símbolos multiplicado por 0.9 (radio 0.34992 y altura 0.2187 celdas); tablones iniciales 1.35 × 1.26 celdas, centrados en los mismos puntos (10 % menos por dimensión). Fácil conserva 1.5 × 1.4 y su hitbox previo.
