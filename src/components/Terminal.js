export class Terminal {
  constructor(portfolioData, soundManager, openDossierFn) {
    this.data = portfolioData;
    this.soundManager = soundManager;
    this.openDossier = openDossierFn;

    this.modal = document.getElementById('terminalModal');
    this.openBtn = document.getElementById('terminalOpenBtn');
    this.closeBtn = document.getElementById('termCloseBtn');
    this.maxBtn = document.getElementById('termMaxBtn');
    this.output = document.getElementById('terminalOutput');
    this.input = document.getElementById('terminalInput');
    this.windowEl = document.querySelector('.terminal-window');

    this.history = [];
    this.historyIndex = -1;

    this.initEvents();
  }

  initEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.maxBtn) {
      this.maxBtn.addEventListener('click', () => {
        this.windowEl.classList.toggle('maximized');
      });
    }

    // Modal background click to close
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Keyboard shortcut (Alt+T or ~)
    window.addEventListener('keydown', (e) => {
      if ((e.altKey && e.key.toLowerCase() === 't') || (e.key === '`' && !e.target.matches('input, textarea'))) {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Input handlers
    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (this.soundManager) this.soundManager.playTick();

        if (e.key === 'Enter') {
          const cmd = this.input.value.trim();
          this.executeCommand(cmd);
          if (cmd) {
            this.history.push(cmd);
            this.historyIndex = this.history.length;
          }
          this.input.value = '';
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.history.length > 0 && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.history[this.historyIndex];
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.input.value = this.history[this.historyIndex];
          } else {
            this.historyIndex = this.history.length;
            this.input.value = '';
          }
        }
      });
    }
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('open');
  }

  open() {
    if (this.modal) {
      this.modal.classList.add('open');
      setTimeout(() => this.input && this.input.focus(), 50);
      if (this.soundManager) this.soundManager.playBlip(550, 'sine', 0.1);
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('open');
    }
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  appendLine(content, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = content;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  executeCommand(cmdRaw) {
    const cleanCmd = cmdRaw.trim();
    this.appendLine(`<span class="term-prompt-sign">kuldeep@core:~$</span> ${cleanCmd}`);

    if (!cleanCmd) return;

    const parts = cleanCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        this.appendLine(`
AVAILABLE COMMANDS:
  <span class="hl-cyan">about</span>       - Developer engineer profile &amp; bio
  <span class="hl-cyan">projects</span>    - List engineering projects &amp; case studies
  <span class="hl-cyan">project</span> &lt;id&gt; - Inspect specific project dossier
  <span class="hl-cyan">skills</span>      - Display technical proficiency matrix
  <span class="hl-cyan">contact</span>     - Secure comms &amp; coordinates
  <span class="hl-cyan">hire</span>        - Direct mission inquiry
  <span class="hl-cyan">matrix</span>      - Run digital rain simulation
  <span class="hl-cyan">clear</span>       - Clear terminal window
  <span class="hl-cyan">whoami</span>      - Display active identity
  <span class="hl-cyan">date</span>        - Display system timestamp
        `);
        break;

      case 'about':
        this.appendLine(`
<span class="hl-pink">OPERATOR PROFILE:</span>
Name:      ${this.data.developer.name}
Role:      ${Array.isArray(this.data.developer.titles) ? this.data.developer.titles.join(' · ') : (this.data.developer.title || 'AI/ML Learner & Software Developer')}
Status:    Available for Roles & Collaborations
Location:  ${this.data.developer.location}
Bio:       ${this.data.developer.bio}
        `);
        break;

      case 'projects':
        let pList = `<span class="hl-amber">FEATURED ENGINEERING PROJECTS:</span>\n`;
        this.data.projects.forEach(p => {
          pList += `• <span class="hl-cyan">${p.id}</span>: ${p.title} [${p.badge}]\n  ${p.stats}\n`;
        });
        pList += `\nType <span class="hl-pink">'project &lt;id&gt;'</span> (e.g. 'project voxtract' or 'project docai') to inspect full dossier.`;
        this.appendLine(pList);
        break;

      case 'project':
        const pid = args[0];
        const proj = this.data.projects.find(p => p.id === pid);
        if (proj) {
          this.appendLine(`Opening dossier for <span class="hl-cyan">${proj.title}</span>...`);
          if (this.openDossier) {
            this.openDossier({
              tag: proj.badge,
              title: proj.title,
              meta: proj.stats,
              body: proj.fullDesc,
              techTags: proj.tags,
              liveUrl: proj.liveUrl,
              githubUrl: proj.githubUrl
            });
          }
        } else {
          this.appendLine(`Error: Project ID '${pid || ''}' not found. Run 'projects' to see valid IDs.`);
        }
        break;

      case 'skills':
        let sList = `<span class="hl-cyan">CORE COMPETENCY MATRIX:</span>\n`;
        this.data.skills.forEach(cat => {
          sList += `\n<span class="hl-amber">[${cat.category}]</span>\n`;
          cat.skills.forEach(s => {
            const bar = '■'.repeat(Math.round(parseInt(s.pct) / 10)) + '░'.repeat(10 - Math.round(parseInt(s.pct) / 10));
            sList += `  ${s.name.padEnd(30)} ${bar} ${s.pct}\n`;
          });
        });
        this.appendLine(sList);
        break;

      case 'contact':
        this.appendLine(`
<span class="hl-pink">TRANSMISSION FREQUENCIES:</span>
Email:     ${this.data.contact?.email || this.data.developer.email}
Phone:     ${this.data.contact?.phone || this.data.developer.phone}
WhatsApp:  ${this.data.contact?.whatsapp || this.data.developer.whatsapp}
Location:  ${this.data.developer.location}
GitHub:    ${this.data.contact?.github || this.data.developer.github}
LinkedIn:  ${this.data.contact?.linkedin || this.data.developer.linkedin}
        `);
        break;

      case 'hire':
        this.appendLine(`Initiating transmission sequence...`);
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          this.close();
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 'matrix':
        this.appendLine(`
01001011 01010101 01001100 01000100 01000101 01000101 01010000 
░█▀▀░█░█░█▀▄░█▀▀░█▀▄░█▀█░█░█░█▀█░█░█░█▀▀
░█░░░░█░░█▀▄░█▀▀░█▀▄░█░█░█▀▄░█▀█░▀▄▀░█▀▀
░▀▀▀░░▀░░▀▀░░▀▀▀░▀░▀░▀▀▀░▀░▀░▀░▀░░▀░░▀▀▀
[SYNTHWAVE NEURAL CORE SYNCHRONIZED]
        `);
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      case 'whoami':
        this.appendLine(`guest@synthwave-network [authorized operator]`);
        break;

      case 'date':
        this.appendLine(new Date().toUTCString());
        break;

      default:
        this.appendLine(`Command not recognized: '${cmd}'. Type <span class="hl-cyan">'help'</span> for instructions.`);
        break;
    }
  }
}
