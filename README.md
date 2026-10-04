# ⚗️ Química Quest

Juego/libro interactivo para estudiar **Reacciones químicas (Unidad 2)** y **Estequiometría (Unidad 4)** de 6° año, armado a partir del material del curso y del capítulo 6 del libro ("Las reacciones y los cálculos en Química").

## Cómo abrirlo
No necesita instalación ni servidor: hacé doble clic en `index.html` y se abre en el navegador.
(Opcional, para compartirlo en la red local: `npx serve .` o la extensión Live Server de VS Code.)

El progreso (XP, logros, ejercicios resueltos) se guarda en el navegador (localStorage).

## Qué tiene
- **10 mundos** con cards de teoría (ejemplos, “paso a paso” que se revela de a uno, tips y curiosidades):
  1. ¿Qué es una reacción química? · 2. Tipos de reacciones y energía · 3. Balanceo · 4. Ácidos, bases y pH ·
  5. Números de oxidación y nomenclatura · 6. El mol y la masa molar · 7. Estequiometría (masas y volúmenes) ·
  8. Reactivo limitante · 9. Rendimiento y soluciones · 10. Composición centesimal y fórmulas
- **~130 ejercicios fijos** con verificación automática: opción múltiple, V/F, cálculos (con tolerancia de redondeo y notación científica), cálculos en partes, escribir fórmulas, balancear ecuaciones y unir con flechas. Cada uno tiene pista, solución y resolución paso a paso.
- **Práctica infinita**: ejercicios generados al azar (masa molar, moles, partículas, volumen, estequiometría, limitante, rendimiento, molaridad, composición, números de oxidación, balanceo, tipos, pH).
- **Laboratorio**: balanceador con balanza animada (incluso con tus propias ecuaciones), calculadora de masa molar + conversor g ⇄ mol ⇄ partículas ⇄ litros, indicador de repollo morado (pH), reactor de reactivo limitante con moléculas dibujadas y tabla de masas atómicas.
- **Desafío relámpago** (3 vidas, 45 s por pregunta), **fichas de repaso** que se dan vuelta, XP, niveles, rachas y logros.

## Estructura
```
index.html
css/styles.css
js/security.js    → escape de HTML, validación de entradas, sanitización del progreso guardado
js/chem.js        → parser de fórmulas, masas atómicas, balanceo, formato (subíndices)
js/data.js        → contenido: mundos, cards, ejercicios y fichas  ← para agregar contenido
js/generators.js  → ejercicios aleatorios
js/labs.js        → herramientas del laboratorio
js/app.js         → motor del juego (rutas, XP, logros, ejercicios)
tests/            → tests de seguridad e integridad (node tests/security.test.js)
sdd/              → especificación completa (Spec-Driven Development) para portar o extender la app
```

## Seguridad
La app no tiene servidor ni base de datos, así que **no hay inyección SQL ni ataques por request posibles**. Los riesgos reales (XSS, progreso guardado manipulado, entradas que congelan la pestaña) están controlados: escape de todo lo que va al HTML, validación por lista blanca, límites de tamaño, reconstrucción del estado guardado y Content-Security-Policy. Detalle, hallazgos de la auditoría y opciones para cuando haya un backend: [`sdd/04-seguridad.md`](sdd/04-seguridad.md).

```bash
node tests/security.test.js   # 46 casos, sin dependencias
```

## Publicar en Vercel
Ya está configurado (`vercel.json` con encabezados de seguridad y `.vercelignore`). Pasos y verificación: [`sdd/06-despliegue.md`](sdd/06-despliegue.md). Resumen: subir a GitHub → Vercel → *Add New Project* → Framework **Other**, sin build → Deploy.

## SDD
La carpeta [`sdd/`](sdd/README.md) tiene la constitución, la especificación (historias, requisitos con ID y criterios de aceptación), el plan técnico, las tareas, la verificación, contratos JSON Schema, decisiones (ADR) y plantillas para especificar funcionalidades nuevas.

## Agregar ejercicios
En `js/data.js`, dentro de `ejercicios` de cada mundo. Mini-markup: `{H2SO4}` se dibuja como fórmula, `**negrita**`, `10^23`.
```js
{ t: 'num', q: '¿Masa molar del {CO2}?', a: 44, tol: 0.01, unit: 'g/mol', steps: ['12 + 2 × 16 = 44'] }
{ t: 'bal', r: ['Fe', 'O2'], p: ['Fe2O3'] }               // la solución se calcula sola
{ t: 'formula', q: 'Fórmula del óxido férrico', a: 'Fe2O3' }
{ t: 'mc', q: '...', op: ['A', 'B', 'C'], a: 1, exp: 'explicación' }
```

> Nota: en el ejemplo resuelto del Bi₂O₃ (libro, pág. 102) la masa molar usada (256,98 g/mol) es incorrecta; la app usa 466 g/mol y lo aclara en la card.
