# 01 · Especificación funcional

> **Qué** hace la app y **por qué**. No menciona tecnologías. Estado: ✅ implementada (v1.0, octubre 2026).

## 1. Visión

Química Quest es un **libro interactivo con mecánicas de juego** para que alumnos/as de 6° año estudien *Reacciones químicas* y *Estequiometría*. Combina teoría en tarjetas, ejercicios con corrección inmediata, herramientas de experimentación y desafíos, sin depender de un docente ni de internet.

**Problema que resuelve:** los apuntes en PDF son estáticos; el alumno no sabe si resolvió bien un ejercicio hasta la clase siguiente, y la estequiometría requiere mucha práctica con retroalimentación.

## 2. Usuarios

| Perfil | Necesidad principal |
|---|---|
| **Alumno/a** (15–18 años) | Entender la teoría con ejemplos, practicar y saber al instante si está bien y por qué. |
| **Docente** (secundario) | Recomendar una herramienta confiable y fiel a su programa. (Sin funciones propias en v1, ver §7.) |
| **Desarrollador/a** (mantenimiento) | Agregar contenido sin tocar la lógica. |

## 3. Glosario del dominio

**Mundo**: unidad temática (10 en total). **Card**: tarjeta de teoría. **Ejercicio**: pregunta con respuesta verificable. **Práctica extra**: ejercicios generados al azar. **XP**: puntos de experiencia. **Racha**: aciertos seguidos al primer intento. **Estrellas**: calificación de 0–3 de un mundo terminado.

## 4. Historias de usuario y criterios de aceptación

### HU-01 · Recorrer la teoría
*Como alumno/a quiero leer la teoría en tarjetas cortas con ejemplos para entender un tema de a poco.*
- **Dado** que entro a un mundo, **cuando** abro "Teoría", **entonces** veo una card por vez con título, explicación y, si corresponde, ejemplo, tabla, consejo o curiosidad.
- **Dado** una card con "paso a paso", **cuando** toco "Siguiente paso", **entonces** se revela un único paso más, hasta terminar.
- **Dado** que veo una card por primera vez, **entonces** gano 2 XP (una sola vez por card).
- Puedo navegar con botones, con los puntos indicadores o con las flechas ← → del teclado.

### HU-02 · Resolver ejercicios con corrección inmediata
*Como alumno/a quiero saber al instante si respondí bien y ver la explicación.*
- **Dado** un ejercicio, **cuando** respondo, **entonces** la app me dice si es correcto sin recargar.
- **Dado** que respondo mal, **entonces** puedo reintentar, pedir una pista (si existe) o ver la solución.
- **Dado** que acierto o veo la solución, **entonces** se muestra la explicación y, si existe, la resolución paso a paso.
- Las respuestas numéricas aceptan coma o punto decimal y notación científica (`6,02e23`, `6,02x10^23`) y tienen tolerancia de redondeo (2 % por defecto).

### HU-03 · Balancear ecuaciones
*Como alumno/a quiero ajustar coeficientes y ver si los átomos coinciden.*
- **Dado** una ecuación, **cuando** subo o bajo un coeficiente (entre 1 y 15), **entonces** veo en vivo cuántos átomos de cada elemento hay de cada lado y una balanza que se inclina si no está equilibrada.
- **Dado** que la ecuación quedó balanceada pero no con los enteros mínimos, **entonces** se me avisa que simplifique **sin** contarlo como error.

### HU-04 · Practicar sin límite
*Como alumno/a quiero ejercicios nuevos cuando ya terminé los del mundo.* Los mundos con "Práctica extra" generan ejercicios al azar indefinidamente (3 XP por acierto).

### HU-05 · Experimentar en el laboratorio
*Como alumno/a quiero herramientas para comprobar mis cálculos.*
- Balanceador (lista del curso o ecuación propia), calculadora de masa molar con composición centesimal, conversor gramos ⇄ moles ⇄ partículas ⇄ átomos ⇄ litros, indicador de pH de repollo morado, reactor de reactivo limitante con moléculas dibujadas, tabla de masas atómicas y constantes.

### HU-06 · Competir contra mí mismo/a
*Como alumno/a quiero un modo desafío para repasar todo.* Preguntas al azar de todos los mundos, 3 vidas, 45 s por pregunta, un solo intento; se guarda el récord.

### HU-07 · Repasar conceptos
*Como alumno/a quiero fichas de memoria.* Fichas que se dan vuelta (concepto ⇄ definición), mezclables, navegables con teclado.

### HU-08 · Ver mi progreso
*Como alumno/a quiero ver cuánto avancé.* Mapa con progreso y estrellas por mundo, nivel y XP en la barra superior, pantalla de logros y estadísticas, opción de borrar el progreso con doble confirmación.

## 5. Requisitos funcionales

