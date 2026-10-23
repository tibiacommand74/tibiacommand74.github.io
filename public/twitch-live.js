(() => {
  'use strict';
  const channels = [];
  function setupChannel(channel, label, suffix = '') {
    const section = document.getElementById('community-live' + suffix);
    const mount = document.getElementById('twitch-player' + suffix);
    const mobileNote = document.getElementById('twitch-mobile-note' + suffix);
    const status = document.getElementById('twitch-status' + suffix);
    const banner = document.getElementById('twitch-live-banner' + suffix);
    if (!section || !mount || !status || !banner) return;
    const showHome = () => { section.hidden = !!location.hash && location.hash !== '#inicio'; };
    showHome();
    window.addEventListener('hashchange', showHome);
    let player = null;
    let state = 'unknown';
    let generation = 0;
    let timeout;
    const setState = value => {
      state = value;
      section.dataset.liveState = value;
      banner.hidden = value !== 'online';
      document.querySelectorAll('[data-twitch-live-badge]').forEach(badge => {
        if ((badge.dataset.twitchLiveBadge || 'kingninhow') === channel) badge.hidden = value !== 'online';
      });
      status.textContent = value === 'online' ? 'AO VIVO AGORA' : value === 'offline'
        ? 'Fora do ar — siga o canal para acompanhar a próxima live.'
        : 'Confira a transmissão e os horários no canal.';
    };
    const start = () => {
      if (!window.Twitch || !window.Twitch.Player || document.hidden || section.hidden || mount.hidden) return;
      if (state === 'online' && mount.querySelector('iframe')) return;
      const current = ++generation;
      clearTimeout(timeout);
      setState('unknown');
      // Replace only while offline/unknown; never interrupt a confirmed live.
      mount.replaceChildren();
      try {
        player = new Twitch.Player('twitch-player' + suffix, {
          channel, parent: [location.hostname],
          width: '100%', height: '100%', autoplay: false, muted: true
        });
        const update = value => {
          if (current !== generation) return;
          clearTimeout(timeout);
          setState(value);
        };
        player.addEventListener(Twitch.Player.ONLINE, () => update('online'));
        player.addEventListener(Twitch.Player.OFFLINE, () => update('offline'));
        player.addEventListener(Twitch.Player.ENDED, () => update('unknown'));
        const frame = mount.querySelector('iframe');
        if (frame) frame.title = 'Live de ' + label + ' na Twitch';
        timeout = setTimeout(() => {
          if (current === generation && state === 'unknown') setState('unknown');
        }, 20000);
      } catch (_) {
        setState('unknown');
      }
    };
    const resizePlayer = () => {
      if(section.hidden) return;
      const narrow = mount.parentElement.clientWidth < 400;
      mount.hidden = narrow;
      if(mobileNote) mobileNote.hidden = !narrow;
      if(narrow){generation++;clearTimeout(timeout);mount.replaceChildren();setState('unknown');}
      else if(!mount.querySelector('iframe')) start();
    };
    window.addEventListener('hashchange', resizePlayer);
    window.addEventListener('resize', resizePlayer);
    if(window.ResizeObserver)new ResizeObserver(resizePlayer).observe(mount.parentElement);
    resizePlayer();
    setState('unknown');
    channels.push({ ready: resizePlayer, error: () => setState('unknown') });
    // Recheck an idle channel without starting playback or requiring a page reload.
    setInterval(() => {
      if (!document.hidden && state !== 'online') start();
    }, 120000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) start();
    });
  }
  setupChannel('kingninhow', 'Kingninhow');
  setupChannel('kingstwv', 'Kingstwv', '-kingstwv');
  if (!channels.length) return;
  const sdk = document.createElement('script');
  sdk.src = 'https://player.twitch.tv/js/embed/v1.js';
  sdk.async = true;
  sdk.onload = () => channels.forEach(channel => channel.ready());
  sdk.onerror = () => channels.forEach(channel => channel.error());
  document.head.appendChild(sdk);
})();
