
(function(){
  var DM = window.DestinyMatrix;
  var currentComb = null;
  function read(id){
    var v = document.getElementById(id).value;
    if(!v) return null;
    var iso = DM.parseDateInput(v);
    if(!iso) return 'invalid';
    var p = iso.split('-').map(Number);
    return DM.calcMatrix(p[0], p[1], p[2]);
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
    // C10/M2: reset chart, detail, table AND heading + centre line.
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
    var r1 = read('dob1'), r2 = read('dob2');
    var note = document.getElementById('compat-note');
    if(r1 === 'invalid' || r2 === 'invalid'){
      if(note) note.textContent = 'That date is not valid — enter dates between 1 January 1900 and 31 December ' + DM.maxYear + '.';
      resetStale(); return false;
    }
    if(!r1 || !r2){ if(note) note.textContent = 'Enter both dates to calculate compatibility.'; resetStale(); return false; }
    var comb = {}; ['A','B','C','D','E','F','G','H','I'].forEach(function(k){ comb[k] = DM.reduce22(r1[k] + r2[k]); });
    currentComb = comb;
    DM.renderChart('chart2', comb, 'D');
    var c = DM.arcana(comb.D);
    document.getElementById('compat-line').textContent = 'Combined centre: ' + comb.D + ' · ' + c.name + '. Person one centre ' + r1.D + ' (' + DM.arcana(r1.D).name + '), person two centre ' + r2.D + ' (' + DM.arcana(r2.D).name + ').';
    var h = document.getElementById('compat-heading');
    if (h) h.textContent = 'Combined chart — ' + DM.fmtDateLong(document.getElementById('dob1').value) + ' and ' + DM.fmtDateLong(document.getElementById('dob2').value);
    if (note) note.textContent = 'Chart shown: ' + DM.fmtDateLong(document.getElementById('dob1').value) + ' and ' + DM.fmtDateLong(document.getElementById('dob2').value) + '. Both dates are calculated in your browser and never leave your device.';
    document.getElementById('compat-detail').innerHTML = DM.detailHTML(comb, 'D');
    var tbl = document.getElementById('compat-table');
    if (tbl) { var wrap = document.createElement('div'); wrap.innerHTML = DM.tableHTML(comb); var n = wrap.firstChild; n.id = 'compat-table'; tbl.replaceWith(n); }
    return true;
  }
  document.getElementById('compat-form').addEventListener('submit', function(e){ e.preventDefault(); compute(); });
  document.getElementById('show-example-compat').addEventListener('click', function(){
    document.getElementById('dob1').value = '1995-06-14';
    document.getElementById('dob2').value = '1990-03-14';
    compute();
  });
  document.getElementById('download-png2').addEventListener('click', function(){ DM.downloadPNG('chart2', 'destiny-matrix-compatibility.png'); });
  resetStale();
})();
