# 05 · Verificación

> Cómo se comprueba que la implementación cumple la especificación.

## 1. Pruebas automáticas

```bash
# desde la carpeta QuimicaQuest
node tests/security.test.js
```
Sin dependencias (solo Node ≥ 18). Cubre escape, validación, parser, límites, estado manipulado, prototype pollution, tiempos del resolvedor e integridad del contenido (que toda ecuación tenga solución y que las respuestas de opción múltiple existan).

## 2. Matriz de trazabilidad

| Requisito | Cómo se verifica |
|---|---|
| RF-06 fórmulas por composición | Test manual: escribir `N3Na` en el ejercicio de la azida → correcto |
| RF-07 enteros mínimos | Test manual: `4H2 + 2O2 -> 4H2O` → aviso "dividí por 2" sin contar error |
| RF-08/09 resultados y XP | Test manual: acertar al 2.º intento → botón verde claro y mitad de XP |
| RF-16 persistencia | Recargar la página → el progreso sigue |
| RF-19 masas del curso | Lab → Tabla de masas; `security.test.js` §6 |
| RNF-03 celular | Smoke test a 390 px: `scrollWidth` = 390 |
| RNF-04 sin congelamiento | `security.test.js` §4 |
| RNF-05 sin errores de consola | Smoke test con navegador automatizado |
| SEC-01 escape | `security.test.js` §1 |
| SEC-02 lista blanca | `security.test.js` §2 |
| SEC-03 estado | `security.test.js` §5 + prueba en navegador con `localStorage` manipulado |
| SEC-05 anti-DoS | `security.test.js` §4 + ecuación de 11 sustancias en el lab → error en 0 ms |
| SEC-06 CSP | Consola del navegador sin avisos "Refused to…" durante el uso |
| SEC-10 encabezados | securityheaders.com sobre la URL publicada (A/A+); `/sdd/` y `/tests/` devuelven 404 |

## 3. Checklist manual antes de entregar una versión

- [ ] `node tests/security.test.js` → 0 errores.
- [ ] Abrir `index.html` con doble clic en Chrome y en Firefox.
- [ ] Recorrer un mundo completo: cards → ejercicios → resumen con estrellas.
- [ ] Probar cada herramienta del laboratorio.
- [ ] Jugar un Desafío hasta perder las 3 vidas.
- [ ] Ver en modo celular (F12 → modo dispositivo, 390 px).
- [ ] Cambiar a modo oscuro y revisar contraste.
- [ ] Revisar la consola (F12): sin errores (salvo las fuentes si no hay internet).
- [ ] Si se agregó contenido: los números de los ejercicios nuevos se verificaron con la calculadora del laboratorio.
