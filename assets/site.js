/* Portfolio Pierre-Olivier Lemoine : comportements communs */
(function () {
  var calme = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Vidéo d'ouverture : démarre sans le son, en boucle ; un bouton remet le son.
  // Si l'utilisateur limite les animations, elle attend un clic.
  document.querySelectorAll('.player[data-video]').forEach(function (p) {
    if (!p.dataset.label) p.dataset.label = p.querySelector('[data-play] span').textContent;
    var id = p.dataset.video, btn = p.querySelector('[data-play]'), label = btn.querySelector('span'), frame = null, sonActif = false;
    function commande(func, args) {
      if (frame) frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: args || [] }), '*');
    }
    function charger(muet) {
      if (frame) return;
      frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=' + (muet ? 1 : 0) +
        '&loop=1&playlist=' + id + '&controls=' + (muet ? 0 : 1) + '&rel=0&playsinline=1&modestbranding=1&enablejsapi=1';
      frame.title = p.dataset.title || 'Vidéo';
      frame.allow = 'autoplay; encrypted-media; picture-in-picture';
      frame.setAttribute('tabindex', '-1');
      p.insertBefore(frame, btn);
      p.classList.add('player--lecture');
      sonActif = !muet;
      maj();
    }
    function maj() {
      label.textContent = !frame ? (p.dataset.label || label.textContent) : (sonActif ? 'Couper le son' : 'Activer le son');
      btn.querySelector('svg').innerHTML = !frame ? '<path d="M8 5v14l11-7z"/>' : (sonActif ? '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a4 4 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2"/>' : '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2"/>');
      btn.setAttribute('aria-label', !frame ? 'Lire la vidéo : ' + (p.dataset.title || '') : label.textContent);
    }
    btn.addEventListener('click', function () {
      if (!frame) { charger(false); return; }
      sonActif = !sonActif;
      commande(sonActif ? 'unMute' : 'mute');
      if (sonActif) { commande('seekTo', [0, true]); commande('playVideo'); }
      maj();
    });
    if (!calme && p.hasAttribute('data-autoplay')) charger(true);
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
