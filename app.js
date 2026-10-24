(function () {
  'use strict';

  const Core = window.CalcoliCore;
  const LS_DATA = 'calcoli-bancari-v1';
  const LS_TAB = 'calcoli-bancari-tab';
  const LS_BK = 'calcoli-bancari-ultimo-backup';

  /* ---------- Opzioni dei menu a tendina (come le convalide del foglio) ---------- */
  const TAX = [[0.125, '12,5%'], [0.26, '26%']];
  const YEARS = Array.from({ length: 12 }, (_, i) => [i + 1, String(i + 1)]);
  const CED = [[3, '3 mesi'], [6, '6 mesi'], [12, '12 mesi']];

  /* ---------- Descrizione delle schede ----------
     in: cella gialla (modificabile) · o: risultato calcolato · key: cella verde (totali) */
  const eur = (id) => ({ id, t: 'eur' });
  const pct = (id) => ({ id, t: 'pct' });
  const pctu = (id) => ({ id, t: 'pctu' });
  const sel = (id, opts, unit) => ({ id, t: 'sel', opts, unit });

  const TABS = [
    {
      id: 't1', short: 'BTP Italia', title: 'Calcolo cedola BTP Italia (6 mesi)',
      blocks: [
        { kind: 'rows', h: 'Dati', rows: [
          { l: 'Quantità', in: eur('D5') },
          { l: 'Cedola base (6 mesi)', in: pct('D6') },
          { l: 'Coeff. indicizzazione (6 mesi)', in: pct('D7') },
          { l: 'Tassazione', in: sel('D8', TAX) }
        ] },
        { kind: 'rows', h: 'Risultati', rows: [
          { l: 'Cedola semestrale lorda', o: 'D10', f: 'pct4' },
          { l: 'Cedola semestrale netta', o: 'D11', f: 'pct4' },
          { l: 'Rendimento semestrale', o: 'D12', f: 'eur' },
          { l: 'Cedola annuale lorda', o: 'D14', f: 'pct2' },
          { l: 'Cedola annuale netta', o: 'D15', f: 'pct2' },
          { l: 'Rendimento annuale', o: 'D16', f: 'eur' }
        ] }
      ]
    },
    {
      id: 't2', short: 'Interessi equivalenti', title: 'Calcolo interessi equivalenti',
      blocks: [
        { kind: 'rows', h: 'Dati', rows: [
          { l: 'Capitale', in: eur('J15') },
          { l: 'Tasso lordo', in: pct('K15') },
          { l: 'Tassazione', in: sel('L15', TAX) },
          { l: 'Anni', in: sel('M15', YEARS) }
        ] },
        { kind: 'text', o: 'I15' },
        { kind: 'cards', cards: [
          { title: { k: 'T17' }, fields: [
            { l: 'Tasso interesse lordo', o: 'I17', f: 'pct2', key: true },
            { l: 'Tassazione', o: 'J17', f: 'pctu2' },
            { l: 'Interesse netto', o: 'K17', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L17', f: 'eur' },
            { l: { k: 'M16' }, o: 'M17', f: 'eur' }
          ] },
          { title: { k: 'T18' }, fields: [
            { l: 'Tasso interesse lordo equivalente', o: 'I18', f: 'pct2', key: true },
            { l: 'Tassazione', o: 'J18', f: 'pctu2' },
            { l: 'Interesse netto', o: 'K18', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L18', f: 'eur' },
            { l: { k: 'M16' }, o: 'M18', f: 'eur' }
          ] }
        ] }
      ]
    },
    {
      id: 't3', short: 'Step-up 4+4', title: 'Investimento step-up (4+4)',
      blocks: [
        { kind: 'rows', h: 'Dati', rows: [
          { l: 'Quantità', in: eur('K31') },
          { l: 'Cedola ogni', in: sel('M31', CED) },
          { l: 'Durata anni', in: sel('M32', YEARS) }
        ] },
        { kind: 'cards', cards: [
          { title: { k: 'H34' }, fields: [
            { l: 'Tasso interesse lordo', in: pct('I34') },
            { l: 'Tassazione', in: pctu('J34') },
            { l: 'Interesse netto', o: 'K34', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L34', f: 'eur' },
            { l: { k: 'M33' }, o: 'M34', f: 'eur' },
            { l: { k: 'N33' }, o: 'N34', f: 'eur' }
          ] },
          { title: { k: 'H35' }, fields: [
            { l: 'Tasso interesse lordo', in: pct('I35') },
            { l: 'Tassazione', in: pctu('J35') },
            { l: 'Interesse netto', o: 'K35', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L35', f: 'eur' },
            { l: { k: 'M33' }, o: 'M35', f: 'eur' },
            { l: { k: 'N33' }, o: 'N35', f: 'eur' }
          ] },
          { title: 'Premio', fields: [
            { l: 'Tasso interesse lordo', in: pct('I36') },
            { l: 'Tassazione', in: pctu('J36') },
            { l: 'Interesse netto', o: 'K36', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L36', f: 'eur' }
          ] },
          { title: { k: 'H37' }, key: true, fields: [
            { l: 'Tasso interesse lordo', o: 'I37', f: 'pct2', key: true },
            { l: 'Tassazione', o: 'J37', f: 'pctu2' },
            { l: 'Interesse netto', o: 'K37', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L37', f: 'eur' },
            { l: 'Totale vincolo', o: 'M37', f: 'eur', key: true },
            { l: { k: 'N33' }, o: 'N37', f: 'eur' }
          ] },
          { title: 'Ultima cedola', key: true, fields: [
            { l: 'Tasso interesse lordo', o: 'I38', f: 'pct2', key: true },
            { l: 'Tassazione', o: 'J38', f: 'pctu2' },
            { l: 'Interesse netto', o: 'K38', f: 'pct2' },
            { l: 'Totale + premio', o: 'M38', f: 'eur', key: true },
            { l: { k: 'N33' }, o: 'N38', f: 'eur' }
          ] }
        ] }
      ]
    },
    {
      id: 't4', short: 'BTP Valore', title: 'BTP Valore',
      blocks: [
        { kind: 'rows', h: 'Dati', rows: [
          { l: 'Step 1 (anni)', in: sel('H56', YEARS) },
          { l: 'Step 2 (anni)', in: sel('H57', YEARS) },
          { l: 'Step 3 (anni)', in: sel('H58', YEARS) },
          { l: 'Quantità', in: eur('K57') },
          { l: 'Cedola ogni', in: sel('M57', CED) },
          { l: 'Durata anni', in: sel('M58', YEARS) }
        ] },
        { kind: 'text', o: 'I57' },
        { kind: 'cards', cards: [
          { title: { k: 'H60' }, fields: [
            { l: 'Tasso interesse lordo', in: pct('I60') },
            { l: 'Tassazione', in: pctu('J60') },
            { l: 'Interesse netto', o: 'K60', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L60', f: 'eur' },
            { l: { k: 'V60' }, o: 'M60', f: 'eur' },
            { l: { k: 'N59' }, o: 'N60', f: 'eur' }
          ] },
          { title: { k: 'H61' }, fields: [
            { l: 'Tasso interesse lordo', in: pct('I61') },
            { l: 'Tassazione', in: pctu('J61') },
            { l: 'Interesse netto', o: 'K61', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L61', f: 'eur' },
            { l: { k: 'V61' }, o: 'M61', f: 'eur' },
            { l: { k: 'N59' }, o: 'N61', f: 'eur' }
          ] },
          { title: { k: 'H62' }, fields: [
            { l: 'Tasso interesse lordo', in: pct('I62') },
            { l: 'Tassazione', in: pctu('J62') },
            { l: 'Interesse netto', o: 'K62', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L62', f: 'eur' },
            { l: { k: 'V62' }, o: 'M62', f: 'eur' },
            { l: { k: 'N59' }, o: 'N62', f: 'eur' }
          ] },
          { title: 'Premio', fields: [
            { l: 'Tasso interesse lordo', in: pct('I63') },
            { l: 'Tassazione', in: pctu('J63') },
            { l: 'Interesse netto', o: 'K63', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L63', f: 'eur' }
          ] },
          { title: { k: 'H64' }, key: true, fields: [
            { l: 'Tasso interesse lordo', o: 'I64', f: 'pct3', key: true },
            { l: 'Tasso interesse lordo TIR', o: 'T64', f: 'pct3', key: true },
            { l: 'Tassazione', o: 'J64', f: 'pctu2' },
            { l: 'Interesse netto', o: 'K64', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L64', f: 'eur' },
            { l: 'Totale vincolo', o: 'M64', f: 'eur', key: true },
            { l: { k: 'N59' }, o: 'N64', f: 'eur' }
          ] },
          { title: { k: 'H65' }, key: true, fields: [
            { l: 'Tasso interesse lordo', o: 'I65', f: 'pct3', key: true },
            { l: 'Tassazione', o: 'J65', f: 'pctu2' },
            { l: 'Interesse netto', o: 'K65', f: 'pct2' },
            { l: 'Rendimento netto', o: 'L65', f: 'eur' },
            { l: 'Totale vincolo + premio', o: 'M65', f: 'eur', key: true },
            { l: { k: 'N59' }, o: 'N65', f: 'eur' }
          ] },
          { title: 'Ultima cedola', key: true, fields: [
            { l: 'Tasso interesse lordo', o: 'I66', f: 'pct3', key: true },
            { l: 'Tassazione', o: 'J66', f: 'pctu2' },
            { l: 'Interesse netto', o: 'K66', f: 'pct2' },
            { l: { k: 'N59' }, o: 'N66', f: 'eur' }
          ] }
        ] }
      ]
    },
    {
      id: 't5', short: 'Ca Auto Disinvest.', title: 'Ca Auto Disinvestimento',
      blocks: [
        { kind: 'rows', h: 'Parametri', rows: [
          { l: 'Capitale', in: eur('D70') },
          { l: 'Tasso annuo pieno', in: pct('D71') },
          { l: 'Tasso annuo disinvestito', in: pct('D72') },
          { l: 'Tassazione', in: pct('D73') },
          { l: 'Data inizio trimestre', in: { id: 'D74', t: 'date' } },
          { l: 'Data svincolo anticipato', in: { id: 'D75', t: 'date' } }
        ] },
        { kind: 'rows', h: 'Risultati', rows: [
          { l: 'Giorni effettivi', o: 'D76', f: 'int', key: true },
          { l: 'Durata cedola (giorni)', o: 'D77', f: 'int', key: true },
          { l: 'Cedola piena prevista lorda (90 gg)', o: 'D78', f: 'eur', key: true },
          { l: 'Cedola piena prevista netta (90 gg)', o: 'D79', f: 'eur', key: true },
          { l: { k: 'C80' }, o: 'D80', f: 'eur', key: true },
          { l: { k: 'C81' }, o: 'D81', f: 'eur', key: true },
          { l: { k: 'C82' }, o: 'D82', f: 'eur', key: true },
          { l: { k: 'C83' }, o: 'D83', f: 'eur', key: true },
          { l: 'Perdita', o: 'D84', f: 'eur', key: true }
        ] }
      ]
    },
    {
      id: 't6', short: 'Fondo BNL', title: 'Calcolo fondo azionario BNL',
      blocks: [
        { kind: 'rows', h: 'Parametri', rows: [
          { l: 'Capitale', in: eur('D106') },
          { l: 'P&L (%)', in: pct('D107') },
          { l: 'Tassazione', in: pct('D108') },
          { l: 'Commissione di uscita/switch (sul capitale)', in: pct('D109') }
        ] },
        { kind: 'rows', h: 'Risultati', rows: [
          { l: 'P&L (€)', o: 'D110', f: 'eur', key: true },
          { l: 'Tassazione (importo)', o: 'D111', f: 'eur', key: true },
          { l: 'Spese commissione di uscita/switch', o: 'D112', f: 'eur', key: true },
          { l: 'Totale netto (guadagno)', o: 'D113', f: 'eur', key: true },
          { l: 'Totale netto (rimborso)', o: 'D114', f: 'eur', key: true },
          { l: 'Totale netto (%)', o: 'D115', f: 'pct2', key: true }
        ] }
      ]
    },
    {
      id: 't7', short: 'Interesse composto', title: 'Simulazione interesse composto',
      sub: 'Cedola capitalizzata ed erogata interamente a scadenza',
      blocks: [
        { kind: 'rows', h: 'Dati di input', rows: [
          { l: 'Capitale investito', in: eur('I98') },
          { l: 'Tasso di interesse annuo nominale', in: pct('I99') },
          { l: 'Durata (anni)', in: { id: 'I100', t: 'num' } }
        ] },
        { kind: 'table', h: 'Piano di accumulo (capitalizzazione composta annuale)',
          head: ['Anno', 'Capitale a inizio anno', 'Interesse maturato nell\'anno', 'Capitale a fine anno'],
          dynamic: true, rows: [] },
        { kind: 'rows', h: 'Riepilogo a scadenza', rows: [
          { l: 'Capitale finale (capit. + inter. composti)', o: 'I111', f: 'eur' },
          { l: 'Totale interessi maturati (cedola complessiva a scadenza)', o: 'I112', f: 'eur' },
          { l: 'Rendimento complessivo sul periodo', o: 'I113', f: 'pct2' },
          { l: 'Rendimento annuo composto (CAGR)', o: 'I114', f: 'pct2' },
          { l: 'Rendimento annuo composto (%)', o: 'I115', f: 'pct2' }
        ] },
        { kind: 'cards', h: 'Confronto: interesse semplice vs interesse composto', cards: [
          { title: 'Interesse semplice', caption: 'La cedola resta ferma, non genera altro interesse', fields: [
            { l: 'Capitale finale', o: 'J119', f: 'eur' },
            { l: 'Interessi totali', o: 'K119', f: 'eur' }
          ] },
          { title: 'Interesse composto', caption: 'La cedola si somma al capitale e produce a sua volta interesse', fields: [
            { l: 'Capitale finale', o: 'J120', f: 'eur' },
            { l: 'Interessi totali', o: 'K120', f: 'eur' }
          ] }
        ] },
        { kind: 'rows', rows: [
          { l: 'Vantaggio del reinvestimento (interesse sull\'interesse)', o: 'J121', f: 'eur', key: true }
        ] }
      ]
    },
    {
      id: 't8', short: 'BTP MOT capitale', title: 'Rendimento cedola BTP — mercato secondario MOT [capitale]',
      sub: 'Analisi finanziaria e rendimento della cedola lordo e netto',
      blocks: [{ kind: 'rows', rows: [
        { l: 'Capitale nominale', note: 'Valore nominale totale dei titoli acquistati', in: eur('C123') },
        { l: 'Capitale speso totale (senza spese)', note: 'Capitale totale sborsato per l\'acquisto', in: eur('C124') },
        { l: 'Spese', note: 'Calcolate in automatico: 0,24% + 3 € sul capitale speso (senza spese). Puoi modificarle.', in: { id: 'C125', t: 'eur', auto: 'C125A' } },
        { l: 'Capitale speso totale (con spese incluse)', note: 'Capitale totale sborsato per l\'acquisto (costo totale)', o: 'C126', f: 'eur', key: true },
        { l: 'Tasso annuo lordo (%)', note: 'Tasso cedolare nominale annuo del BTP', in: pct('C127') },
        { l: 'Anni residui a scadenza', note: 'Durata fino al rimborso a 100 (anche con decimali, es. 3,5)', in: { id: 'C135', t: 'num', unit: 'anni' } },
        { l: 'Cedola lorda annua', note: 'Totale interessi lordi generati in un anno', o: 'C128', f: 'eur' },
        { l: 'Tassazione sui titoli di Stato', note: 'Aliquota agevolata applicata ai BTP italiani', o: 'C129', f: 'pct2' },
        { l: 'Cedola netta annua', note: 'Totale interessi netti dopo la tassazione', o: 'C130', f: 'eur', key: true },
        { l: 'Rendimento cedola % lordo (sul capitale speso)', note: 'Rendimento percentuale lordo calcolato sulla spesa totale', o: 'C131', f: 'pct2', key: true },
        { l: 'Rend. cedola % netto (sul capitale speso)', note: 'Rendimento percentuale netto calcolato sulla spesa totale', o: 'C132', f: 'pct2', key: true },
        { l: 'Rendimento annuo lordo a scadenza', note: 'Include cedole, capitale speso con spese e rimborso a 100 (TIR)', o: 'T8L', f: 'pct2', key: true },
        { l: 'Rendimento annuo netto a scadenza', note: 'Come sopra, con il 12,5% su cedole e su un eventuale guadagno finale', o: 'T8N', f: 'pct2', key: true },
        { l: 'Rendimento cedola annuo', note: 'Incasso effettivo lordo annuale da cedola', o: 'C133', f: 'eur', key: true },
        { l: 'Rendimento cedola annuo in euro (netto)', note: 'Incasso effettivo netto annuale accreditato', o: 'C134', f: 'eur', key: true }
      ] }]
    },
    {
      id: 't9', short: 'BTP MOT %', title: 'Rendimento cedola BTP — mercato secondario MOT [%]',
      sub: 'Analisi finanziaria e rendimento della cedola lordo e netto',
      blocks: [{ kind: 'rows', rows: [
        { l: 'Capitale nominale', note: 'Valore nominale totale dei titoli acquistati', in: eur('C141') },
        { l: 'Percentuale di acquisto', note: 'Percentuale di acquisto', in: pct('C142') },
        { l: 'Capitale speso totale (senza spese)', note: 'Capitale totale sborsato per l\'acquisto', o: 'C143', f: 'eur', key: true },
        { l: 'Spese', note: 'Calcolate in automatico: 0,24% + 3 € sul capitale speso (senza spese). Puoi modificarle.', in: { id: 'C144', t: 'eur', auto: 'C144A' } },
        { l: 'Capitale speso totale (con spese incluse)', note: 'Capitale totale sborsato per l\'acquisto (costo totale)', o: 'C145', f: 'eur', key: true },
        { l: 'Tasso annuo lordo (%)', note: 'Tasso cedolare nominale annuo del BTP', in: pct('C146') },
        { l: 'Anni residui a scadenza', note: 'Durata fino al rimborso a 100 (anche con decimali, es. 3,5)', in: { id: 'C154', t: 'num', unit: 'anni' } },
        { l: 'Cedola lorda annua', note: 'Totale interessi lordi generati in un anno', o: 'C147', f: 'eur' },
        { l: 'Tassazione sui titoli di Stato', note: 'Aliquota agevolata applicata ai BTP italiani', o: 'C148', f: 'pct2' },
        { l: 'Cedola netta annua', note: 'Totale interessi netti dopo la tassazione', o: 'C149', f: 'eur', key: true },
        { l: 'Rendimento cedola % lordo (sul capitale speso)', note: 'Rendimento percentuale lordo calcolato sulla spesa totale', o: 'C150', f: 'pct2', key: true },
        { l: 'Rend. cedola % netto (sul capitale speso)', note: 'Rendimento percentuale netto calcolato sulla spesa totale', o: 'C151', f: 'pct2', key: true },
        { l: 'Rendimento annuo lordo a scadenza', note: 'Include cedole, capitale speso con spese e rimborso a 100 (TIR)', o: 'T9L', f: 'pct2', key: true },
        { l: 'Rendimento annuo netto a scadenza', note: 'Come sopra, con il 12,5% su cedole e su un eventuale guadagno finale', o: 'T9N', f: 'pct2', key: true },
        { l: 'Rendimento cedola annuo', note: 'Incasso effettivo lordo annuale da cedola', o: 'C152', f: 'eur', key: true },
        { l: 'Rendimento cedola annuo in euro (netto)', note: 'Incasso effettivo netto annuale accreditato', o: 'C153', f: 'eur', key: true }
      ] }]
    }
  ];

  /* ---------- Stato e salvataggio automatico ---------- */
  const $ = (s) => document.querySelector(s);
  const state = { values: loadValues(), tab: loadTab() };

  function loadValues() {
    const base = Object.assign({}, Core.DEFAULTS);
    try {
      const raw = JSON.parse(localStorage.getItem(LS_DATA) || 'null');
      if (raw && raw.values) mergeValues(base, raw.values);
    } catch (e) { /* dati non leggibili: si riparte dai valori iniziali */ }
    return base;
  }
  function mergeValues(target, src) {
    Object.keys(Core.DEFAULTS).forEach((k) => {
      if (!(k in src)) return;
      const def = Core.DEFAULTS[k], v = src[k];
      if (typeof def === 'string') {
        if (typeof v === 'string' && (v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v))) target[k] = v;
      } else if (v === null) target[k] = null;
      else if (typeof v === 'number' && Number.isFinite(v)) target[k] = v;
    });
  }
  function loadTab() {
    const t = localStorage.getItem(LS_TAB);
    return TABS.some((x) => x.id === t) ? t : TABS[0].id;
  }

  const clock = (d) => d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  function save() {
    const el = $('#saved');
    try {
      localStorage.setItem(LS_DATA, JSON.stringify({ v: 1, savedAt: Date.now(), values: state.values }));
      el.className = 'saved';
      el.textContent = 'Salvato alle ' + clock(new Date());
    } catch (e) {
      el.className = 'saved err';
      el.textContent = 'Salvataggio non riuscito';
    }
  }

  /* ---------- Formati ---------- */
  const NF = {};
  const nf = (a, b) => NF[a + '-' + b] || (NF[a + '-' + b] = new Intl.NumberFormat('it-IT', { minimumFractionDigits: a, maximumFractionDigits: b }));
  const FMT = {
    eur: (x) => nf(2, 2).format(x) + '\u00a0€',
    pct2: (x) => nf(2, 2).format(x * 100) + '%',
    pct3: (x) => nf(3, 3).format(x * 100) + '%',
    pct4: (x) => nf(4, 4).format(x * 100) + '%',
    pctu2: (x) => nf(2, 2).format(x) + '%',
    num2: (x) => nf(2, 2).format(x),
    int: (x) => nf(0, 0).format(x)
  };
  function fmt(f, x) {
    if (f === 'text') return x == null ? '' : String(x);
    if (typeof x !== 'number' || !Number.isFinite(x)) return '—';
    return FMT[f](x);
  }

  /* ---------- Lettura e scrittura dei numeri digitati ---------- */
  const round = (x) => Number(x.toFixed(10));
  function show(spec, v) {
    if (v === null || v === undefined || v === '') return '';
    if (spec.t === 'date') return v;
    const x = spec.t === 'pct' ? round(v * 100) : round(v);
    return String(x).replace('.', ',');
  }
  function parse(spec, text) {
    let s = text.trim().replace(/\s/g, '').replace('€', '').replace('%', '');
    if (!s) return null;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if (spec.t === 'eur' && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    const x = Number(s);
    if (!Number.isFinite(x)) return undefined;
    return spec.t === 'pct' ? round(x / 100) : x;
  }

  /* ---------- Costruzione dell'interfaccia ---------- */
  function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function outSpan(key, f, cls) {
    const s = h('span', cls);
    s.dataset.o = key;
    s.dataset.f = f;
    return s;
  }
  function labelNode(l) {
    return typeof l === 'string' ? h('span', null, l) : outSpan(l.k, 'text');
  }

  function control(spec, labelText) {
    const wrap = h('label', 'field' + (spec.t === 'sel' ? ' sel' : ''));
    let inp;
    if (spec.t === 'sel') {
      inp = h('select');
      const cur = state.values[spec.id];
      const opts = spec.opts.slice();
      if (!opts.some((o) => o[0] === cur)) opts.unshift([cur, String(cur).replace('.', ',')]);
      opts.forEach((o) => {
        const op = h('option', null, o[1]);
        op.value = String(o[0]);
        if (o[0] === cur) op.selected = true;
        inp.appendChild(op);
      });
      inp.addEventListener('change', () => commit(spec.id, Number(inp.value)));
    } else if (spec.t === 'date') {
      inp = h('input');
      inp.type = 'date';
      inp.value = state.values[spec.id] || '';
      inp.addEventListener('input', () => commit(spec.id, inp.value));
    } else {
      inp = h('input');
      inp.type = 'text';
      inp.inputMode = 'decimal';
      inp.autocomplete = 'off';
      inp.value = show(spec, state.values[spec.id]);
      inp.addEventListener('input', () => {
        const v = parse(spec, inp.value);
        if (v === undefined) { inp.style.color = 'var(--bad)'; return; }
        inp.style.color = '';
        if (spec.auto) state.values[spec.auto] = 0;
        commit(spec.id, v);
      });
      inp.addEventListener('focus', () => setTimeout(() => inp.select && inp.select(), 0));
    }
    inp.dataset.id = spec.id;
    if (spec.auto) inp.dataset.autoFlag = spec.auto;
    if (labelText) inp.setAttribute('aria-label', labelText);
    wrap.appendChild(inp);
    const unit = spec.t === 'eur' ? '€' : (spec.t === 'pct' || spec.t === 'pctu') ? '%' : spec.unit;
    if (unit) wrap.appendChild(h('em', null, unit));
    return wrap;
  }

  function row(r) {
    const el = h('div', 'row' + (r.in ? ' is-input' : '') + (r.key ? ' key' : ''));
    const lab = h('div', 'lab');
    lab.appendChild(labelNode(r.l));
    if (r.note) lab.appendChild(h('small', null, r.note));
    if (r.in && r.in.auto) {
      const b = h('button', 'auto-btn', 'Ripristina calcolo automatico');
      b.type = 'button';
      b.hidden = true;
      b.addEventListener('click', () => { state.values[r.in.auto] = 1; save(); refresh(); });
      lab.appendChild(b);
    }
    el.appendChild(lab);
    if (r.in) {
      el.appendChild(control(r.in, typeof r.l === 'string' ? r.l : ''));
    } else {
      el.appendChild(h('i', 'lead'));
      el.appendChild(outSpan(r.o, r.f, 'val'));
    }
    return el;
  }

  function block(b) {
    const sec = h('section', 'block');
    if (b.h) sec.appendChild(h('h3', null, b.h));
    if (b.kind === 'text') {
      const p = h('p', 'caption');
      p.appendChild(outSpan(b.o, 'text'));
      sec.appendChild(p);
    } else if (b.kind === 'rows') {
      b.rows.forEach((r) => sec.appendChild(row(r)));
    } else if (b.kind === 'cards') {
      const grid = h('div', 'cards');
      b.cards.forEach((c) => {
        const card = h('article', 'card' + (c.key ? ' key' : ''));
        const t = h('h4');
        t.appendChild(labelNode(c.title));
        card.appendChild(t);
        if (c.caption) card.appendChild(h('p', null, c.caption));
        c.fields.forEach((f) => card.appendChild(row(f)));
        grid.appendChild(card);
      });
      sec.appendChild(grid);
    } else if (b.kind === 'table') {
      const box = h('div', 'scroll');
      const tbl = h('table', 'tbl');
      const hr = h('tr');
      b.head.forEach((x) => hr.appendChild(h('th', null, x)));
      const thead = h('thead');
      thead.appendChild(hr);
      tbl.appendChild(thead);
      const tb = h('tbody');
      if (b.dynamic) tb.dataset.plan = '1';
      b.rows.forEach((cells) => {
        const tr = h('tr');
        cells.forEach((c) => {
          const td = h('td');
          if (c.t) td.textContent = c.t; else td.appendChild(outSpan(c.o, c.f));
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      tbl.appendChild(tb);
      box.appendChild(tbl);
      sec.appendChild(box);
    }
    return sec;
  }

  function inputSpecs(tab) {
    const specs = [];
    const scan = (r) => { if (r.in) specs.push(r.in); };
    tab.blocks.forEach((b) => {
      (b.rows || []).forEach((r) => { if (Array.isArray(r)) return; scan(r); });
      (b.cards || []).forEach((c) => c.fields.forEach(scan));
    });
    return specs;
  }

  function renderTab() {
    const tab = TABS.find((t) => t.id === state.tab);
    const view = $('#view');
    view.textContent = '';
    view.appendChild(h('h2', null, tab.title));
    if (tab.sub) view.appendChild(h('p', 'sub', tab.sub));
    tab.blocks.forEach((b) => view.appendChild(block(b)));
    const reset = h('button', 'reset', 'Ripristina i valori iniziali di questo tab');
    reset.type = 'button';
    reset.addEventListener('click', async () => {
      if (!(await ask('Riportare i dati di questo tab ai valori iniziali del foglio Excel?', 'Ripristina'))) return;
      inputSpecs(tab).forEach((s) => { state.values[s.id] = Core.DEFAULTS[s.id]; });
      save();
      renderTab();
      toast('Valori iniziali ripristinati');
    });
    view.appendChild(reset);
    refresh();
  }

  function refresh() {
    const out = Core.computeTab(state.tab, state.values);
    document.querySelectorAll('#view [data-o]').forEach((el) => {
      el.textContent = fmt(el.dataset.f, out[el.dataset.o]);
    });
    document.querySelectorAll('#view input[data-auto-flag]').forEach((inp) => {
      const auto = state.values[inp.dataset.autoFlag] !== 0;
      if (auto && typeof out[inp.dataset.id] === 'number') inp.value = out[inp.dataset.id].toFixed(2).replace('.', ',');
      const btn = inp.closest('.row').querySelector('.auto-btn');
      if (btn) btn.hidden = auto;
    });
    const plan = document.querySelector('#view tbody[data-plan]');
    if (plan && out.plan) {
      plan.textContent = '';
      out.plan.forEach((r) => {
        const tr = h('tr');
        [String(r.a), fmt('num2', r.s), fmt('num2', r.i), fmt('num2', r.e)].forEach((t) => tr.appendChild(h('td', null, t)));
        plan.appendChild(tr);
      });
    }
  }

  function commit(id, value) {
    state.values[id] = value;
    save();
    refresh();
  }

  function switchTab(id) {
    if (id === state.tab) return;
    state.tab = id;
    localStorage.setItem(LS_TAB, id);
    renderTabs();
    renderTab();
    window.scrollTo(0, 0);
  }

  /* Scorrimento tra i tab: la pagina segue il dito e, rilasciando oltre una certa distanza (o con uno scatto veloce), passa al tab vicino */
  const view = $('#view');
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabIndex = () => TABS.findIndex((x) => x.id === state.tab);
  const T_OUT = reduce ? 0 : 150, T_IN = reduce ? 0 : 220;
  let drag = null;
  let busy = false;

  function setView(x, op, ms, ease) {
    view.style.transition = ms ? 'transform ' + ms + 'ms ' + ease + ', opacity ' + ms + 'ms ' + ease : 'none';
    view.style.transform = x ? 'translateX(' + x + 'px)' : '';
    view.style.opacity = op === 1 ? '' : String(op);
  }

  document.addEventListener('touchstart', (e) => {
    if (busy || e.touches.length !== 1 || e.target.closest('#tabs, .scroll, input, select, dialog, .dock, .bar')) { drag = null; return; }
    const t = e.touches[0];
    drag = { x: t.clientX, y: t.clientY, time: Date.now(), mode: null, dx: 0 };
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!drag) return;
    const t = e.touches[0];
    const dx = t.clientX - drag.x, dy = t.clientY - drag.y;
    if (drag.mode === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      drag.mode = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v';
    }
    if (drag.mode !== 'h') return;
    drag.dx = dx;
    const i = tabIndex();
    const edge = (dx < 0 && i === TABS.length - 1) || (dx > 0 && i === 0);
    const shown = edge ? dx * 0.25 : dx;               // ai bordi la pagina "frena"
    setView(shown, 1 - Math.min(Math.abs(shown) / window.innerWidth, 0.6) * 0.7, 0);
  }, { passive: true });

  function release(cancelled) {
    const d = drag;
    drag = null;
    if (!d || d.mode !== 'h') return;
    const w = window.innerWidth;
    const dt = Math.max(1, Date.now() - d.time);
    const dir = d.dx < 0 ? 1 : -1;                      // 1 = tab successivo
    const next = tabIndex() + dir;
    const far = Math.abs(d.dx) > w * 0.22;
    const fast = Math.abs(d.dx) / dt > 0.45 && Math.abs(d.dx) > 40;
    if (cancelled || next < 0 || next >= TABS.length || !(far || fast)) {
      setView(0, 1, T_IN, 'ease-out');                  // torna a posto
      return;
    }
    busy = true;
    setView(-dir * w * 0.6, 0, T_OUT, 'ease-in');       // esce
    setTimeout(() => {
      switchTab(TABS[next].id);
      setView(dir * w * 0.6, 0, 0);                     // entra dal lato opposto
      void view.offsetWidth;
      setView(0, 1, T_IN, 'ease-out');
      setTimeout(() => { busy = false; }, T_IN);
    }, T_OUT);
  }
  document.addEventListener('touchend', () => release(false), { passive: true });
  document.addEventListener('touchcancel', () => release(true), { passive: true });

  function renderTabs() {
    const nav = $('#tabs');
    nav.textContent = '';
    TABS.forEach((t) => {
      const b = h('button', null, t.short);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(t.id === state.tab));
      b.dataset.tab = t.id;
      b.addEventListener('click', () => switchTab(t.id));
      nav.appendChild(b);
    });
    const active = nav.querySelector('[aria-selected="true"]');
    if (active && active.scrollIntoView) active.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  /* ---------- Avvisi e conferme ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }
  function ask(msg, okLabel) {
    return new Promise((resolve) => {
      const d = $('#dlg');
      $('#dlgMsg').textContent = msg;
      $('#dlgOk').textContent = okLabel || 'Conferma';
      const done = (v) => { d.close(); resolve(v); };
      $('#dlgOk').onclick = () => done(true);
      $('#dlgNo').onclick = () => done(false);
      d.oncancel = () => resolve(false);
      d.showModal();
    });
  }

  /* ---------- Backup e ripristino ---------- */
  const pad = (x) => String(x).padStart(2, '0');
  function stamp(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '_' + pad(d.getHours()) + pad(d.getMinutes());
  }
  function showLastBackup() {
    const iso = localStorage.getItem(LS_BK);
    $('#lastBackup').textContent = iso
      ? 'Ultimo backup: ' + new Date(iso).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Nessun backup ancora salvato';
  }
  function markBackup() {
    localStorage.setItem(LS_BK, new Date().toISOString());
    showLastBackup();
  }
  function download(file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function saveBackup() {
    const now = new Date();
    const text = JSON.stringify({ app: 'calcoli-bancari', version: 1, exportedAt: now.toISOString(), values: state.values }, null, 2);
    const name = 'calcoli-bancari-backup-' + stamp(now) + '.json';
    const file = new File([text], name, { type: 'application/json' });
    try {
      if (window.showSaveFilePicker) {                       // computer: finestra "Salva con nome"
        const handle = await window.showSaveFilePicker({
          suggestedName: name,
          types: [{ description: 'Backup Calcoli Bancari', accept: { 'application/json': ['.json'] } }]
        });
        const w = await handle.createWritable();
        await w.write(text);
        await w.close();
        markBackup();
        toast('Backup salvato');
        return;
      }
      if (navigator.canShare && navigator.canShare({ files: [file] })) {   // Android: scegli dove salvarlo
        await navigator.share({ files: [file], title: 'Backup Calcoli Bancari' });
        markBackup();
        toast('Backup salvato');
        return;
      }
      download(file);                                         // ripiego: cartella Download
      markBackup();
      toast('Backup scaricato nella cartella Download');
    } catch (e) {
      if (e && e.name === 'AbortError') return;               // scelta annullata
      try { download(file); markBackup(); toast('Backup scaricato nella cartella Download'); }
      catch (e2) { toast('Backup non riuscito'); }
    }
  }

  async function restoreFrom(file) {
    try {
      const data = JSON.parse(await file.text());
      if (!data || data.app !== 'calcoli-bancari' || typeof data.values !== 'object' || data.values === null) throw new Error('formato');
      if (!(await ask('Sostituire i dati attuali con quelli del backup?', 'Ripristina'))) return;
      const next = Object.assign({}, Core.DEFAULTS);
      mergeValues(next, data.values);
      state.values = next;
      save();
      renderTab();
      toast('Backup ripristinato');
    } catch (e) {
      toast('File non valido: scegli un backup di Calcoli Bancari');
    }
  }

  /* ---------- Avvio ---------- */
  $('#btnBackup').addEventListener('click', saveBackup);
  $('#btnRestore').addEventListener('click', () => $('#fileIn').click());
  $('#fileIn').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (f) restoreFrom(f);
  });

  renderTabs();
  renderTab();
  showLastBackup();
  save();

  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

  window.__calcoli = { state, TABS };   // utile per i test
})();
