
(function(){
  var DM = window.DestinyMatrix;
  function invalidMessage(){
    var d=document.getElementById('py-day').value, m=document.getElementById('py-month').value, y=document.getElementById('py-year').value;
    if(!d||!m||!y) return 'Choose a day, month and year.';
    var dim=DM.daysInMonth(+y,+m); var mn=['January','February','March','April','May','June','July','August','September','October','November','December'][+m-1];
    return d+' '+mn+' '+y+' is not a real date — '+mn+' '+y+' has '+dim+' days.';
  }
  function show(scrollToResult){
    var out = document.getElementById('py-result');
    var iso = DM.dateFromSelects('py');
    if(!iso){ out.innerHTML = '<p>' + DM.escapeHTML(invalidMessage()) + '</p>'; return; }
    var p = iso.split('-').map(Number);
    var r = DM.calcMatrix(p[0], p[1], p[2]);
    var py = DM.reduce22(r.A + r.B + DM.sumDigits(2027));
    var a = DM.arcana(py);
    out.innerHTML = '<h3>Your 2027 personal year: ' + py + ' · ' + DM.escapeHTML(a.name) + '</h3><p>' + DM.escapeHTML(a.short) + '</p><p class="muted small">Calculation: ' + r.A + ' (day) + ' + r.B + ' (month) + 11 (digit sum of 2027) = ' + (r.A + r.B + 11) + ' &rarr; ' + py + '.</p><p>Read the full meaning of <a href="22-arcana.html#arcana-' + py + '">' + DM.escapeHTML(a.name) + '</a> in the 22 arcana guide.</p>';
    if (scrollToResult) { out.scrollIntoView({behavior:'smooth', block:'start'}); }
  }
  document.getElementById('py-form').addEventListener('submit', function(e){ e.preventDefault(); show(true); });
  var heroForm = document.getElementById('hero-form');
  if (heroForm) { heroForm.addEventListener('submit', function(e){ e.preventDefault(); var hv = DM.dateFromSelects('hero-py'); if (hv) { DM.setDateSelects('py', hv); } show(true); }); }
  var qp = new URLSearchParams(window.location.search);
  var dob = qp.get('dob');
  if (dob) {
    if (DM.validISO(dob)) { DM.setDateSelects('py', dob); show(false); document.getElementById('py-form').scrollIntoView({behavior:'auto', block:'start'}); }
    else { document.getElementById('py-result').innerHTML = '<p>That date is not valid — enter a date between 1 January 1900 and 31 December ' + DM.maxYear + '.</p>'; }
  }
})();
