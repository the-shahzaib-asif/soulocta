
(function(){
  var DM = window.DestinyMatrix;
  DM.initDatePicker('dob1');
  DM.initDatePicker('dob2');
  var currentComb = null;
  var currentIso1 = null, currentIso2 = null;
  function readPerson(prefix){
    var iso = DM.dateFromSelects(prefix);
    if(!iso) return 'invalid';
    var p = iso.split('-').map(Number);
    return {iso: iso, r: DM.calcMatrix(p[0], p[1], p[2])};
  }
  function invalidMessage(prefix, who){
    var d=document.getElementById(prefix+'-day').value, m=document.getElementById(prefix+'-month').value, y=document.getElementById(prefix+'-year').value;
    if(!d||!m||!y) return who + ': choose a day, month and year.';
    var dim = DM.daysInMonth(+y, +m);
    var monthName = ['January','February','March','April','May','June','July','August','September','October','November','December'][+m-1];
    return who + ': ' + d + ' ' + monthName + ' ' + y + ' is not a real date — ' + monthName + ' ' + y + ' has ' + dim + ' days.';
  }
  function selectPos2(key){
    if(!currentComb) return;
    DM.renderChart('chart2', currentComb, key);
    document.getElementById('compat-detail').innerHTML = DM.detailHTML(currentComb, key);
  }
  document.querySelectorAll('#chart2 .pos-btn').forEach(function(g){
    g.addEventListener('click', function(){ selectPos2(g.getAttribute('data-pos')); });
    g.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); selectPos2(g.getAttribute('data-pos')); } });
  });
  function resetStale(){
    DM.renderNeutral('chart2');
    currentComb = null;
    var h = document.getElementById('compat-heading');
    if (h) h.textContent = 'Combined chart';
    var line = document.getElementById('compat-line');
    if (line) line.textContent = 'Enter both dates to calculate compatibility.';
    document.getElementById('compat-detail').innerHTML = '<h3>Enter both dates</h3><p class="muted">The combined chart will appear here once both birth dates are valid.</p>';
    var tbl = document.getElementById('compat-table');
    if (tbl) tbl.innerHTML = '<p class="muted">Combined positions will appear here.</p>';
  }
  function compute(){
    var p1 = readPerson('dob1'), p2 = readPerson('dob2');
    var note = document.getElementById('compat-note');
    if(p1 === 'invalid' || p2 === 'invalid'){
      var msg = '';
      if(p1 === 'invalid') msg += invalidMessage('dob1', 'First person');
      if(p2 === 'invalid') msg += (msg ? ' ' : '') + invalidMessage('dob2', 'Second person');
      DM.showFormError('compat-error', msg);
      if(note) note.textContent = 'Enter both dates to calculate compatibility.';
      resetStale(); return false;
    }
    DM.showFormError('compat-error', null);
    var r1 = p1.r, r2 = p2.r, iso1 = p1.iso, iso2 = p2.iso;
    currentIso1 = iso1; currentIso2 = iso2;
    var comb = {}; ['A','B','C','D','E','F','G','H','I'].forEach(function(k){ comb[k] = DM.reduce22(r1[k] + r2[k]); });
    currentComb = comb;
    DM.renderChart('chart2', comb, 'D');
    var c = DM.arcana(comb.D);
    document.getElementById('compat-line').textContent = 'Combined centre: ' + comb.D + ' · ' + c.name + '. Person one centre ' + r1.D + ' (' + DM.arcana(r1.D).name + '), person two centre ' + r2.D + ' (' + DM.arcana(r2.D).name + ').';
    var h = document.getElementById('compat-heading');
    if (h) h.textContent = 'Combined chart — ' + DM.fmtDateLong(iso1) + ' and ' + DM.fmtDateLong(iso2);
    if (note) note.textContent = 'Chart shown: ' + DM.fmtDateLong(iso1) + ' and ' + DM.fmtDateLong(iso2) + '. Both dates are calculated in your browser and never leave your device.';
    document.getElementById('compat-detail').innerHTML = DM.detailHTML(comb, 'D');
    var tbl = document.getElementById('compat-table');
    if (tbl) { var wrap = document.createElement('div'); wrap.innerHTML = DM.tableHTML(comb); var n = wrap.firstChild; n.id = 'compat-table'; tbl.replaceWith(n); }
    var _h = document.getElementById('compat-heading');
    if (_h) { _h.scrollIntoView({behavior:'smooth', block:'start'}); }
    return true;
  }
  document.getElementById('compat-form').addEventListener('submit', function(e){ e.preventDefault(); compute(); });
  document.getElementById('show-example-compat').addEventListener('click', function(){
    DM.setDateSelects('dob1', '1995-06-14');
    DM.setDateSelects('dob2', '1990-03-14');
    compute();
  });
  document.getElementById('download-png2').addEventListener('click', function(){ DM.downloadPNG('chart2', 'destiny-matrix-compatibility.png'); });
  document.getElementById('download-card2').addEventListener('click', function(){
    if(!currentComb || !currentIso1 || !currentIso2){
      var _e = document.getElementById('png-error');
      if(_e){ _e.textContent = 'Calculate compatibility first, then download your chart card.'; _e.hidden = false; }
      return;
    }
    DM.downloadChartCard('chart2', {name: '', dateLabel: DM.fmtDateLong(currentIso1) + '  +  ' + DM.fmtDateLong(currentIso2), r: currentComb}, 'destiny-matrix-compatibility-card.png');
  });
  var qp = new URLSearchParams(window.location.search);
  var q1 = qp.get('dob1'), q2 = qp.get('dob2');
  if (q1 && DM.validISO(q1)) DM.setDateSelects('dob1', q1);
  if (q2 && DM.validISO(q2)) DM.setDateSelects('dob2', q2);
  if (q1 || q2) { var _ok = compute(); if (!_ok) resetStale(); }
})();
