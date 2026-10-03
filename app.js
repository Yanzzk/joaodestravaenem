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
    if (heading) {
      heading.tabIndex = -1;
      heading.style.outline = 'none';
      heading.focus({preventScroll:true});
    }
    window.scrollTo({top:0,behavior:'instant'});
  }
  function getQuestionIcon(id) {
    switch (Number(id)) {
      case 1:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
      case 2:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>`;
      case 3:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`;
      case 4:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
      case 5:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path><path d="M3 21v-5h5"></path></svg>`;
      case 6:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`;
    }
  }
  function question(data) {
    const expectedScreen = screen;
    app.insertAdjacentHTML('beforeend', `<section class="card"><div class="question"><div class="quiz-icon-badge" aria-hidden="true">${getQuestionIcon(data.id)}</div><h2>${escape(data.question)}</h2><div class="options">${data.options.map((option,index) => `<button class="option" type="button" data-option="${index}"><span class="option-emoji" aria-hidden="true">${escape(option.emoji)}</span><span>${escape(option.label)}</span></button>`).join('')}</div></div></section>`);
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
    app.insertAdjacentHTML('beforeend', `<section class="card final"><h2>${escape(config.finalHeadline)}</h2><div class="vsl-player-wrapper" role="region" aria-label="Apresentação do material"><video playsinline preload="metadata" poster="${escape(poster)}" src="${escape(videoUrl)}" aria-label="Vídeo de apresentação"></video><div class="vsl-center-play" aria-hidden="true"><div class="vsl-play-orb"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="7 4 19 12 7 20 7 4"></polygon></svg></div></div><div class="vsl-overlay"><div class="vsl-overlay-card"><div class="vsl-sound-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></div><p class="vsl-overlay-title">Seu próximo passo começa aqui</p><p class="vsl-overlay-subtitle">Toque abaixo para assistir à apresentação com som.</p><button class="vsl-cta-sound" type="button">Assistir com som</button><button class="vsl-restart-btn" type="button" hidden>Assistir do início</button></div></div><div class="vsl-buffer-spinner" hidden role="status" aria-label="Carregando"></div><div class="vsl-duration-track" role="progressbar" aria-label="Progresso do vídeo"><div class="vsl-duration-fill" style="width: 0%"></div></div></div><a class="primary final-cta" href="${escape(destination || '/pagina')}">Conhecer o kit de estudo</a></section>`);
    const root = app.querySelector('.vsl-player-wrapper');
    const video = root.querySelector('video');
    const overlay = root.querySelector('.vsl-overlay');
    const overlayTitle = root.querySelector('.vsl-overlay-title');
    const overlaySubtitle = root.querySelector('.vsl-overlay-subtitle');
    const mainPlay = root.querySelector('.vsl-cta-sound');
    const restart = root.querySelector('.vsl-restart-btn');
    const centerPlay = root.querySelector('.vsl-center-play');
    const progressFill = root.querySelector('.vsl-duration-fill');
    const buffer = root.querySelector('.vsl-buffer-spinner');
    const key = config.videoStorageKey || 'redacao-em-acao-video-v2';
    let saved = 0;
    try { saved = Math.max(0, Number(localStorage.getItem(key)) || 0); } catch {}
    if (saved > 3) {
      overlayTitle.textContent = 'Continue de onde parou';
      overlaySubtitle.textContent = 'Seu progresso ficou salvo neste aparelho.';
      mainPlay.textContent = 'Continuar assistindo';
      restart.hidden = false;
    }
    const save = () => {
      try { localStorage.setItem(key, String(video.ended ? 0 : video.currentTime)); } catch {}
    };
    let resumeRequested = false;
    let retryAttempts = 0;
    const play = () => {
      video.muted = false;
      video.play().then(() => {
        centerPlay.classList.add('playing');
        overlay.classList.add('hidden');
      }).catch(() => {
        video.muted = true;
        video.play().then(() => {
          centerPlay.classList.add('playing');
          overlay.classList.add('hidden');
        }).catch(() => {
          overlay.classList.remove('hidden');
          mainPlay.textContent = 'Toque para reproduzir';
        });
      });
    };
    root.addEventListener('click', (e) => {
      if (e.target.closest('.vsl-overlay-card') || e.target.closest('.vsl-restart-btn')) return;
      if (overlay.classList.contains('hidden')) {
        if (video.paused) play();
        else video.pause();
      }
    });
    mainPlay.addEventListener('click', (e) => {
      e.stopPropagation();
      resumeRequested = true;
      if (saved > 0 && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(saved, Math.max(0, video.duration - 1));
        saved = 0;
      }
      play();
    });
    restart.addEventListener('click', (e) => {
      e.stopPropagation();
      saved = 0;
      video.currentTime = 0;
      save();
      play();
    });
    video.addEventListener('play', () => {
      overlay.classList.add('hidden');
      centerPlay.classList.add('playing');
    });
    video.addEventListener('pause', () => {
      centerPlay.classList.remove('playing');
      save();
    });
    video.addEventListener('waiting', () => { if (!video.paused) buffer.hidden = false; });
    video.addEventListener('playing', () => {
      buffer.hidden = true;
      centerPlay.classList.add('playing');
    });
    video.addEventListener('canplay', () => { buffer.hidden = true; });
    video.addEventListener('loadedmetadata', () => {
      if (saved >= video.duration - 2) saved = 0;
      if (resumeRequested && saved > 0) {
        video.currentTime = saved;
        saved = 0;
      }
    });
    video.addEventListener('timeupdate', () => {
      const percent = Number.isFinite(video.duration) && video.duration > 0
        ? (video.currentTime / video.duration) * 100
        : 0;
      progressFill.style.width = `${percent}%`;
      save();
    });
    video.addEventListener('ended', () => {
      save();
      saved = 0;
      progressFill.style.width = '100%';
      centerPlay.classList.remove('playing');
      overlay.classList.remove('hidden');
      overlayTitle.textContent = 'Apresentação concluída';
      overlaySubtitle.textContent = 'Conheça o conteúdo do kit no botão abaixo.';
      mainPlay.textContent = 'Assistir novamente';
      restart.hidden = true;
    });
    video.addEventListener('error', () => {
      buffer.hidden = true;
      if (retryAttempts < 2) {
        retryAttempts++;
        setTimeout(() => { video.load(); play(); }, 800);
      }
    });
    const pageExit = () => save();
    window.addEventListener('pagehide', pageExit);
    cleanup = () => {
      save();
      video.pause();
      window.removeEventListener('pagehide', pageExit);
    };
  }
  render();
})();
