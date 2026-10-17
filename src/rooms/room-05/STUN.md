# Chispa de la máquina

Cada cinco ataques ejecutados aparece una chispa. Cuenta cada poción lanzada,
cada onda de fuego lanzada y la supernova como un ataque (su onda interna no
cuenta de nuevo). Los avisos, impactos y charcos no suman. Funciona en ambos
modos; en fácil solo hay pociones. No hay aparición por tiempo.

La chispa recorre en 1.2 s un arco desde la máquina a (14.4, 7.5), sobre suelo
seguro antes de la fosa. Al pasar a menos de .65 unidades y con altura de salto
inferior a .65 se recoge, sin tecla. Si queda una sin recoger al quinto ataque
siguiente, se reemplaza: nunca se acumulan varias en el suelo.

El rayo visual y el efecto sintetizado respetan silencio/volumen. Durante los
15 segundos de aturdimiento se detienen los ataques, se limpian pociones,
charcos y onda activa, y se cancela la supernova en curso sin renovar su uso.
Se puede caminar, usar ayudas y programar láseres. No resuelve cortes ni afecta
estrellas. Al terminar, los ataques continúan y comienza el siguiente ciclo.

Pausas y pestaña oculta detienen la simulación. El guardado conserva contador,
chispa en vuelo/suelo y aturdimiento restante (descontando el tiempo fuera).
Morir cancela el aturdimiento, pero conserva el contador y la chispa pendiente.
La migración conserva una chispa ya liberada en partidas del sistema anterior.
Resolver la batalla cancela el efecto y oculta la chispa.

La supernova empieza a los 121.5 s de combate activo: carga 2 s, pantalla verde
opaca 3 s y desvanecimiento 1 s. La onda comienza al entrar en la ceguera.

Sprites WebP cargados al crear el encuentro: 479016 bytes entre ambos.
Scripts/prompts: scripts/build-electric-sprites.cjs y assets/cast/ELECTRIC-SPRITES.md.
