# ADR-003 · Masas atómicas del curso y tolerancia del 2 %

- **Estado:** Aceptada · 03/10/2026
- **Requisitos relacionados:** P2, P3, RF-19, HU-02

## Contexto
El material usa masas redondeadas (Cl = 35,5; Na = 23; Ag = 107,8) y redondea resultados intermedios (0,59 mol, 0,19 mol). Un alumno que sigue el método correcto puede llegar a 79,5 g o a 80,1 g según cuándo redondea.

## Decisión
1. Usar las masas del curso (tabla en `chem.js` y en Laboratorio → Tabla).
2. Comparar respuestas numéricas por **error relativo**, con 2 % por defecto. Valores enteros conceptuales (pH, números de oxidación, conteos) usan `tol: 0`.

## Alternativas descartadas
- Masas IUPAC con 4 decimales: no coinciden con lo que el alumno usa en clase.
- Exigir el valor exacto: castiga redondeos válidos.
- Error absoluto: no sirve para valores como 6 × 10²³.

## Consecuencias
- ✅ Resultados coherentes con el material.
- ❌ Un error grosero de menos del 2 % se aceptaría (poco probable en los ejercicios del curso).
