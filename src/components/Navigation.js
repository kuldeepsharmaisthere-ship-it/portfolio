export class Navigation {
  constructor(portfolioData, soundManager) {
    this.data = portfolioData;
    this.soundManager = soundManager;

    this.trackOrb = document.getElementById('trackOrb');
    this.trackProgress = document.getElementById('trackProgress');
    this.trackPoints = document.querySelectorAll('.track-point');

    this.personaBadge = document.getElementById('badgePersona');
    this.personaTitle = document.getElementById('personaTitle');
    this.personaIndex = 0;

    this.sections = ['home', 'about', 'skills', 'projects', 'experience', 'creative', 'achievements', 'education', 'contact'];

    this.initTrackNav();
    this.initPersonaBadge();
    this.initScrollObserver();
    this.initPolygonButtons();
  }

  initTrackNav() {
    this.trackPoints.forEach((point, index) => {
      point.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSectionId = point.dataset.section;
        this.navigateToSection(targetSectionId);
        if (this.soundManager) this.soundManager.playLaser();
      });
    });

    // Check initial hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && this.sections.includes(initialHash)) {
      this.updateTrackState(initialHash);
    }
  }

  navigateToSection(sectionId) {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, null, '#home');
      this.updateTrackState('home');
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, null, `#${sectionId}`);
      this.updateTrackState(sectionId);
    }
  }

  updateTrackState(activeSectionId) {
    const activeIndex = this.sections.indexOf(activeSectionId);
    if (activeIndex === -1) return;

    this.trackPoints.forEach((p, idx) => {
      if (idx === activeIndex) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Calculate percentage offset for track orb
    const pct = (activeIndex / (this.sections.length - 1)) * 100;
    if (this.trackOrb) {
      this.trackOrb.style.left = `${pct}%`;
    }
    if (this.trackProgress) {
      this.trackProgress.style.width = `${pct}%`;
    }
  }

  initPersonaBadge() {
    if (!this.personaBadge || !this.personaTitle) return;

    this.personaBadge.addEventListener('click', () => {
      const titles = this.data.developer.titles || [];
      if (!titles.length) return;
      this.personaIndex = (this.personaIndex + 1) % titles.length;
      const nextTitle = titles[this.personaIndex];
      
      this.personaTitle.style.opacity = '0';
      this.personaTitle.style.transform = 'scale(0.85)';
      
      setTimeout(() => {
        this.personaTitle.textContent = nextTitle;
        this.personaTitle.style.opacity = '1';
        this.personaTitle.style.transform = 'scale(1)';
      }, 150);

      if (this.soundManager) this.soundManager.playBlip(700, 'triangle', 0.1);
    });
  }

  initScrollObserver() {
    // Detect which section is currently on screen
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.updateTrackState(sectionId);
        }
      });
    }, observerOptions);

    this.sections.forEach(secId => {
      const el = document.getElementById(secId);
      if (el) observer.observe(el);
    });

    // Special scroll listener for top overview
    window.addEventListener('scroll', () => {
      if (window.scrollY < 200) {
        this.updateTrackState('home');
      }
    }, { passive: true });
  }

  initPolygonButtons() {
    const btnFeatured = document.getElementById('btnFeaturedProjects');
    const btnServices = document.getElementById('btnCreativeServices');
    const btnSkills = document.getElementById('btnSkills');
    const btnTransmission = document.getElementById('btnTransmission');

    const attachSound = (btn) => {
      if (btn) {
        btn.addEventListener('click', () => {
          if (this.soundManager) this.soundManager.playLaser();
        });
      }
    };

    attachSound(btnFeatured);
    attachSound(btnServices);
    attachSound(btnSkills);
    attachSound(btnTransmission);
  }
}
