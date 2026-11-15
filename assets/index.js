
(function(){
  var DM = window.DestinyMatrix;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var form = document.getElementById('calc-form');
  var dobEl = document.getElementById('dob');
  var nameEl = document.getElementById('pname');
  var params = new URLSearchParams(window.location.search);
  var current = null;
  var EXAMPLE = DM.calcMatrix(1995, 6, 14);
  function selectPos(key){
    if(!current) return;
    DM.renderChart('chart', current, key);
    document.getElementById('pos-detail').innerHTML = DM.detailHTML(current, key);
  }
  document.querySelectorAll('#chart .pos-btn').forEach(function(g){
    g.addEventListener('click', function(){ selectPos(g.getAttribute('data-pos')); });
    g.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); selectPos(g.getAttribute('data-pos')); } });
  });
  var echo = document.getElementById('date-echo');
  dobEl.addEventListener('change', function(){
    var iso = DM.parseDateInput(dobEl.value);
    if (echo) echo.textContent = iso ? DM.fmtDateLong(iso) : 'Day / Month / Year — e.g. 14 June 1995';
  });
  // M1: empty/invalid input resets EVERYTHING to the inviting ghost state —
  // chart, identity, share, open loop, pull-quote, card, ghost tag.
  function showGhost(){
    current = null;
    DM.renderChart('chart', EXAMPLE, 'D');
    var svg = document.getElementById('chart'); if (svg) { svg.classList.add('ghost'); svg.querySelectorAll('.ghost-watermark').forEach(function(t){ t.style.display = ''; }); }
    var gt = document.getElementById('ghost-tag'); if (gt) gt.hidden = false;
    var el2 = document.getElementById('example-label'); if (el2) el2.hidden = false;
    var idText = document.getElementById('identity-text'); if (idText) idText.hidden = true;
    var hero = document.getElementById('hero-centre');
    if (hero) { hero.innerHTML = '<span class="name">Your centre will appear here — enter your date below.</span>'; hero.setAttribute('aria-label', 'Your centre arcana appears here after you calculate'); }
    document.getElementById('centre-line').textContent = 'Centre 8 · Day 14 · Month 6 · Year 6 — 14 June 1995 (example).';
    document.getElementById('pos-detail').innerHTML = DM.detailHTML(EXAMPLE, 'D');
    var tbl = document.getElementById('pos-table');
    if (tbl) { var wrap0 = document.createElement('div'); wrap0.innerHTML = DM.tableHTML(EXAMPLE); var n0 = wrap0.firstChild; n0.id = 'pos-table'; tbl.replaceWith(n0); }
    var steps = document.getElementById('steps');
    if (steps) steps.innerHTML = DM.stepsHTML(1995, 6, 14, EXAMPLE);
    var pqs = document.getElementById('pull-quote-sec'); if (pqs) pqs.hidden = true;
    var share = document.getElementById('share-block'); if (share) share.hidden = true;
    var ol = document.getElementById('open-loop'); if (ol) ol.textContent = '';
    var img = document.getElementById('arcana-card-img');
    if (img) { img.src = 'assets/arcana-justice.webp'; img.alt = 'VIII — Justice, the centre arcana of the example chart'; }
    var cap = document.getElementById('arcana-card-caption');
    if (cap) cap.innerHTML = '<strong>VIII — Justice</strong>The example centre. Born on 14 June 1995? Your centre is 8.';
  }
  function run(fromUser){
    var iso = DM.parseDateInput(dobEl.value);
    var note = document.getElementById('form-note');
    if (!dobEl.value) { note.textContent = 'Enter your birth date first.'; showGhost(); return; }
    if (!iso) { note.textContent = 'That date is not valid — enter a date between 1 January 1900 and 31 December ' + DM.maxYear + ' (e.g. 14 June 1995).'; showGhost(); return; }
    var parts = iso.split('-').map(Number);
    current = DM.calcMatrix(parts[0], parts[1], parts[2]);
    var r = current;
    var nm = nameEl.value.trim();
    DM.renderChart('chart', r, 'D');
    var gt = document.getElementById('ghost-tag'); if (gt) gt.hidden = true;
    var el2 = document.getElementById('example-label'); if (el2) el2.hidden = true;
    var centre = DM.arcana(r.D);
    var art = DM.articleFor(r.D);
    // Q1: the example card LEAVES — it is swapped for the visitor's own
    // centre card, so one screen never shows two different centres.
    var img = document.getElementById('arcana-card-img');
    var cardFile = (r.D === 8) ? 'assets/arcana-justice.webp' : 'assets/arcana-' + (r.D < 10 ? '0' + r.D : r.D) + '.webp';
    if (img) { img.src = cardFile; img.alt = DM.roman(r.D) + ' — ' + centre.name + ', your centre arcana'; }
    var cap = document.getElementById('arcana-card-caption');
    if (cap) cap.innerHTML = '<strong>' + DM.escapeHTML(DM.roman(r.D)) + ' — ' + DM.escapeHTML(centre.name) + '</strong>' + (nm ? DM.escapeHTML(nm) + '’s centre. ' : 'Your centre. ') + 'Born on ' + DM.escapeHTML(DM.fmtDateLong(iso)) + '? Your centre is ' + r.D + '.';
    // Q5: identity is the H1-scale line now (CSS), sharing a screen with
    // the filled chart; the result section below is data only.
    var idText = document.getElementById('identity-text');
    idText.textContent = (nm ? nm + ', you are ' : 'You are ') + art + ' ' + r.D + ' — ' + centre.name + '.';
    idText.hidden = false;
    document.getElementById('centre-line').textContent = 'Centre ' + r.D + ' · Day ' + r.A + ' · Month ' + r.B + ' · Year ' + r.C + ' — ' + DM.fmtDateLong(iso);
    document.getElementById('pos-detail').innerHTML = DM.detailHTML(r, 'D');
    var hero = document.getElementById('hero-centre');
    if (hero) { var isExample = (iso === '1995-06-14');
      hero.innerHTML = (isExample ? '<span class="example-tag">Example</span>' : '') + '<span class="num">' + DM.escapeHTML(DM.roman(r.D)) + '</span> <span class="name">' + DM.escapeHTML(centre.name) + ' — centre, ' + DM.escapeHTML(DM.fmtDateLong(iso)) + '</span>';
      hero.setAttribute('aria-label', (isExample ? 'Example centre arcana' : 'Centre arcana ' + r.D + ', ' + centre.name + ', ' + DM.fmtDateLong(iso))); }
    if (note) { note.textContent = (iso === '1995-06-14')
      ? 'Example shown: 14 June 1995. Change the date and press Calculate. Or open a link someone shared with you.'
      : 'Chart shown: ' + DM.fmtDateLong(iso) + '. Change the date and press Calculate. Or open a link someone shared with you.'; }
    var tbl = document.getElementById('pos-table');
    if (tbl) { var wrap = document.createElement('div'); wrap.innerHTML = DM.tableHTML(r); var n = wrap.firstChild; n.id = 'pos-table'; tbl.replaceWith(n); }
    var steps = document.getElementById('steps');
    if (steps) steps.innerHTML = DM.stepsHTML(parts[0], parts[1], parts[2], r);
    // Q13: pull-quote only AFTER Calculate, with the visitor's own centre.
    var pqs = document.getElementById('pull-quote-sec');
    var pq = document.getElementById('pull-quote');
    if (pq) pq.textContent = '“' + centre.short + '” — ' + centre.name + ', your centre.';
    if (pqs) pqs.hidden = false;
    var share = document.getElementById('share-block');
    if (share) {
      share.hidden = false;
      // Q10: share preview is an IDENTITY card, not a diagram.
      var scNum = document.getElementById('share-card-num');
      if (scNum) scNum.textContent = DM.roman(r.D);
      var scName = document.getElementById('share-card-name');
      if (scName) scName.textContent = centre.name;
      var scLine = document.getElementById('share-card-line');
      if (scLine) scLine.textContent = (nm ? nm + ' is ' : 'I am ') + art + ' ' + r.D + ' — ' + centre.name + '. ' + centre.short;
      var scWho = document.getElementById('share-card-who');
      if (scWho) scWho.textContent = 'soulocta.me';
      var py = DM.reduce22(r.A + r.B + DM.sumDigits(2027));
      var pa = DM.arcana(py);
      document.getElementById('open-loop').innerHTML = 'Your 2027 is ' + DM.articleFor(py) + ' ' + py + ' — ' + DM.escapeHTML(pa.name) + '. <a href="2027-personal-year.html?dob=' + iso + '">See your 2027 &rarr;</a>';
    }
    history.replaceState(null, '', DM.shareURL(iso));
    // v12 A2: scroll the CALCULATOR card into view (block:start + 84px
    // scroll-margin for the sticky nav) — ONLY on a user submit, never
    // on a ?dob= load. The old code centred the identity line, which
    // pushed the calculator below the fold (95% below it at 360px).
    if (fromUser) { document.getElementById('calculator').scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block:'start'}); }
  }
  form.addEventListener('submit', function(e){ e.preventDefault(); run(true); });
  // v12 H2: the hero mini-form feeds the same calculator.
  var heroForm = document.getElementById('hero-form');
  if (heroForm) { heroForm.addEventListener('submit', function(e){ e.preventDefault(); var hv = document.getElementById('hero-dob').value; if (hv) { dobEl.value = hv; } run(true); }); }
  document.getElementById('show-example').addEventListener('click', function(){ dobEl.value = '1995-06-14'; run(true); });
  document.getElementById('copy-link').addEventListener('click', function(){
    var btn = this;
    var url = DM.shareURL(dobEl.value);
    var shareNote = document.getElementById('share-note');
    function done(){ btn.textContent = 'Copied ✓'; shareNote.textContent = 'Link copied: ' + url; setTimeout(function(){ btn.textContent = 'Copy your chart link'; }, 2000); }
    function fallback(){
      // L4: no prompt() — show the link in a readonly input to select.
      shareNote.textContent = 'Copy this link: ';
      var inp = document.createElement('input');
      inp.type = 'text'; inp.readOnly = true; inp.value = url;
      inp.style.width = '100%'; inp.style.marginTop = '8px';
      shareNote.appendChild(inp); inp.select();
      var ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select();
      try { if (document.execCommand('copy')) { done(); } } catch (e) {}
      ta.remove();
    }
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(url).then(done, fallback); }
    else { fallback(); }
  });
  document.getElementById('download-png').addEventListener('click', function(){ DM.downloadPNG('chart', 'destiny-matrix-chart.png'); });
  var qp = params.get('dob');
  if (qp) {
    if (DM.validISO(qp)) { dobEl.value = qp; run(false); }
    else { document.getElementById('form-note').textContent = 'That date is not valid — enter a date between 1 January 1900 and 31 December ' + DM.maxYear + '.'; history.replaceState(null, '', window.location.pathname); showGhost(); }
  }
})();
