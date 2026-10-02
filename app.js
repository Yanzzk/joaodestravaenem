/* Reconstrução editável do frontend público. Sem coleta ou envio automático de respostas. */
(() => {
  'use strict';
  const config = window.QUIZ_CONFIG;
  const app = document.getElementById('app');
  if (!config || !Array.isArray(config.questions) || config.questions.length !== 6) {
    app.textContent = 'Não foi possível carregar o quiz. Verifique o arquivo config.js.';
    return;
  }
  let screen = 0;
  let locked = false;
  let cleanup = () => {};
  const answers = {};
  const clockAudio = new Audio(config.countdown.audioUrl);
  clockAudio.preload = 'none';
  clockAudio.loop = true;
  clockAudio.volume = Math.max(0, Math.min(1, config.countdown.audioVolume ?? 0.4));
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function safeUrl(value) {
    if (value === '/pagina' || value === 'pagina' || value === 'lp.html' || value === '/lp.html') return value;
    if (/^\/?assets\/[a-zA-Z0-9_./-]+$/.test(value)) return value;
    try { const url = new URL(value, window.location.origin); return (url.protocol === 'https:' || url.protocol === 'http:') ? value : ''; }
    catch { return ''; }
  }
  function next() {
    if (locked || screen >= 8) return;
    locked = true;
    screen++;
    render();
  }
  function render() {
    cleanup();
    cleanup = () => {};
    locked = false;
    app.className = screen === 7 ? 'transition-mode' : '';
    app.dataset.step = String(screen + 1);
    const progress = screen < 7 ? `<div class="progress-area">${screen ? `<div class="progress-track" role="progressbar" aria-label="Progresso do quiz" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${screen / 8 * 100}"><div class="progress-fill" style="width:${screen / 8 * 100}%"></div></div>` : ''}</div>` : '';
    app.innerHTML = progress;
    if (screen === 3) countdown();
    else if (screen === 7) transition();
    else if (screen === 8) finalScreen();
    else question(config.questions[screen < 3 ? screen : screen - 1]);
    const heading = app.querySelector('h2');
    if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    window.scrollTo({top:0,behavior:'instant'});
  }
  function question(data) {
    const expectedScreen = screen;
    app.insertAdjacentHTML('beforeend', `<section class="card"><div class="question"><div class="emoji" aria-hidden="true">${escape(data.headerEmoji)}</div><h2>${escape(data.question)}</h2><div class="options">${data.options.map((option,index) => `<button class="option" type="button" data-option="${index}"><span class="option-emoji" aria-hidden="true">${escape(option.emoji)}</span><span>${escape(option.label)}</span></button>`).join('')}</div></div></section>`);
    app.querySelectorAll('[data-option]').forEach(button => {
      button.addEventListener('click', () => {
        if (locked || screen !== expectedScreen) return;
        answers[data.id] = data.options[Number(button.dataset.option)].label;
        if (screen === 2) { next(); return; }
        // Prevent accidental double taps between questions.
        locked = true;
        app.querySelectorAll('[data-option]').forEach(item => item.disabled = true);
        const timer = setTimeout(() => { locked = false; next(); }, 220);
        cleanup = () => clearTimeout(timer);
      });
    });
  }
  function countdown() {
    const c = config.countdown;
    const duration = Math.max(1000, Number(c.autoAdvanceMs) || 8000);
    app.insertAdjacentHTML('beforeend', `<section class="card countdown" style="--timer:${duration}ms"><svg class="calendar" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/></svg><h2>Os dias estão passando...</h2><div class="date-rows"><div class="date-row">Hoje: ${escape(new Date().toLocaleDateString('pt-BR'))}</div><div class="date-row">${escape(c.eventLabel)} <span id="months"></span></div></div><div class="clock-panel"><p>Faltam aproximadamente:</p><div class="clock" aria-label="Contagem regressiva">${['DIAS','HORAS','MIN','SEG'].map((label,i) => `<div class="clock-cell"><div class="clock-value" id="clock-${i}">0</div><div class="clock-label">${label}</div></div>`).join('')}</div></div><p class="story">${escape(c.story)}</p><button class="sound-toggle" type="button" aria-label="Silenciar tic-tac">Som ligado</button><div><div class="timer-track"><div class="timer-fill"></div></div><button class="skip" type="button">Clique na tela para continuar ou aguarde...</button></div></section>`);
    const update = () => {
      const now = new Date();
      const target = new Date(c.targetDate);
      const seconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000) || 0);
      const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
      values.forEach((value,i) => { document.getElementById(`clock-${i}`).textContent = value; });
      const months = Math.max(0, (target.getFullYear() - now.getFullYear()) * 12 + target.getMonth() - now.getMonth() - (now.getDate() > target.getDate() ? 1 : 0));
      document.getElementById('months').textContent = Number.isFinite(months) ? `(Faltam ${months} Meses)` : '';
    };
    update();
    const tick = setInterval(update,1000);
    const timer = setTimeout(next,duration);
    const entered = Date.now();
    const soundButton = app.querySelector('.sound-toggle');
    let audioBlocked = false;
    clockAudio.muted = false;
    clockAudio.play().catch(() => { audioBlocked = true; soundButton.textContent = 'Ativar tic-tac'; soundButton.setAttribute('aria-label','Ativar tic-tac'); });
    soundButton.addEventListener('click', event => {
      event.stopPropagation();
      if (audioBlocked) { clockAudio.play().then(() => { audioBlocked=false; soundButton.textContent='Som ligado'; soundButton.setAttribute('aria-label','Silenciar tic-tac'); }).catch(() => { soundButton.textContent='Som indisponível'; }); return; }
      clockAudio.muted = !clockAudio.muted;
      soundButton.textContent = clockAudio.muted ? 'Som desligado' : 'Som ligado';
      soundButton.setAttribute('aria-label',clockAudio.muted ? 'Ativar tic-tac' : 'Silenciar tic-tac');
    });
    app.querySelector('.skip').addEventListener('click', event => { event.stopPropagation(); next(); });
    app.querySelector('.countdown').addEventListener('click', () => { if (Date.now() - entered > 300) next(); });
    cleanup = () => { clearInterval(tick); clearTimeout(timer); clockAudio.pause(); clockAudio.currentTime=0; };

  }
  function transition() {
    const t = config.transition;
    app.insertAdjacentHTML('beforeend', `<section class="transition-screen"><div class="transition-panel"><h2>${escape(t.title)}</h2><p>${escape(t.intro)}</p><p class="warning">${escape(t.warning)}</p><p class="closing">${escape(t.closing)}</p><button type="button" class="primary">${escape(t.button)}</button></div></section>`);
    app.querySelector('.primary').addEventListener('click',next);
  }
  function finalScreen() {
    const videoUrl = safeUrl(config.videoUrl);
    const poster = safeUrl(config.videoPoster);
    const destination = safeUrl(config.landingPage);
    app.insertAdjacentHTML('beforeend', `<section class="card final"><h2>${escape(config.finalHeadline)}</h2><div class="premium-player" role="region" aria-label="Vídeo de apresentação"><video playsinline preload="metadata" poster="${escape(poster)}" src="${escape(videoUrl)}" aria-label="Apresentação do material"></video><div class="player-overlay"><span class="play-orbit" aria-hidden="true">▶</span><p class="overlay-title">Seu próximo passo começa aqui</p><p class="overlay-subtitle">Assista à apresentação com som.</p><button class="overlay-play" type="button">Assistir com som</button><button class="overlay-restart" type="button" hidden>Assistir do início</button></div><div class="player-buffer" hidden role="status">Carregando vídeo…</div><div class="player-error" hidden role="alert"><p>Não foi possível carregar o vídeo.</p><button class="retry-video" type="button">Tentar novamente</button></div><div class="player-controls"><div class="control-row"><button class="play-toggle" type="button" aria-label="Reproduzir vídeo">▶</button><button class="mute-toggle" type="button" aria-label="Silenciar vídeo" aria-pressed="false">Som ligado</button><label class="volume-label">Volume<input class="volume-slider" aria-label="Volume do vídeo" type="range" min="0" max="1" step="0.05" value="1"></label><span class="video-time" aria-live="off">0:00 / 2:22</span><button class="fullscreen-toggle" type="button" aria-label="Tela cheia">⛶</button></div><label class="seek-label"><span class="sr-only">Posição no vídeo</span><input class="video-seek" aria-label="Posição no vídeo" type="range" min="0" max="100" step="0.1" value="0"></label></div></div><p class="player-hint">Você pode pausar, ajustar o som e continuar quando quiser.</p><a class="primary final-cta" href="${escape(destination || '/pagina')}">Conhecer o kit de estudo</a></section>`);
    const root = app.querySelector('.premium-player');
    const video = root.querySelector('video');
    const overlay = root.querySelector('.player-overlay');
    const overlayTitle = root.querySelector('.overlay-title');
    const overlaySubtitle = root.querySelector('.overlay-subtitle');
    const mainPlay = root.querySelector('.overlay-play');
    const restart = root.querySelector('.overlay-restart');
    const toggle = root.querySelector('.play-toggle');
    const mute = root.querySelector('.mute-toggle');
    const volume = root.querySelector('.volume-slider');
    const seek = root.querySelector('.video-seek');
    const clock = root.querySelector('.video-time');
    const buffer = root.querySelector('.player-buffer');
    const error = root.querySelector('.player-error');
    const key = config.videoStorageKey;
    let saved = 0, lastStored = 0, resumeRequested = false;
    try { saved = Math.max(0,Number(localStorage.getItem(key)) || 0); } catch {}
    if (saved > 3) {
      overlayTitle.textContent = 'Continue de onde parou';
      overlaySubtitle.textContent = 'Seu progresso ficou salvo neste aparelho.';
      mainPlay.textContent = 'Continuar assistindo'; restart.hidden = false;
    }
    const time = value => { value = Number.isFinite(value) ? Math.floor(value) : 0; return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`; };
    const save = () => { try { localStorage.setItem(key,String(video.ended ? 0 : video.currentTime)); } catch {} };
    const play = () => { error.hidden=true; video.play().catch(() => { buffer.hidden=true; overlay.hidden=false; mainPlay.textContent='Toque para reproduzir'; }); };
    mainPlay.addEventListener('click', () => {
      resumeRequested = true;
      if (saved > 0 && Number.isFinite(video.duration)) { video.currentTime = Math.min(saved,Math.max(0,video.duration-1)); saved=0; }
      play();
    });
    restart.addEventListener('click', () => { saved=0; video.currentTime=0; save(); play(); });
    toggle.addEventListener('click', () => video.paused ? play() : video.pause());
    video.addEventListener('click', () => video.paused ? play() : video.pause());
    mute.addEventListener('click', () => { video.muted=!video.muted; if (!video.muted && video.volume===0) video.volume=1; });
    volume.addEventListener('input', () => { video.volume=Number(volume.value); video.muted=video.volume===0; });
    video.addEventListener('volumechange', () => {
      const silent=video.muted||video.volume===0;
      mute.textContent=silent?'Ativar som':'Som ligado';mute.setAttribute('aria-label',silent?'Ativar som do vídeo':'Silenciar vídeo');mute.setAttribute('aria-pressed',String(silent));volume.value=String(silent?0:video.volume);
    });
    video.addEventListener('play', () => { overlay.hidden=true; toggle.textContent='Ⅱ'; toggle.setAttribute('aria-label','Pausar vídeo'); });
    video.addEventListener('playing', () => { buffer.hidden=true; });
    video.addEventListener('pause', () => {
      toggle.textContent='▶';toggle.setAttribute('aria-label','Reproduzir vídeo');buffer.hidden=true;save();
      if (!video.ended) { overlay.hidden=false;overlayTitle.textContent='Vídeo pausado';overlaySubtitle.textContent='Continue quando estiver pronto.';mainPlay.textContent='Continuar assistindo';restart.hidden=false; }
    });
    video.addEventListener('waiting', () => { if (!video.paused) buffer.hidden=false; });
    video.addEventListener('canplay', () => { buffer.hidden=true; });
    video.addEventListener('loadedmetadata', () => {
      if (saved >= video.duration-2) saved=0;
      if (resumeRequested && saved > 0) { video.currentTime=saved; saved=0; }
      clock.textContent=`${time(video.currentTime)} / ${time(video.duration)}`;
    });
    video.addEventListener('timeupdate', () => {
      const percent=Number.isFinite(video.duration)&&video.duration>0?video.currentTime/video.duration*100:0;
      seek.value=String(percent);seek.style.setProperty('--played',`${percent}%`);
      seek.setAttribute('aria-valuetext',`${time(video.currentTime)} de ${time(video.duration)}`);
      clock.textContent=`${time(video.currentTime)} / ${time(video.duration)}`;
      if (Math.abs(video.currentTime-lastStored)>2) { save();lastStored=video.currentTime; }
    });
    seek.addEventListener('input', () => { if(Number.isFinite(video.duration)) { saved=0;video.currentTime=Number(seek.value)/100*video.duration; } });
    video.addEventListener('ended', () => {
      save();saved=0;overlay.hidden=false;overlayTitle.textContent='Apresentação concluída';overlaySubtitle.textContent='Conheça o conteúdo do kit no botão abaixo.';mainPlay.textContent='Assistir novamente';restart.hidden=true;
    });
    video.addEventListener('error', () => { buffer.hidden=true;error.hidden=false;overlay.hidden=true; });
    root.querySelector('.retry-video').addEventListener('click', () => { video.load();play(); });
    root.querySelector('.fullscreen-toggle').addEventListener('click', async () => {
      try { if (document.fullscreenElement) await document.exitFullscreen(); else if(root.requestFullscreen) await root.requestFullscreen(); else if(video.webkitEnterFullscreen) video.webkitEnterFullscreen(); } catch {}
    });
    const pageExit=()=>save();window.addEventListener('pagehide',pageExit);
    cleanup = () => { save();video.pause();window.removeEventListener('pagehide',pageExit); };
  }
  render();
})();
