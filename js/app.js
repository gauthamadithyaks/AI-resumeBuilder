// app.js - Main Application State Controller, Stepper Forms, Live Preview, and AI Integration

import { SAMPLE_STUDENT, JOB_PRESETS } from './sampleData.js';
import { aiEngine } from './aiEngine.js';
import { TemplateRenderer, TEMPLATES } from './templates.js';
import { ExportUtils } from './exportUtils.js';

class ResumeApp {
  constructor() {
    this.currentView = 'landing'; // 'landing', 'dashboard', 'builder'
    this.currentStep = 1; // 1 to 9
    this.currentUser = {
      id: 'usr-1',
      name: 'Alex Chen',
      email: 'alex.chen@university.edu',
      isDemo: true
    };

    // Load or initialize active student resume
    this.resumeData = JSON.parse(JSON.stringify(SAMPLE_STUDENT));
    this.resumeOptions = {
      templateId: 'cascade',
      accentColor: '#4f46e5',
      fontFamily: 'Inter',
      fontSize: 'normal',
      sectionVisibility: {
        summary: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: true,
        achievements: true,
        extracurricular: true
      }
    };

    this.resumesList = [
      {
        id: 'res-google',
        name: 'Google — Software Engineer',
        targetCompany: 'Google',
        targetRole: 'Associate Software Engineer',
        updatedAt: '2026-09-28',
        score: 88,
        templateId: 'fresher'
      },
      {
        id: 'res-msft',
        name: 'Microsoft — Cloud Developer',
        targetCompany: 'Microsoft',
        targetRole: 'Software Developer (New Grad)',
        updatedAt: '2026-09-25',
        score: 91,
        templateId: 'swe'
      },
      {
        id: 'res-amzn',
        name: 'Amazon — SDE Intern',
        targetCompany: 'Amazon',
        targetRole: 'SDE Intern',
        updatedAt: '2026-09-20',
        score: 85,
        templateId: 'classic'
      }
    ];

    this.chatHistory = [];
    this.latestAnalysis = null;
    this.builderMode = 'form'; // 'form' or 'workspace' (Left: Resume, Right: AI Upskilling)
    this.workspaceAITab = 'upskill'; // 'upskill' | 'score' | 'improvements' | 'chat'
  }

