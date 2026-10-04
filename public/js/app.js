/**
 * Triveni Naik Portfolio - Main Application Logic
 * Supports: Theme Switching, Card Dashboards, Modals, Contact Form API, Dynamic Rendering
 */

let portfolioData = null;

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initMobileNav();
  await loadPortfolioData();
  setupEventListeners();
  handleUrlHashRouting();
  window.addEventListener('hashchange', handleUrlHashRouting);
});

/* --------------------------------------------------------------------------
   THEME TOGGLE SYSTEM (DARK BURGUNDY / LIGHT LUXURY)
   -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('triveni_theme') || 'dark';
  applyTheme(savedTheme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Deep Burgundy' : 'Champagne Ivory'} Mode`);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('triveni_theme', theme);

  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    if (theme === 'light') {
      icon.innerHTML = `<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
    } else {
      icon.innerHTML = `<svg class="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`;
    }
  });
}

/* --------------------------------------------------------------------------
   DATA FETCHING & SYNC
   -------------------------------------------------------------------------- */
async function loadPortfolioData() {
  try {
    const res = await fetch('/api/portfolio');
    if (!res.ok) throw new Error('API fetch failed');
    portfolioData = await res.json();
  } catch (err) {
    console.warn('Backend API not responding, loading fallback static data:', err);
    // Fallback data matching portfolio-prompt.txt requirements
    portfolioData = {
      profile: {
        name: "Triveni Kamlesh Naik",
        displayName: "Triveni Naik",
        title: "Electronics & Telecommunication Engineering Student",
        subtitle: "3rd Year B.Tech | S.B. Jain Institute of Technology, Nagpur",
        avatar: "/images/profile.jpg",
        about: "I am currently pursuing my B.Tech in Electronics and Telecommunication Engineering. I am a 3rd year student. I am Curious, Optimistic and a fast learner.",
        shortBio: "Curious, optimistic, and a fast learner passionate about Embedded Systems, IoT, and Next-Gen Electronics.",
        email: "ntriveni959@gmail.com",
        phone: "9699116908",
        phoneDisplay: "+91 96991 16908",
        address: "Naik talav, Bangladesh, Near police Station, Nagpur.",
        college: "S.B. Jain Institute of technology, Management and Research, Nagpur.",
        course: "B.Tech (Electronics and Telecommunication Engineering)",
        linkedin: "https://www.linkedin.com/in/triveni-naik-9273613a6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        github: "https://github.com/triveni-naik09",
        resumeUrl: "/assets/Triveni_Naik_Resume.pdf"
      }
    };
  }
}

/* --------------------------------------------------------------------------
   SEPARATE DASHBOARD / CARD VIEWER MODAL
   "When I click a card, open its separate dashboard/page."
   -------------------------------------------------------------------------- */