| ID | Requisito | HU |
|---|---|---|
| RF-01 | Hay 10 mundos en orden recomendado: 1 Reacciones · 2 Tipos y energía · 3 Balanceo · 4 pH · 5 Nomenclatura · 6 Mol · 7 Estequiometría · 8 Limitante · 9 Rendimiento y soluciones · 10 Fórmulas. Todos están desbloqueados. | HU-01 |
| RF-02 | Cada mundo tiene cards de teoría y una lista fija de ejercicios. Algunos mundos tienen práctica extra. | HU-01/04 |
| RF-03 | Las fórmulas químicas se muestran con subíndices, cargas como superíndice y estados de agregación. | HU-01 |
| RF-04 | Tipos de ejercicio: opción múltiple, verdadero/falso, numérico, numérico en varias partes, escribir fórmula, balancear, unir parejas. | HU-02 |
| RF-05 | Las opciones de opción múltiple y la columna derecha de "unir" se muestran mezcladas. | HU-02 |
| RF-06 | Una fórmula escrita es correcta si tiene la **misma composición** que la esperada (el orden de los elementos no importa). | HU-02 |
| RF-07 | Una ecuación es correcta si está balanceada **y** sus coeficientes son los enteros mínimos. | HU-03 |
| RF-08 | Un ejercicio tiene 3 resultados posibles: `ok` (primer intento), `ok2` (con reintento), `fail` (vio la solución). Se guarda el mejor resultado. | HU-02 |
| RF-09 | XP por ejercicio de la lista fija, **solo la primera vez**: opción múltiple y V/F 10; numérico, fórmula, balanceo y unir 15; en partes 20. `ok2` da la mitad (redondeada hacia arriba); `fail` da 0. | HU-02 |
| RF-10 | Al completar todos los ejercicios de un mundo se muestran estrellas: puntaje = (ok×1 + ok2×0,6)/total; ≥ 0,85 → 3; ≥ 0,6 → 2; si no → 1. | HU-08 |
| RF-11 | Progreso del mundo (%) = cards vistas/total × 30 + ejercicios hechos/total × 70. | HU-08 |
| RF-12 | 10 niveles por XP acumulada: 0, 80, 200, 380, 620, 920, 1300, 1750, 2300, 3000. Al subir de nivel hay aviso y animación. | HU-08 |
| RF-13 | 12 logros (primera reacción, racha 5, racha 10, leer un mundo, completar un mundo, 3 estrellas, 10 balanceos, 8+ en desafío, usar las 5 herramientas, 25 fichas, 20 prácticas, completar los 10 mundos). | HU-08 |
| RF-14 | La racha suma con cada acierto al primer intento y vuelve a 0 con un error o al ver la solución. | HU-08 |
| RF-15 | Desafío: 3 vidas, 45 s por pregunta, un solo intento, ~35 % de preguntas generadas al azar, 5 XP por acierto; si se acaba el tiempo se pierde una vida y se muestra la respuesta. | HU-06 |
| RF-16 | El progreso se conserva al cerrar y volver a abrir la app en el mismo navegador. | HU-08 |
| RF-17 | Sonido (activable/desactivable) y tema claro/oscuro/automático, recordados entre sesiones. | — |
| RF-18 | El balanceador del laboratorio acepta ecuaciones escritas por el usuario con `->`, `=>`, `=` o `<=>`. | HU-05 |
| RF-19 | Las masas atómicas son las redondeadas del curso (H 1, C 12, N 14, O 16, Na 23, Cl 35,5…); NA = 6,02 × 10²³; volumen molar 22,4 L (CNPT). | HU-02/05 |

## 6. Requisitos no funcionales

| ID | Requisito | Cómo se mide |
|---|---|---|
| RNF-01 | Funciona abriendo el archivo principal con doble clic, sin servidor ni instalación. | Prueba manual en Windows |
| RNF-02 | Funciona sin internet (solo cambia la tipografía por una del sistema). | Desconectar la red |
| RNF-03 | Usable en pantallas desde 360 px sin desplazamiento horizontal. | Test automatizado a 390 px |
| RNF-04 | Ninguna acción del usuario congela la interfaz más de 3 s. | `tests/security.test.js` §4 |
| RNF-05 | No hay errores en la consola durante el uso normal. | Smoke test con navegador automatizado |
| RNF-06 | Agregar un ejercicio = agregar un objeto que cumple `contratos/ejercicio.schema.json`. | Revisión |
| RNF-07 | Seguridad según `04-seguridad.md` (SEC-01 a SEC-09). | `tests/security.test.js` |

## 7. Fuera de alcance (v1)

- Cuentas de usuario, servidor, base de datos o sincronización entre dispositivos.
- Panel del docente / ver el progreso de un curso.
- Generar ejercicios con IA.
- Otras unidades del programa (estructura atómica, soluciones avanzadas, gases en profundidad).

## 8. Preguntas abiertas (para practicar la etapa "Clarificar")

1. ¿El docente debería poder exportar/importar el progreso de un alumno (por ejemplo, un archivo)? ¿Qué riesgos tiene importar un archivo? → impacta en SEC.
2. ¿Conviene bloquear los mundos hasta completar el anterior? (Hoy: no, para no frenar a quien estudia un tema puntual.)
3. ¿La tolerancia del 2 % es adecuada para todos los ejercicios, o algunos (pH, números de oxidación) deben ser exactos? (Hoy: los que tienen `tol: 0` son exactos.)
4. ¿Hace falta accesibilidad para lectores de pantalla en la herramienta de "unir parejas"?
