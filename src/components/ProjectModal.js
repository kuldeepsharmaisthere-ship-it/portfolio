export class ProjectModal {
  constructor(soundManager) {
    this.soundManager = soundManager;

    this.modal = document.getElementById('dossierModal');
    this.backdrop = document.getElementById('dossierBackdrop');
    this.closeBtn = document.getElementById('dossierCloseBtn');

    this.tagEl = document.getElementById('dossierTag');
    this.titleEl = document.getElementById('dossierTitle');
    this.metaEl = document.getElementById('dossierMeta');
    this.bodyEl = document.getElementById('dossierBody');
    this.techTagsEl = document.getElementById('dossierTechTags');
    this.actionsEl = document.getElementById('dossierActions');

    this.initEvents();
  }

  initEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('open');
  }

  open(data) {
    if (!this.modal) return;

    this.tagEl.textContent = data.tag || 'SYSTEM DOSSIER';
    this.titleEl.textContent = data.title || 'Untitled';
    this.metaEl.textContent = data.meta || '';
    this.bodyEl.innerHTML = data.body || '';

    // Render tags
    this.techTagsEl.innerHTML = '';
    if (data.techTags && Array.isArray(data.techTags)) {
      data.techTags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.textContent = t;
        this.techTagsEl.appendChild(span);
      });
    }

    // Render action buttons
    this.actionsEl.innerHTML = '';
    if (data.anchor) {
      const btn = document.createElement('a');
      btn.href = data.anchor;
      btn.className = 'polygon-nav-btn btn-primary';
      btn.style.padding = '8px 16px';
      btn.style.fontSize = '0.8rem';
      btn.innerHTML = `<span>EXPLORE SECTION</span> <span class="btn-arrow">▷</span>`;
      btn.addEventListener('click', () => this.close());
      this.actionsEl.appendChild(btn);
    } else {
      if (data.githubUrl) {
        const ghBtn = document.createElement('a');
        ghBtn.href = data.githubUrl;
        ghBtn.target = '_blank';
        ghBtn.rel = 'noopener';
        ghBtn.className = 'social-chip';
        ghBtn.innerHTML = `<span>GITHUB REPOSITORY</span> <span class="ext-arrow">↗</span>`;
        this.actionsEl.appendChild(ghBtn);
      }
      if (data.liveUrl && data.liveUrl !== '#' && data.liveUrl.trim() !== '') {
        const liveBtn = document.createElement('a');
        liveBtn.href = data.liveUrl;
        liveBtn.target = '_blank';
        liveBtn.rel = 'noopener';
        liveBtn.className = 'social-chip';
        liveBtn.style.borderColor = 'var(--neon-cyan)';
        liveBtn.style.color = 'var(--neon-cyan)';
        liveBtn.innerHTML = `<span>LAUNCH PREVIEW</span> <span class="ext-arrow">↗</span>`;
        this.actionsEl.appendChild(liveBtn);
      }
    }

    this.modal.classList.add('open');
    if (this.soundManager) this.soundManager.playBlip(680, 'sine', 0.12);
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('open');
    }
  }
}
