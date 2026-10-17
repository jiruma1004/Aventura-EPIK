# Chispa de la máquina

Cada 20 segundos de juego activo aparece una chispa, independientemente del
número de ataques y en ambos modos. El contador avanza también durante el
aturdimiento, pero se pausa al pausar el juego u ocultar la pestaña.

La chispa recorre en 1.2 s un arco desde la máquina a un destino aleatorio
sobre suelo accesible: x entre 2 y 16, y entre 2 y 13. Evita los láseres
(margen de 1.35), la fosa y las paredes; queda al menos a 1.5 del jugador
y a 2 del destino anterior. El vuelo interpola ambos ejes. Al pasar a menos de .65 unidades y con altura de salto
inferior a .65 se recoge, sin tecla. Si queda una sin recoger a los 20 segundos
siguientes, se reemplaza: nunca se acumulan varias en el suelo.

El rayo visual y el efecto sintetizado respetan silencio/volumen. Durante los
15 segundos de aturdimiento se detienen los ataques, se limpian pociones,
charcos y onda activa, y se cancela la supernova en curso sin renovar su uso.
Se puede caminar, usar ayudas y programar láseres. No resuelve cortes ni afecta
estrellas. Al terminar, los ataques continúan; el ciclo de la chispa mantiene su ritmo.

Pausas y pestaña oculta detienen la simulación. El guardado conserva contador, destino aleatorio,
chispa en vuelo/suelo y aturdimiento restante (descontando el tiempo fuera).
Morir cancela el aturdimiento, pero conserva el contador y la chispa pendiente.
La migración conserva una chispa ya liberada en partidas anteriores e inicia el nuevo ciclo de 20 s.
Resolver la batalla cancela el efecto y oculta la chispa.

La supernova empieza a los 121.5 s de combate activo: carga 2 s, pantalla verde
opaca 3 s y desvanecimiento 1 s. La onda comienza al entrar en la ceguera.

Sprites WebP cargados al crear el encuentro: 479016 bytes entre ambos.
Scripts/prompts: scripts/build-electric-sprites.cjs y assets/cast/ELECTRIC-SPRITES.md.

SFX de máquina arcana: descarga de 1.2 s, carga ascendente de 2 s e impacto
grave con ecos de 2.2 s. Síntesis Web Audio en src/audio/arcane.js, sin archivos
adicionales; respeta volumen general, efectos y silencio. El impacto se activa
con la ceguera, no mediante un temporizador de audio. Aturdir o reiniciar cancela
la carga. Cada capa desconecta sus nodos al terminar.
