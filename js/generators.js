/* =========================================================
   generators.js — ejercicios generados al azar (práctica infinita).
   Cada generador devuelve un ejercicio con el mismo formato de data.js
   ========================================================= */
(function () {
  'use strict';
  const C = window.Chem;
  const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
  const r2 = x => Math.round(x * 100) / 100;
  const r1 = x => Math.round(x * 10) / 10;
  const n = x => C.numES(x, 2);

  const NOMBRE = {
    H2O: 'agua', CO2: 'dióxido de carbono', NH3: 'amoníaco', CH4: 'metano', NaCl: 'cloruro de sodio',
    KCl: 'cloruro de potasio', CaCO3: 'carbonato de calcio', H2SO4: 'ácido sulfúrico', HNO3: 'ácido nítrico',
    NaOH: 'hidróxido de sodio', 'Ca(OH)2': 'hidróxido de calcio', 'Mg(OH)2': 'hidróxido de magnesio',
    Al2O3: 'óxido de aluminio', Fe2O3: 'óxido de hierro (III)', CuSO4: 'sulfato de cobre (II)',
    KMnO4: 'permanganato de potasio', C6H12O6: 'glucosa', Na2CO3: 'carbonato de sodio',
    NaHCO3: 'bicarbonato de sodio', H3PO4: 'ácido fosfórico', 'Al2(SO4)3': 'sulfato de aluminio',
    'Ca3(PO4)2': 'fosfato de calcio', NH4Cl: 'cloruro de amonio', C2H6O: 'etanol', 'Fe(OH)3': 'hidróxido de hierro (III)',
    Na2SO4: 'sulfato de sodio', BaSO4: 'sulfato de bario', AgNO3: 'nitrato de plata', KNO3: 'nitrato de potasio',
    MgO: 'óxido de magnesio', SO2: 'dióxido de azufre', SO3: 'trióxido de azufre', N2O5: 'pentóxido de dinitrógeno',
    HCl: 'cloruro de hidrógeno', CaO: 'óxido de calcio', O2: 'oxígeno', H2: 'hidrógeno', N2: 'nitrógeno',
    Cl2: 'cloro', ZnCl2: 'cloruro de cinc', Zn: 'cinc', Mg: 'magnesio', Na: 'sodio', Fe: 'hierro', Al: 'aluminio',
    AlCl3: 'cloruro de aluminio', KClO3: 'clorato de potasio', C3H8: 'propano', C: 'carbono', NO: 'monóxido de nitrógeno',
    NO2: 'dióxido de nitrógeno', NaNO3: 'nitrato de sodio', AgCl: 'cloruro de plata'
  };
  const nom = f => NOMBRE[f] ? NOMBRE[f] + ' ({' + f + '})' : '{' + f + '}';

  const COMPUESTOS = ['H2O', 'CO2', 'NH3', 'CH4', 'NaCl', 'KCl', 'CaCO3', 'H2SO4', 'HNO3', 'NaOH', 'Ca(OH)2',
    'Mg(OH)2', 'Al2O3', 'Fe2O3', 'CuSO4', 'KMnO4', 'C6H12O6', 'Na2CO3', 'NaHCO3', 'H3PO4', 'Al2(SO4)3',
    'Ca3(PO4)2', 'NH4Cl', 'C2H6O', 'Fe(OH)3', 'Na2SO4', 'BaSO4', 'AgNO3', 'KNO3', 'MgO', 'SO2', 'SO3', 'N2O5', 'CaO'];

  const GASES = ['O2', 'H2', 'N2', 'CO2', 'NH3', 'CH4', 'Cl2', 'SO2', 'NO2', 'C3H8'];

  // Reacciones balanceadas para estequiometría
  const REACCIONES = [
    { r: [[2, 'H2'], [1, 'O2']], p: [[2, 'H2O']] },
    { r: [[1, 'N2'], [3, 'H2']], p: [[2, 'NH3']] },
    { r: [[1, 'CH4'], [2, 'O2']], p: [[1, 'CO2'], [2, 'H2O']] },
    { r: [[2, 'Na'], [2, 'H2O']], p: [[2, 'NaOH'], [1, 'H2']] },
    { r: [[1, 'CaCO3']], p: [[1, 'CaO'], [1, 'CO2']] },
    { r: [[2, 'Mg'], [1, 'O2']], p: [[2, 'MgO']] },
    { r: [[1, 'Zn'], [2, 'HCl']], p: [[1, 'ZnCl2'], [1, 'H2']] },
    { r: [[1, 'C3H8'], [5, 'O2']], p: [[3, 'CO2'], [4, 'H2O']] },
    { r: [[4, 'Fe'], [3, 'O2']], p: [[2, 'Fe2O3']] },
    { r: [[2, 'KClO3']], p: [[2, 'KCl'], [3, 'O2']] },
    { r: [[1, 'HCl'], [1, 'NaOH']], p: [[1, 'NaCl'], [1, 'H2O']] },
    { r: [[2, 'Al'], [3, 'Cl2']], p: [[2, 'AlCl3']] },
    { r: [[2, 'NO'], [1, 'O2']], p: [[2, 'NO2']] },
    { r: [[1, 'AgNO3'], [1, 'NaCl']], p: [[1, 'AgCl'], [1, 'NaNO3']] }
  ];
  const eqTxt = rx => rx.r.map(([c, f]) => (c > 1 ? c : '') + f).join(' + ') + ' -> ' + rx.p.map(([c, f]) => (c > 1 ? c : '') + f).join(' + ');

  const ECUACIONES_BAL = [
    [['H2', 'O2'], ['H2O']], [['N2', 'H2'], ['NH3']], [['CH4', 'O2'], ['CO2', 'H2O']], [['C2H6', 'O2'], ['CO2', 'H2O']],
    [['Na', 'Cl2'], ['NaCl']], [['Mg', 'O2'], ['MgO']], [['Al', 'O2'], ['Al2O3']], [['Fe', 'Cl2'], ['FeCl3']],
    [['KClO3'], ['KCl', 'O2']], [['H2O2'], ['H2O', 'O2']], [['Zn', 'HCl'], ['ZnCl2', 'H2']], [['Al', 'HCl'], ['AlCl3', 'H2']],
    [['NaOH', 'H2SO4'], ['Na2SO4', 'H2O']], [['Ca(OH)2', 'HCl'], ['CaCl2', 'H2O']], [['Fe2O3', 'CO'], ['Fe', 'CO2']],
    [['C6H12O6', 'O2'], ['CO2', 'H2O']], [['P4', 'O2'], ['P4O10']], [['SO2', 'O2'], ['SO3']], [['NH3', 'O2'], ['NO', 'H2O']],
    [['K', 'H2O'], ['KOH', 'H2']], [['BaCl2', 'Na2SO4'], ['BaSO4', 'NaCl']], [['Al(OH)3', 'H2SO4'], ['Al2(SO4)3', 'H2O']],
    [['C4H10', 'O2'], ['CO2', 'H2O']], [['Cu', 'AgNO3'], ['Cu(NO3)2', 'Ag']], [['N2O5', 'H2O'], ['HNO3']], [['Li', 'N2'], ['Li3N']]
  ];

  const OX = [['H2SO4', 'S', 6], ['HNO3', 'N', 5], ['HNO2', 'N', 3], ['KMnO4', 'Mn', 7], ['K2Cr2O7', 'Cr', 6],
    ['HClO', 'Cl', 1], ['HClO3', 'Cl', 5], ['HClO4', 'Cl', 7], ['Fe2O3', 'Fe', 3], ['FeO', 'Fe', 2], ['SO2', 'S', 4],
    ['SO3', 'S', 6], ['H3PO4', 'P', 5], ['CO2', 'C', 4], ['NH3', 'N', -3], ['CaH2', 'H', -1], ['H2O2', 'O', -1],
    ['Cl2O7', 'Cl', 7], ['N2O5', 'N', 5], ['MnO2', 'Mn', 4], ['Na2SO3', 'S', 4], ['CuSO4', 'Cu', 2], ['Al2O3', 'Al', 3],
    ['H2CO3', 'C', 4], ['O2', 'O', 0], ['Cl2O', 'Cl', 1], ['NaClO', 'Cl', 1], ['H2S', 'S', -2], ['PbO2', 'Pb', 4]];

  const TIPOS = [
    ['2H2 + O2 -> 2H2O', 0], ['CaO + H2O -> Ca(OH)2', 0], ['N2 + 3H2 -> 2NH3', 0], ['2Na + Cl2 -> 2NaCl', 0],
    ['2KClO3 -> 2KCl + 3O2', 1], ['2H2O2 -> 2H2O + O2', 1], ['CaCO3 -> CaO + CO2', 1], ['2HgO -> 2Hg + O2', 1],
    ['Mg + 2HCl -> MgCl2 + H2', 2], ['Cu + 2AgNO3 -> Cu(NO3)2 + 2Ag', 2], ['Fe + CuSO4 -> FeSO4 + Cu', 2],
    ['AgNO3 + NaCl -> AgCl + NaNO3', 3], ['BaCl2 + K2SO4 -> BaSO4 + 2KCl', 3], ['Pb(NO3)2 + 2KI -> PbI2 + 2KNO3', 3],
    ['CH4 + 2O2 -> CO2 + 2H2O', 4], ['C2H6O + 3O2 -> 2CO2 + 3H2O', 4], ['2C4H10 + 13O2 -> 8CO2 + 10H2O', 4],
    ['HCl + NaOH -> NaCl + H2O', 5], ['H2SO4 + 2KOH -> K2SO4 + 2H2O', 5], ['HNO3 + NH4OH -> NH4NO3 + H2O', 5]
  ];
  const TIPOS_NOM = ['Síntesis', 'Descomposición', 'Sustitución simple', 'Doble sustitución', 'Combustión', 'Neutralización'];

  const G = {};

  G.masaMolar = () => {
    const f = rnd(COMPUESTOS);
    const d = C.desglose(f);
    return {
      t: 'num', q: `Calculá la masa molar de ${nom(f)}.`, a: C.masaMolar(f), tol: 0.01, unit: 'g/mol',
      steps: [d.map(x => `${x.el}: ${x.n} × ${n(x.masa)} = ${n(x.sub)}`).join(' · '), `Total: **${n(C.masaMolar(f))} g/mol**`]
    };
  };

  G.gramosAMoles = () => {
    const f = rnd(COMPUESTOS);
    const M = C.masaMolar(f);
    const mol = rnd([0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
    const g = r1(mol * M);
    return {
      t: 'num', q: `¿Cuántos moles hay en ${n(g)} g de ${nom(f)}?`, a: g / M, tol: 0.02, unit: 'mol',
      steps: [`Masa molar: ${n(M)} g/mol`, `n = m / M = ${n(g)} g ÷ ${n(M)} g/mol = **${n(g / M)} mol**`]
    };
  };

  G.molesAGramos = () => {
    const f = rnd(COMPUESTOS);
    const M = C.masaMolar(f);
    const mol = rnd([0.1, 0.2, 0.25, 0.5, 0.75, 1.5, 2, 3, 2.5]);
    return {
      t: 'num', q: `¿Cuántos gramos pesan ${n(mol)} moles de ${nom(f)}?`, a: mol * M, tol: 0.02, unit: 'g',
      steps: [`Masa molar: ${n(M)} g/mol`, `m = n × M = ${n(mol)} × ${n(M)} = **${n(mol * M)} g**`]
    };
  };

  G.molesAParticulas = () => {
    const f = rnd(['H2O', 'CO2', 'NH3', 'CH4', 'O2', 'N2', 'H2', 'C6H12O6']);
    const mol = rnd([0.5, 1, 1.5, 2, 3, 5, 0.25]);
    const M = C.masaMolar(f);
    const usarGramos = Math.random() < 0.5;
    const g = r1(mol * M);
    const q = usarGramos
      ? `¿Cuántas moléculas hay en ${n(g)} g de ${nom(f)}? (podés escribir, por ej., 3,01e23)`
      : `¿Cuántas moléculas hay en ${n(mol)} moles de ${nom(f)}? (podés escribir, por ej., 3,01e23)`;
    const steps = usarGramos ? [`n = ${n(g)} ÷ ${n(M)} = ${n(g / M)} mol`] : [];
    steps.push(`N = n × 6,02 × 10^23 = **${C.numES(mol * C.NA)}**`);
    return { t: 'num', q, a: (usarGramos ? g / M : mol) * C.NA, tol: 0.02, unit: 'moléculas', steps };
  };

  G.molesAVolumen = () => {
    const f = rnd(GASES);
    const M = C.masaMolar(f);
    const mol = rnd([0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4]);
    const tipo = rnd(['g->L', 'L->g', 'mol->L']);
    if (tipo === 'g->L') {
      const g = r1(mol * M);
      return { t: 'num', q: `¿Qué volumen ocupan ${n(g)} g de ${nom(f)} en CNPT?`, a: g / M * 22.4, tol: 0.02, unit: 'L',
        steps: [`n = ${n(g)} ÷ ${n(M)} = ${n(g / M)} mol`, `V = n × 22,4 L = **${n(g / M * 22.4)} L**`] };
    }
    if (tipo === 'L->g') {
      const L = r1(mol * 22.4);
      return { t: 'num', q: `¿Cuántos gramos de ${nom(f)} hay en ${n(L)} L medidos en CNPT?`, a: L / 22.4 * M, tol: 0.02, unit: 'g',
        steps: [`n = ${n(L)} ÷ 22,4 = ${n(L / 22.4)} mol`, `m = n × M = ${n(L / 22.4)} × ${n(M)} = **${n(L / 22.4 * M)} g**`] };
    }
    return { t: 'num', q: `¿Qué volumen ocupan ${n(mol)} moles de ${nom(f)} en CNPT?`, a: mol * 22.4, tol: 0.01, unit: 'L',
      steps: [`V = ${n(mol)} × 22,4 L = **${n(mol * 22.4)} L**`] };
  };

  G.estequiometriaMasa = () => {
    const rx = rnd(REACCIONES);
    const todos = rx.r.concat(rx.p);
    const A = rnd(rx.r);
    let B; do { B = rnd(todos); } while (B[1] === A[1]);
    const MA = C.masaMolar(A[1]), MB = C.masaMolar(B[1]);
    const molA = rnd([0.5, 1, 1.5, 2, 3, 4]);
    const gA = r1(molA * MA);
    const nA = gA / MA, nB = nA * B[0] / A[0], gB = nB * MB;
    const esReactivo = rx.r.some(x => x[1] === B[1]);
    return {
      t: 'num', q: `{${eqTxt(rx)}}\n¿Cuántos gramos de ${nom(B[1])} ${esReactivo ? 'reaccionan' : 'se forman'} con ${n(gA)} g de ${nom(A[1])}?`,
      a: gB, tol: 0.02, unit: 'g',
      steps: [`Etapa 1: ${n(gA)} g ÷ ${n(MA)} g/mol = ${n(nA)} mol de ${A[1]}`,
        `Etapa 2: ${n(nA)} × ${B[0]}/${A[0]} = ${n(nB)} mol de ${B[1]}`,
        `Etapa 3: ${n(nB)} × ${n(MB)} g/mol = **${n(gB)} g**`]
    };
  };

  G.limitanteGen = () => {
    const opciones = REACCIONES.filter(x => x.r.length === 2);
    const rx = rnd(opciones);
    const [[ca, A], [cb, B]] = rx.r;
    const MA = C.masaMolar(A), MB = C.masaMolar(B);
    let nA, nB;
    do { nA = rnd([0.5, 1, 1.5, 2, 2.5, 3, 4]) * ca / 2 + rnd([0, 0.25, 0.5]); nB = rnd([0.5, 1, 1.5, 2, 2.5, 3, 4]) * cb / 2 + rnd([0, 0.25, 0.5]); }
    while (Math.abs(nA / ca - nB / cb) < 0.05 || nA <= 0 || nB <= 0);
    const gA = r1(nA * MA), gB = r1(nB * MB);
    nA = gA / MA; nB = gB / MB;
    const lim = nA / ca < nB / cb ? 0 : 1;
    const ext = Math.min(nA / ca, nB / cb);
    const [cp, P] = rx.p[0];
    const gP = ext * cp * C.masaMolar(P);
    const exc = lim === 0 ? nB - ext * cb : nA - ext * ca;
    const excF = lim === 0 ? B : A;
    const steps = [`${A}: ${n(gA)} g ÷ ${n(MA)} = ${n(nA)} mol → ÷ ${ca} = ${n(nA / ca)}`,
      `${B}: ${n(gB)} g ÷ ${n(MB)} = ${n(nB)} mol → ÷ ${cb} = ${n(nB / cb)}`,
      `El menor es el de **${lim === 0 ? A : B}** → reactivo limitante`,
      `${P}: ${n(ext)} × ${cp} = ${n(ext * cp)} mol × ${n(C.masaMolar(P))} g/mol = **${n(gP)} g**`,
      `Sobran ${n(exc)} mol de ${excF}`];
    if (Math.random() < 0.4) {
      return { t: 'mc', q: `{${eqTxt(rx)}}\nSe mezclan ${n(gA)} g de ${nom(A)} con ${n(gB)} g de ${nom(B)}. ¿Cuál es el reactivo limitante?`,
        op: ['{' + A + '}', '{' + B + '}'], a: lim, steps };
    }
    return {
      t: 'multi', q: `{${eqTxt(rx)}}\nSe mezclan ${n(gA)} g de ${nom(A)} con ${n(gB)} g de ${nom(B)}.`,
      fields: [{ l: `Gramos de {${P}} que se forman`, a: gP, tol: 0.03, unit: 'g' },
        { l: `Moles de {${excF}} que sobran (reactivo en exceso)`, a: exc, tol: 0.05, unit: 'mol' }],
      steps
    };
  };

  G.rendimientoGen = () => {
    const rx = rnd(REACCIONES.filter(x => x.p.length));
    const [ca, A] = rnd(rx.r); const [cp, P] = rx.p[0];
    const MA = C.masaMolar(A), MP = C.masaMolar(P);
    const gA = r1(rnd([1, 1.5, 2, 3, 4]) * MA);
    const teo = gA / MA * cp / ca * MP;
    const pct = rnd([62, 70, 75, 80, 85, 88, 90, 94]);
    const real = r1(teo * pct / 100);
    return {
      t: 'num', q: `{${eqTxt(rx)}}\nA partir de ${n(gA)} g de ${nom(A)} (y exceso del resto) se obtuvieron ${n(real)} g de ${nom(P)}. ¿Cuál es el rendimiento porcentual?`,
      a: real / teo * 100, tol: 0.015, unit: '%',
      steps: [`Teórico: ${n(gA)} ÷ ${n(MA)} × ${cp}/${ca} × ${n(MP)} = ${n(teo)} g`, `Rendimiento = ${n(real)} / ${n(teo)} × 100 = **${n(real / teo * 100)} %**`]
    };
  };

  G.molaridadGen = () => {
    const f = rnd(['NaCl', 'NaOH', 'KCl', 'HCl', 'H2SO4', 'KNO3', 'C6H12O6']);
    const M = C.masaMolar(f);
    const V = rnd([100, 200, 250, 500, 750, 1000, 1500]);
    const c = rnd([0.1, 0.2, 0.25, 0.5, 1, 1.5, 2]);
    const tipo = rnd(['c', 'mol', 'g']);
    const mol = c * V / 1000;
    if (tipo === 'c') return { t: 'num', q: `Se disuelven ${n(mol)} mol de ${nom(f)} hasta ${V} mL de solución. ¿Cuál es la molaridad?`, a: c, tol: 0.01, unit: 'M',
      steps: [`V = ${V} mL = ${n(V / 1000)} L`, `c = ${n(mol)} ÷ ${n(V / 1000)} = **${n(c)} M**`] };
    if (tipo === 'mol') return { t: 'num', q: `¿Cuántos moles de ${nom(f)} hay en ${V} mL de solución ${n(c)} M?`, a: mol, tol: 0.01, unit: 'mol',
      steps: [`n = c × V = ${n(c)} × ${n(V / 1000)} L = **${n(mol)} mol**`] };
    return { t: 'num', q: `¿Cuántos gramos de ${nom(f)} se necesitan para preparar ${V} mL de solución ${n(c)} M?`, a: mol * M, tol: 0.02, unit: 'g',
      steps: [`n = ${n(c)} × ${n(V / 1000)} = ${n(mol)} mol`, `m = ${n(mol)} × ${n(M)} = **${n(mol * M)} g**`] };
  };

  G.composicionGen = () => {
    const f = rnd(COMPUESTOS);
    const d = C.desglose(f);
    const e = rnd(d);
    const M = C.masaMolar(f);
    return {
      t: 'num', q: `¿Qué porcentaje en masa de ${C.NOMBRES[e.el].toLowerCase()} (${e.el}) tiene ${nom(f)}?`, a: e.pct, tol: 0.01, unit: '%',
      steps: [`Masa molar: ${n(M)} g/mol`, `Masa de ${e.el}: ${e.n} × ${n(e.masa)} = ${n(e.sub)} g`, `% = ${n(e.sub)} / ${n(M)} × 100 = **${n(e.pct)} %**`]
    };
  };

  G.oxGen = () => {
    const [f, el, v] = rnd(OX);
    return { t: 'num', q: `¿Cuál es el número de oxidación del **${el}** en {${f}}? (escribí el signo si es negativo)`, a: v, tol: 0,
      exp: `El ${el} actúa con ${v > 0 ? '+' + v : v}. Recordá: la suma de los números de oxidación da 0 (H = +1, O = −2, metales alcalinos = +1…).` };
  };

  G.balanceGen = () => { const [r, p] = rnd(ECUACIONES_BAL); return { t: 'bal', r, p }; };

  G.tipoGen = () => {
    const [eq, t] = rnd(TIPOS);
    return { t: 'mc', q: `¿Qué tipo de reacción es {${eq}}?`, op: TIPOS_NOM.slice(), a: t,
      exp: ['A + B → C', 'A → B + C', 'A + BC → AC + B', 'AB + CD → AD + CB', 'combustible + O₂ → CO₂ + H₂O', 'ácido + base → sal + agua'][t] };
  };

  G.phGen = () => {
    const tipo = rnd(['calc', 'clasif', 'veces']);
    if (tipo === 'calc') {
      const p = 1 + Math.floor(Math.random() * 13);
      return { t: 'num', q: `Si [{H3O^+}] = 10^-${p} M, ¿cuál es el pH?`, a: p, tol: 0, exp: `pH = −log(10⁻${p}) = ${p} → ${p < 7 ? 'ácido' : p === 7 ? 'neutro' : 'básico'}` };
    }
    if (tipo === 'veces') {
      const a = 1 + Math.floor(Math.random() * 6), b = a + 1 + Math.floor(Math.random() * 3);
      return { t: 'num', q: `¿Cuántas veces más ácida es una solución de pH ${a} que una de pH ${b}?`, a: Math.pow(10, b - a), tol: 0, unit: 'veces',
        exp: `Diferencia de ${b - a} unidades → 10^${b - a} = ${Math.pow(10, b - a)} veces.` };
    }
    const p = rnd([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    return { t: 'mc', q: `Una solución tiene pH = ${p}. Es…`, op: ['Ácida', 'Neutra', 'Básica'], a: p < 7 ? 0 : p === 7 ? 1 : 2 };
  };

  window.GEN = G;
  window.GEN_DATA = { COMPUESTOS, REACCIONES, ECUACIONES_BAL, eqTxt, NOMBRE };
})();
