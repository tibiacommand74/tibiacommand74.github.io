(() => {
  'use strict';
  const section = document.getElementById('community-live');
  const panel = document.getElementById('twitch-watch-panel');
  const mount = document.getElementById('twitch-player');
  const status = document.getElementById('twitch-status');
  const mobileNote = document.getElementById('twitch-mobile-note');
  const mobileLink = document.getElementById('twitch-mobile-link');
  const closeButton = document.getElementById('twitch-close-player');
  if (!section || !panel || !mount || !status || !mobileNote || !mobileLink || !closeButton) return;
  const labels = {kingninhow: 'Kingninhow', kingstwv: 'Kingstwv'};
  const buttons = [...section.querySelectorAll('[data-watch-stream]')];
  let selected = null, player = null, generation = 0, sdkPromise = null;
  const states = Object.fromEntries(Object.keys(labels).map(channel => [channel, 'unknown']));
  const setState = (channel, state) => {
    states[channel] = state;
    const card = section.querySelector('[data-streamer="' + channel + '"]');
    if (card) card.dataset.state = state;
    const liveCount = document.getElementById('streamer-live-count');
    const count = Object.values(states).filter(value => value === 'online').length;
    if (liveCount) {
      liveCount.textContent = count ? count + (count === 1 ? ' canal transmitindo' : ' canais transmitindo') : Object.values(states).every(value => value === 'offline') ? 'Siga os canais para acompanhar' : 'Confira os canais na Twitch';
      liveCount.classList.toggle('has-live', count > 0);
    }
    document.querySelectorAll('[data-twitch-live-badge]').forEach(badge => {
      if ((badge.dataset.twitchLiveBadge || 'kingninhow') === channel) badge.hidden = state !== 'online';
    });
    const label = section.querySelector('[data-stream-status="' + channel + '"]');
    if (label) label.textContent = state === 'offline' ? 'OFFLINE' : state === 'unknown' ? 'Ver na Twitch' : '';
    const watch = buttons.find(button => button.dataset.watchStream === channel);
    if (watch) watch.setAttribute('aria-label', (state === 'online' ? 'Assistir live de ' : 'Abrir transmissão de ') + labels[channel]);
    if (selected === channel) status.textContent = labels[channel] + (state === 'online' ? ' · Ao vivo' : state === 'offline' ? ' · Fora do ar' : ' · Transmissão na Twitch');
  };
  const clearPlayer = () => {
    generation++;
    if (player) { try { player.pause(); } catch (_) {} }
    player = null;
    mount.replaceChildren();

  };
  const loadSDK = () => {
    if (window.Twitch?.Player) return Promise.resolve();
    if (!sdkPromise) sdkPromise = new Promise((resolve, reject) => {
      const sdk = document.createElement('script');
      sdk.src = 'https://player.twitch.tv/js/embed/v1.js';
      sdk.async = true;
      sdk.onload = resolve;
      sdk.onerror = () => { sdkPromise = null; reject(new Error('Twitch unavailable')); };
      document.head.appendChild(sdk);
    });
    return sdkPromise;
  };
  const resizePlayer = () => {
    if (!selected || panel.hidden || section.hidden) return;
    const narrow = mount.parentElement.clientWidth < 400;
    mount.hidden = narrow;
    mobileNote.hidden = !narrow;
    if (narrow) { if (player) clearPlayer(); return; }
    if (player) return;
    const channel = selected, current = ++generation;
    status.textContent = 'Carregando ' + labels[channel] + '…';
    loadSDK().then(() => {
      if (current !== generation || selected !== channel || panel.hidden || section.hidden) return;
      player = new window.Twitch.Player('twitch-player', {channel, parent: [location.hostname], width: '100%', height: '100%', autoplay: false, muted: true});
      const update = state => { if (current === generation && selected === channel) setState(channel, state); };
      player.addEventListener(window.Twitch.Player.ONLINE, () => update('online'));
      player.addEventListener(window.Twitch.Player.OFFLINE, () => update('offline'));
      player.addEventListener(window.Twitch.Player.ENDED, () => update('unknown'));
      const frame = mount.querySelector('iframe');
      if (frame) frame.title = 'Live de ' + labels[channel] + ' na Twitch';
      setState(channel, states[channel]);
    }).catch(() => {
      if (current !== generation) return;
      mount.hidden = true;
      mobileNote.hidden = false;
      status.textContent = 'Abra ' + labels[channel] + ' na Twitch para assistir.';
    });
  };
  const close = (focus = false) => {
    const previous = selected;
    clearPlayer(); selected = null; panel.hidden = true;
    buttons.forEach(button => button.setAttribute('aria-expanded', 'false'));
    if (focus) buttons.find(button => button.dataset.watchStream === previous)?.focus();
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    const channel = button.dataset.watchStream;
    if (!labels[channel]) return;
    clearPlayer(); selected = channel; panel.hidden = false;
    mobileLink.href = 'https://www.twitch.tv/' + channel;
    mobileLink.textContent = 'Abrir ' + labels[channel] + ' na Twitch ↗';
    buttons.forEach(other => other.setAttribute('aria-expanded', String(other === button)));
    setState(channel, states[channel]); resizePlayer();
  }));
  closeButton.addEventListener('click', () => close(true));
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') close(true); });
  const showHome = () => {
    section.hidden = !!location.hash && location.hash !== '#inicio';
    if (section.hidden) close();
  };
  let checking = false;
  const refreshPresence = async () => {
    if (checking || document.hidden) return;
    checking = true;
    try {
      await Promise.all(Object.keys(labels).map(async channel => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 10000);
        try {
          const response = await fetch('https://decapi.me/twitch/uptime/' + channel, {signal: controller.signal, credentials: 'omit', cache: 'no-store'});
          if (!response.ok) throw new Error('Presence unavailable');
          const text = (await response.text()).trim();
          // Accept only the documented offline response or an uptime, never an error as live.
          const state = new RegExp('^' + channel + ' is offline[.!]?$', 'i').test(text) ? 'offline' : /^\d+ (?:years?|months?|weeks?|days?|hours?|minutes?|seconds?)(?:, \d+ (?:years?|months?|weeks?|days?|hours?|minutes?|seconds?))*$/.test(text) ? 'online' : 'unknown';
          setState(channel, state);
        } catch (_) { setState(channel, 'unknown'); }
        finally { window.clearTimeout(timeout); }
      }));
    } finally { checking = false; }
  };
  refreshPresence();
  window.setInterval(refreshPresence, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshPresence(); });
  showHome();
  window.addEventListener('hashchange', showHome);
  window.addEventListener('resize', resizePlayer);
  if (window.ResizeObserver) new window.ResizeObserver(resizePlayer).observe(mount.parentElement);
})();
