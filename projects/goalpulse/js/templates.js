/**
 * Escapes user input to keep template HTML safe.
 */
function esc(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * 1. Mission Control Template
 */
function renderMissionControl(state, m) {
    const msHtml = state.milestones
        .map(
            (item) => `
        <div class="mc-ms-item ${esc(item.status)}">
          <div class="mc-ms-left">
            <span class="mc-ms-dot"></span>
            <span class="mc-ms-text">${esc(item.text)}</span>
          </div>
          <span class="mc-ms-date">${esc(item.date)}</span>
        </div>`
        )
        .join('');

    return `
      <div class="tpl-root tpl-mission is-${state.device}">
        <div class="tpl-inner">
          <div class="tpl-col">
            <div class="mc-badge-row">
              <span class="mc-tag">${esc(state.tag || 'ACTIVE')}</span>
              <span class="mc-target-date">${esc(m.targetFormatted)}</span>
            </div>
            <div>
              <div class="mc-title">${esc(state.title)}</div>
              <div class="mc-subtitle">${esc(state.subtitle)}</div>
            </div>
            <div class="mc-timer-grid">
              <div class="mc-unit"><div class="mc-val">${m.dd}</div><div class="mc-lbl">Days</div></div>
              <div class="mc-unit"><div class="mc-val">${m.hh}</div><div class="mc-lbl">Hrs</div></div>
              <div class="mc-unit"><div class="mc-val">${m.mm}</div><div class="mc-lbl">Min</div></div>
              <div class="mc-unit"><div class="mc-val">${m.ss}</div><div class="mc-lbl">Sec</div></div>
            </div>
            <div class="mc-progress-wrap">
              <div class="mc-progress-meta">
                <span>TIMELINE PROGRESS</span>
                <span>${m.progress}%</span>
              </div>
              <div class="mc-progress-bar">
                <div class="mc-progress-fill" style="width: ${m.progress}%"></div>
              </div>
            </div>
          </div>
  
          <div class="tpl-col">
            <div class="mc-milestones">
              ${msHtml}
            </div>
          </div>
        </div>
      </div>
    `;
}

/**
 * 2. Boarding Pass Template
 */
function renderBoardingPass(state, m) {
    const msHtml = state.milestones
        .map(
            (item) => `
        <div class="bp-ms-item ${esc(item.status)}">
          <span>${item.status === 'done' ? '✓ ' : item.status === 'active' ? '▸ ' : '○ '}${esc(item.text)}</span>
          <span class="bp-ms-date">${esc(item.date)}</span>
        </div>`
        )
        .join('');

    return `
      <div class="tpl-root tpl-boarding is-${state.device}">
        <div class="tpl-inner">
          <div class="tpl-col">
            <div class="bp-card">
              <div class="bp-top">
                <span class="bp-airline">${esc(state.subtitle || 'DEADLINE PASS')}</span>
                <span class="bp-code">${esc(state.tag || 'GATE-01')}</span>
              </div>
              <div class="bp-body">
                <div class="bp-title">${esc(state.title)}</div>
                <div class="bp-meta-strip">
                  <div>
                    <div class="bp-meta-lbl">T-MINUS</div>
                    <div class="bp-meta-val">${m.dd}d ${m.hh}h</div>
                  </div>
                  <div>
                    <div class="bp-meta-lbl">ARRIVAL</div>
                    <div class="bp-meta-val">${esc(m.targetFormatted.split(',')[0])}</div>
                  </div>
                  <div>
                    <div class="bp-meta-lbl">STATUS</div>
                    <div class="bp-meta-val">${m.progress}%</div>
                  </div>
                </div>
                <div class="bp-barcode"></div>
              </div>
            </div>
          </div>
  
          <div class="tpl-col">
            <div class="bp-card">
              <div class="bp-body">
                <div class="bp-meta-lbl">FLIGHT CHECKPOINTS</div>
                <div class="bp-milestones">
                  ${msHtml}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}

/**
 * 3. Editorial Poster Template (Light Wallpaper)
 */
function renderEditorial(state, m) {
    const msHtml = state.milestones
        .map(
            (item, idx) => `
        <div class="ed-ms-item ${esc(item.status)}">
          <span class="ed-ms-num">0${idx + 1}</span>
          <span class="ed-ms-text">${esc(item.text)}</span>
          <span class="ed-ms-date">${esc(item.date)}</span>
        </div>`
        )
        .join('');

    return `
      <div class="tpl-root tpl-editorial is-${state.device}">
        <div class="tpl-inner">
          <div class="tpl-col">
            <div class="ed-kicker">
              <span>${esc(state.subtitle || 'EDITION')}</span>
              <span>${esc(state.tag || '2026')}</span>
            </div>
            <div class="ed-title">${esc(state.title)}</div>
            <div class="ed-countdown-line">
              <span class="ed-big-days">${m.days}d</span>
              <span class="ed-sub-time">${m.hh}h : ${m.mm}m : ${m.ss}s left</span>
            </div>
          </div>
  
          <div class="tpl-col">
            <div class="ed-milestones">
              ${msHtml}
            </div>
          </div>
        </div>
      </div>
    `;
}

/**
 * 4. Frosted Depth Template (Aurora Glassmorphism)
 */
function renderFrosted(state, m) {
    const msHtml = state.milestones
        .map(
            (item) => `
        <div class="fr-ms-item ${esc(item.status)}">
          <span>${item.status === 'done' ? '✓ ' : item.status === 'active' ? '● ' : '○ '}${esc(item.text)}</span>
          <span class="fr-ms-date">${esc(item.date)}</span>
        </div>`
        )
        .join('');

    return `
      <div class="tpl-root tpl-frosted is-${state.device}">
        <div class="tpl-inner">
          <div class="tpl-col">
            <div class="fr-glass">
              <span class="fr-pill">${esc(state.tag || 'FOCUS')}</span>
              <div class="fr-title">${esc(state.title)}</div>
              <div class="fr-subtitle">${esc(state.subtitle)}</div>
              <div class="fr-timer-row">
                <div><div class="fr-stat-val">${m.dd}</div><div class="fr-stat-lbl">Days</div></div>
                <div><div class="fr-stat-val">${m.hh}</div><div class="fr-stat-lbl">Hrs</div></div>
                <div><div class="fr-stat-val">${m.mm}</div><div class="fr-stat-lbl">Min</div></div>
                <div><div class="fr-stat-val">${m.ss}</div><div class="fr-stat-lbl">Sec</div></div>
              </div>
            </div>
          </div>
  
          <div class="tpl-col">
            <div class="fr-glass">
              <div class="fr-ms-list">
                ${msHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}

/**
 * 5. Terminal / Dev Template
 */
function renderTerminal(state, m) {
    const filled = Math.round(m.progress / 10);
    const asciiBar = `[${'#'.repeat(filled)}${'-'.repeat(10 - filled)}] ${m.progress}%`;

    const msHtml = state.milestones
        .map((item) => {
            const prefix = item.status === 'done' ? '[x]' : item.status === 'active' ? '[>]' : '[ ]';
            return `
          <div class="tm-ms-item ${esc(item.status)}">
            <span>${prefix} ${esc(item.text)}</span>
            <span>${esc(item.date)}</span>
          </div>`;
        })
        .join('');

    return `
      <div class="tpl-root tpl-terminal is-${state.device}">
        <div class="tpl-inner">
          <div class="tpl-col">
            <div class="tm-window">
              <div class="tm-bar">
                <div class="tm-dots"><span></span><span></span><span></span></div>
                <span class="tm-bar-title">${esc(state.tag || 'main')}</span>
              </div>
              <div class="tm-body">
                <div><span class="tm-cmd">$</span> countdown <span class="tm-cmd-arg">--goal="${esc(state.title)}"</span></div>
                <div class="tm-countdown-box">
                  <div class="tm-big">T-${m.dd}d ${m.hh}:${m.mm}:${m.ss}</div>
                  <div class="tm-ascii-bar">${asciiBar}</div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="tpl-col">
            <div class="tm-window">
              <div class="tm-bar">
                <span class="tm-bar-title">milestones.log</span>
                <span class="tm-bar-title">${esc(m.targetFormatted)}</span>
              </div>
              <div class="tm-body">
                <div class="tm-ms-list">
                  ${msHtml}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}

/**
 * Main Dispatcher
 */
export function renderTemplate(state, metrics) {
    switch (state.template) {
        case 'boarding-pass':
            return renderBoardingPass(state, metrics);
        case 'editorial':
            return renderEditorial(state, metrics);
        case 'frosted':
            return renderFrosted(state, metrics);
        case 'terminal':
            return renderTerminal(state, metrics);
        case 'mission-control':
        default:
            return renderMissionControl(state, metrics);
    }
}