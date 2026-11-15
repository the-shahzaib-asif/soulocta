
(function(){
  var DM = window.DestinyMatrix;
  function show(scrollToResult){
    var out = document.getElementById('py-result');
    var raw = document.getElementById('py-dob').value;
    if(!raw){ out.innerHTML = '<p>Enter your birth date first.</p>'; return; }
    var iso = DM.parseDateInput(raw);
    if(!iso){ out.innerHTML = '<p>That date is not valid — enter a date between 1 January 1900 and 31 December ' + DM.maxYear + ' (e.g. 14 June 1995).</p>'; return; }
    var p = iso.split('-').map(Number);
    var r = DM.calcMatrix(p[0], p[1], p[2]);
    var py = DM.reduce22(r.A + r.B + DM.sumDigits(2027));
    var a = DM.arcana(py);
    out.innerHTML = '<h3>Your 2027 personal year: ' + py + ' · ' + DM.escapeHTML(a.name) + '</h3><p>' + DM.escapeHTML(a.short) + '</p><p class="muted small">Calculation: ' + r.A + ' (day) + ' + r.B + ' (month) + 11 (digit sum of 2027) = ' + (r.A + r.B + 11) + ' &rarr; ' + py + '.</p><p>Read the full meaning of <a href="22-arcana.html#arcana-' + py + '">' + DM.escapeHTML(a.name) + '</a> in the 22 arcana guide.</p>';
    // v12 A3: scroll the result into view after submit.
    if (scrollToResult) { out.scrollIntoView({behavior:'smooth', block:'start'}); }
  }
  document.getElementById('py-form').addEventListener('submit', function(e){ e.preventDefault(); show(true); });
  // v12 H2: the hero mini-form feeds the same calculator.
  var heroForm = document.getElementById('hero-form');
  if (heroForm) { heroForm.addEventListener('submit', function(e){ e.preventDefault(); var hv = document.getElementById('hero-dob').value; if (hv) { document.getElementById('py-dob').value = hv; } show(true); }); }
  var qp = new URLSearchParams(window.location.search);
  var dob = qp.get('dob');
  if (dob) {
    if (DM.validISO(dob)) { document.getElementById('py-dob').value = dob; show(false); document.getElementById('py-form').scrollIntoView({behavior:'auto', block:'start'}); }
    else { document.getElementById('py-result').innerHTML = '<p>That date is not valid — enter a date between 1 January 1900 and 31 December ' + DM.maxYear + '.</p>'; }
  }
  // v12 H5: on a plain load with no ?dob, render NOTHING — no
  // "Enter your birth date first." before the user does anything.
})();
