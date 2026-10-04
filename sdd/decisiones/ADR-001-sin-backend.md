# ADR-001 · Aplicación sin servidor

- **Estado:** Aceptada · 03/10/2026
- **Requisitos relacionados:** P4, P5, RNF-01, RNF-02

## Contexto
La app la usan alumnos/as de secundaria en computadoras del colegio o en su casa, muchas veces sin poder instalar nada y con internet inestable. No hace falta compartir datos entre usuarios en la v1.

## Decisión
Todo corre en el navegador. No hay servidor, base de datos ni llamadas de red. Se distribuye como una carpeta que se abre con doble clic.

## Alternativas descartadas
- **API + base de datos** (ASP.NET Core / Laravel): permitiría panel docente, pero exige hosting, cuentas, mantenimiento y abre riesgos (inyección SQL, datos de menores).
- **Backend como servicio** (Firebase/Supabase): menos mantenimiento, pero requiere internet y cuentas.

## Consecuencias
- ✅ Cero costo, cero instalación, privacidad total, no existe inyección SQL ni ataques por request.
- ❌ El progreso no se comparte entre dispositivos ni lo ve el docente.
- ➡️ Si se necesita, ver `04-seguridad.md` §4 (opciones A, B y C) y escribir un ADR nuevo.
