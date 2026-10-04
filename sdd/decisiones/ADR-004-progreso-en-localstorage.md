# ADR-004 · Progreso en localStorage, sanitizado al cargar

- **Estado:** Aceptada · 03/10/2026
- **Requisitos relacionados:** RF-16, P5, SEC-03

## Contexto
Sin servidor (ADR-001), el progreso debe guardarse en el navegador. `localStorage` es editable por el usuario o por extensiones: es una **entrada no confiable**. La auditoría encontró que un valor manipulado podía ejecutar JavaScript (hallazgo H1).

## Decisión
Guardar todo en una sola clave (`quimica-quest-v1`). Al cargar, **reconstruir** el estado con `Safe.sanitizeState`, campo por campo, contra lo definido en `contratos/estado.schema.json`: claves desconocidas, tipos incorrectos y valores fuera de rango se descartan.

## Alternativas descartadas
- `IndexedDB`: más capacidad, más complejidad; no hace falta.
- Confiar en el JSON leído: vulnerable (H1).
- Firmar el estado con una clave: inútil, la clave estaría en el mismo código del cliente.

## Consecuencias
- ✅ Un estado manipulado nunca rompe la app ni ejecuta código.
- ❌ El alumno puede "hacerse trampa" editando su XP (aceptable: no hay ranking compartido).
- ➡️ Si se cambia la estructura del estado, subir la versión de la clave (`-v2`) y migrar.
