/* Portfolio Pierre-Olivier Lemoine : comportements communs */
(function () {
  // Lecteur vidéo léger : YouTube ne se charge qu'au clic
  document.querySelectorAll('[data-video]').forEach(function (p) {
    p.addEventListener('click', function () {
      if (p.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + p.dataset.video + '?autoplay=1&rel=0';
      f.title = p.dataset.title || 'Vidéo';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      p.appendChild(f);
      f.focus();
    });
  });

  // Onglets « la part de l'IA, la part de l'humain »
  var data = document.getElementById('focus-data');
  if (data) {
    var D = JSON.parse(data.textContent);
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role=tab]'));
    var cols = document.querySelectorAll('#focus-panel ul');
    var cta = document.getElementById('focus-cta');
    function show(t, moveFocus) {
      var d = D[t.dataset.app];
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
      });
      for (var i = 0; i < 3; i++) cols[i].innerHTML = d.cols[i].map(function (l) { return '<li>' + l + '</li>'; }).join('');
      cta.textContent = 'Voir la fiche complète : ' + d.name;
      cta.href = d.href;
      document.getElementById('focus-panel').setAttribute('aria-labelledby', t.id);
      if (moveFocus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); show(n, true); }
      });
    });
    show(tabs[0]);
  }
})();
