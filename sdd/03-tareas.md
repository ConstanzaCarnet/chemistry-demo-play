# 03 · Tareas de implementación

> Desglose del plan en pasos chicos, ordenados por dependencia. Cada tarea apunta a los requisitos que cumple. `[P]` = se puede hacer en paralelo con la anterior.

## Fase 0 — Cimientos
- [x] **T-01** Estructura de carpetas, `index.html`, carga de scripts en orden. → RNF-01
- [x] **T-02** Módulo de seguridad: `escapeHtml`, `cleanText`, `validate`, límites. → SEC-01, SEC-02, SEC-04
- [x] **T-03** Tests de seguridad sin dependencias (`tests/security.test.js`). → RNF-07

## Fase 1 — Dominio químico (testeable sin interfaz)
- [x] **T-04** Tabla de masas atómicas del curso y nombres. → RF-19
- [x] **T-05** Parser de fórmulas con paréntesis e hidratos + límites. → RF-06, SEC-04, SEC-08
- [x] **T-06** Masa molar, desglose y composición centesimal. → HU-05
- [x] **T-07** Verificación de balanceo y MCD. → RF-07
- [x] **T-08** Resolvedor por fuerza bruta con presupuesto. → HU-03, SEC-05, RNF-04
- [x] **T-09** `parseNum` (coma, notación científica, unidades) y comparación con tolerancia. → HU-02
- [x] **T-10** Formato visual (subíndices, cargas, estados, flechas) con escape previo. → RF-03, SEC-01

## Fase 2 — Contenido
- [x] **T-11** Escribir cards de los 10 mundos a partir de los PDFs. → RF-01, RF-02, P2
- [x] **T-12** [P] Cargar ejercicios de los PDFs + ejercicios propios; verificar respuestas con script. → P3
- [x] **T-13** [P] Fichas de repaso (37 conceptos). → HU-07
- [x] **T-14** Generadores aleatorios (13). → HU-04

## Fase 3 — Motor del juego
- [x] **T-15** Estado + persistencia con `sanitizeState`. → RF-16, SEC-03
- [x] **T-16** Router por hash y vistas base. → §2 del plan
- [x] **T-17** Vista de cards con pasos revelables y navegación por teclado. → HU-01
- [x] **T-18** Motor de ejercicios: 7 tipos, reintento, pista, solución, explicación. → RF-04, RF-05, RF-08
- [x] **T-19** XP, niveles, estrellas, progreso, racha. → RF-09 a RF-12, RF-14
- [x] **T-20** Logros y avisos. → RF-13
- [x] **T-21** [P] Sonido y confeti. → RF-17

## Fase 4 — Modos y laboratorio
- [x] **T-22** Práctica extra. → HU-04
- [x] **T-23** Desafío relámpago con vidas y temporizador. → RF-15
- [x] **T-24** Fichas giratorias. → HU-07
- [x] **T-25** Laboratorio: balanceador, masa molar + conversor, pH, reactor, tabla. → HU-05, RF-18
- [x] **T-26** Pantalla de logros, estadísticas y borrado con doble confirmación. → HU-08

## Fase 5 — Calidad
- [x] **T-27** Estilos responsive + modo oscuro. → RNF-03, P7
- [x] **T-28** Content-Security-Policy y auditoría de entradas. → SEC-06, SEC-07
- [x] **T-29** Smoke test con navegador automatizado (todas las vistas, escritorio y celular). → RNF-03, RNF-05
- [x] **T-30** README y carpeta SDD. → P8

## Fase 6 — Publicación
- [x] **T-36** `vercel.json` con encabezados de seguridad y `.vercelignore`; prueba con servidor que imita los encabezados. → SEC-10, ADR-005
- [ ] **T-37** Crear repositorio, importar en Vercel y verificar en securityheaders.com. → `06-despliegue.md`

## Backlog (próximas versiones — especificar primero con la plantilla)
- [ ] **T-31** Modo profesor (ver `plantillas/ejemplo-modo-profesor.md`).
- [ ] **T-32** Exportar/importar progreso en archivo (ver `04-seguridad.md` §4 opción A).
- [ ] **T-33** Pasar `data.js` a archivos JSON validados contra los schemas en un test.
- [ ] **T-34** Accesibilidad de "unir parejas" para lector de pantalla (pregunta abierta 4).
- [ ] **T-35** Funcionar como PWA instalable (manifest + service worker; requiere servirse por http).
