import * as THREE from 'three';
import { portfolioData } from './data/portfolioData.js';
import { SceneManager } from './three/SceneManager.js';
import { WorldBuilder } from './three/WorldBuilder.js';
import { GizmoManager } from './three/GizmoManager.js';
import { InteractionManager } from './three/InteractionManager.js';
import { ScrollChoreographer } from './three/ScrollChoreographer.js';
import { SoundManager } from './components/SoundManager.js';
import { Navigation } from './components/Navigation.js';
import { Terminal } from './components/Terminal.js';
import { ProjectModal } from './components/ProjectModal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sound Manager
  const soundManager = new SoundManager();

  // 2. Initialize Project Dossier Modal
  const projectModal = new ProjectModal(soundManager);

  // 3. Populate Dynamic Content Sections from real resume data
  renderSkills(portfolioData.skills);
  renderProjects(portfolioData.projects, projectModal, soundManager);
  renderExperience(portfolioData.experience);
  renderCreative(portfolioData.creative);
  renderAchievements(portfolioData.achievements);
  renderEducation(portfolioData.education);
  setupContactForm(soundManager);

  // 4. Hero title cycling
  setupTitleCycling(portfolioData.developer.titles);

  // 5. Initialize scroll-reveal (IntersectionObserver)
  setupScrollReveal();

  // 6. Initialize Navigation & Stage Tracking
  const navigation = new Navigation(portfolioData, soundManager);

  // 7. Initialize Interactive Terminal
  const terminal = new Terminal(portfolioData, soundManager, (data) => projectModal.open(data));

  // Wire Hero CLI Button if present
  const heroCliBtn = document.getElementById('heroCliBtn');
  if (heroCliBtn) {
    heroCliBtn.addEventListener('click', () => {
      terminal.open();
      if (soundManager) soundManager.playLaser();
    });
  }

  // 8. Initialize Three.js Full-screen 3D Viewport Scene
  const container = document.getElementById('webgl-container');
  if (container) {
    const sceneManager = new SceneManager(container);
    const worldBuilder = new WorldBuilder(sceneManager.scene, sceneManager);

    // 9. Initialize Scroll Choreographer
    const scrollChoreographer = new ScrollChoreographer(sceneManager, worldBuilder);

    // 10. Initialize 3D Coordinate Gizmo (Bottom Right HUD)
    const gizmoCanvas = document.getElementById('gizmo-canvas');
    let gizmoManager = null;
    if (gizmoCanvas) {
      gizmoManager = new GizmoManager(gizmoCanvas, sceneManager.camera);
    }

    // 11. Initialize 3D Raycasting & HUD Interaction
    const interactionManager = new InteractionManager(
      sceneManager,
      worldBuilder,
      soundManager,
      (data) => projectModal.open(data),
      scrollChoreographer
    );

    // 12. Main Animation Loop
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      scrollChoreographer.update(delta);
      sceneManager.render(delta, elapsedTime);
      if (gizmoManager) gizmoManager.update();
    }
    animate();
  }
});

// ==========================================================================
// HERO TITLE CYCLING
// ==========================================================================
function setupTitleCycling(titles) {
  const textEl = document.getElementById('cyclingTitle');
  if (!textEl || !titles || titles.length === 0) return;

  let idx = 0;
  const typeSpeed = 60;
  const deleteSpeed = 40;
  const pauseAfterType = 2000;
  const pauseAfterDelete = 400;

  function typeText(text, cb) {
    let i = 0;
    textEl.textContent = '';
    const t = setInterval(() => {
      textEl.textContent = text.slice(0, ++i);
      if (i === text.length) { clearInterval(t); cb(); }
    }, typeSpeed);
  }

  function deleteText(cb) {
    let i = textEl.textContent.length;
    const t = setInterval(() => {
      textEl.textContent = textEl.textContent.slice(0, --i);
      if (i === 0) { clearInterval(t); cb(); }
    }, deleteSpeed);
  }

  function cycle() {
    typeText(titles[idx], () => {
      setTimeout(() => {
        deleteText(() => {
          idx = (idx + 1) % titles.length;
          setTimeout(cycle, pauseAfterDelete);
        });
      }, pauseAfterType);
    });
  }

  cycle();
}

// ==========================================================================
// SCROLL REVEAL — IntersectionObserver
// ==========================================================================
function setupScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Animate skill bars inside this element
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const pct = fill.dataset.pct || fill.parentElement.closest('.skill-bar-row')?.querySelector('.skill-pct')?.textContent || '0%';
          fill.style.width = fill.dataset.pct || pct;
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));
}

