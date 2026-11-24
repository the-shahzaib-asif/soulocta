
(function(){
  var DM = window.DestinyMatrix;
  DM.initDatePicker('hero');
  DM.initDatePicker('lt');
  DM.syncDatePickers('hero', 'lt'); /* v16: hero + main pickers stay in sync live */
  document.querySelectorAll('.lt-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var out = form.parentElement.querySelector('.lt-result');
      var iso = DM.dateFromSelects('lt');
      if(!iso){
        var d=document.getElementById('lt-day').value, m=document.getElementById('lt-month').value, y=document.getElementById('lt-year').value;
        var msg = 'Choose a day, month and year.';
        if(d&&m&&y){ var dim=DM.daysInMonth(+y,+m); var mn=['January','February','March','April','May','June','July','August','September','October','November','December'][+m-1]; msg = d+' '+mn+' '+y+' is not a real date — '+mn+' '+y+' has '+dim+' days.'; }
        out.innerHTML = '<p>' + DM.escapeHTML(msg) + '</p>'; return;
      }
      var p = iso.split('-').map(Number);
      var r = DM.calcMatrix(p[0], p[1], p[2]);
      var kind = form.getAttribute('data-kind');
      var nm = DM.escapeHTML(form.querySelector('.lt-name').value.trim());
      var html = '';
      if (kind === 'portrait-zone.html') {
        html = '<h3>' + (nm ? nm + "'s portrait zone" : 'Your portrait zone') + '</h3>' + DM.tableHTML(r, ['A','B','C','F','G']) +
        '<p>Your portrait zone is the upper part of your chart: day ' + r.A + ' (' + DM.escapeHTML(DM.arcana(r.A).name) + '), month ' + r.B + ' (' + DM.escapeHTML(DM.arcana(r.B).name) + '), year ' + r.C + ' (' + DM.escapeHTML(DM.arcana(r.C).name) + '), with heritage ' + r.F + ' and talents ' + r.G + '. Read these five together: they describe how you come across to the world.</p>';
      } else if (kind === 'money-line.html') {
        html = '<h3>' + (nm ? nm + "'s money line" : 'Your money line') + '</h3><p><strong>C — Year ' + r.C + ' · ' + DM.escapeHTML(DM.arcana(r.C).name) + '</strong> — direction and purpose.</p>' +
        '<p><strong>G — Talents ' + r.G + ' · ' + DM.escapeHTML(DM.arcana(r.G).name) + '</strong> — what earns well for you.</p>' +
        '<p><strong>H — Material ' + r.H + ' · ' + DM.escapeHTML(DM.arcana(r.H).name) + '</strong> — how money behaves in your life.</p>' +
        '<p>Money focus arcana: ' + DM.escapeHTML(DM.arcana(r.G).name) + ' (' + r.G + '). Read C, G, and H together: direction, talent, and material result.</p>';
      } else if (kind === 'karmic-tail.html') {
        html = '<h3>' + (nm ? nm + "'s karmic tail" : 'Your karmic tail') + '</h3><p><strong>D — Centre ' + r.D + ' · ' + DM.escapeHTML(DM.arcana(r.D).name) + '</strong> — the central lesson.</p>' +
        '<p><strong>H — Material ' + r.H + ' · ' + DM.escapeHTML(DM.arcana(r.H).name) + '</strong> and <strong>I — Spiritual task ' + r.I + ' · ' + DM.escapeHTML(DM.arcana(r.I).name) + '</strong> complete the tail.</p>' +
        '<p>Read D, H, and I together. They describe the pattern this system says repeats until it is faced honestly.</p>';
        var _tg = DM.guideURLForTail(r);
        if (_tg) { html += '<p class="guide-link">Your karmic tail is ' + r.D + '-' + r.H + '-' + r.I + ' — <a href="' + _tg.url + '">Read the ' + DM.escapeHTML(_tg.label) + ' guide &rarr;</a></p>'; }
      }
      out.innerHTML = html;
      out.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  var heroForm = document.querySelector('.hero-form');
  if (heroForm) { heroForm.addEventListener('submit', function(e){ e.preventDefault(); var mainForm = document.querySelector('.lt-form'); var hv = DM.dateFromSelects('hero'); if (hv && mainForm) { DM.setDateSelects('lt', hv); } if (mainForm) { mainForm.dispatchEvent(new Event('submit', {cancelable:true})); } }); }
})();
