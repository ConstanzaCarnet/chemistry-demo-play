# 📐 SDD — Spec-Driven Development de Química Quest

Esta carpeta contiene la **especificación completa** de la app. La idea del *Spec-Driven Development* (Desarrollo Guiado por Especificaciones) es que **la especificación es la fuente de verdad** y el código es una consecuencia de ella. Si mañana querés rehacer Química Quest en React, Blazor (.NET), Flutter o lo que sea, con esta carpeta deberías poder lograrlo **sin mirar el código actual**. Eso es lo que la hace "portátil".

> Nota: "SDD" a veces también significa *Software Design Document*. Esta carpeta cubre las dos cosas: el flujo de Spec-Driven Development (constitución → spec → plan → tareas → verificación) incluye todo lo que tendría un documento de diseño (requisitos, arquitectura, modelo de datos, decisiones).

## 🗂️ Qué hay en cada archivo

| Archivo | Pregunta que responde | Etapa SDD |
|---|---|---|
| [`00-constitucion.md`](00-constitucion.md) | ¿Qué principios NO se negocian nunca? | Constitución |
| [`01-especificacion.md`](01-especificacion.md) | **¿Qué** hace la app y **para quién**? (sin hablar de tecnología) | Specify |
| [`02-plan-tecnico.md`](02-plan-tecnico.md) | **¿Cómo** se construye? Arquitectura, datos, algoritmos | Plan |
| [`03-tareas.md`](03-tareas.md) | ¿En qué pasos se implementa y en qué orden? | Tasks |
| [`04-seguridad.md`](04-seguridad.md) | ¿Qué puede salir mal y cómo se previene? | Plan (transversal) |
| [`05-verificacion.md`](05-verificacion.md) | ¿Cómo comprobamos que cumple la spec? | Verify |
| [`06-despliegue.md`](06-despliegue.md) | ¿Cómo se publica y comparte? | Deploy |
| [`contratos/`](contratos/) | Formato exacto de los datos (JSON Schema) | Plan |
| [`decisiones/`](decisiones/) | Por qué se eligió cada cosa (ADR) | Plan |
| [`plantillas/`](plantillas/) | Plantillas para especificar funcionalidades nuevas | — |

## 🔁 El flujo SDD (cómo se trabaja)

```
 ┌──────────────┐   ┌──────────────┐   ┌─────────────┐   ┌──────────┐   ┌──────────────┐   ┌─────────────┐
 │ Constitución │ → │ Especificar  │ → │  Clarificar │ → │ Planear  │ → │ Desglosar en │ → │ Implementar │
 │ (principios) │   │ (qué/por qué)│   │ (dudas)     │   │ (cómo)   │   │ tareas       │   │ + verificar │
 └──────────────┘   └──────────────┘   └─────────────┘   └──────────┘   └──────────────┘   └─────────────┘
        ▲                                                                                        │
        └──────────────── si algo cambia, se cambia PRIMERO la spec y después el código ─────────┘
```

Reglas de oro:
1. **Primero la spec, después el código.** Una funcionalidad nueva empieza copiando `plantillas/plantilla-funcionalidad.md`.
2. **Todo requisito tiene un ID** (`RF-xx`, `RNF-xx`, `SEC-xx`) y toda tarea y todo test apuntan a un ID. Así hay **trazabilidad**.
3. **Los criterios de aceptación son verificables** (formato *Dado / Cuando / Entonces*). Si no se puede comprobar, no es un requisito, es un deseo.
4. **La spec no nombra tecnologías** (eso va en el plan). "El alumno puede balancear una ecuación" ✅ — "Un componente React con useState" ❌.
5. **Las decisiones importantes se registran** en `decisiones/` con su contexto y alternativas descartadas.

## 🚀 Cómo usar esta carpeta para portar la app

1. Leé la constitución y la spec completas.
2. Elegí tu stack y escribí un **ADR nuevo** (ej.: `ADR-005-portar-a-blazor.md`) explicando la elección.
3. Copiá el plan técnico y reemplazá solo la sección "Mapeo a la implementación actual" por tu stack (en `02-plan-tecnico.md` hay una tabla de equivalencias para React, Blazor y Flutter).
4. Reutilizá **tal cual** los contratos de `contratos/` y el contenido (`js/data.js` cumple `contratos/mundo.schema.json`; es convertible a JSON).
5. Implementá siguiendo `03-tareas.md` y verificá con `05-verificacion.md`.

## 🎓 Ejercicios para aprender SDD con esta app

1. **Leer al revés:** elegí un requisito (por ej. `RF-14`) y encontrá en el código dónde se cumple y qué test lo verifica.
2. **Spec primero:** especificá el "Modo profesor" (ver ejemplo a medio hacer en `plantillas/ejemplo-modo-profesor.md`) y completá las secciones vacías **antes** de escribir código.
3. **Clarificar:** buscá en `01-especificacion.md` la sección "Preguntas abiertas" y proponé respuestas.
4. **ADR:** escribí un ADR decidiendo si agregar un backend para que el profesor vea el progreso de los alumnos. Usá `04-seguridad.md` (sección "Si se agrega un backend").
5. **Romper y verificar:** cambiá un límite de `SEC-04` en el código y corré `node tests/security.test.js` para ver cómo los tests detectan que la implementación ya no cumple la spec.
