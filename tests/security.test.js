/* =========================================================
   Tests de seguridad y validación — sin dependencias.
   Ejecutar desde la carpeta del proyecto:   node tests/security.test.js
   ========================================================= */
'use strict';
global.window = global;
require('../js/security.js');
require('../js/chem.js');
require('../js/data.js');
require('../js/generators.js');

const { Safe, Chem } = global;
let pass = 0, fail = 0;
function test(nombre, fn) {
  try { fn(); pass++; console.log('  ✔', nombre); }
  catch (e) { fail++; console.log('  ✘', nombre, '→', e.message); }
}
const assert = (c, msg) => { if (!c) throw new Error(msg || 'falló la condición'); };
const throws = (fn, msg) => { let ok = false; try { fn(); } catch (e) { ok = true; } assert(ok, msg || 'se esperaba un error'); };

const XSS = [
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "' onmouseover='alert(1)",
  '`${alert(1)}`',
  '<svg/onload=alert(1)>',
  'javascript:alert(1)'
];
const SQLI = ["' OR '1'='1", "1; DROP TABLE alumnos;--", "admin'--", "1 UNION SELECT * FROM users"];

console.log('\n1) Escape de HTML');
test('escapeHtml neutraliza < > " \' ` &', () => {
  const out = Safe.escapeHtml('<a href="x" title=\'y\'>`&`</a>');
  assert(!/[<>"'`]/.test(out), out);
});
XSS.forEach(p => test('payload XSS escapado: ' + p.slice(0, 25), () => {
  const out = Safe.escapeHtml(p);
  assert(!out.includes('<') && !out.includes('"') && !out.includes("'"), out);
}));
test('Chem.chem() escapa la entrada antes de formatear', () => {
  const out = Chem.chem('<img src=x onerror=alert(1)>');
  assert(!out.includes('<img'), out);
});
test('Chem.fmt() escapa el texto plano y las fórmulas', () => {
  const out = Chem.fmt('hola <b onclick=x> {<script>}');
  assert(!out.includes('<b onclick') && !out.includes('<script'), out);
});

console.log('\n2) Validación por lista blanca');
// Defensa en capas: lo que pasa el filtro de caracteres igual lo rechaza el parser químico
XSS.concat(SQLI).forEach(p => test('fórmula rechaza: ' + p.slice(0, 25), () => {
  const v = Safe.validate('formula', p);
  let parserOk = true; try { Chem.parseFormula(v.value); } catch (e) { parserOk = false; }
  assert(!v.ok || !parserOk);
}));
test('fórmula válida aceptada: Ca(OH)2', () => assert(Safe.validate('formula', 'Ca(OH)2').ok));
test('fórmula válida aceptada: CuSO4·5H2O', () => assert(Safe.validate('formula', 'CuSO4·5H2O').ok));
test('ecuación válida aceptada', () => assert(Safe.validate('equation', 'CH4 + 2O2 -> CO2 + 2H2O').ok));
test('ecuación con flecha doble aceptada', () => assert(Safe.validate('equation', 'N2 + 3H2 <=> 2NH3').ok));
test('ecuación con < o > sueltos rechazada', () => assert(!Safe.validate('equation', 'H2 <b> -> H2').ok));
test('rechaza entradas vacías', () => assert(!Safe.validate('formula', '   ').ok));
test('rechaza entradas demasiado largas', () => assert(!Safe.validate('formula', 'H2O'.repeat(40)).ok));
test('cleanText quita caracteres de control e invisibles', () => {
  assert(Safe.cleanText('Ana\u0000\u200B\u202E') === 'Ana');
});

console.log('\n3) Parser de fórmulas y números');
test('elemento inexistente da error', () => throws(() => Chem.parseFormula('Xx2')));
test('no acepta claves de prototipo', () => throws(() => Chem.parseFormula('Constructor')));
test('subíndice absurdo da error', () => throws(() => Chem.parseFormula('H99999999')));
test('paréntesis sin cerrar da error', () => throws(() => Chem.parseFormula('Ca(OH2')));
test('parseNum ignora texto basura', () => assert(isNaN(Chem.parseNum("1; DROP TABLE x"))));
test('parseNum ignora entradas larguísimas', () => assert(isNaN(Chem.parseNum('1'.repeat(500)))));
test('parseNum acepta notación científica', () => assert(Math.abs(Chem.parseNum('6,02x10^23') - 6.02e23) < 1e18));

console.log('\n4) Protección contra congelamiento (DoS local)');
test('más de 6 sustancias → error inmediato', () => {
  throws(() => Chem.resolverBalance(['H2', 'O2', 'N2', 'C'], ['H2O', 'NO2', 'CO2']));
});
test('6 sustancias se resuelven en < 3 s', () => {
  const t = Date.now();
  Chem.resolverBalance(['Al(OH)3', 'H2SO4'], ['Al2(SO4)3', 'H2O']);
  Chem.resolverBalance(['KMnO4', 'HCl'], ['KCl', 'MnCl2', 'H2O', 'Cl2']);
  assert(Date.now() - t < 3000, 'tardó ' + (Date.now() - t) + ' ms');
});
test('ecuación con caracteres peligrosos se rechaza al parsear', () => throws(() => Chem.parseEcuacion('<img> -> H2')));

console.log('\n5) Estado guardado (localStorage) manipulado');
const ctx = { worlds: global.MUNDOS, badges: ['primer', 'rayo'], labs: ['balance', 'ph'] };
test('JSON basura → estado por defecto', () => {
  const s = Safe.sanitizeState('no soy un objeto', ctx);
  assert(s.xp === 0 && s.name === '' && Array.isArray(s.badges));
});
test('números con HTML se convierten a números', () => {
  const s = Safe.sanitizeState({ xp: '<img src=x onerror=alert(1)>', stats: { bestChallenge: '<script>' } }, ctx);
  assert(s.xp === 0 && s.stats.bestChallenge === 0);
});
test('nombre larguísimo se recorta', () => {
  assert(Safe.sanitizeState({ name: 'a'.repeat(1000) }, ctx).name.length <= Safe.LIMITS.name);
});
test('logros desconocidos se descartan', () => {
  assert(Safe.sanitizeState({ badges: ['primer', '<x>', 'hack'] }, ctx).badges.join() === 'primer');
});
test('mundos y resultados desconocidos se descartan', () => {
  const s = Safe.sanitizeState({ worlds: { hack: { seen: [1] }, mol: { seen: [0, 999, 'x'], ex: { 0: 'ok', 1: '<b>', 999: 'ok', __proto__: 'ok' } } } }, ctx);
  assert(!s.worlds.hack && s.worlds.mol.seen.join() === '0' && Object.keys(s.worlds.mol.ex).join() === '0');
});
test('tema inválido vuelve a automático', () => assert(Safe.sanitizeState({ theme: 'x" onload="' }, ctx).theme === ''));
test('no hay contaminación de prototipo', () => {
  Safe.sanitizeState(JSON.parse('{"__proto__": {"pwn": 1}, "stats": {"__proto__": {"pwn": 1}}}'), ctx);
  assert(({}).pwn === undefined);
});

console.log('\n6) Integridad del contenido');
test('todas las ecuaciones de ejercicios tienen solución', () => {
  global.MUNDOS.forEach(m => m.ejercicios.forEach((e, i) => {
    if (e.t === 'bal') assert(Chem.resolverBalance(e.r, e.p), m.id + '#' + (i + 1));
  }));
});
test('respuestas de opción múltiple dentro de rango', () => {
  global.MUNDOS.forEach(m => m.ejercicios.forEach((e, i) => {
    if (e.t === 'mc') assert(e.a >= 0 && e.a < e.op.length, m.id + '#' + (i + 1));
  }));
});

console.log(`\nResultado: ${pass} OK, ${fail} con error\n`);
process.exit(fail ? 1 : 0);
