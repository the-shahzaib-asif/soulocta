
(function(){
  var DM = window.DestinyMatrix;
  document.querySelectorAll('.lt-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var out = form.parentElement.querySelector('.lt-result');
      var raw = form.querySelector('.lt-dob').value;
      if(!raw){ out.innerHTML = '<p>Enter your birth date first.</p>'; return; }
      var iso = DM.parseDateInput(raw);
      if(!iso){ out.innerHTML = '<p>That date is not valid — enter a date between 1 January 1900 and 31 December ' + DM.maxYear + ' (e.g. 14 June 1995).</p>'; return; }
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
      }
      out.innerHTML = html;
      // v12 A3: scroll the result into view after submit.
      out.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  // v12 H2: the hero mini-form feeds the same calculator.
  var heroForm = document.querySelector('.hero-form');
  if (heroForm) { heroForm.addEventListener('submit', function(e){ e.preventDefault(); var mainForm = document.querySelector('.lt-form'); var hv = heroForm.querySelector('.hero-dob').value; if (hv && mainForm) { mainForm.querySelector('.lt-dob').value = hv; } if (mainForm) { mainForm.dispatchEvent(new Event('submit', {cancelable:true})); } }); }
})();
