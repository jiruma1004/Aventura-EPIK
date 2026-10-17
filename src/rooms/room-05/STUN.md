# Chispa de la máquina

EricSpark aparece 12 segundos después de iniciar el combate, recorre en 1.2 s
un arco desde la máquina a (14.4, 7.5), sobre suelo seguro antes de la fosa.
Al pasar a menos de .65 unidades y con altura de salto inferior a .65 se recoge.
No requiere tecla: funciona con teclado y joystick. Hay una sola carga por
encuentro; morir no renueva una chispa consumida.

El rayo visual y un efecto sintetizado respetan silencio/volumen. El contador
muestra 15 segundos. Durante ese tiempo se detienen los ataques, se limpian las
pociones/charcos y la onda activa, y se cancela la supernova en curso. No se
reinicia su reloj acumulado ni se repite una supernova ya usada. Tras los 15 s
continúan los ataques. Se puede caminar, usar las ayudas y programar los láseres.
No resuelve ningún corte ni cambia estrellas o penalizaciones de Palma IA.

La pestaña oculta y las pausas detienen el reloj. Al recuperar una sesión se
conservan consumo y tiempo restante, descontando el tiempo fuera. Resolver la
batalla o morir cancela el efecto activo. Una partida nueva crea una carga nueva.

Los sprites se descargan solo al crear el encuentro, en WebP (479016 bytes los dos).
Se reutilizan cuatro cuadros por hoja. Scripts/prompts: scripts/build-electric-sprites.cjs
 y assets/cast/ELECTRIC-SPRITES.md. El recorte de la cinemática aérea se corrige
mediante límites de contenido en SpaceCinematic.drawEric, conservando los anclajes.
