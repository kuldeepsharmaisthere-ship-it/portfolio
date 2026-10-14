export const portfolioData = {
  developer: {
    name: "Kuldeep Sharma",
    shortName: "K.Sharma",
    titles: [
      "AI/ML Learner",
      "Software Developer",
      "Photographer",
      "UI/UX Enthusiast"
    ],
    location: "Sikar, Rajasthan • Currently in Dharwad, Karnataka",
    email: "kuldeepsharmaisthere@gmail.com",
    phone: "+91 6301647191",
    whatsapp: "+916301647191",
    github: "https://github.com/kuldeepsharmaisthere",
    linkedin: "https://linkedin.com/in/kuldeepsharmaisthere",
    profilePhoto: "/kuldeep_profile.png",
    bio: "B.Tech student at Indian Institute of Information Technology Dharwad with a strong interest in Artificial Intelligence, Machine Learning, software development, and creative technology. I enjoy building practical software and AI-driven applications while combining technical work with photography, videography, graphic design, and UI/UX."
  },

  education: [
    {
      institution: "Indian Institute of Information Technology Dharwad",
      degree: "B.Tech",
      location: "Dharwad, Karnataka",
      duration: "Expected 2028",
      note: "Branch and CGPA to be updated soon."
    }
  ],

  skills: [
    {
      category: "PROGRAMMING",
      icon: "⌨️",
      skills: [
        { name: "C++", pct: "85%" },
        { name: "C", pct: "80%" },
        { name: "Python", pct: "88%" },
        { name: "JavaScript", pct: "82%" },
        { name: "Java", pct: "82%" },
      ]
    },
    {
      category: "AI / ML",
      icon: "🤖",
      skills: [
        { name: "Machine Learning", pct: "80%" },
        { name: "Speech Processing (Whisper/Kaldi)", pct: "78%" },
        { name: "LLM Applications (Ollama)", pct: "75%" },
        { name: "Pyannote.audio", pct: "72%" }
      ]
    },
    {
      category: "WEB DEVELOPMENT",
      icon: "🌐",
      skills: [
        { name: "React / Next.js / Vite", pct: "84%" },
        { name: "Node.js / Express.js", pct: "82%" },
        { name: "Tailwind CSS / HTML / CSS", pct: "90%" },
        { name: "FastAPI / Flask", pct: "78%" }
      ]
    },
    {
      category: "DATABASES & DESIGN",
      icon: "🗄️",
      skills: [
        { name: "PostgreSQL / MySQL / SQLite", pct: "80%" },
        { name: "MongoDB", pct: "74%" },
        { name: "Figma / Canva", pct: "85%" },
        { name: "Adobe Photoshop / Graphic Design", pct: "80%" }
      ]
    }
  ],

  projects: [
    {
      id: "voxtract",
      title: "Voxtract",
      category: "ai",
      badge: "AI / ML",
      subtitle: "AI-Powered Multilingual Conversational Intelligence Platform",
      desc: "AI platform for live/remote voice capture, multilingual and code-mixed transcription, speaker diarization, structured reports, and AI-assisted analysis.",
      fullDesc: `
        <p>Voxtract is an AI-powered multilingual conversational intelligence platform built for live and remote voice capture with real-time processing capabilities.</p>
        <h4>KEY FEATURES:</h4>
        <ul>
          <li>Multilingual and code-mixed transcription with high accuracy</li>
          <li>Speaker diarization to identify and label individual speakers</li>
          <li>Structured report generation from audio sessions</li>
          <li>AI-assisted semantic analysis of conversation content</li>
        </ul>
      `,
      tags: ["Whisper", "Pyannote.audio", "Kaldi", "Ollama", "React", "Tailwind CSS", "FastAPI", "Node.js"],
      githubUrl: "https://github.com/kuldeepsharmaisthere",
      liveUrl: "#",
      stats: "Multilingual // Speaker Diarization // Live + Remote"
    },
    {
      id: "docai",
      title: "DocAI",
      category: "ai",
      badge: "AI / NLP",
      subtitle: "AI-Powered Document Intelligence Project",
      desc: "Developed at the Abhisarga Hackathon — AI-assisted document understanding and intelligent information extraction from complex documents.",
      fullDesc: `
        <p>DocAI was built at the Abhisarga Hackathon at IIIT Sri City. It placed Runner-Up among approximately 150 teams, demonstrating robust AI-assisted document intelligence.</p>
        <h4>KEY FEATURES:</h4>
        <ul>
          <li>Intelligent document parsing and structure extraction</li>
          <li>NLP-powered entity and information extraction</li>
          <li>LLM-assisted querying over document content</li>
          <li>Competed against 150+ teams — Runner-Up Winner</li>
        </ul>
      `,
      tags: ["AI/ML", "NLP", "LLMs", "Document Processing"],
      githubUrl: "https://github.com/kuldeepsharmaisthere",
      liveUrl: "#",
      stats: "Runner-Up — Abhisarga Hackathon // 150+ Teams"
    },
    {
      id: "adc-sim",
      title: "Interactive Circuit Simulation Lab (ADC)",
      category: "systems",
      badge: "SIMULATION",
      subtitle: "Real-Time Analog, Digital & Communication Circuit Simulation Platform",
      desc: "An interactive platform for simulating and exploring analog, digital, and communication circuits with visual, hands-on circuit analysis.",
      fullDesc: `
        <p>A web-based interactive circuit simulation platform that lets users build, explore, and visualize Analog, Digital, and Communication (ADC) circuits in real time.</p>
        <h4>KEY FEATURES:</h4>
        <ul>
          <li>Real-time simulation of analog and digital circuit behavior</li>
          <li>Visual circuit builder with interactive component manipulation</li>
          <li>Communication circuit modeling and waveform visualization</li>
          <li>Hands-on educational tool for circuit analysis</li>
        </ul>
      `,
      tags: ["Circuit Simulation", "Analog & Digital Circuits", "Interactive Visualization"],
      githubUrl: "https://github.com/kuldeepsharmaisthere",
      liveUrl: "#",
      stats: "Real-Time Simulation // Visual Circuits // Educational"
    },
    {
      id: "autotimemon",
      title: "AutoTimeMon",
      category: "systems",
      badge: "RTL / HARDWARE",
      subtitle: "RTL-Based Timing & Latency Monitoring System",
      desc: "Verilog-based timing monitor with latency, jitter, violation detection, statistics, and a web dashboard for visualizing results.",
      fullDesc: `
        <p>AutoTimeMon is a hardware-software co-design project implementing RTL-based timing and latency monitoring using Verilog, with a real-time web dashboard for results visualization.</p>
        <h4>KEY FEATURES:</h4>
        <ul>
          <li>Verilog RTL modules for timing violation and jitter detection</li>
          <li>Statistical analysis of latency distribution patterns</li>
          <li>Web dashboard with live Chart.js graphs for metrics</li>
          <li>Simulation via Icarus Verilog with Node.js backend</li>
        </ul>
      `,
      tags: ["Verilog", "Icarus Verilog", "Node.js", "React", "Chart.js"],
      githubUrl: "https://github.com/kuldeepsharmaisthere",
      liveUrl: "#",
      stats: "RTL Design // Jitter Detection // Real-Time Dashboard"
    },
    {
      id: "patient-health",
      title: "Secure Patient Health Monitoring",
      category: "systems",
      badge: "IoT / EMBEDDED",
      subtitle: "Health Monitoring Prototype",
      desc: "Health-monitoring concept using physiological and temperature sensors with an OLED display and secure device component.",
      fullDesc: `
        <p>A hardware prototype for secure patient health monitoring using embedded sensors and encrypted device communication.</p>
        <h4>KEY FEATURES:</h4>
        <ul>
          <li>Physiological signal monitoring via MAX30102 and LM35/DS18B20 sensors</li>
          <li>Secure hardware component using ATECC608A crypto chip</li>
          <li>Real-time OLED display output of vitals</li>
          <li>ESP32-based wireless data transmission</li>
        </ul>
      `,
      tags: ["ESP32", "MAX30102", "LM35", "DS18B20", "OLED", "ATECC608A"],
      githubUrl: "https://github.com/kuldeepsharmaisthere",
      liveUrl: "#",
      stats: "ESP32 // Physiological Sensors // Secure Crypto Chip"
    },
    {
      id: "auto-irrigation",
      title: "Embedded Autonomous Irrigation System",
      category: "systems",
      badge: "IoT / EMBEDDED",
      subtitle: "Automated Irrigation Concept",
      desc: "Sensor-driven irrigation concept focused on monitoring environmental conditions and automating watering decisions.",
      fullDesc: `
        <p>An embedded system for autonomous smart irrigation using environmental sensors to automate watering decisions without manual intervention.</p>
        <h4>KEY FEATURES:</h4>
        <ul>
          <li>Soil moisture, temperature, and humidity sensor integration</li>
          <li>Automated decision logic for irrigation control</li>
          <li>IoT-based remote monitoring of environmental parameters</li>
          <li>Low-power embedded design for field deployment</li>
        </ul>
      `,
      tags: ["IoT", "Sensors", "Automation", "Embedded Systems"],
      githubUrl: "https://github.com/kuldeepsharmaisthere",
      liveUrl: "#",
      stats: "IoT // Sensor Automation // Smart Agriculture"
    }
  ],

  experience: [
    {
      period: "2024 — PRESENT",
      role: "President",
      organization: "Iridescence — Photography & Creative Club, IIIT Dharwad",
      type: "LEADERSHIP",
      desc: "Leading the official Photography, Videography, and Creative Media club of IIIT Dharwad. Organizing campus events, photoshoots, creative campaigns, and managing a team of creative members."
    }
  ],

  creative: [
    {
      icon: "📷",
      title: "Photography",
      desc: "Event photography, portraits, nature and travel photography. Documenting campus life at IIIT Dharwad through the lens.",
      skills: ["Event Photography", "Portrait", "Nature & Travel", "Composition"]
    },
    {
      icon: "🎬",
      title: "Videography",
      desc: "Shooting and editing videos for campus events, reels, and creative media projects. Comfortable with production and post-production.",
      skills: ["Event Videography", "Reels & Shorts", "Video Editing", "Post-Production"]
    },
    {
      icon: "🎨",
      title: "Graphic Design",
      desc: "Creating posters, social media graphics, UI mockups, and brand visuals using Figma, Canva, and Adobe Photoshop.",
      skills: ["Figma", "Canva", "Adobe Photoshop", "UI/UX Design"]
    }
  ],

  achievements: [
    {
      icon: "🏆",
      title: "Runner-Up — Abhisarga Hackathon, IIIT Sri City",
      desc: "Competed among approximately 150 teams and developed DocAI, an AI-powered document intelligence platform.",
      badge: "HACKATHON"
    }
  ],

  certifications: [],

  contact: {
    email: "kuldeepsharmaisthere@gmail.com",
    phone: "+91 6301647191",
    whatsapp: "+916301647191",
    location: "Sikar, Rajasthan • Dharwad, Karnataka",
    github: "https://github.com/kuldeepsharmaisthere",
    linkedin: "https://linkedin.com/in/kuldeepsharmaisthere"
  }
};