  init() {
    this.initTheme();
    this.bindEvents();
    this.renderView('landing');
    this.renderLiveResume();
    this.updateAuthNav();

    // Trigger Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- THEME MANAGEMENT ---
  initTheme() {
    const savedTheme = localStorage.getItem('resumeforge_theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('resumeforge_theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('resumeforge_theme', 'dark');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  // --- VIEW ROUTING ---
  renderView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.view-screen').forEach(el => el.classList.add('hidden'));

    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.classList.remove('hidden');
    }

    const footer = document.getElementById('global-footer');
    if (footer) {
      footer.classList.toggle('hidden', viewName === 'builder');
    }

    this.updateAuthNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'dashboard') {
      this.renderDashboard();
    } else if (viewName === 'builder') {
      this.renderStepperPills();
      this.renderCurrentStepForm();
      this.renderLiveResume();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  updateAuthNav() {
    const navContainer = document.getElementById('nav-auth-container');
    if (!navContainer) return;

    if (this.currentView === 'landing') {
      navContainer.innerHTML = `
        <button id="nav-btn-dashboard" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          My Dashboard
        </button>
        <button id="nav-btn-cta-builder" class="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
          Resume Builder
        </button>
      `;
      document.getElementById('nav-btn-dashboard')?.addEventListener('click', () => this.renderView('dashboard'));
      document.getElementById('nav-btn-cta-builder')?.addEventListener('click', () => this.renderView('builder'));
    } else if (this.currentView === 'dashboard') {
      navContainer.innerHTML = `
        <button id="nav-btn-landing" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          Home
        </button>
        <button id="nav-btn-new-res" class="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
          + New Resume
        </button>
      `;
      document.getElementById('nav-btn-landing')?.addEventListener('click', () => this.renderView('landing'));
      document.getElementById('nav-btn-new-res')?.addEventListener('click', () => this.renderView('builder'));
    } else if (this.currentView === 'builder') {
      navContainer.innerHTML = `
        <button id="nav-btn-to-dash" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5">
          <i data-lucide="layout-dashboard" class="w-3.5 h-3.5"></i>
          <span>Dashboard</span>
        </button>
      `;
      document.getElementById('nav-btn-to-dash')?.addEventListener('click', () => this.renderView('dashboard'));
    }
    if (window.lucide) window.lucide.createIcons();
  }

  // --- DASHBOARD RENDERER ---
  renderDashboard() {
    const grid = document.getElementById('dashboard-resumes-grid');
    if (!grid) return;

    grid.innerHTML = this.resumesList.map(res => `
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
              ${res.targetCompany}
            </span>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              ${res.score}/100 ATS
            </span>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white mt-3">${res.name}</h3>
          <p class="text-xs text-slate-500 mt-1">Role: ${res.targetRole}</p>
          <div class="text-[11px] text-slate-400 mt-2">Last updated: ${res.updatedAt}</div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-semibold text-xs transition" onclick="app.loadResumeForEdit('${res.id}')">
            Edit & Tailor
          </button>
          <div class="flex items-center gap-1.5">
            <button class="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" title="Quick PDF Export" onclick="app.quickExportPDF('${res.id}')">
              <i data-lucide="download" class="w-4 h-4"></i>
            </button>
            <button class="p-1.5 text-slate-400 hover:text-red-500" title="Delete" onclick="app.deleteResume('${res.id}')">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  loadResumeForEdit(resumeId) {
    const found = this.resumesList.find(r => r.id === resumeId);
    if (found) {
      this.resumeData.targetJob.company = found.targetCompany;
      this.resumeData.targetJob.role = found.targetRole;
      this.resumeOptions.templateId = found.templateId || 'fresher';
      document.getElementById('select-template').value = this.resumeOptions.templateId;
    }
    this.renderView('builder');
    this.showToast(`Loaded ${found?.name || 'Resume'} for editing!`);
  }

  quickExportPDF(resumeId) {
    this.loadResumeForEdit(resumeId);
    setTimeout(() => {
      ExportUtils.printToPDF('resume-live-preview', this.resumeData.targetJob?.company || 'Resume');
    }, 500);
  }

  deleteResume(resumeId) {
    if (confirm('Are you sure you want to delete this resume?')) {
      this.resumesList = this.resumesList.filter(r => r.id !== resumeId);
      this.renderDashboard();
      this.showToast('Resume removed from dashboard.');
    }
  }

  // --- STEPPER PILLS (Steps 1 to 9) ---
  renderStepperPills() {
    const container = document.getElementById('stepper-pills-container');
    if (!container) return;

    const steps = [
      { num: 1, label: 'Personal', icon: 'user' },
      { num: 2, label: 'Education', icon: 'graduation-cap' },
      { num: 3, label: 'Skills', icon: 'cpu' },
      { num: 4, label: 'Projects', icon: 'folder-git-2' },
      { num: 5, label: 'Experience', icon: 'briefcase' },
      { num: 6, label: 'Certifications', icon: 'award' },
      { num: 7, label: 'Achievements', icon: 'trophy' },
      { num: 8, label: 'Activities', icon: 'users' },
      { num: 9, label: 'Target & AI', icon: 'sparkles' }
    ];

    container.innerHTML = steps.map(s => {
      const isActive = this.currentStep === s.num;
      const isCompleted = this.currentStep > s.num;

      return `
        <button class="step-pill px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
          isActive
            ? 'bg-indigo-600 text-white shadow-sm'
            : isCompleted
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }" onclick="app.goToStep(${s.num})">
          <i data-lucide="${s.icon}" class="w-3.5 h-3.5"></i>
          <span>${s.num}. ${s.label}</span>
          ${isCompleted ? '<i data-lucide="check" class="w-3 h-3 ml-0.5"></i>' : ''}
        </button>
      `;
    }).join('');

    const currentStepNum = document.getElementById('current-step-num');
    if (currentStepNum) currentStepNum.innerText = this.currentStep;

    const prevBtn = document.getElementById('btn-step-prev');
    if (prevBtn) prevBtn.disabled = this.currentStep === 1;

    const nextBtn = document.getElementById('btn-step-next');
    if (nextBtn) {
      if (this.currentStep === 9) {
        nextBtn.innerHTML = `⚡ Build Resume & Open Workspace`;
        nextBtn.classList.add('bg-gradient-to-r', 'from-indigo-600', 'to-purple-600', 'shadow-md', 'shadow-indigo-500/25');
      } else {
        nextBtn.innerHTML = `Next Step →`;
        nextBtn.classList.remove('bg-gradient-to-r', 'from-indigo-600', 'to-purple-600', 'shadow-md', 'shadow-indigo-500/25');
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  goToStep(stepNum) {
    this.currentStep = Math.max(1, Math.min(9, stepNum));
    this.renderStepperPills();
    this.renderCurrentStepForm();
  }

  nextStep() {
    if (this.currentStep === 9) {
      this.runAITailoringFlow();
    } else {
      this.goToStep(this.currentStep + 1);
    }
  }

  prevStep() {
    this.goToStep(this.currentStep - 1);
  }

  // --- STEP FORM RENDERING ---
  renderCurrentStepForm() {
    const formContainer = document.getElementById('form-step-content');
    if (!formContainer) return;

    switch (this.currentStep) {
      case 1:
        formContainer.innerHTML = this.renderStep1PersonalInfo();
        break;
      case 2:
        formContainer.innerHTML = this.renderStep2Education();
        break;
      case 3:
        formContainer.innerHTML = this.renderStep3Skills();
        break;
      case 4:
        formContainer.innerHTML = this.renderStep4Projects();
        break;
      case 5:
        formContainer.innerHTML = this.renderStep5Experience();
        break;
      case 6:
        formContainer.innerHTML = this.renderStep6Certifications();
        break;
      case 7:
        formContainer.innerHTML = this.renderStep7Achievements();
        break;
      case 8:
        formContainer.innerHTML = this.renderStep8Extracurricular();
        break;
      case 9:
        formContainer.innerHTML = this.renderStep9CareerTarget();
        break;
    }

    this.bindFormInputEvents();
    if (window.lucide) window.lucide.createIcons();
  }

  // STEP 1: PERSONAL INFO & EXPERIENCE STATUS
  renderStep1PersonalInfo() {
    const p = this.resumeData.personalInfo;
    const status = this.resumeData.profileStatus || 'student';
    const exp = this.resumeData.yearsOfExperience || '0';

    return `
      <!-- Experience & Candidate Status Section -->
      <div class="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-4">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
            Candidate Profile & Experience
          </span>
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1.5">
            Are you currently a student or working professional?
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Our AI engine customizes section prioritization and ATS keywords based on your exact experience level.
          </p>
        </div>

        <!-- Candidate Status (Student vs Fresher vs Working Professional) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button type="button" class="p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            status === 'student'
              ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
              : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
          }" onclick="app.setProfileStatus('student')">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <i data-lucide="graduation-cap" class="w-4 h-4"></i>
              </div>
              <span class="w-4 h-4 rounded-full border flex items-center justify-center ${
                status === 'student' ? 'border-indigo-600 bg-indigo-600 text-white text-[10px] font-bold' : 'border-slate-300'
              }">
                ${status === 'student' ? '✓' : ''}
              </span>
            </div>
            <div class="mt-2.5 font-bold text-xs text-slate-900 dark:text-white">College Student</div>
            <div class="text-[11px] text-slate-500 mt-0.5">Undergrad / Master's / Intern</div>
          </button>

          <button type="button" class="p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            status === 'fresher'
              ? 'bg-white dark:bg-slate-800 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
          }" onclick="app.setProfileStatus('fresher')">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
              </div>
              <span class="w-4 h-4 rounded-full border flex items-center justify-center ${
                status === 'fresher' ? 'border-emerald-600 bg-emerald-600 text-white text-[10px] font-bold' : 'border-slate-300'
              }">
                ${status === 'fresher' ? '✓' : ''}
              </span>
            </div>
            <div class="mt-2.5 font-bold text-xs text-slate-900 dark:text-white">Recent Graduate</div>
            <div class="text-[11px] text-slate-500 mt-0.5">Fresher seeking 1st full-time job</div>
          </button>

          <button type="button" class="p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            status === 'experienced'
              ? 'bg-white dark:bg-slate-800 border-purple-600 dark:border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
              : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-purple-300'
          }" onclick="app.setProfileStatus('experienced')">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <i data-lucide="briefcase" class="w-4 h-4"></i>
              </div>
              <span class="w-4 h-4 rounded-full border flex items-center justify-center ${
                status === 'experienced' ? 'border-purple-600 bg-purple-600 text-white text-[10px] font-bold' : 'border-slate-300'
              }">
                ${status === 'experienced' ? '✓' : ''}
              </span>
            </div>
            <div class="mt-2.5 font-bold text-xs text-slate-900 dark:text-white">Working Professional</div>
            <div class="text-[11px] text-slate-500 mt-0.5">Have corporate work experience</div>
          </button>
        </div>

        <!-- Years of Experience Selector -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Total Years of Professional Experience:
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
            ${[
              { val: '0', label: '0 Years', sub: 'No experience' },
              { val: '0-1', label: '< 1 Year', sub: 'Intern / Freelance' },
              { val: '1-2', label: '1 – 2 Years', sub: 'Junior Level' },
              { val: '3-5', label: '3 – 5 Years', sub: 'Mid-Level' },
              { val: '5+', label: '5+ Years', sub: 'Senior Level' }
            ].map(item => `
              <button type="button" class="p-2.5 rounded-xl border text-center transition ${
                exp === item.val
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }" onclick="app.setYearsOfExperience('${item.val}')">
                <div class="font-bold text-xs">${item.label}</div>
                <div class="text-[10px] ${exp === item.val ? 'text-indigo-100' : 'text-slate-500'} mt-0.5">${item.sub}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Contextual Helper Banner based on selected experience -->
        <div class="p-3 rounded-xl ${
          exp === '0' || status === 'student'
            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
        } text-xs flex items-start gap-2.5">
          <i data-lucide="${exp === '0' || status === 'student' ? 'check-circle-2' : 'info'}" class="w-4 h-4 shrink-0 mt-0.5"></i>
          <div>
            ${
              exp === '0' || status === 'student'
                ? `<strong>Zero Experience Tailoring Active:</strong> The AI will emphasize your college projects, academic coursework, hackathons, and technical skills so your resume clears ATS filters without needing prior full-time jobs.`
                : `<strong>Professional Experience Tailoring Active:</strong> The AI will prioritize your work history, measurable business outcomes, system architecture contributions, and leadership impact.`
            }
          </div>
        </div>
      </div>

      <!-- Personal & Contact Information -->
      <div class="pt-2">
        <h3 class="text-base font-bold text-slate-900 dark:text-white">Step 1 — Personal & Contact Information</h3>
        <p class="text-xs text-slate-500 mt-1">Provide accurate contact links so tech recruiters can reach you easily.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
          <input type="text" data-field="personalInfo.fullName" value="${p.fullName || ''}" placeholder="Alex Chen" class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
          <input type="email" data-field="personalInfo.email" value="${p.email || ''}" placeholder="alex@university.edu" class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
          <input type="text" data-field="personalInfo.phone" value="${p.phone || ''}" placeholder="+1 (555) 019-2834" class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / City *</label>
          <input type="text" data-field="personalInfo.location" value="${p.location || ''}" placeholder="San Jose, CA" class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile</label>
          <input type="text" data-field="personalInfo.linkedIn" value="${p.linkedIn || ''}" placeholder="linkedin.com/in/alexchen" class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub Profile (Crucial for Tech!)</label>
          <input type="text" data-field="personalInfo.github" value="${p.github || ''}" placeholder="github.com/alexchen" class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Portfolio / Personal Website</label>
          <input type="text" data-field="personalInfo.portfolio" value="${p.portfolio || ''}" placeholder="alexchen.dev" class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
        </div>
        <div class="sm:col-span-2">
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Professional Summary / Career Objective</label>
            <button class="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1" onclick="app.aiPolishSummary()">
              <i data-lucide="sparkles" class="w-3 h-3"></i> AI Polish Summary
            </button>
          </div>
          <textarea data-field="personalInfo.summary" rows="3" placeholder="Brief summary of your academic background and technical interests..." class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed">${p.summary || ''}</textarea>
        </div>
      </div>
    `;
  }

  // STEP 2: EDUCATION
  renderStep2Education() {
    const list = this.resumeData.education || [];
    return `
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Step 2 — Education & Coursework</h3>
          <p class="text-xs text-slate-500 mt-1">College education is prime real estate on a fresher's resume.</p>
        </div>
        <button class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition" onclick="app.addEducation()">
          + Add Degree
        </button>
      </div>

      <div class="space-y-4">
        ${list.map((edu, idx) => `
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 relative">
            <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700/50">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Entry #${idx + 1}</span>
              ${list.length > 1 ? `<button class="text-slate-400 hover:text-red-500 text-xs" onclick="app.removeEducation(${idx})">Remove</button>` : ''}
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block font-semibold mb-1">College / University *</label>
                <input type="text" data-array="education" data-index="${idx}" data-field="college" value="${edu.college || ''}" placeholder="California State University" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">Degree *</label>
                <input type="text" data-array="education" data-index="${idx}" data-field="degree" value="${edu.degree || ''}" placeholder="Bachelor of Science" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">Branch / Major *</label>
                <input type="text" data-array="education" data-index="${idx}" data-field="branch" value="${edu.branch || ''}" placeholder="Computer Science & Engineering" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">Current Year</label>
                <input type="text" data-array="education" data-index="${idx}" data-field="currentYear" value="${edu.currentYear || ''}" placeholder="Senior (4th Year)" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">Graduation Year *</label>
                <input type="text" data-array="education" data-index="${idx}" data-field="graduationYear" value="${edu.graduationYear || ''}" placeholder="2026" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">CGPA / Percentage</label>
                <input type="text" data-array="education" data-index="${idx}" data-field="cgpa" value="${edu.cgpa || ''}" placeholder="3.84 / 4.0 or 8.8 / 10" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div class="sm:col-span-2">
                <label class="block font-semibold mb-1">Relevant Coursework (Boosts ATS Matching!)</label>
                <input type="text" data-array="education" data-index="${idx}" data-field="coursework" value="${edu.coursework || ''}" placeholder="Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  addEducation() {
    this.resumeData.education.push({
      college: '',
      degree: 'Bachelor of Technology',
      branch: 'Computer Science',
      currentYear: 'Final Year',
      graduationYear: '2026',
      cgpa: '',
      coursework: 'Data Structures, Algorithms, Web Development'
    });
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  removeEducation(index) {
    this.resumeData.education.splice(index, 1);
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  // STEP 3: SKILLS
  renderStep3Skills() {
    const s = this.resumeData.skills;
    const categories = [
      { key: 'programming', label: 'Programming Languages', placeholder: 'e.g. JavaScript, Python, Java, C++, SQL' },
      { key: 'web', label: 'Web Technologies', placeholder: 'e.g. React, Next.js, HTML5, CSS3, Node.js, REST APIs' },
      { key: 'databases', label: 'Databases & Storage', placeholder: 'e.g. PostgreSQL, MongoDB, MySQL, Redis' },
      { key: 'frameworks', label: 'Frameworks & Libraries', placeholder: 'e.g. Express.js, Django, Spring Boot' },
      { key: 'tools', label: 'Developer Tools', placeholder: 'e.g. Git, GitHub, VS Code, Postman, Linux' },
      { key: 'cloud', label: 'Cloud Technologies', placeholder: 'e.g. AWS (S3, EC2 Basics), Firebase, Vercel' },
      { key: 'aiml', label: 'AI / Machine Learning (Optional)', placeholder: 'e.g. Scikit-Learn, Gemini API, PyTorch' },
      { key: 'soft', label: 'Soft Skills', placeholder: 'e.g. Team Leadership, Problem Solving, Agile, Communication' }
    ];

    return `
      <div>
        <h3 class="text-base font-bold text-slate-900 dark:text-white">Step 3 — Technical & Soft Skills</h3>
        <p class="text-xs text-slate-500 mt-1">Enter your genuine skills. Separate items with commas or press enter.</p>
      </div>

      <div class="space-y-4">
        ${categories.map(cat => {
          const currentList = s[cat.key] || [];
          return `
            <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">${cat.label}</label>
              <div class="flex flex-wrap gap-1.5 mb-2">
                ${currentList.map((skill, sIdx) => `
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                    ${skill}
                    <button class="hover:text-red-500 ml-0.5 text-slate-400" onclick="app.removeSkill('${cat.key}', ${sIdx})">×</button>
                  </span>
                `).join('')}
              </div>
              <div class="flex gap-2">
                <input type="text" id="input-skill-${cat.key}" placeholder="${cat.placeholder}" class="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs" onkeydown="if(event.key==='Enter'){event.preventDefault(); app.addSkillFromInput('${cat.key}');}">
                <button class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition" onclick="app.addSkillFromInput('${cat.key}')">
                  Add
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  addSkillFromInput(categoryKey) {
    const input = document.getElementById(`input-skill-${categoryKey}`);
    if (!input || !input.value.trim()) return;

    const newSkills = input.value.split(',').map(s => s.trim()).filter(Boolean);
    if (!this.resumeData.skills[categoryKey]) {
      this.resumeData.skills[categoryKey] = [];
    }
    this.resumeData.skills[categoryKey].push(...newSkills);
    input.value = '';
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  removeSkill(categoryKey, index) {
    this.resumeData.skills[categoryKey].splice(index, 1);
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  // STEP 4: PROJECTS
  renderStep4Projects() {
    const list = this.resumeData.projects || [];
    return `
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Step 4 — Academic & Personal Projects</h3>
          <p class="text-xs text-slate-500 mt-1">Your projects demonstrate your actual coding competence.</p>
        </div>
        <button class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition" onclick="app.addProject()">
          + Add Project
        </button>
      </div>

      <div class="space-y-5">
        ${list.map((proj, idx) => `
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 relative">
            <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700/50">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Project #${idx + 1}</span>
              <div class="flex items-center gap-2">
                <button class="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold hover:bg-indigo-100 flex items-center gap-1" onclick="app.aiPolishProject(${idx})">
                  <i data-lucide="sparkles" class="w-3 h-3"></i> AI Polish Bullets
                </button>
                ${list.length > 1 ? `<button class="text-slate-400 hover:text-red-500 text-xs" onclick="app.removeProject(${idx})">Remove</button>` : ''}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block font-semibold mb-1">Project Name *</label>
                <input type="text" data-array="projects" data-index="${idx}" data-field="name" value="${proj.name || ''}" placeholder="CampusSync Marketplace" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">Your Role</label>
                <input type="text" data-array="projects" data-index="${idx}" data-field="role" value="${proj.role || ''}" placeholder="Full-Stack Developer" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div class="sm:col-span-2">
                <label class="block font-semibold mb-1">Technologies Used *</label>
                <input type="text" data-array="projects" data-index="${idx}" data-field="technologies" value="${proj.technologies || ''}" placeholder="React, Node.js, Express, PostgreSQL, Tailwind" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">GitHub Link</label>
                <input type="text" data-array="projects" data-index="${idx}" data-field="github" value="${proj.github || ''}" placeholder="https://github.com/user/project" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">Live Demo Link</label>
                <input type="text" data-array="projects" data-index="${idx}" data-field="link" value="${proj.link || ''}" placeholder="https://myproject.dev" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div class="sm:col-span-2">
                <label class="block font-semibold mb-1">Project Description / Summary</label>
                <textarea data-array="projects" data-index="${idx}" data-field="description" rows="2" placeholder="Brief summary of what the project does..." class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 leading-relaxed">${proj.description || ''}</textarea>
              </div>
              <div class="sm:col-span-2">
                <label class="block font-semibold mb-1">ATS Bullet Points (1 bullet per line)</label>
                <textarea data-array="projects" data-index="${idx}" data-field="bulletPointsRaw" rows="3" placeholder="• Architected full-stack web tool...&#10;• Implemented real-time updates..." class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px] leading-relaxed">${(proj.bulletPoints || []).join('\n')}</textarea>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  addProject() {
    this.resumeData.projects.push({
      name: 'New Technical Project',
      role: 'Developer',
      technologies: 'JavaScript, HTML5, CSS3',
      description: 'Built a web tool solving a common campus problem.',
      github: '',
      link: '',
      bulletPoints: ['Engineered modular frontend components ensuring smooth user experience.']
    });
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  removeProject(index) {
    this.resumeData.projects.splice(index, 1);
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  async aiPolishProject(index) {
    const proj = this.resumeData.projects[index];
    if (!proj) return;

    this.showToast('AI is elevating project bullet points with action verbs...');
    const enhanced = aiEngine.synthesizeBulletsFromDescription(proj.description, proj.features, proj.technologies);
    this.resumeData.projects[index].bulletPoints = enhanced;
    this.renderCurrentStepForm();
    this.renderLiveResume();
    this.showToast('Project bullet points polished!');
  }

  // STEP 5: EXPERIENCE (OPTIONAL FOR FRESHERS / STUDENTS)
  renderStep5Experience() {
    const list = this.resumeData.experience || [];
    const isStudentOrZeroExp = this.resumeData.profileStatus === 'student' || this.resumeData.yearsOfExperience === '0';
    return `
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Step 5 — Experience & Internships</h3>
            <span class="text-[10px] font-semibold ${
              isStudentOrZeroExp
                ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400'
                : 'text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-400'
            } px-2 py-0.5 rounded-full">
              ${isStudentOrZeroExp ? 'Optional for College Students & Freshers' : 'Recommended for Experienced'}
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            ${isStudentOrZeroExp 
              ? 'If you have completed internships, freelance projects, or campus jobs, add them here. If not, feel free to skip!' 
              : 'Include full-time and contract roles, core responsibilities, and quantifiable business outcomes.'}
          </p>
        </div>
        <button class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition" onclick="app.addExperience()">
          + Add Experience
        </button>
      </div>

      <div class="space-y-4">
        ${list.length === 0 ? `
          <div class="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 text-center">
            <i data-lucide="briefcase" class="w-8 h-8 text-slate-400 mx-auto mb-2"></i>
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300">
              ${isStudentOrZeroExp ? 'No Full-Time Work Experience?' : 'No Work Positions Added Yet'}
            </h4>
            <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              ${isStudentOrZeroExp 
                ? "That's 100% normal for freshers and college students. Our algorithms and templates are built to let your college projects, coursework, and technical skills shine!"
                : "Add your previous and current roles to boost your experience relevance and ATS score."}
            </p>
            <button class="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition" onclick="app.addExperience()">
              ${isStudentOrZeroExp ? 'Add Internship or Freelance' : 'Add Professional Experience'}
            </button>
          </div>
        ` : list.map((exp, idx) => `
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700/50">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Position #${idx + 1}</span>
              <button class="text-slate-400 hover:text-red-500 text-xs" onclick="app.removeExperience(${idx})">Remove</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block font-semibold mb-1">Company / Organization *</label>
                <input type="text" data-array="experience" data-index="${idx}" data-field="company" value="${exp.company || ''}" placeholder="InnovateLabs" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">Position / Title *</label>
                <input type="text" data-array="experience" data-index="${idx}" data-field="position" value="${exp.position || ''}" placeholder="Software Engineering Intern" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div class="sm:col-span-2">
                <label class="block font-semibold mb-1">Duration</label>
                <input type="text" data-array="experience" data-index="${idx}" data-field="duration" value="${exp.duration || ''}" placeholder="Jun 2025 – Aug 2025" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div class="sm:col-span-2">
                <label class="block font-semibold mb-1">Responsibilities</label>
                <textarea data-array="experience" data-index="${idx}" data-field="responsibilities" rows="2" placeholder="Key tasks and contributions..." class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 leading-relaxed">${exp.responsibilities || ''}</textarea>
              </div>
              <div class="sm:col-span-2">
                <label class="block font-semibold mb-1">Key Achievements / Measurable Outcomes</label>
                <input type="text" data-array="experience" data-index="${idx}" data-field="achievements" value="${exp.achievements || ''}" placeholder="e.g. Reduced page load times by 28%, wrote 20+ unit tests" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  addExperience() {
    this.resumeData.experience.push({
      company: '',
      position: 'Intern',
      duration: '',
      responsibilities: '',
      achievements: ''
    });
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  removeExperience(index) {
    this.resumeData.experience.splice(index, 1);
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  // STEP 6: CERTIFICATIONS
  renderStep6Certifications() {
    const list = this.resumeData.certifications || [];
    return `
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Step 6 — Certifications & Courses</h3>
          <p class="text-xs text-slate-500 mt-1">Validates continuous learning beyond your standard college syllabus.</p>
        </div>
        <button class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition" onclick="app.addCertification()">
          + Add Certification
        </button>
      </div>

      <div class="space-y-3">
        ${list.map((cert, idx) => `
          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs relative">
            <div>
              <label class="block font-semibold mb-1">Certification Name *</label>
              <input type="text" data-array="certifications" data-index="${idx}" data-field="name" value="${cert.name || ''}" placeholder="AWS Certified Cloud Practitioner" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            </div>
            <div>
              <label class="block font-semibold mb-1">Issuing Organization *</label>
              <input type="text" data-array="certifications" data-index="${idx}" data-field="issuer" value="${cert.issuer || ''}" placeholder="Amazon Web Services" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            </div>
            <div>
              <label class="block font-semibold mb-1">Issue Date</label>
              <input type="text" data-array="certifications" data-index="${idx}" data-field="date" value="${cert.date || ''}" placeholder="Aug 2025" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            </div>
            <div>
              <label class="block font-semibold mb-1">Credential URL</label>
              <div class="flex gap-2">
                <input type="text" data-array="certifications" data-index="${idx}" data-field="link" value="${cert.link || ''}" placeholder="https://aws.amazon.com/verify/..." class="form-input flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <button class="text-slate-400 hover:text-red-500 text-xs px-1" onclick="app.removeCertification(${idx})">×</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  addCertification() {
    this.resumeData.certifications.push({
      name: '',
      issuer: '',
      date: '',
      link: ''
    });
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  removeCertification(index) {
    this.resumeData.certifications.splice(index, 1);
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  // STEP 7: ACHIEVEMENTS
  renderStep7Achievements() {
    const list = this.resumeData.achievements || [];
    return `
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Step 7 — Achievements & Hackathons</h3>
          <p class="text-xs text-slate-500 mt-1">Hackathons, coding contests, and merit awards prove competitive excellence.</p>
        </div>
        <button class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition" onclick="app.addAchievement()">
          + Add Honor
        </button>
      </div>

      <div class="space-y-3">
        ${list.map((ach, idx) => `
          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div class="flex justify-between items-center">
              <label class="block font-semibold">Achievement Title *</label>
              <button class="text-slate-400 hover:text-red-500 text-xs" onclick="app.removeAchievement(${idx})">Remove</button>
            </div>
            <input type="text" data-array="achievements" data-index="${idx}" data-field="title" value="${ach.title || ''}" placeholder="1st Place Winner — University Hackathon (45 teams)" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <label class="block font-semibold pt-1">Description / Details</label>
            <input type="text" data-array="achievements" data-index="${idx}" data-field="description" value="${ach.description || ''}" placeholder="Built an accessible campus navigation app in 36 hours." class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          </div>
        `).join('')}
      </div>
    `;
  }

  addAchievement() {
    this.resumeData.achievements.push({
      title: '',
      description: ''
    });
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  removeAchievement(index) {
    this.resumeData.achievements.splice(index, 1);
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  // STEP 8: EXTRACURRICULAR
  renderStep8Extracurricular() {
    const list = this.resumeData.extracurricular || [];
    return `
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Step 8 — Extracurricular & Leadership</h3>
          <p class="text-xs text-slate-500 mt-1">Clubs, volunteer mentoring, and sports demonstrate strong communication skills.</p>
        </div>
        <button class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition" onclick="app.addExtracurricular()">
          + Add Activity
        </button>
      </div>

      <div class="space-y-3">
        ${list.map((ex, idx) => `
          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div class="flex justify-between items-center">
              <label class="block font-semibold">Club / Organization *</label>
              <button class="text-slate-400 hover:text-red-500 text-xs" onclick="app.removeExtracurricular(${idx})">Remove</button>
            </div>
            <input type="text" data-array="extracurricular" data-index="${idx}" data-field="organization" value="${ex.organization || ''}" placeholder="ACM Student Chapter" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label class="block font-semibold mb-1">Your Role</label>
                <input type="text" data-array="extracurricular" data-index="${idx}" data-field="role" value="${ex.role || ''}" placeholder="Workshop Lead" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
              <div>
                <label class="block font-semibold mb-1">Impact / Activities</label>
                <input type="text" data-array="extracurricular" data-index="${idx}" data-field="details" value="${ex.details || ''}" placeholder="Mentored 70+ junior students in Python & Git" class="form-input w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  addExtracurricular() {
    this.resumeData.extracurricular.push({
      organization: '',
      role: 'Member',
      details: ''
    });
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  removeExtracurricular(index) {
    this.resumeData.extracurricular.splice(index, 1);
    this.renderCurrentStepForm();
    this.renderLiveResume();
  }

  // STEP 9: CAREER TARGET & AI
  renderStep9CareerTarget() {
    const t = this.resumeData.targetJob || {};
    return `
      <div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">
          Core AI Section
        </span>
        <h3 class="text-base font-bold text-slate-900 dark:text-white mt-1">Step 9 — Target Company & Job Role</h3>
        <p class="text-xs text-slate-500 mt-1">Our AI aligns your projects, keywords, and phrasing specifically for this application.</p>
      </div>

      <!-- Quick Preset Buttons -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Or choose a popular company preset:</label>
        <div class="flex flex-wrap gap-1.5">
          ${JOB_PRESETS.map((preset, idx) => `
            <button class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition" onclick="app.applyJobPreset(${idx})">
              ${preset.company} — ${preset.role}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Company Name *</label>
          <input type="text" data-field="targetJob.company" value="${t.company || ''}" placeholder="e.g. Google, Microsoft, Amazon, Infosys" class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Job Role *</label>
          <input type="text" data-field="targetJob.role" value="${t.role || ''}" placeholder="e.g. Associate Software Engineer, SDE Intern" class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Description (Optional, but increases ATS match!)</label>
          <textarea data-field="targetJob.jobDescription" rows="4" placeholder="Paste the job description from LinkedIn, Indeed, or the company careers page..." class="form-input w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed font-mono">${t.jobDescription || ''}</textarea>
        </div>
      </div>

      <!-- Core Build Resume Action Banner -->
      <div class="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20">
            <i data-lucide="sparkles" class="w-6 h-6 text-indigo-300"></i>
          </div>
          <div>
            <h4 class="text-base font-extrabold">All Inputs Completed!</h4>
            <p class="text-xs text-indigo-200 mt-0.5">Build your tailored resume and generate your personalized upskilling roadmap.</p>
          </div>
        </div>

        <button id="btn-build-resume-action" class="w-full py-4 px-6 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 font-black text-sm shadow-2xl flex items-center justify-center gap-2.5 transition transform hover:scale-[1.01] active:scale-[0.99]" onclick="app.runAITailoringFlow()">
          <i data-lucide="zap" class="w-5 h-5 text-indigo-600 fill-indigo-600"></i>
          <span>⚡ Build My Resume & Open AI Workspace</span>
          <i data-lucide="arrow-right" class="w-5 h-5 text-indigo-600"></i>
        </button>

        <div class="flex flex-wrap items-center justify-center gap-4 text-[11px] text-indigo-200 pt-1">
          <span class="flex items-center gap-1.5"><i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> Tailored Resume on Left</span>
          <span class="flex items-center gap-1.5"><i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> "What More Can I Upskill Myself?" on Right</span>
          <span class="flex items-center gap-1.5"><i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> ATS Score & Gaps</span>
        </div>
      </div>
    `;
  }

  applyJobPreset(index) {
    const p = JOB_PRESETS[index];
    if (!p) return;
    this.resumeData.targetJob.company = p.company;
    this.resumeData.targetJob.role = p.role;
    this.resumeData.targetJob.jobDescription = p.description;
    this.renderCurrentStepForm();
    this.renderLiveResume();
    this.showToast(`Applied preset for ${p.company}!`);
  }

  // --- FORM INPUT TWO-WAY BINDINGS ---
  bindFormInputEvents() {
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('input', e => {
        const field = e.target.getAttribute('data-field');
        const arrayName = e.target.getAttribute('data-array');
        const index = e.target.getAttribute('data-index');

        if (arrayName && index !== null) {
          const idx = parseInt(index, 10);
          if (field === 'bulletPointsRaw') {
            this.resumeData[arrayName][idx].bulletPoints = e.target.value.split('\n').filter(Boolean);
          } else {
            this.resumeData[arrayName][idx][field] = e.target.value;
          }
        } else if (field) {
          const parts = field.split('.');
          if (parts.length === 2) {
            this.resumeData[parts[0]][parts[1]] = e.target.value;
          }
        }

        // Live preview updates in real-time
        this.renderLiveResume();
      });
    });
  }

  // --- LIVE RESUME RENDERING ---
  renderLiveResume() {
    const renderedHTML = TemplateRenderer.render(this.resumeData, this.resumeOptions);

    // Form Mode Preview (Right column of Form Layout)
    const previewContainer = document.getElementById('resume-live-preview');
    if (previewContainer) {
      previewContainer.innerHTML = renderedHTML;
    }

    // Workspace Mode Preview (LEFT column of Workspace Layout)
    const workspacePreview = document.getElementById('workspace-resume-preview');
    if (workspacePreview) {
      workspacePreview.innerHTML = renderedHTML;
    }

    // Synchronize select dropdowns across form mode & workspace mode
    const selForm = document.getElementById('select-template');
    if (selForm && selForm.value !== this.resumeOptions.templateId) {
      selForm.value = this.resumeOptions.templateId;
    }
    const selWs = document.getElementById('select-template-workspace');
    if (selWs && selWs.value !== this.resumeOptions.templateId) {
      selWs.value = this.resumeOptions.templateId;
    }

    const fontForm = document.getElementById('select-font');
    if (fontForm && fontForm.value !== this.resumeOptions.fontFamily) {
      fontForm.value = this.resumeOptions.fontFamily;
    }
    const fontWs = document.getElementById('select-font-workspace');
    if (fontWs && fontWs.value !== this.resumeOptions.fontFamily) {
      fontWs.value = this.resumeOptions.fontFamily;
    }

    // Update title in builder top bar
    const titleEl = document.getElementById('builder-resume-title');
    if (titleEl) {
      const company = this.resumeData.targetJob?.company || 'Company';
      const role = this.resumeData.targetJob?.role || 'Software Engineer';
      titleEl.innerText = `${company} — ${role} Resume`;
    }
  }

  // --- AI ANALYSIS & TAILORING FLOW ---
  async runAITailoringFlow() {
    const modal = document.getElementById('modal-ai-loading');
    if (modal) modal.classList.remove('hidden');

    // Simulate multi-stage visual scanning
    const step1 = document.getElementById('l-step-1');
    const step2 = document.getElementById('l-step-2');
    const step3 = document.getElementById('l-step-3');
    const step4 = document.getElementById('l-step-4');

    setTimeout(() => {
      if (step2) {
        step2.classList.remove('text-slate-400');
        step2.classList.add('text-indigo-600', 'dark:text-indigo-400');
      }
    }, 700);

    setTimeout(() => {
      if (step3) {
        step3.classList.remove('text-slate-400');
        step3.classList.add('text-indigo-600', 'dark:text-indigo-400');
      }
    }, 1400);

    setTimeout(() => {
      if (step4) {
        step4.classList.remove('text-slate-400');
        step4.classList.add('text-indigo-600', 'dark:text-indigo-400');
      }
    }, 2100);

    try {
      // 1. Run profile analysis & upskilling roadmap generation
      const analysis = await aiEngine.analyzeProfile(this.resumeData);
      this.latestAnalysis = analysis;

      // 2. Run tailored rephrasing (Anti-fabrication guaranteed)
      const tailored = await aiEngine.tailorResume(this.resumeData);
      this.resumeData.personalInfo.summary = tailored.summary;
      this.resumeData.projects = tailored.projects;
      if (tailored.experience && tailored.experience.length) {
        this.resumeData.experience = tailored.experience;
      }

      setTimeout(() => {
        if (modal) modal.classList.add('hidden');
        this.renderLiveResume();
        this.renderCurrentStepForm();

        // Switch to Workspace Layout: Resume on Left, AI Upskilling on Right!
        this.setBuilderMode('workspace');
        this.setWorkspaceAITab('upskill');
        this.showToast('Resume built! Explore your personalized upskilling roadmap on the right.');

        // Trigger celebratory confetti!
        if (window.confetti) {
          window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        }
      }, 2600);

    } catch (err) {
      console.error('AI Tailoring Error:', err);
      if (modal) modal.classList.add('hidden');
      this.setBuilderMode('workspace');
      this.showToast('Tailoring complete with local optimizations.');
    }
  }

  // AI Polish Single Summary
  aiPolishSummary() {
    const summary = aiEngine.generateTailoredSummary(
      this.resumeData.personalInfo,
      this.resumeData.education,
      this.resumeData.skills,
      this.resumeData.projects,
      this.resumeData.targetJob?.company || 'Target Company',
      this.resumeData.targetJob?.role || 'Software Engineer'
    );
    this.resumeData.personalInfo.summary = summary;
    this.renderCurrentStepForm();
    this.renderLiveResume();
    this.showToast('Professional summary polished!');
  }

  // --- CANDIDATE STATUS & EXPERIENCE METHODS ---
  setProfileStatus(status) {
    this.resumeData.profileStatus = status;
    this.renderCurrentStepForm();
    this.renderLiveResume();
    const label = status === 'student' ? 'College Student' : status === 'fresher' ? 'Recent Graduate' : 'Working Professional';
    this.showToast(`Candidate status set to: ${label}`);
  }

  setYearsOfExperience(years) {
    this.resumeData.yearsOfExperience = years;
    this.renderCurrentStepForm();
    this.renderLiveResume();
    const label = years === '0' ? '0 Years (No Experience)' : `${years} Years`;
    this.showToast(`Experience level set to: ${label}`);
  }

  // --- BUILDER MODE SWITCHER (Form vs Left-Resume / Right-AI Workspace) ---
  setBuilderMode(mode) {
    this.builderMode = mode;
    const formLayout = document.getElementById('builder-form-layout');
    const workspaceLayout = document.getElementById('builder-workspace-layout');
    const btnModeForm = document.getElementById('btn-mode-form');
    const btnModeWorkspace = document.getElementById('btn-mode-workspace');

    if (mode === 'workspace') {
      if (formLayout) formLayout.classList.add('hidden');
      if (workspaceLayout) workspaceLayout.classList.remove('hidden');

      if (btnModeForm) {
        btnModeForm.className = 'px-3 py-1 rounded-lg transition flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white';
      }
      if (btnModeWorkspace) {
        btnModeWorkspace.className = 'px-3 py-1 rounded-lg transition flex items-center gap-1.5 bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm';
      }

      // Sync select template and font values
      const tplWs = document.getElementById('select-template-workspace');
      if (tplWs) tplWs.value = this.resumeOptions.templateId;

      const fontWs = document.getElementById('select-font-workspace');
      if (fontWs) fontWs.value = this.resumeOptions.fontFamily;

      this.renderLiveResume();
      this.renderWorkspaceAI();
    } else {
      if (formLayout) formLayout.classList.remove('hidden');
      if (workspaceLayout) workspaceLayout.classList.add('hidden');

      if (btnModeForm) {
        btnModeForm.className = 'px-3 py-1 rounded-lg transition flex items-center gap-1.5 bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm';
      }
      if (btnModeWorkspace) {
        btnModeWorkspace.className = 'px-3 py-1 rounded-lg transition flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white';
      }

      // Sync select template and font values
      const tplForm = document.getElementById('select-template');
      if (tplForm) tplForm.value = this.resumeOptions.templateId;

      const fontForm = document.getElementById('select-font');
      if (fontForm) fontForm.value = this.resumeOptions.fontFamily;

      this.renderLiveResume();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // --- WORKSPACE RIGHT-HAND AI TABS ---
  setWorkspaceAITab(tabName) {
    this.workspaceAITab = tabName;
    ['upskill', 'score', 'improvements', 'chat'].forEach(t => {
      const btn = document.getElementById(`tab-btn-${t}`);
      if (!btn) return;
      if (t === tabName) {
        btn.className = 'workspace-ai-tab pb-2.5 px-3 border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 transition shrink-0';
      } else {
        btn.className = 'workspace-ai-tab pb-2.5 px-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 transition shrink-0';
      }
    });

    this.renderWorkspaceAIContent(tabName);
    if (window.lucide) window.lucide.createIcons();
  }

  renderWorkspaceAI() {
    const roleEl = document.getElementById('workspace-ai-target-role');
    const compEl = document.getElementById('workspace-ai-target-company');
    const badgeEl = document.getElementById('workspace-candidate-type-badge');

    const role = this.resumeData.targetJob?.role || 'Associate Software Engineer';
    const comp = this.resumeData.targetJob?.company || 'Target Company';
    const status = this.resumeData.profileStatus || 'student';
    const exp = this.resumeData.yearsOfExperience || '0';

    if (roleEl) roleEl.innerText = role;
    if (compEl) compEl.innerText = comp;
    if (badgeEl) {
      const statusText = status === 'student' ? 'College Student' : status === 'fresher' ? 'Recent Graduate' : 'Working Professional';
      const expText = exp === '0' ? '0 Years Exp (Fresher)' : `${exp} Years Exp`;
      badgeEl.innerText = `${statusText} • ${expText}`;
    }

    // Ensure analysis exists
    if (!this.latestAnalysis) {
      aiEngine.analyzeProfile(this.resumeData).then(analysis => {
        this.latestAnalysis = analysis;
        this.updateWorkspaceScoreBadge(analysis.overallScore);
        this.renderWorkspaceAIContent(this.workspaceAITab);
      });
    } else {
      this.updateWorkspaceScoreBadge(this.latestAnalysis.overallScore);
      this.renderWorkspaceAIContent(this.workspaceAITab);
    }
  }

  updateWorkspaceScoreBadge(score) {
    const scoreNum = document.getElementById('workspace-score-number');
    const scoreRing = document.getElementById('workspace-score-ring');
    const scoreLabel = document.getElementById('workspace-score-label');
    const topScore = document.getElementById('builder-top-score');

    if (scoreNum) scoreNum.innerText = score;
    if (topScore) topScore.innerText = `${score}/100`;
    if (scoreRing) scoreRing.setAttribute('stroke-dasharray', `${score}, 100`);
    if (scoreLabel) {
      scoreLabel.innerText = score >= 85 ? 'Strong Fit' : score >= 70 ? 'Good Fit' : 'Moderate';
    }
  }

  renderWorkspaceAIContent(tabName) {
    const container = document.getElementById('workspace-ai-tab-body');
    if (!container) return;

    switch (tabName) {
      case 'upskill':
        container.innerHTML = this.renderUpskillingTab();
        break;
      case 'score':
        container.innerHTML = this.renderScoreTab();
        break;
      case 'improvements':
        container.innerHTML = this.renderImprovementsTab();
        break;
      case 'chat':
        container.innerHTML = this.renderChatTab();
        break;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // --- TAB 1: WHAT MORE CAN I UPSKILL MYSELF? ---
  renderUpskillingTab() {
    const roadmap = this.latestAnalysis?.upskillingRoadmap || aiEngine.generateUpskillingRoadmap(
      this.resumeData,
      this.latestAnalysis?.skillsAnalysis?.missingImportantSkills || ['Docker', 'Unit Testing', 'CI/CD Pipelines', 'Redis Caching'],
      this.resumeData.targetJob?.company || 'Target Company',
      this.resumeData.targetJob?.role || 'Software Engineer'
    );

    const comp = this.resumeData.targetJob?.company || 'Target Company';
    const role = this.resumeData.targetJob?.role || 'Software Engineer';
    const isZeroExp = this.resumeData.yearsOfExperience === '0' || this.resumeData.profileStatus === 'student';

    return `
      <!-- Hero Banner for Upskilling -->
      <div class="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10">
          <div class="flex items-center gap-2 text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
            <i data-lucide="compass" class="w-3.5 h-3.5"></i>
            <span>Personalized Candidate Upskilling Roadmap</span>
          </div>
          <h4 class="text-base sm:text-lg font-black mt-1">What More Can I Upskill Myself?</h4>
          <p class="text-xs text-indigo-100 mt-1 leading-relaxed max-w-xl">
            Here is your tailored 30-day learning plan and high-impact capstone projects designed specifically to clear technical screenings at <strong>${comp}</strong> for <strong>${role}</strong> roles.
          </p>
          <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">🎯 Target: ${role}</span>
            <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">🏢 Company: ${comp}</span>
            <span class="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">⏱️ Est. Timeline: 4 Weeks</span>
          </div>
        </div>
      </div>

      <!-- 1. Prioritized Skill Gaps -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <div>
            <h5 class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <i data-lucide="alert-circle" class="w-4 h-4 text-amber-500"></i>
              <span>1. Prioritized Technical Skill Gaps</span>
            </h5>
            <p class="text-[11px] text-slate-500 mt-0.5">High-frequency skills tested in technical rounds that are currently missing from your resume.</p>
          </div>
          <span class="text-[10px] font-bold text-slate-400">${(roadmap.prioritizedGaps || []).length} Gaps Detected</span>
        </div>

        <div class="space-y-2.5">
          ${(roadmap.prioritizedGaps || []).map((gap, i) => `
            <div class="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-xs text-slate-900 dark:text-white">${gap.name}</span>
                  <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    gap.priority === 'High Priority'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      : gap.priority === 'Medium Priority'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                  }">${gap.priority}</span>
                  <span class="text-[10px] text-slate-400">⏱️ ${gap.estimatedTime}</span>
                </div>
                <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">${gap.reason}</p>
              </div>
              <button class="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 text-[11px] font-semibold transition shrink-0 self-start sm:self-center" onclick="app.quickAddSkill('${gap.name}')">
                + Add to Resume
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 2. 30-Day Step-by-Step Learning Sprint -->
      <div>
        <div class="mb-3">
          <h5 class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <i data-lucide="calendar" class="w-4 h-4 text-indigo-500"></i>
            <span>2. 30-Day Week-by-Week Learning Sprint</span>
          </h5>
          <p class="text-[11px] text-slate-500 mt-0.5">Structured weekly milestones to take you from applicant to hired offer.</p>
        </div>

        <div class="space-y-3">
          ${(roadmap.learningPlan || []).map(w => `
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
                <span class="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md">
                  ${w.week}
                </span>
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${w.title}</span>
              </div>
              <ul class="mt-2.5 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                ${w.goals.map(g => `
                  <li class="flex items-start gap-2">
                    <input type="checkbox" class="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600">
                    <span class="leading-relaxed">${g}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 3. Curated Recommended Capstone Projects -->
      <div>
        <div class="mb-3">
          <h5 class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <i data-lucide="folder-git-2" class="w-4 h-4 text-purple-500"></i>
            <span>3. Recommended Capstone Projects to Build</span>
          </h5>
          <p class="text-[11px] text-slate-500 mt-0.5">Projects designed to showcase system design, scaling, and architectural depth for ${comp}.</p>
        </div>

        <div class="grid grid-cols-1 gap-3">
          ${(roadmap.recommendedProjects || []).map(proj => `
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <div class="flex items-start justify-between gap-2">
                <h6 class="font-bold text-xs text-slate-900 dark:text-white">${proj.title}</h6>
                <button class="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold hover:bg-indigo-100 transition shrink-0" onclick="app.addRecommendedProject('${proj.title.replace(/'/g, "\\'")}', '${proj.tech.replace(/'/g, "\\'")}', '${proj.description.replace(/'/g, "\\'")}')">
                  + Add to Projects
                </button>
              </div>
              <div class="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 p-1.5 rounded-lg">
                💻 Stack: ${proj.tech}
              </div>
              <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">${proj.description}</p>
              <div class="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg flex items-center gap-1.5">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 shrink-0"></i>
                <span><strong>Recruiter Impact:</strong> ${proj.impact}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 4. Free Learning Resources & Certifications -->
      <div>
        <div class="mb-3">
          <h5 class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <i data-lucide="book-open" class="w-4 h-4 text-emerald-500"></i>
            <span>4. Curated Free Resources & Certifications</span>
          </h5>
          <p class="text-[11px] text-slate-500 mt-0.5">High-quality, free platforms to master these skills without expensive bootcamps.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${(roadmap.freeResources || []).map(res => `
            <a href="${res.link}" target="_blank" rel="noopener noreferrer" class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition flex items-center justify-between group shadow-sm">
              <div>
                <div class="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 transition">${res.name}</div>
                <div class="text-[10px] text-slate-500">${res.type}</div>
              </div>
              <div class="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                <span>Free</span>
                <i data-lucide="external-link" class="w-3 h-3"></i>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- TAB 2: ATS SCORE & ROLE FIT ---
  renderScoreTab() {
    const a = this.latestAnalysis;
    if (!a) {
      return `<div class="p-8 text-center text-xs text-slate-500">Computing ATS analysis...</div>`;
    }

    const metricLabels = [
      { label: 'ATS Compatibility', val: a.metrics.atsCompatibility },
      { label: 'Skills Relevance', val: a.metrics.skillsRelevance },
      { label: 'Project Relevance', val: a.metrics.projectRelevance },
      { label: 'Keyword Optimization', val: a.metrics.keywordOptimization },
      { label: 'Content Quality', val: a.metrics.contentQuality },
      { label: 'Formatting Standard', val: a.metrics.formatting }
    ];

    return `
      <!-- Overall Score Card -->
      <div class="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center gap-5">
        <div class="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path class="text-slate-200 dark:text-slate-700" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="text-indigo-600 dark:text-indigo-400" stroke-dasharray="${a.overallScore}, 100" stroke-width="3.5" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-2xl font-black text-slate-900 dark:text-white">${a.overallScore}</span>
            <span class="text-[9px] uppercase font-bold text-slate-500">out of 100</span>
          </div>
        </div>
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Target Role Match</span>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white mt-0.5">${a.targetCompany} — ${a.targetRole}</h4>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Your projects, coursework, and technical skills match <strong>${a.overallScore}%</strong> of the screening criteria for this role.
          </p>
        </div>
      </div>

      <!-- 6 Metrics Breakdown -->
      <div>
        <h5 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">6-Point Screening Breakdown</h5>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          ${metricLabels.map(m => `
            <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <div class="flex justify-between font-semibold mb-1.5">
                <span class="text-slate-700 dark:text-slate-300">${m.label}</span>
                <span class="${m.val >= 85 ? 'text-emerald-600 font-bold' : 'text-indigo-600 font-bold'}">${m.val}/100</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div class="h-full rounded-full ${m.val >= 85 ? 'bg-emerald-500' : 'bg-indigo-600'}" style="width: ${m.val}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Matched Skills vs Missing Keywords -->
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>Matched Technical Skills</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${(a.skillsAnalysis.matchedSkills || []).map(s => `
              <span class="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                ✓ ${s}
              </span>
            `).join('') || '<span class="text-xs text-slate-400">Add technical skills in Step 3 to match.</span>'}
          </div>
        </div>

        <div class="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
          <div class="text-xs font-bold uppercase text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-1">
            <i data-lucide="alert-triangle" class="w-4 h-4"></i>
            <span>Missing Job Description Keywords</span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
            Consider integrating these into your project descriptions or learning queue for interview rounds.
          </p>
          <div class="flex flex-wrap gap-1.5">
            ${(a.keywordAnalysis?.missingKeywords || a.skillsAnalysis?.missingImportantSkills || []).map(g => `
              <span class="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-[11px] font-semibold flex items-center gap-1">
                💡 ${g}
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Actionable Suggestions -->
      <div>
        <h5 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Actionable Suggestions</h5>
        <div class="space-y-2">
          ${(a.suggestions || []).map(s => `
            <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-sm">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                s.impact === 'High Impact' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
              }">${s.impact}</span>
              <p class="text-slate-700 dark:text-slate-300 mt-1 font-medium leading-relaxed">${s.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- TAB 3: AI IMPROVEMENTS ---
  renderImprovementsTab() {
    const comp = this.resumeData.targetJob?.company || 'Target Company';
    const role = this.resumeData.targetJob?.role || 'Software Engineer';
    const suggestedSummary = aiEngine.generateTailoredSummary(
      this.resumeData.personalInfo,
      this.resumeData.education,
      this.resumeData.skills,
      this.resumeData.projects,
      comp,
      role
    );

    return `
      <!-- Summary Polish -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <i data-lucide="sparkles" class="w-4 h-4 text-indigo-600"></i>
            <span>AI Tailored Summary for ${comp}</span>
          </span>
          <button class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition" onclick="app.applyTailoredSummary()">
            Apply to Resume
          </button>
        </div>
        <div class="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
          ${suggestedSummary}
        </div>
      </div>

      <!-- Project Enhancements -->
      <div>
        <h5 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Project Action Verb & Metric Enhancer</h5>
        <div class="space-y-3">
          ${(this.resumeData.projects || []).map((proj, idx) => `
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-900 dark:text-white">${proj.name}</span>
                <button class="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[11px] font-semibold hover:bg-indigo-100 transition" onclick="app.aiPolishProject(${idx})">
                  ⚡ Enhance Bullets
                </button>
              </div>
              <ul class="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                ${(proj.bulletPoints || []).map(b => `
                  <li class="flex items-start gap-1.5">
                    <span class="text-indigo-600 font-bold">•</span>
                    <span class="leading-relaxed">${b}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- TAB 4: EMBEDDED AI ASSISTANT CHAT ---
  renderChatTab() {
    return `
      <div class="flex flex-col h-[520px] bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <!-- Quick Question Chips -->
        <div class="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] font-medium shrink-0">
          <button class="chat-quick-chip-ws px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:border-indigo-500 transition" onclick="app.sendWorkspaceQuickQuestion('What technical topics should I review for the Google interview?')">
            Interview Prep Tips
          </button>
          <button class="chat-quick-chip-ws px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:border-indigo-500 transition" onclick="app.sendWorkspaceQuickQuestion('How do I explain my projects using the STAR method?')">
            STAR Method for Projects
          </button>
          <button class="chat-quick-chip-ws px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 hover:border-indigo-500 transition" onclick="app.sendWorkspaceQuickQuestion('Suggest 3 additional project ideas for a fresher')">
            New Project Ideas
          </button>
        </div>

        <!-- Messages Area -->
        <div id="chat-messages-container-ws" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          <div class="flex gap-2.5 items-start">
            <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <i data-lucide="bot" class="w-3.5 h-3.5"></i>
            </div>
            <div class="p-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed max-w-[85%] shadow-sm">
              Hi ${this.resumeData.personalInfo.fullName || 'there'}! I've analyzed your resume against ${this.resumeData.targetJob?.company || 'your target company'}. Ask me anything about preparing for interviews, upskilling, or refining your resume!
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <form id="form-chat-ws" class="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0" onsubmit="event.preventDefault(); app.sendWorkspaceChatMessage();">
          <input type="text" id="chat-input-ws" placeholder="Ask anything about your resume, skills, or interview prep..." class="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <button type="submit" class="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
          </button>
        </form>
      </div>
    `;
  }

  // --- ACTIONS IN WORKSPACE ---
  quickAddSkill(skillName) {
    if (!this.resumeData.skills.tools.includes(skillName)) {
      this.resumeData.skills.tools.push(skillName);
      this.renderLiveResume();
      this.showToast(`Added ${skillName} to your Technical Skills!`);
    } else {
      this.showToast(`${skillName} is already in your skills.`);
    }
  }

  addRecommendedProject(title, tech, desc) {
    this.resumeData.projects.push({
      name: title,
      role: 'Developer',
      technologies: tech,
      description: desc,
      github: '',
      link: '',
      bulletPoints: [
        `Engineered ${title} utilizing ${tech} to solve core architectural challenges.`,
        `Implemented unit tests and modular component structure ensuring high maintainability.`
      ]
    });
    this.renderLiveResume();
    this.renderCurrentStepForm();
    this.showToast(`Added "${title}" to your projects!`);
  }

  applyTailoredSummary() {
    const comp = this.resumeData.targetJob?.company || 'Target Company';
    const role = this.resumeData.targetJob?.role || 'Software Engineer';
    const suggestedSummary = aiEngine.generateTailoredSummary(
      this.resumeData.personalInfo,
      this.resumeData.education,
      this.resumeData.skills,
      this.resumeData.projects,
      comp,
      role
    );
    this.resumeData.personalInfo.summary = suggestedSummary;
    this.renderLiveResume();
    this.renderCurrentStepForm();
    this.showToast('Tailored summary applied directly to your resume!');
  }

  sendWorkspaceQuickQuestion(question) {
    const input = document.getElementById('chat-input-ws');
    if (input) input.value = question;
    this.sendWorkspaceChatMessage();
  }

  async sendWorkspaceChatMessage() {
    const input = document.getElementById('chat-input-ws');
    const text = input?.value?.trim();
    if (!text) return;

    const container = document.getElementById('chat-messages-container-ws');
    if (!container) return;

    // Append user message
    container.innerHTML += `
      <div class="flex gap-2.5 items-start justify-end">
        <div class="p-3 rounded-2xl rounded-tr-sm bg-indigo-600 text-white leading-relaxed max-w-[85%] text-xs shadow-sm">
          ${text}
        </div>
      </div>
    `;
    input.value = '';
    container.scrollTop = container.scrollHeight;

    const typingId = 'typing-ws-' + Date.now();
    container.innerHTML += `
      <div id="${typingId}" class="flex gap-2.5 items-start">
        <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 flex items-center justify-center shrink-0">
          <i data-lucide="bot" class="w-3.5 h-3.5"></i>
        </div>
        <div class="p-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 text-slate-500 text-xs animate-pulse">
          Thinking with your candidate profile context...
        </div>
      </div>
    `;
    container.scrollTop = container.scrollHeight;
    if (window.lucide) window.lucide.createIcons();

    try {
      const reply = await aiEngine.askAssistant(text, this.resumeData, this.chatHistory);
      document.getElementById(typingId)?.remove();

      container.innerHTML += `
        <div class="flex gap-2.5 items-start">
          <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <i data-lucide="bot" class="w-3.5 h-3.5"></i>
          </div>
          <div class="p-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed max-w-[85%] text-xs space-y-2 shadow-sm">
            ${reply.replace(/\n/g, '<br>')}
          </div>
        </div>
      `;
      container.scrollTop = container.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      document.getElementById(typingId)?.remove();
      this.showToast('Assistant ready in offline mode.');
    }
  }

  // --- ATS SCORE & GAPS MODAL ---
  openScoreModal() {
    const modal = document.getElementById('modal-ai-score');
    if (!modal) return;

    if (!this.latestAnalysis) {
      // Compute on the fly if not analyzed yet
      aiEngine.analyzeProfile(this.resumeData).then(analysis => {
        this.latestAnalysis = analysis;
        this.populateScoreModalData();
        modal.classList.remove('hidden');
      });
      return;
    }

    this.populateScoreModalData();
    modal.classList.remove('hidden');
  }

  populateScoreModalData() {
    const a = this.latestAnalysis;
    if (!a) return;

    const numEl = document.getElementById('modal-score-number');
    if (numEl) numEl.innerText = a.overallScore;

    const topScoreEl = document.getElementById('builder-top-score');
    if (topScoreEl) topScoreEl.innerText = `${a.overallScore}/100`;

    const targetEl = document.getElementById('modal-target-company-role');
    if (targetEl) targetEl.innerText = `${a.targetCompany} — ${a.targetRole}`;

    // Metrics
    const metricsContainer = document.getElementById('modal-metrics-container');
    if (metricsContainer) {
      const metricLabels = [
        { label: 'ATS Compatibility', val: a.metrics.atsCompatibility },
        { label: 'Skills Relevance', val: a.metrics.skillsRelevance },
        { label: 'Project Relevance', val: a.metrics.projectRelevance },
        { label: 'Keyword Optimization', val: a.metrics.keywordOptimization },
        { label: 'Content Quality', val: a.metrics.contentQuality },
        { label: 'Formatting', val: a.metrics.formatting }
      ];

      metricsContainer.innerHTML = metricLabels.map(m => `
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
          <div class="flex justify-between font-semibold mb-1">
            <span class="text-slate-700 dark:text-slate-300">${m.label}</span>
            <span class="${m.val >= 85 ? 'text-emerald-600' : 'text-indigo-600'}">${m.val}/100</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div class="h-full rounded-full ${m.val >= 85 ? 'bg-emerald-500' : 'bg-indigo-600'}" style="width: ${m.val}%"></div>
          </div>
        </div>
      `).join('');
    }

    // Matched Skills
    const matchedContainer = document.getElementById('modal-matched-skills');
    if (matchedContainer) {
      matchedContainer.innerHTML = (a.skillsAnalysis.matchedSkills || []).map(s => `
        <span class="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
          ✓ ${s}
        </span>
      `).join('') || '<span class="text-xs text-slate-400">Add technical skills in Step 3 to match.</span>';
    }

    // Skill Gaps (Clearly labeled as potential to consider)
    const gapsContainer = document.getElementById('modal-skill-gaps');
    if (gapsContainer) {
      gapsContainer.innerHTML = (a.skillsAnalysis.missingImportantSkills || []).map(g => `
        <span class="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-[11px] font-semibold flex items-center gap-1">
          💡 ${g}
        </span>
      `).join('') || '<span class="text-xs text-emerald-600">No major skill gaps detected!</span>';
    }

    // Actionable Suggestions
    const sugContainer = document.getElementById('modal-suggestions-list');
    if (sugContainer) {
      sugContainer.innerHTML = (a.suggestions || []).map(s => `
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-start justify-between gap-3">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              s.impact === 'High Impact' ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
            }">${s.impact}</span>
            <p class="text-slate-700 dark:text-slate-300 mt-1 font-medium leading-relaxed">${s.text}</p>
          </div>
        </div>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // --- RESUME AI ASSISTANT CHAT ---
  toggleAssistant() {
    const drawer = document.getElementById('chat-assistant-drawer');
    if (!drawer) return;
    drawer.classList.toggle('hidden');
    if (!drawer.classList.contains('hidden')) {
      document.getElementById('chat-input')?.focus();
    }
  }

  async sendAssistantMessage(messageText) {
    const text = messageText || document.getElementById('chat-input')?.value;
    if (!text || !text.trim()) return;

    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    // Append User Message
    container.innerHTML += `
      <div class="flex gap-2.5 items-start justify-end">
        <div class="p-3 rounded-2xl rounded-tr-sm bg-indigo-600 text-white leading-relaxed max-w-[85%] text-xs shadow-sm">
          ${text}
        </div>
      </div>
    `;

    const input = document.getElementById('chat-input');
    if (input) input.value = '';
    container.scrollTop = container.scrollHeight;

    // Show temporary typing indicator
    const typingId = 'typing-' + Date.now();
    container.innerHTML += `
      <div id="${typingId}" class="flex gap-2.5 items-start">
        <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 flex items-center justify-center shrink-0">
          <i data-lucide="bot" class="w-3.5 h-3.5"></i>
        </div>
        <div class="p-3 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs animate-pulse">
          Thinking with your resume context...
        </div>
      </div>
    `;
    container.scrollTop = container.scrollHeight;
    if (window.lucide) window.lucide.createIcons();

    try {
      const reply = await aiEngine.askAssistant(text, this.resumeData, this.chatHistory);
      document.getElementById(typingId)?.remove();

      container.innerHTML += `
        <div class="flex gap-2.5 items-start">
          <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <i data-lucide="bot" class="w-3.5 h-3.5"></i>
          </div>
          <div class="p-3 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed max-w-[85%] text-xs space-y-2">
            ${reply.replace(/\n/g, '<br>')}
          </div>
        </div>
      `;
      container.scrollTop = container.scrollHeight;
      if (window.lucide) window.lucide.createIcons();

    } catch (e) {
      document.getElementById(typingId)?.remove();
      this.showToast('Assistant is available in offline mode.');
    }
  }

  // --- MODALS & EXPORTS ---
  openLegalModal() {
    document.getElementById('modal-legal')?.classList.remove('hidden');
  }

  openAuthModal() {
    document.getElementById('modal-auth')?.classList.remove('hidden');
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700/50';
    toast.innerHTML = `<i data-lucide="info" class="w-3.5 h-3.5 text-indigo-400"></i> <span>${message}</span>`;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  openBuilderWithTemplate(tplId) {
    this.resumeOptions.templateId = tplId;
    const select = document.getElementById('select-template');
    if (select) select.value = tplId;
    this.renderView('builder');
  }

  openBuilder() {
    this.renderView('builder');
  }

  showLandingSection(sectionId) {
    if (this.currentView !== 'landing') {
      this.renderView('landing');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // --- EVENT ATTACHMENTS ---
  bindEvents() {
    // Theme toggle
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => this.toggleTheme());

    // Brand logo
    document.getElementById('nav-brand-logo')?.addEventListener('click', () => this.renderView('landing'));

    // Hero buttons
    document.getElementById('hero-btn-build')?.addEventListener('click', () => this.renderView('builder'));
    document.getElementById('hero-btn-how')?.addEventListener('click', () => this.showLandingSection('how-it-works'));

    // Demo Data Button
    document.getElementById('btn-load-demo-data')?.addEventListener('click', () => {
      this.resumeData = JSON.parse(JSON.stringify(SAMPLE_STUDENT));
      this.renderCurrentStepForm();
      this.renderLiveResume();
      this.showToast('Loaded sample student data for Alex Chen!');
    });

    // Before/After Hero preview toggle
    const btnBefore = document.getElementById('toggle-preview-before');
    const btnAfter = document.getElementById('toggle-preview-after');
    const contentBefore = document.getElementById('preview-content-before');
    const contentAfter = document.getElementById('preview-content-after');

    btnBefore?.addEventListener('click', () => {
      contentBefore?.classList.remove('hidden');
      contentAfter?.classList.add('hidden');
      btnBefore.classList.add('bg-white', 'dark:bg-slate-700', 'text-indigo-600', 'shadow-sm');
      btnAfter.classList.remove('bg-white', 'dark:bg-slate-700', 'text-indigo-600', 'shadow-sm');
    });

    btnAfter?.addEventListener('click', () => {
      contentAfter?.classList.remove('hidden');
      contentBefore?.classList.add('hidden');
      btnAfter.classList.add('bg-white', 'dark:bg-slate-700', 'text-indigo-600', 'shadow-sm');
      btnBefore.classList.remove('bg-white', 'dark:bg-slate-700', 'text-indigo-600', 'shadow-sm');
    });

    // Stepper navigation buttons
    document.getElementById('btn-step-prev')?.addEventListener('click', () => this.prevStep());
    document.getElementById('btn-step-next')?.addEventListener('click', () => this.nextStep());
    document.getElementById('builder-btn-back')?.addEventListener('click', () => this.renderView('dashboard'));
    document.getElementById('dashboard-btn-create-new')?.addEventListener('click', () => this.renderView('builder'));

    // Top action bar in builder
    document.getElementById('btn-quick-ai-tailor')?.addEventListener('click', () => this.runAITailoringFlow());
    document.getElementById('btn-quick-ai-score')?.addEventListener('click', () => this.openScoreModal());
    document.getElementById('btn-download-pdf-top')?.addEventListener('click', () => {
      ExportUtils.printToPDF('resume-live-preview', this.resumeData.targetJob?.company || 'Resume');
    });

    // Live preview controls (Form Mode)
    document.getElementById('select-template')?.addEventListener('change', e => {
      this.resumeOptions.templateId = e.target.value;
      this.renderLiveResume();
    });

    document.getElementById('select-font')?.addEventListener('change', e => {
      this.resumeOptions.fontFamily = e.target.value;
      this.renderLiveResume();
    });

    // Color buttons (Form Mode)
    document.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', e => {
        const color = e.target.getAttribute('data-color');
        this.resumeOptions.accentColor = color;
        this.renderLiveResume();
      });
    });

    // PDF & DOCX Export buttons (Form Mode)
    document.getElementById('btn-download-pdf')?.addEventListener('click', () => {
      ExportUtils.printToPDF('resume-live-preview', this.resumeData.targetJob?.company || 'Resume');
    });

    document.getElementById('btn-download-docx')?.addEventListener('click', () => {
      ExportUtils.downloadDOCX(this.resumeData, this.resumeData.targetJob?.company || 'Resume');
      this.showToast('Downloaded Word DOCX format!');
    });

    // Workspace Live preview controls (Workspace Mode: Resume on Left)
    document.getElementById('select-template-workspace')?.addEventListener('change', e => {
      this.resumeOptions.templateId = e.target.value;
      this.renderLiveResume();
    });

    document.getElementById('select-font-workspace')?.addEventListener('change', e => {
      this.resumeOptions.fontFamily = e.target.value;
      this.renderLiveResume();
    });

    // Workspace Color buttons
    document.querySelectorAll('[data-workspace-color]').forEach(btn => {
      btn.addEventListener('click', e => {
        const color = e.target.getAttribute('data-workspace-color');
        this.resumeOptions.accentColor = color;
        this.renderLiveResume();
      });
    });

    // Workspace PDF & DOCX Export buttons
    document.getElementById('btn-download-pdf-workspace')?.addEventListener('click', () => {
      ExportUtils.printToPDF('workspace-resume-preview', this.resumeData.targetJob?.company || 'Resume');
    });

    document.getElementById('btn-download-docx-workspace')?.addEventListener('click', () => {
      ExportUtils.downloadDOCX(this.resumeData, this.resumeData.targetJob?.company || 'Resume');
      this.showToast('Downloaded Word DOCX format!');
    });

    // Modals
    document.getElementById('btn-close-score-modal')?.addEventListener('click', () => {
      document.getElementById('modal-ai-score')?.classList.add('hidden');
    });

    document.getElementById('btn-close-legal-modal')?.addEventListener('click', () => {
      document.getElementById('modal-legal')?.classList.add('hidden');
    });

    document.getElementById('btn-close-auth-modal')?.addEventListener('click', () => {
      document.getElementById('modal-auth')?.classList.add('hidden');
    });

    document.getElementById('btn-auth-demo-login')?.addEventListener('click', () => {
      document.getElementById('modal-auth')?.classList.add('hidden');
      this.showToast('Logged in as Alex Chen (Demo CS Senior)');
      this.renderView('dashboard');
    });

    // Assistant Drawer
    document.getElementById('btn-toggle-assistant')?.addEventListener('click', () => this.toggleAssistant());
    document.getElementById('btn-close-chat')?.addEventListener('click', () => this.toggleAssistant());

    document.getElementById('form-chat')?.addEventListener('submit', e => {
      e.preventDefault();
      this.sendAssistantMessage();
    });

    // Quick chip questions
    document.querySelectorAll('.chat-quick-chip').forEach(btn => {
      btn.addEventListener('click', e => {
        const text = e.target.innerText;
        this.sendAssistantMessage(text);
      });
    });
  }
}

// Instantiate and expose globally
const app = new ResumeApp();
window.app = app;

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