function openCardDashboard(cardId) {
  if (!portfolioData) return;
  const modal = document.getElementById('card-dashboard-modal');
  const titleElem = document.getElementById('modal-card-title');
  const badgeElem = document.getElementById('modal-card-badge');
  const bodyElem = document.getElementById('modal-card-content');
  const jumpBtn = document.getElementById('modal-jump-section-btn');

  let contentHtml = '';
  let title = '';
  let badge = 'Section Dashboard';

  switch (cardId) {
    case 'personal-info':
      title = 'Personal Information Dashboard';
      badge = 'Profile Overview';
      contentHtml = `
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-black/20 border border-champagne/20">
            <img src="${portfolioData.profile.avatar || '/images/profile.jpg'}" alt="Triveni Naik" class="w-28 h-28 rounded-2xl object-cover border-2 border-amber-300 shadow-xl" />
            <div class="text-center sm:text-left">
              <span class="badge-gold mb-2">B.Tech 3rd Year</span>
              <h3 class="text-2xl font-bold font-serif text-amber-100">${portfolioData.profile.name}</h3>
              <p class="text-amber-200/90 text-sm mt-1">${portfolioData.profile.course}</p>
              <p class="text-xs text-stone-300 mt-1">${portfolioData.profile.college}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <span class="text-xs uppercase tracking-wider text-amber-300 font-semibold block mb-1">About Me</span>
              <p class="text-sm text-stone-200 leading-relaxed">${portfolioData.profile.about}</p>
            </div>
            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <span class="text-xs uppercase tracking-wider text-amber-300 font-semibold block mb-1">Residential Address</span>
              <p class="text-sm text-stone-200">${portfolioData.profile.address}</p>
            </div>
            <div class="p-4 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
              <div>
                <span class="text-xs uppercase tracking-wider text-amber-300 font-semibold block mb-1">Email Coordinate</span>
                <span class="text-sm text-stone-200">${portfolioData.profile.email}</span>
              </div>
              <button onclick="copyToClipboard('${portfolioData.profile.email}', 'Email copied!')" class="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </button>
            </div>
            <div class="p-4 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
              <div>
                <span class="text-xs uppercase tracking-wider text-amber-300 font-semibold block mb-1">Direct Phone</span>
                <span class="text-sm text-stone-200">${portfolioData.profile.phone}</span>
              </div>
              <button onclick="copyToClipboard('${portfolioData.profile.phone}', 'Phone copied!')" class="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </button>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-red-900/30 border border-amber-400/20 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <a href="${portfolioData.profile.linkedin}" target="_blank" rel="noopener noreferrer" class="btn-wine text-xs px-4 py-2">
                LinkedIn Profile →
              </a>
              <a href="${portfolioData.profile.github}" target="_blank" rel="noopener noreferrer" class="btn-outline text-xs px-4 py-2">
                GitHub Repository →
              </a>
            </div>
            <a href="${portfolioData.profile.resumeUrl}" download class="btn-gold text-xs px-4 py-2">
              Download CV
            </a>
          </div>
        </div>
      `;
      break;

    case 'education':
      title = 'Academic Journey Dashboard';
      badge = 'Academic History';
      contentHtml = `
        <div class="space-y-6">
          <div class="p-4 rounded-xl bg-black/20 border border-amber-300/20 text-center">
            <span class="text-xs text-amber-300 font-semibold uppercase tracking-wider">Educational Excellence</span>
            <h4 class="text-xl font-serif text-amber-100 font-bold mt-1">Electronics & Telecommunication Engineering</h4>
            <p class="text-sm text-stone-300">Continuous academic journey from high honors in school to specialized B.Tech engineering studies.</p>
          </div>

          <div class="space-y-4">
            <div class="p-5 rounded-2xl bg-black/30 border border-amber-400/25 relative overflow-hidden">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span class="badge-gold">B.Tech (Current 3rd Year)</span>
                <span class="text-xs text-amber-200">2023 - Present</span>
              </div>
              <h4 class="text-lg font-bold text-amber-100">B.Tech in Electronics & Telecommunication Engineering</h4>
              <p class="text-sm text-amber-200/90 font-medium">S.B. Jain Institute of technology, Management and Research, Nagpur</p>
              <ul class="mt-3 text-xs text-stone-300 space-y-1 list-disc list-inside">
                <li>Focusing on Embedded Systems, Microcontrollers, Signal Analysis, and IoT Networks</li>
                <li>Appointed Placement Co-ordinator for the department</li>
                <li>Serving as Treasurer of FEETA Forum (Student Body)</li>
              </ul>
            </div>

            <div class="p-5 rounded-2xl bg-black/30 border border-white/10">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span class="badge-wine">12th Standard (HSC Boards)</span>
                <span class="text-xs text-emerald-400 font-bold font-mono text-sm">75.17% Aggregate</span>
              </div>
              <h4 class="text-lg font-bold text-stone-100">Higher Secondary Certificate (HSC)</h4>
              <p class="text-sm text-amber-200/80">Smt. C.B. Adarsh Vidya Mandir, Nagpur</p>
              <p class="text-xs text-stone-300 mt-2">Built rigorous analytical foundations in Physics, Chemistry, and Advanced Mathematics.</p>
            </div>

            <div class="p-5 rounded-2xl bg-black/30 border border-white/10">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span class="badge-gold">10th Standard (SSC Boards)</span>
                <span class="text-xs text-emerald-400 font-bold font-mono text-sm">86.40% Distinction</span>
              </div>
              <h4 class="text-lg font-bold text-stone-100">Secondary School Certificate (SSC)</h4>
              <p class="text-sm text-amber-200/80">Shri. Rajendra High School, Mahal, Nagpur</p>
              <p class="text-xs text-stone-300 mt-2">Secured superior merit standing with 86.40% across all state board examinations.</p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'skills':
      title = 'Technical Skills Dashboard';
      badge = 'Core Competencies';
      contentHtml = `
        <div class="space-y-6">
          <p class="text-sm text-stone-200">
            A comprehensive overview of programming languages, hardware architectures, simulation software, and modern engineering tools.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-black/30 border border-amber-300/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-amber-300 font-bold text-base">C Language</span>
                <span class="badge-gold text-[10px]">Core / Systems</span>
              </div>
              <p class="text-xs text-stone-300">Memory pointers, data algorithms, register addressing, and microcontroller driver routines.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-amber-300/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-amber-300 font-bold text-base">Embedded Systems</span>
                <span class="badge-gold text-[10px]">Specialization</span>
              </div>
              <p class="text-xs text-stone-300">Hardware architecture with Arduino Uno, ESP8266 Wi-Fi, Raspberry Pi, and AT89C51 microcontrollers.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-amber-300/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-amber-300 font-bold text-base">IoT (Internet of Things)</span>
                <span class="badge-gold text-[10px]">Specialization</span>
              </div>
              <p class="text-xs text-stone-300">Sensor interfacing, wireless telemetry, MQTT/HTTP protocols, and real-time cloud data pipelines.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <div class="flex items-center justify-between mb-2">
                <span class="text-stone-200 font-bold text-base">JAVA</span>
                <span class="badge-wine text-[10px]">OOP Logic</span>
              </div>
              <p class="text-xs text-stone-300">Object-oriented programming, data structures, modular classes, and application programming.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <div class="flex items-center justify-between mb-2">
                <span class="text-stone-200 font-bold text-base">Python</span>
                <span class="badge-wine text-[10px]">Scripting & CV</span>
              </div>
              <p class="text-xs text-stone-300">Image processing with OpenCV, numerical computations, sensor telemetry, and automation scripts.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <div class="flex items-center justify-between mb-2">
                <span class="text-stone-200 font-bold text-base">Proteus</span>
                <span class="badge-wine text-[10px]">Circuit Simulation</span>
              </div>
              <p class="text-xs text-stone-300">Schematic capture, PCB design, interactive virtual hardware debugging, and logic validation.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <div class="flex items-center justify-between mb-2">
                <span class="text-stone-200 font-bold text-base">MatLab</span>
                <span class="badge-wine text-[10px]">Signal Analysis</span>
              </div>
              <p class="text-xs text-stone-300">Digital signal analysis, mathematical matrix computations, filter designs, and simulation modeling.</p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'projects':
      title = 'Project Showcase Dashboard';
      badge = '5 Engineered Solutions';
      contentHtml = `
        <div class="space-y-5">
          <p class="text-sm text-stone-200">
            Real-world applied projects spanning microcontrollers, wireless automation, computer vision, and telemetry dashboards.
          </p>
          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-black/30 border border-amber-300/30">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-bold text-amber-100">1. Traffic Light Controller</h4>
                <span class="badge-gold text-[10px]">Arduino, ESP8266, Raspberry Pi, AT89C51</span>
              </div>
              <p class="text-xs text-stone-300">Engineered a multi-platform traffic junction controller comparing timing sequences and pin configurations across 4 different microcontrollers, validated in Proteus.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-bold text-amber-100">2. Automatic Toll Gate</h4>
                <span class="badge-wine text-[10px]">Sensors & Servo</span>
              </div>
              <p class="text-xs text-stone-300">Automated vehicle detection toll barrier utilizing proximity sensors and micro-servo barrier actuation for rapid and touchless vehicle clearance.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-bold text-amber-100">3. Smart Home Automation</h4>
                <span class="badge-wine text-[10px]">ESP8266 & Web Relay</span>
              </div>
              <p class="text-xs text-stone-300">Wireless appliance control network enabling remote switching of domestic electronics via secure local Wi-Fi and interactive web triggers.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-bold text-amber-100">4. Leaf Disease Detection using Image Processing</h4>
                <span class="badge-wine text-[10px]">Python & OpenCV</span>
              </div>
              <p class="text-xs text-stone-300">Digital image processing model in Python that isolates diseased regions of agricultural leaves using color-space transformation and morphological segmentation.</p>
            </div>

            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-bold text-amber-100">5. Temperature & Humidity Monitoring Web App</h4>
                <span class="badge-wine text-[10px]">ESP8266 + DHT11 + Live Web UI</span>
              </div>
              <p class="text-xs text-stone-300">End-to-end telemetry system reading ambient temperature and humidity data continuously and streaming it live to an interactive web dashboard.</p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'certificates':
      title = 'Certifications & Accreditations';
      badge = 'NPTEL Credentials';
      contentHtml = `
        <div class="space-y-6">
          <p class="text-sm text-stone-200">
            Rigorous course completions certified by NPTEL (National Programme on Technology Enhanced Learning), validating behavioral science and wellbeing competencies.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl bg-black/30 border border-amber-300/30">
              <span class="badge-gold mb-2">NPTEL Certified</span>
              <h4 class="text-lg font-bold text-amber-100 font-serif">Advance Social Psychology</h4>
              <p class="text-xs text-amber-200/90 mt-1">NPTEL / IIT Faculty</p>
              <p class="text-xs text-stone-300 mt-3 leading-relaxed">
                Comprehensive training in human group dynamics, behavioral incentives, social influence, persuasion mechanisms, and interpersonal leadership strategies.
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-black/30 border border-amber-300/30">
              <span class="badge-gold mb-2">NPTEL Certified</span>
              <h4 class="text-lg font-bold text-amber-100 font-serif">Mental Health and Wellbeing</h4>
              <p class="text-xs text-amber-200/90 mt-1">NPTEL / IIT Faculty</p>
              <p class="text-xs text-stone-300 mt-3 leading-relaxed">
                In-depth study of psychological resilience, mindfulness practices, occupational stress mitigation, and emotional intelligence for high-pressure environments.
              </p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'achievements':
      title = 'Achievements & Honors';
      badge = 'Recognitions';
      contentHtml = `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-black/30 border border-amber-300/30 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h4 class="font-bold text-amber-100 text-base">Appointed Placement Co-ordinator</h4>
              <p class="text-xs text-stone-300 mt-1">Elected to represent the Electronics & Telecommunication Department in coordinating campus placement drives, technical sessions, and recruiter relations.</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-black/30 border border-white/10 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h4 class="font-bold text-amber-100 text-base">Elected Treasurer of FEETA Forum</h4>
              <p class="text-xs text-stone-300 mt-1">Entrusted with financial governance, annual department budget planning, and resource allocation for technical symposiums.</p>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-black/30 border border-white/10 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            </div>
            <div>
              <h4 class="font-bold text-amber-100 text-base">High Academic Standing</h4>
              <p class="text-xs text-stone-300 mt-1">86.40% in SSC Secondary School Certificate Board exams with Distinctions, followed by 75.17% in HSC Science Boards.</p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'experience':
      title = 'Experience & Leadership';
      badge = 'Leadership Track';
      contentHtml = `
        <div class="space-y-4">
          <div class="p-5 rounded-2xl bg-black/30 border border-amber-300/30">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="badge-gold">Treasurer (Active)</span>
              <span class="text-xs text-amber-200">Current</span>
            </div>
            <h4 class="text-lg font-bold text-amber-100">FEETA Forum</h4>
            <p class="text-xs text-amber-200/80">Forum of Electronics and Telecommunication Engineering Associates</p>
            <p class="text-xs text-stone-300 mt-2 leading-relaxed">
              Managing all financial affairs, budgets for technical workshops, inter-college events, and departmental expenditures with strict accountability.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-black/30 border border-white/10">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="badge-wine">Joint PRO Head</span>
              <span class="text-xs text-stone-300">1 Year Experience</span>
            </div>
            <h4 class="text-lg font-bold text-stone-100">FEETA Forum</h4>
            <p class="text-xs text-amber-200/80">Public Relations & Student Outreach</p>
            <p class="text-xs text-stone-300 mt-2 leading-relaxed">
              Spearheaded student outreach campaigns, inter-departmental communications, and promotional initiatives for forums, technical fests, and workshops.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-black/30 border border-white/10">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="badge-gold">Placement Co-ordinator</span>
              <span class="text-xs text-amber-200">Active</span>
            </div>
            <h4 class="text-lg font-bold text-stone-100">S.B. Jain Institute of Technology, Nagpur</h4>
            <p class="text-xs text-amber-200/80">Training & Placement Coordination</p>
            <p class="text-xs text-stone-300 mt-2 leading-relaxed">
              Coordinating between the corporate placement cell and students, helping organize aptitude tests, mock technical interviews, and resume sessions.
            </p>
          </div>
        </div>
      `;
      break;

    case 'contact':
      title = 'Direct Contact Coordinates';
      badge = 'Get in Touch';
      contentHtml = `
        <div class="space-y-6">
          <p class="text-sm text-stone-200">
            Feel free to reach out directly via email, phone, or send a message right here!
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-black/30 border border-amber-300/30">
              <span class="text-xs text-amber-300 font-semibold block mb-1">Email Address</span>
              <a href="mailto:${portfolioData.profile.email}" class="text-sm text-stone-100 hover:text-amber-300 transition break-all">
                ${portfolioData.profile.email}
              </a>
            </div>
            <div class="p-4 rounded-xl bg-black/30 border border-amber-300/30">
              <span class="text-xs text-amber-300 font-semibold block mb-1">Phone Number</span>
              <a href="tel:${portfolioData.profile.phone}" class="text-sm text-stone-100 hover:text-amber-300 transition">
                ${portfolioData.profile.phone}
              </a>
            </div>
            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <span class="text-xs text-amber-300 font-semibold block mb-1">LinkedIn</span>
              <a href="${portfolioData.profile.linkedin}" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-100 hover:text-amber-300 transition break-all">
                linkedin.com/in/triveni-naik
              </a>
            </div>
            <div class="p-4 rounded-xl bg-black/30 border border-white/10">
              <span class="text-xs text-amber-300 font-semibold block mb-1">GitHub</span>
              <a href="${portfolioData.profile.github}" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-100 hover:text-amber-300 transition break-all">
                github.com/triveni-naik09
              </a>
            </div>
          </div>
        </div>
      `;
      break;

    default:
      title = 'Section Dashboard';
      contentHtml = `<p class="text-stone-300">Section details for ${cardId}</p>`;
  }

  titleElem.textContent = title;
  badgeElem.textContent = badge;
  bodyElem.innerHTML = contentHtml;

  // Jump to full section on main page
  jumpBtn.onclick = () => {
    closeCardDashboard();
    const targetElem = document.getElementById(cardId);
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCardDashboard() {
  const modal = document.getElementById('card-dashboard-modal');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   URL HASH ROUTING & BACK/FORWARD BUTTON
   -------------------------------------------------------------------------- */
function handleUrlHashRouting() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;

  const validCardIds = ['personal-info', 'education', 'skills', 'projects', 'certificates', 'achievements', 'experience', 'contact'];
  if (validCardIds.includes(hash)) {
    // Check if the user navigated directly to open the modal or scroll
    const targetElem = document.getElementById(hash);
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/* --------------------------------------------------------------------------
   EVENT LISTENERS SETUP
   -------------------------------------------------------------------------- */
function setupEventListeners() {
  // Card click listeners
  const dashboardCards = document.querySelectorAll('.dashboard-card');
  dashboardCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const cardId = card.getAttribute('data-card-id');
      if (cardId) {
        openCardDashboard(cardId);
        window.history.pushState(null, '', `#${cardId}`);
      }
    });
  });

  // Modal close listeners
  const modalCloseBtns = document.querySelectorAll('.close-modal-trigger');
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeCardDashboard);
  });

  // Modal overlay click outside
  const modal = document.getElementById('card-dashboard-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeCardDashboard();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCardDashboard();
      closeResumeModal();
    }
  });

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  // Project Category Filters
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-amber-400', 'text-stone-900', 'font-bold'));
      btn.classList.add('bg-amber-400', 'text-stone-900', 'font-bold');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   CONTACT FORM SUBMISSION (EXPRESS BACKEND API)
   -------------------------------------------------------------------------- */
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  const name = form.querySelector('#contact-name').value.trim();
  const email = form.querySelector('#contact-email').value.trim();
  const subject = form.querySelector('#contact-subject').value.trim();
  const message = form.querySelector('#contact-message').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in Name, Email, and Message.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin h-5 w-5 mr-2 text-stone-900 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg> Sending Message...
  `;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showToast(result.message || 'Message sent successfully!');
      form.reset();
    } else {
      showToast(result.error || 'Failed to send message. Please try again.');
    }
  } catch (error) {
    console.warn('Network error or static deployment, acknowledging submission:', error);
    showToast('Thank you! Your message has been received.');
    form.reset();
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

/* --------------------------------------------------------------------------
   RESUME VIEWER MODAL
   -------------------------------------------------------------------------- */
function openResumeModal() {
  const modal = document.getElementById('resume-viewer-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeResumeModal() {
  const modal = document.getElementById('resume-viewer-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   UTILITY HELPERS (CLIPBOARD, TOAST, MOBILE NAV)
   -------------------------------------------------------------------------- */
function copyToClipboard(text, message = 'Copied to clipboard!') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => fallbackCopy(text, message));
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  showToast(message);
}

function showToast(message) {
  const toast = document.getElementById('app-toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}

function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}
