/* Calcoli Bancari — motore di calcolo
   Ogni chiave è l'indirizzo della cella nel foglio Excel "Calcoli" (es. D5, K17),
   così formule e valori restano riconoscibili e confrontabili con l'originale. */
(function (root) {
  'use strict';

  /* Valori iniziali = quelli presenti nelle celle gialle del foglio Excel */
  const DEFAULTS = {
    // 1 · Cedola BTP Italia (6 mesi)
    D5: 35000, D6: 0.0102709, D7: 0.02709, D8: 0.125,
    // 2 · Interessi equivalenti
    J15: 15000, K15: 0.0445, L15: 0.125, M15: 5,
    // 3 · Step-up (4+4)
    K31: 30000, M31: 3, M32: 8,
    I34: 0.0285, J34: 12.5, I35: 0.037, J35: 12.5, I36: 0, J36: 12.5,
    // 4 · BTP Valore
    H56: 2, H57: 2, H58: 2, K57: 55000, M57: 3, M58: 6,
    I60: 0.026, J60: 12.5, I61: 0.032, J61: 12.5, I62: 0.038, J62: 12.5, I63: 0.008, J63: 12.5,
    // 5 · Ca Auto Disinvestimento
    D70: 10000, D71: 0.03, D72: 0.005, D73: 0.26, D74: '2026-07-29', D75: '2026-10-19',
    // 6 · Fondo azionario BNL
    D106: 10000, D107: 0.3606, D108: 0.26, D109: 0.015,
    // 7 · Interesse composto
    I98: 15000, I99: 0.041, I100: 5,
    // 8 · BTP MOT [capitale]
    C123: 15000, C124: 14880, C125: 45, C127: 0.0395,
    // 9 · BTP MOT [%]
    C141: 15000, C142: 0.9795, C144: 45, C146: 0.0395
  };

  /* Celle non gialle con valore fisso nel foglio */
  const FIXED = { D77: 90, J37: 12.5, J38: 12.5, J64: 12.5, J65: 12.5, J66: 12.5, C129: 0.125, C148: 0.125 };

  const n = (v) => { const x = typeof v === 'number' ? v : parseFloat(v); return Number.isFinite(x) ? x : 0; };
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  const txt = (x) => String(x).replace('.', ',');                       // numero → testo all'italiana
  const net = (rate, taxPct) => rate - (rate / 100 * taxPct);           // =I-(I/100*J)
  const daysBetween = (end, start) => {                                  // =DAYS(end;start)
    const a = Date.parse(end + 'T00:00:00Z'), b = Date.parse(start + 'T00:00:00Z');
    return Math.round((a - b) / 864e5);
  };

  /* 1 · Calcolo Cedola BTP Italia (6 mesi) — C3:D16 */
  function t1(v) {
    const D5 = n(v.D5), D6 = n(v.D6), D7 = n(v.D7), D8 = n(v.D8);
    const D10 = D6 + D7;
    const D11 = D10 - (D10 * D8);
    const D12 = D5 * D11;
    const D14 = D10 * 2;
    const D15 = D11 * 2;
    const D16 = D5 * D15;
    return { D10, D11, D12, D14, D15, D16 };
  }

  /* 2 · Calcolo interessi equivalenti — I14:M18 (+ celle di appoggio P13:P18) */
  function t2(v) {
    const J15 = n(v.J15), K15 = n(v.K15), L15 = n(v.L15), M15 = n(v.M15);
    const I17 = K15;
    const J17 = L15 * 100;
    const K17 = net(I17, J17);
    const L17 = J15 * K17;
    const M17 = L17 * M15;
    const P13 = I17 * J17 / 100;
    const P14 = L17 + P13;
    const P15 = P14 / J15;
    const J18 = near(J17, 26) ? 12.5 : near(J17, 12.5) ? 26 : NaN;
    const P16 = 1 - J18 / 100;
    const P17 = 1 / P16;
    const P18 = P15 * P17;
    const I18 = P18;
    const K18 = net(I18, J18);
    const L18 = P14;
    const M18 = L18 * M15;
    const I15 = near(J17, 26) ? 'Tass. standard → agevolata' : near(J17, 12.5) ? 'Tass. agevolata → standard' : '';
    return {
      I15, M16: 'Vincolo anni ' + txt(M15),
      T17: 'Con tassazione ' + txt(J17) + '%', T18: 'Con tassazione ' + txt(J18) + '%',
      I17, J17, K17, L17, M17, I18, J18, K18, L18, M18
    };
  }

  /* 3 · Investimento Step-up (4+4) — I31:N38 */
  function t3(v) {
    const K31 = n(v.K31), M31 = n(v.M31), M32 = n(v.M32);
    const I34 = n(v.I34), J34 = n(v.J34), I35 = n(v.I35), J35 = n(v.J35), I36 = n(v.I36), J36 = n(v.J36);
    const K34 = net(I34, J34), L34 = K31 * K34, M34 = (L34 * M32) / 2, N34 = L34 / (12 / M31);
    const K35 = net(I35, J35), L35 = K31 * K35, M35 = (L35 * M32) / 2, N35 = L35 / (12 / M31);
    const K36 = net(I36, J36), L36 = K31 * K36;
    const I37 = (I34 + I35) / 2, J37 = FIXED.J37, K37 = net(I37, J37), L37 = K31 * K37;
    const M37 = M34 + M35, N37 = L37 / (12 / M31);
    const I38 = I35 + I36, J38 = FIXED.J38, K38 = net(I38, J38);
    const M38 = M37 + L36, N38 = N35 + L36;
    return {
      H34: txt(M32 / 2) + ' anni', H35: txt(M32 / 2) + ' anni', H37: 'Media anni ' + txt(M32),
      M33: 'Vincolo anni ' + txt(M32), N33: 'Cedola ogni ' + txt(M31) + ' mesi',
      K34, L34, M34, N34, K35, L35, M35, N35, K36, L36,
      I37, J37, K37, L37, M37, N37, I38, J38, K38, M38, N38
    };
  }

  /* 4 · BTP Valore — G56:N66 */
  function t4(v) {
    const H56 = n(v.H56), H57 = n(v.H57), H58 = n(v.H58);
    const K57 = n(v.K57), M57 = n(v.M57), M58 = n(v.M58);
    const I60 = n(v.I60), J60 = n(v.J60), I61 = n(v.I61), J61 = n(v.J61);
    const I62 = n(v.I62), J62 = n(v.J62), I63 = n(v.I63), J63 = n(v.J63);
    const K60 = net(I60, J60), K61 = net(I61, J61), K62 = net(I62, J62), K63 = net(I63, J63);
    const L60 = K57 * K60, L61 = K57 * K61, L62 = K57 * K62, L63 = K57 * K63;
    const M60 = L60 * H56, M61 = L61 * H57, M62 = L62 * H58;
    const N60 = L60 / (12 / M57), N61 = L61 / (12 / M57), N62 = L62 / (12 / M57);
    const I64 = ((H56 * I60) + (H57 * I61) + (H58 * I62)) / M58;
    const J64 = FIXED.J64, K64 = net(I64, J64), L64 = K57 * K64;
    const M64 = M60 + M61 + M62, N64 = L64 / (12 / M57);
    const I65 = (((H56 * I60) + (H57 * I61) + (H58 * I62)) / M58) + (I63 / M58);
    const J65 = FIXED.J65, K65 = net(I65, J65), L65 = K57 * K65;
    const M65 = M64 + L63, N65 = L65 / (12 / M57);
    const I66 = I62 + I63, J66 = FIXED.J66, K66 = net(I66, J66);
    const N66 = N62 + L63;
    return {
      I57: 'Investimento step-up ' + txt(H56) + ' + ' + txt(H57) + ' + ' + txt(H58),
      H60: txt(H56) + ' anni', H61: txt(H57) + ' anni', H62: txt(H58) + ' anni',
      H64: 'Media anni ' + txt(M58), H65: 'Media anni ' + txt(M58) + ' + premio',
      M59: 'Vincolo anni ' + txt(M58), N59: 'Cedola ogni ' + txt(M57) + ' mesi',
      K60, L60, M60, N60, K61, L61, M61, N61, K62, L62, M62, N62, K63, L63,
      I64, J64, K64, L64, M64, N64, I65, J65, K65, L65, M65, N65,
      I66, J66, K66, N66
    };
  }

  /* 5 · Ca Auto Disinvestimento — C68:D84 */
  function t5(v) {
    const D70 = n(v.D70), D71 = n(v.D71), D72 = n(v.D72), D73 = n(v.D73);
    const D76 = daysBetween(v.D75, v.D74);
    const D77 = FIXED.D77;
    const D78 = (D70 * D71) / 4;
    const D79 = D78 - (D78 * D73);
    const D80 = D70 * D71 * (D76 / D77) / 4;
    const D81 = D70 * D72 * (D76 / D77) / 4;
    const D82 = D80 - (D80 * D73);
    const D83 = D81 - (D81 * D73);
    const D84 = D82 - D83;
    const g = Number.isFinite(D76) ? txt(D76) : '—';
    return {
      C80: 'Cedola piena prevista lorda ' + g + ' gg',
      C81: 'Rendimento disinvestendo lordo ' + g + ' gg',
      C82: 'Cedola piena prevista netta ' + g + ' gg',
      C83: 'Rendimento disinvestendo netto ' + g + ' gg',
      D76, D77, D78, D79, D80, D81, D82, D83, D84
    };
  }

  /* 6 · Calcolo fondo azionario BNL — C104:D115 */
  function t6(v) {
    const D106 = n(v.D106), D107 = n(v.D107), D108 = n(v.D108), D109 = n(v.D109);
    const D110 = D106 * D107;
    const D111 = D110 * D108;
    const D112 = D106 * D109;
    const D113 = D110 - (D111 + D112);
    const D114 = D106 + D113;
    const D115 = D113 / D106;
    return { D110, D111, D112, D113, D114, D115 };
  }

  /* 7 · Simulazione interesse composto — H94:K121 (piano fisso su 5 anni, come nel foglio) */
  function t7(v) {
    const I98 = n(v.I98), I99 = n(v.I99), I100 = n(v.I100);
    const o = {};
    let start = I98;
    for (let r = 104; r <= 108; r++) {
      const interest = I99 * start;
      o['I' + r] = start;
      o['J' + r] = interest;
      o['K' + r] = start + interest;
      start = start + interest;
    }
    o.I111 = o.K108;
    o.I112 = o.I111 - I98;
    o.I113 = o.I112 / I98;
    o.I114 = Math.pow(o.I111 / I98, 1 / I100) - 1;
    o.I115 = o.I113 / I100;
    o.J119 = I98 * (1 + I99 * I100);
    o.K119 = o.J119 - I98;
    o.J120 = o.I111;
    o.K120 = o.J120 - I98;
    o.J121 = o.J120 - o.J119;
    return o;
  }

  /* 8 · Rendimento cedola BTP — mercato secondario MOT [capitale] — B119:D134 */
  function t8(v) {
    const C123 = n(v.C123), C124 = n(v.C124), C125 = n(v.C125), C127 = n(v.C127);
    const C126 = C124 + C125;
    const C128 = C123 * C127;
    const C129 = FIXED.C129;
    const C130 = C128 * (1 - C129);
    const C131 = C128 / C126;
    const C132 = C130 / C126;
    return { C126, C128, C129, C130, C131, C132, C133: C128, C134: C130 };
  }

  /* 9 · Rendimento cedola BTP — mercato secondario MOT [%] — B137:D153 */
  function t9(v) {
    const C141 = n(v.C141), C142 = n(v.C142), C144 = n(v.C144), C146 = n(v.C146);
    const C143 = C141 * C142;
    const C145 = C143 + C144;
    const C147 = C141 * C146;
    const C148 = FIXED.C148;
    const C149 = C147 * (1 - C148);
    const C150 = C147 / C145;
    const C151 = C149 / C145;
    return { C143, C145, C147, C148, C149, C150, C151, C152: C147, C153: C149 };
  }

  const TABS = { t1, t2, t3, t4, t5, t6, t7, t8, t9 };
  const computeTab = (id, values) => TABS[id](values);

  const api = { DEFAULTS, FIXED, computeTab };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CalcoliCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
