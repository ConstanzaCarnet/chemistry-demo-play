/* =========================================================
   security.js — sanitización y validación de entradas.
   La app es 100 % del lado del cliente (sin servidor, sin SQL,
   sin requests de red), así que los riesgos reales son:
     1. XSS: texto del usuario o de localStorage insertado como HTML.
     2. Datos corruptos/manipulados en localStorage.
     3. DoS local: entradas que disparan cálculos enormes.
   Todo dato externo pasa por acá ANTES de usarse.
   ========================================================= */
(function (global) {
  'use strict';

  const LIMITS = {
    name: 18,          // nombre del jugador
    formula: 60,       // fórmula química
    equation: 160,     // ecuación completa
    number: 40,        // respuesta numérica
    species: 6,        // sustancias máximas en una ecuación del balanceador
    subscript: 999,    // subíndice máximo aceptado
    solverOps: 3e6     // combinaciones máximas que puede probar el resolvedor
  };

  // Lista blanca de caracteres permitidos por tipo de entrada
  const PATTERNS = {
    formula: /^[A-Za-z0-9()[\]·*.₀-₉+\-^ ]+$/,
    equation: /^[A-Za-z0-9()[\]·*.₀-₉+\-^ →⇄]+$/,   // las flechas -> => <=> se quitan antes de validar
    number: /^[0-9.,+\-−eE×x*^ %a-zA-Z/]+$/
  };

  const HTML_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' };

  /** Escapa texto para insertarlo en HTML (contenido o atributos). */
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"'`]/g, c => HTML_ESC[c]);
  }

  /** Quita caracteres de control/invisibles, normaliza y recorta. */
  function cleanText(s, max) {
    return String(s == null ? '' : s)
      .normalize('NFC')
      .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/g, '')
      .trim()
      .slice(0, max || 200);
  }

  /** Valida contra lista blanca + largo. Devuelve {ok, value, error}. */
  function validate(tipo, raw) {
    const max = LIMITS[tipo] || 200;
    const value = cleanText(raw, max + 1);
    if (!value) return { ok: false, value: '', error: 'El campo está vacío.' };
    if (value.length > max) return { ok: false, value: value.slice(0, max), error: `Máximo ${max} caracteres.` };
    const re = PATTERNS[tipo];
    // En ecuaciones, < y > solo se permiten formando flechas (->, =>, <=>); sueltos se rechazan
    const probe = tipo === 'equation' ? value.replace(/<=>|->|=>/g, '→') : value;
    if (re && !re.test(probe)) return { ok: false, value, error: 'Hay caracteres no permitidos. Usá solo letras, números, paréntesis, + y la flecha ->.' };
    return { ok: true, value, error: null };
  }

  /* ---------- helpers de tipos para el estado guardado ---------- */
  const int = (v, min, max, def) => { const n = Math.floor(Number(v)); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; };
  const bool = (v, def) => typeof v === 'boolean' ? v : def;
  const oneOf = (v, list, def) => list.includes(v) ? v : def;

  /**
   * Reconstruye el estado guardado campo por campo (nunca se confía en el JSON tal cual).
   * Solo sobreviven claves conocidas con tipos y rangos válidos.
   * @param {any} raw      objeto leído de localStorage (puede ser cualquier cosa)
   * @param {object} ctx   { worlds:[{id, cards, ejercicios}], badges:[ids], labs:[ids] }
   */
  function sanitizeState(raw, ctx) {
    const r = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
    const st = (r.stats && typeof r.stats === 'object') ? r.stats : {};
    const out = {
      name: cleanText(r.name, LIMITS.name),
      xp: int(r.xp, 0, 1e7, 0),
      worlds: {},
      badges: Array.isArray(r.badges) ? Array.from(new Set(r.badges.filter(b => ctx.badges.includes(b)))) : [],
      stats: {
        correct: int(st.correct, 0, 1e7, 0), wrong: int(st.wrong, 0, 1e7, 0), balances: int(st.balances, 0, 1e7, 0),
        streak: int(st.streak, 0, 1e7, 0), streakMax: int(st.streakMax, 0, 1e7, 0), bestChallenge: int(st.bestChallenge, 0, 1e5, 0),
        practice: int(st.practice, 0, 1e7, 0), flips: int(st.flips, 0, 1e7, 0),
        labs: Array.isArray(st.labs) ? Array.from(new Set(st.labs.filter(l => ctx.labs.includes(l)))) : []
      },
      sound: bool(r.sound, true),
      theme: oneOf(r.theme, ['', 'light', 'dark'], '')
    };
    const ws = (r.worlds && typeof r.worlds === 'object') ? r.worlds : {};
    ctx.worlds.forEach(m => {
      const w = ws[m.id];
      if (!w || typeof w !== 'object') return;
      const idxOk = (x, len) => Number.isInteger(x) && x >= 0 && x < len;   // sin “recortar”: fuera de rango = descartado
      const seen = Array.isArray(w.seen) ? Array.from(new Set(w.seen.filter(x => idxOk(x, m.cards.length)))) : [];
      const ex = {};
      if (w.ex && typeof w.ex === 'object') {
        Object.keys(w.ex).forEach(k => {
          const i = Number(k);
          if (idxOk(i, m.ejercicios.length) && String(i) === k && ['ok', 'ok2', 'fail'].includes(w.ex[k])) ex[i] = w.ex[k];
        });
      }
      out.worlds[m.id] = { seen, ex };
    });
    return out;
  }

  /** ¿Es razonable resolver por fuerza bruta n sustancias con coeficientes hasta max? */
  function solverBudget(nSpecies, max) {
    return Math.pow(max, nSpecies) <= LIMITS.solverOps;
  }

  global.Safe = { LIMITS, PATTERNS, escapeHtml, cleanText, validate, sanitizeState, solverBudget };
})(window);