// ==========================================================================
// TECH STACK (formerly Skills)
// ==========================================================================
function renderSkills(skillsData) {
  const container = document.getElementById('skillsGrid');
  if (!container) return;

  container.innerHTML = skillsData.map(cat => `
    <div class="tech-category-card liquid-card">
      <div class="category-header">
        <div class="category-icon-wrapper">${cat.icon}</div>
        <div class="category-header-text">
          <h3 class="category-title">${cat.category}</h3>
          <span class="category-count">${cat.skills.length} Technologies</span>
        </div>
      </div>
      <div class="tech-pills-grid">
        ${cat.skills.map(s => `
          <div class="tech-pill">
            <span class="tech-pill-dot"></span>
            <span class="tech-pill-name">${s.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// PROJECTS
// ==========================================================================
function renderProjects(projects, modal, soundManager) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  function renderList(filteredProjects) {
    grid.innerHTML = '';
    filteredProjects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card liquid-card reveal';
      card.dataset.category = p.category;

      card.innerHTML = `
        <div class="project-visual">
          <div class="project-visual-badge">${p.badge}</div>
          <div class="project-canvas-preview" style="background: radial-gradient(circle at 50% 50%, rgba(255, 45, 135, 0.25), #090514);">
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 2rem; color: rgba(255, 255, 255, 0.15); letter-spacing: 4px;">
              [${p.id.toUpperCase()}]
            </div>
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-subtitle">${p.subtitle}</p>
          <p class="project-desc">${p.desc}</p>
          <div class="project-tags">
            ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <div class="project-actions">
            <button class="project-btn-details" data-id="${p.id}">
              <span>VIEW DOSSIER</span>
              <span>▷</span>
            </button>
            <a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-link-icon" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
      `;

      card.querySelector('.project-btn-details').addEventListener('click', () => {
        modal.open({
          tag: p.badge,
          title: p.title,
          meta: p.stats,
          body: p.fullDesc,
          techTags: p.tags,
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl
        });
        if (soundManager) soundManager.playTick();
      });

      grid.appendChild(card);
    });

    // Re-observe new reveal elements
    setupScrollRevealCards();
  }

  renderList(projects);

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderList(filter === 'all' ? projects : projects.filter(p => p.category === filter));
      if (soundManager) soundManager.playTick();
    });
  });
}

function setupScrollRevealCards() {
  const els = document.querySelectorAll('.project-card.reveal:not(.revealed)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

// ==========================================================================
// EXPERIENCE
// ==========================================================================
function renderExperience(experience) {
  const container = document.getElementById('experienceContainer');
  if (!container) return;

  container.innerHTML = experience.map(e => `
    <div class="exp-card liquid-card">
      <div class="exp-icon-col">🏛️</div>
      <div class="exp-content">
        <div class="exp-type-badge">${e.type}</div>
        <div class="exp-role">${e.role}</div>
        <div class="exp-org">${e.organization}</div>
        <div class="exp-period">${e.period}</div>
        <p class="exp-desc">${e.desc}</p>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// CREATIVE
// ==========================================================================
function renderCreative(creative) {
  const container = document.getElementById('creativeGrid');
  if (!container) return;

  container.innerHTML = creative.map(c => `
    <div class="creative-card liquid-card">
      <span class="creative-icon">${c.icon}</span>
      <div class="creative-title">${c.title}</div>
      <p class="creative-desc">${c.desc}</p>
      <div class="creative-skills-list">
        ${c.skills.map(s => `<span class="creative-skill-tag">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// ACHIEVEMENTS
// ==========================================================================
function renderAchievements(achievements) {
  const container = document.getElementById('achievementsList');
  if (!container) return;

  container.innerHTML = achievements.map(a => `
    <div class="achievement-card liquid-card">
      <div class="achievement-icon-col">${a.icon}</div>
      <div class="achievement-content">
        <div class="achievement-badge">${a.badge}</div>
        <div class="achievement-title">${a.title}</div>
        <p class="achievement-desc">${a.desc}</p>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// EDUCATION
// ==========================================================================
function renderEducation(education) {
  const container = document.getElementById('educationContainer');
  if (!container) return;

  container.innerHTML = education.map(e => `
    <div class="education-card liquid-card">
      <div class="edu-main">
        <div class="edu-institution">${e.institution}</div>
        <div class="edu-degree">${e.degree} · ${e.location}</div>
        ${e.note ? `<div class="edu-note">${e.note}</div>` : ''}
      </div>
      <div class="edu-duration">${e.duration}</div>
    </div>
  `).join('');
}

// ==========================================================================
// CONTACT FORM
// ==========================================================================
function setupContactForm(soundManager) {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (soundManager) soundManager.playLaser();

    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const subject = document.getElementById('contactSubject')?.value || 'General Inquiry';
    const message = document.getElementById('contactMessage')?.value.trim() || '';

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="btn-text">TRANSMITTING PACKET...</span>`;
    status.innerHTML = `<span style="color: var(--neon-cyan);">ENCRYPTING PAYLOAD & BROADCASTING...</span>`;

    // Compose mailto link to guarantee delivery to Kuldeep's inbox
    const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} from ${name}`);
    const mailBody = encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\nSubject Category: ${subject}\n\nMessage:\n${message}\n\n--- Sent from Kuldeep Sharma Portfolio ---`);
    const mailtoUrl = `mailto:kuldeepsharmaisthere@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    setTimeout(() => {
      // Open email client in background/new tab
      window.open(mailtoUrl, '_blank');

      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span class="btn-text">SEND MESSAGE ▷▷</span>`;
      status.innerHTML = `<span style="color: var(--neon-green); font-weight: 700;">✓ TRANSMISSION DISPATCHED // OPENED SECURE COMMS TO KULDEEP SHARMA</span>`;
      if (soundManager) soundManager.playBlip(880, 'sine', 0.2);

      setTimeout(() => {
        status.innerHTML = '';
      }, 7000);
    }, 1200);
  });
}
