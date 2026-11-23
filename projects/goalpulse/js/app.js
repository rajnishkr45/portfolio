import {
    TEMPLATES,
    PRESETS,
    createDefaultState,
    loadState,
    saveState,
    encodeStateToUrl,
  } from './state.js';
  import { getCountdownMetrics, getLiveOsClock } from './timer.js';
  import { renderTemplate } from './templates.js';
  import { exportWallpaperPng } from './exporter.js';
  
  const el = {
    themeToggle: document.getElementById('btn-theme-toggle'),
    resetBtn: document.getElementById('btn-reset'),
    presetList: document.getElementById('preset-list'),
    templateList: document.getElementById('template-list'),
  
    inputTitle: document.getElementById('input-title'),
    inputTargetDate: document.getElementById('input-target-date'),
  
    addMilestoneBtn: document.getElementById('btn-add-milestone'),
    milestoneList: document.getElementById('milestone-editor-list'),
  
    deviceMobileBtn: document.getElementById('btn-device-mobile'),
    deviceDesktopBtn: document.getElementById('btn-device-desktop'),
    osOverlayToggle: document.getElementById('toggle-os-overlay'),
  
    copyLinkBtn: document.getElementById('btn-copy-link'),
    downloadBtn: document.getElementById('btn-download-png'),
  
    deviceFrame: document.getElementById('device-frame'),
    exportCanvas: document.getElementById('export-canvas'),
    osOverlay: document.getElementById('os-overlay'),
    toast: document.getElementById('toast'),
  };
  
  let state = loadState();
  let activePresetId = null;
  let toastTimer = null;
  
  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('is-visible'), 2200);
  }
  
  function initThemeToggle() {
    el.themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('deadline-studio-theme', next);
    });
  }
  
  function renderPresets() {
    el.presetList.innerHTML = PRESETS.map(
      (p) => `
        <button type="button" class="choice-card ${activePresetId === p.id ? 'is-active' : ''}" data-preset="${p.id}">
          <span class="choice-card-title">${p.name}</span>
        </button>
      `
    ).join('');
  }
  
  function renderTemplatePicker() {
    el.templateList.innerHTML = TEMPLATES.map(
      (t) => `
        <button type="button" class="choice-card ${state.template === t.id ? 'is-active' : ''}" data-template="${t.id}">
          <span class="choice-card-title">${t.name}</span>
        </button>
      `
    ).join('');
  }
  
  function syncFormInputs() {
    el.inputTitle.value = state.title || '';
    el.inputTargetDate.value = state.targetDate || '';
    el.osOverlayToggle.checked = Boolean(state.showOsOverlay);
  
    el.deviceMobileBtn.classList.toggle('is-active', state.device === 'mobile');
    el.deviceDesktopBtn.classList.toggle('is-active', state.device === 'desktop');
  }
  
  function renderMilestoneEditor() {
    el.milestoneList.innerHTML = state.milestones
      .map(
        (ms, index) => `
        <div class="milestone-row" data-index="${index}">
          <button type="button" class="status-cycle-btn" data-action="cycle-status" title="Cycle status">
            <span class="status-dot ${ms.status}"></span>
          </button>
          <input type="text" class="milestone-inline-input" data-field="text" maxlength="34" value="${ms.text.replace(/"/g, '&quot;')}" placeholder="Milestone" />
          <input type="text" class="milestone-inline-input milestone-date-input" data-field="date" maxlength="10" value="${ms.date.replace(/"/g, '&quot;')}" placeholder="T-3" />
          <button type="button" class="milestone-delete-btn" data-action="delete" title="Remove">&times;</button>
        </div>
      `
      )
      .join('');
  }
  
  function renderOsOverlay() {
    const activeTemplateMeta = TEMPLATES.find((t) => t.id === state.template);
    const clock = getLiveOsClock();
  
    el.osOverlay.classList.toggle('is-hidden', !state.showOsOverlay);
    el.osOverlay.classList.toggle('is-light-wallpaper', Boolean(activeTemplateMeta?.isLightWallpaper));
  
    if (state.device === 'mobile') {
      el.osOverlay.innerHTML = `
        <div class="os-dynamic-island"></div>
        <div class="os-mobile-status">
          <span>${clock.time}</span>
          <span>5G &bull; 100%</span>
        </div>
        <div class="os-mobile-clock-zone" style="top: 66px;">
          <div class="os-mobile-time">${clock.time}</div>
          <div class="os-mobile-date">${clock.date}</div>
        </div>
        <div class="os-mobile-bottom">
          <div class="os-lock-circle">🔦</div>
          <div class="os-lock-circle">📷</div>
        </div>
        <div class="os-home-bar"></div>
      `;
    } else {
      el.osOverlay.innerHTML = `
        <div class="os-desktop-top">
          <span>GoalPulse</span>
          <span>${clock.date} &nbsp; ${clock.time}</span>
        </div>
        <div class="os-desktop-clock">
          <div class="os-desktop-clock-date">${clock.date}</div>
          <div class="os-desktop-clock-time">${clock.time}</div>
        </div>
      `;
    }
  }
  
  function renderPreview() {
    el.deviceFrame.className = `device-frame device-${state.device}`;
    const metrics = getCountdownMetrics(state.startDate, state.targetDate);
    el.exportCanvas.innerHTML = renderTemplate(state, metrics);
    renderOsOverlay();
  }
  
  function updateAll() {
    saveState(state);
    renderPresets();
    renderTemplatePicker();
    syncFormInputs();
    renderMilestoneEditor();
    renderPreview();
  }
  
  function bindEvents() {
    el.presetList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-preset]');
      if (!btn) return;
      const preset = PRESETS.find((p) => p.id === btn.dataset.preset);
      if (!preset) return;
      activePresetId = preset.id;
      state = { ...state, ...preset.data() };
      updateAll();
      showToast(`Loaded "${preset.name}"`);
    });
  
    el.templateList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-template]');
      if (!btn) return;
      state.template = btn.dataset.template;
      saveState(state);
      renderTemplatePicker();
      renderPreview();
    });
  
    el.inputTitle.addEventListener('input', (e) => {
      state.title = e.target.value;
      state.subtitle = 'T-MINUS COUNTDOWN';
      saveState(state);
      renderPreview();
    });
  
    el.inputTargetDate.addEventListener('input', (e) => {
      state.targetDate = e.target.value;
      if (!state.startDate || new Date(state.startDate) >= new Date(state.targetDate)) {
        state.startDate = new Date(Date.now() - 86400000).toISOString().slice(0, 16);
      }
      saveState(state);
      renderPreview();
    });
  
    el.addMilestoneBtn.addEventListener('click', () => {
      if (state.milestones.length >= 6) {
        showToast('Keep 3–6 milestones for clarity');
        return;
      }
      state.milestones.push({ id: Date.now(), text: 'New Step', date: 'T-1', status: 'upcoming' });
      saveState(state);
      renderMilestoneEditor();
      renderPreview();
    });
  
    el.milestoneList.addEventListener('input', (e) => {
      const row = e.target.closest('.milestone-row');
      if (!row) return;
      const idx = Number(row.dataset.index);
      const field = e.target.dataset.field;
      if (field && state.milestones[idx]) {
        state.milestones[idx][field] = e.target.value;
        saveState(state);
        renderPreview();
      }
    });
  
    el.milestoneList.addEventListener('click', (e) => {
      const row = e.target.closest('.milestone-row');
      if (!row) return;
      const idx = Number(row.dataset.index);
      const actionBtn = e.target.closest('[data-action]');
      if (!actionBtn || !state.milestones[idx]) return;
  
      if (actionBtn.dataset.action === 'cycle-status') {
        const order = ['done', 'active', 'upcoming'];
        state.milestones[idx].status = order[(order.indexOf(state.milestones[idx].status) + 1) % order.length];
        saveState(state);
        renderMilestoneEditor();
        renderPreview();
      } else if (actionBtn.dataset.action === 'delete' && state.milestones.length > 1) {
        state.milestones.splice(idx, 1);
        saveState(state);
        renderMilestoneEditor();
        renderPreview();
      }
    });
  
    [el.deviceMobileBtn, el.deviceDesktopBtn].forEach((btn) => {
      btn.addEventListener('click', () => {
        state.device = btn.dataset.device;
        saveState(state);
        syncFormInputs();
        renderPreview();
      });
    });
  
    el.osOverlayToggle.addEventListener('change', (e) => {
      state.showOsOverlay = e.target.checked;
      saveState(state);
      renderOsOverlay();
    });
  
    el.resetBtn.addEventListener('click', () => {
      activePresetId = PRESETS[0].id;
      state = createDefaultState();
      window.history.replaceState(null, '', window.location.pathname);
      updateAll();
      showToast('Reset');
    });
  
    el.copyLinkBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(encodeStateToUrl(state));
        showToast('Share link copied!');
      } catch {
        showToast('Could not copy link');
      }
    });
  
    el.downloadBtn.addEventListener('click', async () => {
      const label = el.downloadBtn.textContent;
      el.downloadBtn.textContent = 'Saving...';
      el.downloadBtn.disabled = true;
      try {
        const file = await exportWallpaperPng(el.exportCanvas, state);
        showToast(`Saved ${file}`);
      } catch {
        showToast('Export failed — use Live Server / HTTPS');
      } finally {
        el.downloadBtn.textContent = label;
        el.downloadBtn.disabled = false;
      }
    });
  }
  
  initThemeToggle();
  bindEvents();
  updateAll();
  setInterval(renderPreview, 1000);