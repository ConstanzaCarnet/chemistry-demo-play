/* =========================================================
   chem.js — utilidades químicas: masas, parser de fórmulas,
   formato visual (subíndices), verificación de balanceo.
   ========================================================= */
(function (global) {
  'use strict';

  // Masas atómicas redondeadas como en el material del curso (g/mol)
  const MASAS = {
    H: 1, He: 4, Li: 7, Be: 9, B: 10.8, C: 12, N: 14, O: 16, F: 19, Ne: 20,
    Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, Ar: 40,
    K: 39, Ca: 40, Ti: 48, Cr: 52, Mn: 55, Fe: 56, Co: 59, Ni: 58.7,
    Cu: 63.5, Zn: 65.4, As: 75, Se: 79, Br: 80, Ag: 107.8, Sn: 118.7,
    I: 127, Xe: 131.3, Ba: 137, Ce: 140.12, W: 184, Pt: 195, Au: 197,
    Hg: 200.6, Pb: 207, Bi: 209
  };

  const NOMBRES = {
    H: 'Hidrógeno', He: 'Helio', Li: 'Litio', Be: 'Berilio', B: 'Boro', C: 'Carbono',
    N: 'Nitrógeno', O: 'Oxígeno', F: 'Flúor', Ne: 'Neón', Na: 'Sodio', Mg: 'Magnesio',
    Al: 'Aluminio', Si: 'Silicio', P: 'Fósforo', S: 'Azufre', Cl: 'Cloro', Ar: 'Argón',
    K: 'Potasio', Ca: 'Calcio', Ti: 'Titanio', Cr: 'Cromo', Mn: 'Manganeso', Fe: 'Hierro',
    Co: 'Cobalto', Ni: 'Níquel', Cu: 'Cobre', Zn: 'Cinc', As: 'Arsénico', Se: 'Selenio',
    Br: 'Bromo', Ag: 'Plata', Sn: 'Estaño', I: 'Yodo', Xe: 'Xenón', Ba: 'Bario',
    Ce: 'Cerio', W: 'Tungsteno', Pt: 'Platino', Au: 'Oro', Hg: 'Mercurio', Pb: 'Plomo', Bi: 'Bismuto'
  };

  // Colores para dibujar átomos (modelo de esferas)
  const COLORES = {
    H: '#f4f4f4', O: '#ef4444', N: '#3b82f6', C: '#374151', Cl: '#22c55e',
    S: '#facc15', Na: '#a855f7', Fe: '#f97316', P: '#fb923c', Ag: '#cbd5e1'
  };

  /* ---------- Parser de fórmulas ----------
     Soporta paréntesis/corchetes, hidratos (· o *), cargas (^2-, ^+) que se ignoran. */
  function parseFormula(formula) {
    if (!formula) throw new Error('Fórmula vacía');
    const Lm = (global.Safe && global.Safe.LIMITS) || { formula: 60 };
    if (String(formula).length > Lm.formula) throw new Error('Fórmula demasiado larga (máx. ' + Lm.formula + ' caracteres)');
    let f = String(formula).trim()
      .replace(/\s+/g, '')
      .replace(/\^?\d*[+\-]$/, '')            // quitar carga final
      .replace(/\((s|l|g|ac|aq)\)$/i, '');   // quitar estado
    const partes = f.split(/[·*.]/);
    const total = {};
    partes.forEach((parte, idx) => {
      let mult = 1;
      const m = parte.match(/^(\d+)(.*)$/);
      if (m && idx > 0) { mult = toSub(m[1]); parte = m[2]; }
      const counts = parseGroup(parte);
      for (const el in counts) total[el] = (total[el] || 0) + counts[el] * mult;
    });
    return total;
  }

  // Subíndice validado: entero entre 1 y el límite (evita números absurdos)
  function toSub(txt) {
    const n = parseInt(txt, 10);
    const max = (global.Safe && global.Safe.LIMITS.subscript) || 999;
    if (!(n >= 1 && n <= max)) throw new Error('Subíndice fuera de rango: ' + txt);
    return n;
  }

  function parseGroup(str) {
    const stack = [{}];
    let i = 0;
    while (i < str.length) {
      const ch = str[i];
      if (ch === '(' || ch === '[') { stack.push({}); i++; continue; }
      if (ch === ')' || ch === ']') {
        i++;
        let num = '';
        while (i < str.length && /\d/.test(str[i])) num += str[i++];
        const n = num ? toSub(num) : 1;
        const top = stack.pop();
        if (!stack.length) throw new Error('Paréntesis mal cerrados');
        const dest = stack[stack.length - 1];
        for (const el in top) dest[el] = (dest[el] || 0) + top[el] * n;
        continue;
      }
      if (/[A-Z]/.test(ch)) {
        let el = ch; i++;
        while (i < str.length && /[a-z]/.test(str[i])) el += str[i++];
        let num = '';
        while (i < str.length && /\d/.test(str[i])) num += str[i++];
        if (!Object.prototype.hasOwnProperty.call(MASAS, el)) throw new Error('Elemento desconocido: ' + el);
        const dest = stack[stack.length - 1];
        dest[el] = (dest[el] || 0) + (num ? toSub(num) : 1);
        continue;
      }
      throw new Error('Carácter inesperado: "' + ch + '"');
    }
    if (stack.length !== 1) throw new Error('Paréntesis sin cerrar');
    return stack[0];
  }

  function masaMolar(formula) {
    const c = parseFormula(formula);
    let m = 0;
    for (const el in c) m += MASAS[el] * c[el];
    return Math.round(m * 1000) / 1000;
  }

  function desglose(formula) {
    const c = parseFormula(formula);
    const M = masaMolar(formula);
    return Object.keys(c).map(el => ({
      el, nombre: NOMBRES[el] || el, n: c[el], masa: MASAS[el],
      sub: Math.round(MASAS[el] * c[el] * 1000) / 1000,
      pct: Math.round(MASAS[el] * c[el] / M * 10000) / 100
    }));
  }

  function mismaComposicion(a, b) {
    try {
      const ca = parseFormula(a), cb = parseFormula(b);
      const ka = Object.keys(ca), kb = Object.keys(cb);
      if (ka.length !== kb.length) return false;
      return ka.every(k => ca[k] === cb[k]);
    } catch (e) { return false; }
  }

  /* ---------- Ecuaciones ---------- */
  // "2H2 + O2 -> 2H2O"  => { reactivos:[{coef, formula}], productos:[...] }
  function parseEcuacion(texto) {
    if (global.Safe) { const v = global.Safe.validate('equation', texto); if (!v.ok) throw new Error(v.error); texto = v.value; }
    const t = texto.replace(/→|⟶|=>|<=>|⇄|=/g, '->');
    const lados = t.split('->');
    if (lados.length !== 2) throw new Error('Usá una flecha "->" entre reactivos y productos');
    const lado = s => s.split('+').map(x => x.trim()).filter(Boolean).map(sp => {
      const m = sp.match(/^(\d*)\s*(.+)$/);
      return { coef: m[1] ? parseInt(m[1], 10) : 1, formula: m[2].replace(/\((s|l|g|ac|aq)\)$/i, '') };
    });
    return { reactivos: lado(lados[0]), productos: lado(lados[1]) };
  }

  function contarLado(especies, coefs) {
    const tot = {};
    especies.forEach((f, i) => {
      const c = parseFormula(f);
      for (const el in c) tot[el] = (tot[el] || 0) + c[el] * coefs[i];
    });
    return tot;
  }

  function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
  function gcdList(arr) { return arr.reduce((a, b) => gcd(a, b)); }

  // Revisa balanceo; devuelve {balanceada, simplificada, tabla:[{el, izq, der}]}
  function revisarBalance(reactivos, productos, cR, cP) {
    const izq = contarLado(reactivos, cR);
    const der = contarLado(productos, cP);
    const els = Array.from(new Set(Object.keys(izq).concat(Object.keys(der))));
    const tabla = els.map(el => ({ el, izq: izq[el] || 0, der: der[el] || 0 }));
    const balanceada = tabla.every(r => r.izq === r.der) && cR.concat(cP).every(c => c > 0);
    const g = gcdList(cR.concat(cP));
    return { balanceada, simplificada: g === 1, divisor: g, tabla };
  }

  // Busca los coeficientes mínimos por fuerza bruta (ecuaciones escolares, coef ≤ 15)
  function resolverBalance(reactivos, productos, max) {
    max = max || 15;
    const n0 = reactivos.length + productos.length;
    const Sf = global.Safe;
    if (Sf && n0 > Sf.LIMITS.species) throw new Error('Demasiadas sustancias (máx. ' + Sf.LIMITS.species + ')');
    // Protección anti-congelamiento: bajar el coeficiente máximo si hay muchas sustancias
    if (Sf) while (max > 4 && !Sf.solverBudget(n0, max)) max--;
    const esp = reactivos.map(f => ({ c: parseFormula(f), s: 1 })).concat(productos.map(f => ({ c: parseFormula(f), s: -1 })));
    const els = Array.from(new Set([].concat.apply([], esp.map(e => Object.keys(e.c)))));
    const n = esp.length;
    const coefs = new Array(n).fill(1);
    const suma = new Array(els.length).fill(0);
    function rec(i) {
      if (i === n) return suma.every(v => v === 0) && gcdList(coefs) === 1;
      for (let c = 1; c <= max; c++) {
        coefs[i] = c;
        els.forEach((el, k) => { suma[k] += esp[i].s * (esp[i].c[el] || 0) * c; });
        const ok = rec(i + 1);
        els.forEach((el, k) => { suma[k] -= esp[i].s * (esp[i].c[el] || 0) * c; });
        if (ok) return true;
      }
      return false;
    }
    return rec(0) ? coefs.slice() : null;
  }

  /* ---------- Formato visual ---------- */
  // Escape centralizado en security.js (incluye comillas para atributos)
  function esc(s) {
    if (global.Safe) return global.Safe.escapeHtml(s);
    return String(s).replace(/[&<>"'`]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' })[c]);
  }

  // Formatea una especie/ecuación: subíndices, cargas, flechas
  function chem(texto) {
    let s = esc(texto)
      .replace(/&lt;=&gt;|&lt;-&gt;/g, '⇄')
      .replace(/-&gt;/g, '→');
    // cargas: ^2- ^3+ ^- ^+
    s = s.replace(/\^(\d*[+\-−])/g, '<sup>$1</sup>');
    // subíndices: número que sigue a letra o ) ] — no coeficientes iniciales
    s = s.replace(/([A-Za-z\)\]])(\d+)/g, (m, a, n) => {
      // no tocar estados (ac) (g) etc. ni palabras comunes
      return a + '<sub>' + n + '</sub>';
    });
    // estados de agregación en estilo más chico
    s = s.replace(/\((s|l|g|ac|aq)\)/g, '<span class="estado">($1)</span>');
    s = s.replace(/·/g, '<span class="hidrato">·</span>');
    return '<span class="chem">' + s + '</span>';
  }

  // Mini-markup de textos: {fórmula}, **negrita**, _cursiva_, 10^23, saltos de línea
  function fmt(texto) {
    if (texto == null) return '';
    let out = '';
    const re = /\{([^}]+)\}/g;
    let last = 0, m;
    const plain = t => esc(t)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<em>$1</em>')
      .replace(/10\^(-?\d+)/g, '10<sup>$1</sup>')
      .replace(/\^(-?\d+)/g, '<sup>$1</sup>')
      .replace(/-&gt;/g, '→')
      .replace(/\n/g, '<br>');
    while ((m = re.exec(texto))) {
      out += plain(texto.slice(last, m.index)) + chem(m[1]);
      last = re.lastIndex;
    }
    out += plain(texto.slice(last));
    return out;
  }

  /* ---------- Números ---------- */
  // Acepta "6,02e23", "6.02x10^23", "6,02 × 10^23", "1.2E24", "−3", "75 %"
  function parseNum(txt) {
    if (txt == null) return NaN;
    if (String(txt).length > 40) return NaN;   // entrada absurda: se descarta
    let s = String(txt).trim().toLowerCase()
      .replace(/\s+/g, '')
      .replace(/−/g, '-')
      .replace(/%|g\/mol|g|l|mol|ml|atm|k$/g, '');
    s = s.replace(/(\d),(\d)/g, '$1.$2');
    const sci = s.match(/^([+\-]?\d*\.?\d+)(?:[x×*·]10\^?([+\-]?\d+)|e([+\-]?\d+))$/);
    if (sci) return parseFloat(sci[1]) * Math.pow(10, parseInt(sci[2] || sci[3], 10));
    if (/^10\^([+\-]?\d+)$/.test(s)) return Math.pow(10, parseInt(s.slice(3), 10));
    if (/^[+\-]?\d*\.?\d+$/.test(s)) return parseFloat(s);
    return NaN;
  }

  function aproxIgual(valor, esperado, tolRel) {
    if (isNaN(valor)) return false;
    tolRel = tolRel == null ? 0.02 : tolRel;
    if (esperado === 0) return Math.abs(valor) < 1e-9;
    return Math.abs(valor - esperado) / Math.abs(esperado) <= tolRel;
  }

  // Formatea número estilo argentino: coma decimal, notación científica si es grande
  function numES(x, dec) {
    if (x == null || isNaN(x)) return '—';
    dec = dec == null ? 2 : dec;
    const abs = Math.abs(x);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) {
      const e = Math.floor(Math.log10(abs));
      const mant = x / Math.pow(10, e);
      return mant.toFixed(2).replace('.', ',') + ' × 10<sup>' + e + '</sup>';
    }
    const r = Math.round(x * Math.pow(10, dec)) / Math.pow(10, dec);
    return String(r).replace('.', ',');
  }

  const NA = 6.02e23;
  const VM = 22.4;

  global.Chem = {
    MASAS, NOMBRES, COLORES, NA, VM,
    parseFormula, masaMolar, desglose, mismaComposicion,
    parseEcuacion, revisarBalance, resolverBalance, contarLado, gcdList,
    chem, fmt, esc, parseNum, aproxIgual, numES
  };
})(window);
