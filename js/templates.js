// templates.js - 13 Professional, ATS-friendly Resume Templates
// Includes Zety-inspired designs (Cascade, Primo, Cubic, Diamond, Concept, Vibes, Crisp)
// and Student & Fresher-optimized designs (Fresher, SWE, Classic ATS, Modern, Minimal, Internship).

export const TEMPLATES = {
  // Zety Flagship Templates
  cascade: {
    id: 'cascade',
    name: 'Cascade (Zety Style)',
    badge: 'Zety #1 Most Popular',
    category: 'Zety Signature',
    description: 'The world-famous two-column design with a shaded sidebar, skills badges, and clean visual hierarchy.'
  },
  primo: {
    id: 'primo',
    name: 'Primo (Timeline)',
    badge: 'Timeline Storyteller',
    category: 'Zety Signature',
    description: 'Features an elegant vertical timeline spine with milestone nodes and an initials monogram badge.'
  },
  cubic: {
    id: 'cubic',
    name: 'Cubic (Geometric)',
    badge: 'High Contrast',
    category: 'Zety Signature',
    description: 'Modern geometric design with an accent color header block and organized two-column layout.'
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond (Corporate)',
    badge: 'Executive Polish',
    category: 'Zety Signature',
    description: 'Distinguished diamond-marker bullet points, dark accent bar, and sleek double horizontal dividers.'
  },
  concept: {
    id: 'concept',
    name: 'Concept (Milestones)',
    badge: 'Chronological Focus',
    category: 'Zety Signature',
    description: 'Showcases year and date badges alongside education and projects for fast recruiter scanning.'
  },
  vibes: {
    id: 'vibes',
    name: 'Vibes (Modern Creative)',
    badge: 'Dynamic & Fresh',
    category: 'Zety Signature',
    description: 'Creative modern layout with stylish section icon headers, gradient underline, and crisp cards.'
  },
  crisp: {
    id: 'crisp',
    name: 'Crisp (Executive Clean)',
    badge: 'Minimalist Favorite',
    category: 'Zety Signature',
    description: 'Pristine typographic balance with hairline dividers, perfect for corporate and high-tech applications.'
  },

  // Student & Industry Classics
  fresher: {
    id: 'fresher',
    name: 'College Fresher',
    badge: 'Best for Students',
    category: 'Campus Focus',
    description: 'Tailored for zero-to-little experience: highlights Education, CGPA, Projects, and Hackathons first.'
  },
  swe: {
    id: 'swe',
    name: 'Software Engineer',
    badge: 'Tech & Code Focused',
    category: 'Technical',
    description: 'Optimized for technical recruiters: skills upfront, GitHub & repo links prominent, project-heavy.'
  },
  classic: {
    id: 'classic',
    name: 'Classic ATS',
    badge: 'Max ATS Scanner Pass',
    category: 'Traditional',
    description: 'Clean, single-column layout adhering strictly to standard applicant tracking system scanner guidelines.'
  },
  modern: {
    id: 'modern',
    name: 'Modern Professional',
    badge: 'Industry Favorite',
    category: 'Contemporary',
    description: 'Contemporary two-column layout with a stylish sidebar for contact & skills with clear section dividers.'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    badge: 'Sleek & Elegant',
    category: 'Minimalist',
    description: 'Focuses on typographic balance, ample whitespace, and distraction-free visual hierarchy.'
  },
  internship: {
    id: 'internship',
    name: 'Internship Seeker',
    badge: 'Coursework & Potential',
    category: 'Campus Focus',
    description: 'Emphasizes core CS coursework, certifications, club leadership, and fast learning agility.'
  }
};

export class TemplateRenderer {
  /**
   * Main render function that dispatches to the requested template
   */
  static render(studentData, options = {}) {
    const {
      templateId = 'cascade',
      accentColor = '#4f46e5', // default indigo
      fontFamily = 'Inter',
      fontSize = 'normal', // compact, normal, spacious
      sectionVisibility = {
        summary: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: true,
        achievements: true,
        extracurricular: true
      }
    } = options;

    const spacingClasses = {
      compact: 'space-y-2 text-xs',
      normal: 'space-y-3.5 text-sm',
      spacious: 'space-y-5 text-base'
    }[fontSize] || 'space-y-3.5 text-sm';

    const fontStyle = `font-family: '${fontFamily}', sans-serif;`;
    const cssVars = `--accent: ${accentColor};`;
    const config = { spacingClasses, fontStyle, cssVars, accentColor, sectionVisibility };

    switch (templateId) {
      // Zety-Inspired Templates
      case 'cascade':
        return TemplateRenderer.renderCascade(studentData, config);
      case 'primo':
        return TemplateRenderer.renderPrimo(studentData, config);
      case 'cubic':
        return TemplateRenderer.renderCubic(studentData, config);
      case 'diamond':
        return TemplateRenderer.renderDiamond(studentData, config);
      case 'concept':
        return TemplateRenderer.renderConcept(studentData, config);
      case 'vibes':
        return TemplateRenderer.renderVibes(studentData, config);
      case 'crisp':
        return TemplateRenderer.renderCrisp(studentData, config);

      // Student & Classic Templates
      case 'classic':
        return TemplateRenderer.renderClassicATS(studentData, config);
      case 'modern':
        return TemplateRenderer.renderModernProfessional(studentData, config);
      case 'minimal':
        return TemplateRenderer.renderMinimal(studentData, config);
      case 'swe':
        return TemplateRenderer.renderSoftwareEngineer(studentData, config);
      case 'internship':
        return TemplateRenderer.renderInternship(studentData, config);
      case 'fresher':
      default:
        return TemplateRenderer.renderFresher(studentData, config);
    }
  }

  // =========================================================================
  // 1. ZETY CASCADE TEMPLATE (Zety's #1 Most Famous Design)
  // Two-column layout with a shaded left sidebar, skills meters, and clean lines
  // =========================================================================
  static renderCascade(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, certifications, achievements, extracurricular } = data;
    const initials = (personalInfo.fullName || 'Alex Chen').split(' ').map(n => n[0]).join('').substring(0, 2);

    return `
      <div class="resume-document bg-white text-slate-800" style="${fontStyle} ${cssVars}">
        <div class="grid grid-cols-12 min-h-[1050px]">
          
          <!-- LEFT SHADED SIDEBAR (38% width) -->
          <div class="col-span-12 md:col-span-5 bg-slate-100/80 p-6 md:p-8 border-r border-slate-200/90 flex flex-col justify-between space-y-6">
            <div class="space-y-6">
              
              <!-- Monogram & Contact Card -->
              <div class="space-y-4">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md" style="background-color: ${accentColor};">
                  ${initials}
                </div>
                <div>
                  <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-300 pb-1">Contact Details</h3>
                  <div class="space-y-2 text-xs text-slate-700">
                    ${personalInfo.location ? `<div class="flex items-center gap-2"><span class="font-bold text-slate-900">📍</span> <span>${personalInfo.location}</span></div>` : ''}
                    ${personalInfo.phone ? `<div class="flex items-center gap-2"><span class="font-bold text-slate-900">📞</span> <span>${personalInfo.phone}</span></div>` : ''}
                    ${personalInfo.email ? `<div class="flex items-center gap-2 truncate"><span class="font-bold text-slate-900">✉️</span> <a href="mailto:${personalInfo.email}" class="hover:underline truncate">${personalInfo.email}</a></div>` : ''}
                    ${personalInfo.linkedIn ? `<div class="flex items-center gap-2 truncate"><span class="font-bold text-slate-900">💼</span> <a href="https://${personalInfo.linkedIn.replace(/^https?:\/\//, '')}" target="_blank" class="hover:underline truncate text-indigo-700 font-medium">${personalInfo.linkedIn}</a></div>` : ''}
                    ${personalInfo.github ? `<div class="flex items-center gap-2 truncate"><span class="font-bold text-slate-900">💻</span> <a href="https://${personalInfo.github.replace(/^https?:\/\//, '')}" target="_blank" class="hover:underline truncate text-indigo-700 font-medium">${personalInfo.github}</a></div>` : ''}
                    ${personalInfo.portfolio ? `<div class="flex items-center gap-2 truncate"><span class="font-bold text-slate-900">🌐</span> <span>${personalInfo.portfolio}</span></div>` : ''}
                  </div>
                </div>
              </div>

              <!-- Skills with Cascade-style pill indicators -->
              ${sectionVisibility.skills ? `
                <div class="space-y-3">
                  <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-300 pb-1">Skills & Stack</h3>
                  
                  ${skills.programming?.length ? `
                    <div>
                      <div class="text-[11px] font-bold text-slate-800 uppercase mb-1">Languages</div>
                      <div class="flex flex-wrap gap-1">
                        ${skills.programming.map(s => `<span class="bg-white px-2 py-0.5 rounded text-[11px] font-medium text-slate-800 border border-slate-200 shadow-2xs">${s}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}

                  ${skills.web?.length ? `
                    <div>
                      <div class="text-[11px] font-bold text-slate-800 uppercase mb-1">Web & Cloud</div>
                      <div class="flex flex-wrap gap-1">
                        ${[...(skills.web || []), ...(skills.cloud || [])].map(s => `<span class="bg-white px-2 py-0.5 rounded text-[11px] font-medium text-slate-800 border border-slate-200 shadow-2xs">${s}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}

                  ${skills.databases?.length ? `
                    <div>
                      <div class="text-[11px] font-bold text-slate-800 uppercase mb-1">Databases & Tools</div>
                      <div class="flex flex-wrap gap-1">
                        ${[...(skills.databases || []), ...(skills.tools || [])].map(s => `<span class="bg-white px-2 py-0.5 rounded text-[11px] font-medium text-slate-800 border border-slate-200 shadow-2xs">${s}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}

                  ${skills.soft?.length ? `
                    <div>
                      <div class="text-[11px] font-bold text-slate-800 uppercase mb-1">Competencies</div>
                      <div class="flex flex-wrap gap-1">
                        ${skills.soft.map(s => `<span class="bg-white px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 border border-slate-200">${s}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <!-- Certifications Sidebar -->
              ${sectionVisibility.certifications && certifications?.length ? `
                <div class="space-y-2">
                  <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-300 pb-1">Certifications</h3>
                  <div class="space-y-2 text-xs">
                    ${certifications.map(c => `
                      <div>
                        <div class="font-bold text-slate-900">${c.name}</div>
                        <div class="text-[11px] text-slate-600">${c.issuer} ${c.date ? `(${c.date})` : ''}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Extracurricular in Sidebar -->
              ${sectionVisibility.extracurricular && extracurricular?.length ? `
                <div class="space-y-2">
                  <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-300 pb-1">Activities</h3>
                  <div class="space-y-1.5 text-xs text-slate-700">
                    ${extracurricular.map(ex => `
                      <div><span class="font-bold text-slate-900">${ex.organization}:</span> <span class="text-slate-600 text-[11px]">${ex.role} — ${ex.details}</span></div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <div class="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
              Applicant Tracking System Ready
            </div>
          </div>

          <!-- RIGHT MAIN CONTENT (62% width) -->
          <div class="col-span-12 md:col-span-7 p-6 md:p-8 space-y-5">
            
            <!-- Cascade Header -->
            <header class="border-b-2 pb-4" style="border-color: ${accentColor};">
              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">${personalInfo.fullName || 'Student Name'}</h1>
              <p class="text-xs font-bold tracking-widest uppercase mt-1" style="color: ${accentColor};">
                ${data.targetJob?.role || 'Software Engineering Fresher'} • ${data.targetJob?.company || 'Candidate'}
              </p>
            </header>

            <!-- Professional Summary -->
            ${sectionVisibility.summary && personalInfo.summary ? `
              <section>
                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-1.5" style="color: ${accentColor};">
                  <span class="w-1.5 h-3 rounded-full" style="background-color: ${accentColor};"></span> Professional Summary
                </h2>
                <p class="text-xs leading-relaxed text-slate-700">${personalInfo.summary}</p>
              </section>
            ` : ''}

            <!-- Education -->
            ${sectionVisibility.education && education?.length ? `
              <section>
                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-2" style="color: ${accentColor};">
                  <span class="w-1.5 h-3 rounded-full" style="background-color: ${accentColor};"></span> Education
                </h2>
                <div class="space-y-3">
                  ${education.map(edu => `
                    <div class="relative pl-3 border-l-2 border-slate-200">
                      <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                        <span>${edu.college}</span>
                        <span class="text-xs font-semibold text-slate-500">${edu.graduationYear ? `Class of ${edu.graduationYear}` : ''}</span>
                      </div>
                      <div class="flex justify-between text-xs text-slate-700 mt-0.5">
                        <span class="font-medium">${edu.degree} in ${edu.branch}</span>
                        ${edu.cgpa ? `<span class="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">GPA: ${edu.cgpa}</span>` : ''}
                      </div>
                      ${edu.coursework ? `<div class="text-[11px] text-slate-600 mt-1"><span class="font-semibold text-slate-700">Coursework:</span> ${edu.coursework}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            <!-- Projects (Prime Focus) -->
            ${sectionVisibility.projects && projects?.length ? `
              <section>
                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-2.5" style="color: ${accentColor};">
                  <span class="w-1.5 h-3 rounded-full" style="background-color: ${accentColor};"></span> Technical Projects
                </h2>
                <div class="space-y-4">
                  ${projects.map(proj => `
                    <div class="relative pl-3 border-l-2" style="border-color: ${accentColor};">
                      <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                        <span>${proj.name} ${proj.role ? `<span class="font-normal text-slate-500 text-xs">(${proj.role})</span>` : ''}</span>
                        <div class="text-[11px] font-mono space-x-2">
                          ${proj.github ? `<a href="${proj.github}" target="_blank" class="hover:underline font-medium" style="color: ${accentColor};">GitHub ↗</a>` : ''}
                          ${proj.link ? `<a href="${proj.link}" target="_blank" class="hover:underline text-slate-600">Demo ↗</a>` : ''}
                        </div>
                      </div>
                      <div class="text-[11px] text-slate-600 font-medium mt-0.5 mb-1 bg-slate-50 inline-block px-1.5 py-0.5 rounded border border-slate-100">
                        ${proj.technologies}
                      </div>
                      <ul class="list-disc list-outside ml-3 text-xs text-slate-700 space-y-0.5">
                        ${(proj.bulletPoints || [proj.description]).map(b => `<li>${b}</li>`).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            <!-- Experience (if any) -->
            ${sectionVisibility.experience && experience?.length ? `
              <section>
                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-2" style="color: ${accentColor};">
                  <span class="w-1.5 h-3 rounded-full" style="background-color: ${accentColor};"></span> Work & Internships
                </h2>
                <div class="space-y-3">
                  ${experience.map(exp => `
                    <div class="relative pl-3 border-l-2 border-slate-200 text-xs">
                      <div class="flex justify-between items-baseline font-bold text-slate-900">
                        <span>${exp.position} — <span class="font-normal text-slate-700">${exp.company}</span></span>
                        <span class="text-slate-500 text-[11px]">${exp.duration}</span>
                      </div>
                      ${exp.responsibilities ? `<p class="text-slate-700 mt-1">${exp.responsibilities}</p>` : ''}
                      ${exp.achievements ? `<p class="text-slate-600 mt-0.5"><span class="font-semibold text-slate-800">Impact:</span> ${exp.achievements}</p>` : ''}
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            <!-- Achievements & Hackathons -->
            ${sectionVisibility.achievements && achievements?.length ? `
              <section>
                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-1.5" style="color: ${accentColor};">
                  <span class="w-1.5 h-3 rounded-full" style="background-color: ${accentColor};"></span> Key Achievements
                </h2>
                <ul class="text-xs text-slate-700 space-y-1">
                  ${achievements.map(a => `
                    <li class="flex items-start gap-1.5">
                      <span class="font-bold" style="color: ${accentColor};">🏆</span>
                      <span><span class="font-bold text-slate-900">${a.title}:</span> ${a.description}</span>
                    </li>
                  `).join('')}
                </ul>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 2. ZETY PRIMO TEMPLATE (Signature Vertical Timeline with Monogram)
  // Continuous vertical spine connecting milestones, clean circles, monogram avatar
  // =========================================================================
  static renderPrimo(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;
    const initials = (personalInfo.fullName || 'Alex Chen').split(' ').map(n => n[0]).join('').substring(0, 2);

    return `
      <div class="resume-document bg-white text-slate-800 p-8 md:p-10" style="${fontStyle} ${cssVars}">
        
        <!-- Primo Header with Circular Monogram -->
        <header class="flex items-center gap-6 pb-6 border-b border-slate-200">
          <div class="w-20 h-20 rounded-full border-4 flex items-center justify-center font-black text-2xl text-white shadow-lg shrink-0" style="background-color: ${accentColor}; border-color: rgba(255,255,255,0.8);">
            ${initials}
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">${personalInfo.fullName || 'Student Name'}</h1>
            <p class="text-xs font-bold uppercase tracking-widest mt-1 font-mono" style="color: ${accentColor};">
              ${data.targetJob?.role || 'Software Engineering Fresher'}
            </p>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
              ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
              ${personalInfo.phone ? `<span>📞 ${personalInfo.phone}</span>` : ''}
              ${personalInfo.email ? `<span>✉️ ${personalInfo.email}</span>` : ''}
              ${personalInfo.github ? `<span>💻 ${personalInfo.github}</span>` : ''}
              ${personalInfo.linkedIn ? `<span>💼 ${personalInfo.linkedIn}</span>` : ''}
            </div>
          </div>
        </header>

        <!-- Primo Timeline Spine Container -->
        <div class="mt-6 space-y-6">
          
          <!-- Summary -->
          ${sectionVisibility.summary && personalInfo.summary ? `
            <section class="relative pl-7 border-l-2" style="border-color: ${accentColor};">
              <span class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-white border-2" style="border-color: ${accentColor};"></span>
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1" style="color: ${accentColor};">Objective & Profile</h2>
              <p class="text-xs leading-relaxed text-slate-700">${personalInfo.summary}</p>
            </section>
          ` : ''}

          <!-- Education Timeline -->
          ${sectionVisibility.education && education?.length ? `
            <section class="relative pl-7 border-l-2" style="border-color: ${accentColor};">
              <span class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-white border-2" style="border-color: ${accentColor};"></span>
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5" style="color: ${accentColor};">Education</h2>
              <div class="space-y-3">
                ${education.map(e => `
                  <div>
                    <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                      <span>${e.college} — ${e.degree} in ${e.branch}</span>
                      <span class="text-xs font-semibold text-slate-500 font-mono">${e.graduationYear ? `Grad ${e.graduationYear}` : ''}</span>
                    </div>
                    <div class="text-xs text-slate-600 mt-0.5">
                      <span class="font-bold text-slate-800">CGPA: ${e.cgpa || 'N/A'}</span> ${e.coursework ? `• Coursework: ${e.coursework}` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Skills Section in Primo Grid -->
          ${sectionVisibility.skills ? `
            <section class="relative pl-7 border-l-2" style="border-color: ${accentColor};">
              <span class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-white border-2" style="border-color: ${accentColor};"></span>
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2" style="color: ${accentColor};">Core Competencies</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div><span class="font-bold text-slate-900">Languages:</span> ${(skills.programming || []).join(', ')}</div>
                <div><span class="font-bold text-slate-900">Web & Cloud:</span> ${[...(skills.web || []), ...(skills.cloud || [])].join(', ')}</div>
                <div><span class="font-bold text-slate-900">Databases & Tools:</span> ${[...(skills.databases || []), ...(skills.tools || [])].join(', ')}</div>
                <div><span class="font-bold text-slate-900">Soft Skills:</span> ${(skills.soft || []).join(', ')}</div>
              </div>
            </section>
          ` : ''}

          <!-- Projects Timeline -->
          ${sectionVisibility.projects && projects?.length ? `
            <section class="relative pl-7 border-l-2" style="border-color: ${accentColor};">
              <span class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-white border-2" style="border-color: ${accentColor};"></span>
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5" style="color: ${accentColor};">Featured Engineering Projects</h2>
              <div class="space-y-4">
                ${projects.map(p => `
                  <div>
                    <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                      <span>${p.name}</span>
                      <div class="text-[11px] font-mono space-x-2">
                        ${p.github ? `<a href="${p.github}" target="_blank" class="hover:underline font-medium" style="color: ${accentColor};">[GitHub]</a>` : ''}
                        ${p.link ? `<a href="${p.link}" target="_blank" class="hover:underline text-slate-500">[Demo]</a>` : ''}
                      </div>
                    </div>
                    <div class="text-[11px] text-slate-500 font-mono mt-0.5">Stack: ${p.technologies}</div>
                    <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                      ${(p.bulletPoints || [p.description]).map(b => `<li>${b}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Experience Timeline -->
          ${sectionVisibility.experience && experience?.length ? `
            <section class="relative pl-7 border-l-2" style="border-color: ${accentColor};">
              <span class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-white border-2" style="border-color: ${accentColor};"></span>
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2" style="color: ${accentColor};">Work Experience</h2>
              <div class="space-y-3">
                ${experience.map(exp => `
                  <div class="text-xs">
                    <div class="flex justify-between font-bold text-slate-900">
                      <span>${exp.position} — ${exp.company}</span>
                      <span class="text-slate-500 font-mono text-[11px]">${exp.duration}</span>
                    </div>
                    ${exp.responsibilities ? `<p class="text-slate-700 mt-1">${exp.responsibilities}</p>` : ''}
                    ${exp.achievements ? `<p class="text-slate-600 mt-0.5"><span class="font-bold text-slate-800">Impact:</span> ${exp.achievements}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Achievements Timeline -->
          ${sectionVisibility.achievements && achievements?.length ? `
            <section class="relative pl-7 border-l-2" style="border-color: ${accentColor};">
              <span class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-white border-2" style="border-color: ${accentColor};"></span>
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5" style="color: ${accentColor};">Honors & Competitions</h2>
              <ul class="text-xs text-slate-700 space-y-1">
                ${achievements.map(a => `<li>• <span class="font-bold text-slate-900">${a.title}:</span> ${a.description}</li>`).join('')}
              </ul>
            </section>
          ` : ''}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 3. ZETY CUBIC TEMPLATE (Geometric Header Block & Structured Sidebar)
  // Bold colored top band with white typography, side block for credentials
  // =========================================================================
  static renderCubic(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

    return `
      <div class="resume-document bg-white text-slate-800" style="${fontStyle} ${cssVars}">
        
        <!-- Cubic Bold Header Block -->
        <header class="p-8 text-white" style="background-color: ${accentColor};">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
            <div>
              <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight">${personalInfo.fullName || 'Student Name'}</h1>
              <p class="text-xs font-bold uppercase tracking-widest text-white/90 mt-1">${data.targetJob?.role || 'Software Engineering Graduate'}</p>
            </div>
            <div class="text-xs text-white/90 text-left md:text-right space-y-0.5">
              ${personalInfo.location ? `<div>📍 ${personalInfo.location}</div>` : ''}
              ${personalInfo.email ? `<div>✉️ ${personalInfo.email}</div>` : ''}
              ${personalInfo.phone ? `<div>📞 ${personalInfo.phone}</div>` : ''}
              ${personalInfo.github ? `<div>💻 ${personalInfo.github}</div>` : ''}
            </div>
          </div>
        </header>

        <!-- Cubic 2-Column Body -->
        <div class="grid grid-cols-12 min-h-[900px]">
          
          <!-- Left Shaded Column (35%) -->
          <div class="col-span-12 md:col-span-4 bg-slate-50 p-6 space-y-5 border-r border-slate-200">
            
            <!-- Education -->
            ${sectionVisibility.education && education?.length ? `
              <div>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b-2 pb-1 mb-2" style="border-color: ${accentColor};">Education</h3>
                ${education.map(e => `
                  <div class="mb-3 text-xs">
                    <div class="font-bold text-slate-900">${e.college}</div>
                    <div class="text-slate-700">${e.degree} in ${e.branch}</div>
                    <div class="text-[11px] font-bold text-slate-600">GPA: ${e.cgpa || 'N/A'} • Class of ${e.graduationYear}</div>
                    ${e.coursework ? `<div class="text-[10px] text-slate-500 mt-1">Courses: ${e.coursework}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Skills -->
            ${sectionVisibility.skills ? `
              <div>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b-2 pb-1 mb-2" style="border-color: ${accentColor};">Technical Stack</h3>
                <div class="space-y-2 text-xs">
                  <div>
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Languages</div>
                    <div class="font-medium text-slate-800">${(skills.programming || []).join(', ')}</div>
                  </div>
                  <div>
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Frameworks & Web</div>
                    <div class="font-medium text-slate-800">${[...(skills.web || []), ...(skills.frameworks || [])].join(', ')}</div>
                  </div>
                  <div>
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Databases & Tools</div>
                    <div class="font-medium text-slate-800">${[...(skills.databases || []), ...(skills.tools || [])].join(', ')}</div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Certifications -->
            ${sectionVisibility.certifications && certifications?.length ? `
              <div>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b-2 pb-1 mb-2" style="border-color: ${accentColor};">Certifications</h3>
                <div class="space-y-1.5 text-xs text-slate-700">
                  ${certifications.map(c => `
                    <div>
                      <div class="font-bold text-slate-900">${c.name}</div>
                      <div class="text-[11px] text-slate-500">${c.issuer}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right Main Column (65%) -->
          <div class="col-span-12 md:col-span-8 p-6 md:p-8 space-y-5">
            
            <!-- Summary -->
            ${sectionVisibility.summary && personalInfo.summary ? `
              <section>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b pb-1 mb-1.5" style="border-color: ${accentColor};">Profile</h3>
                <p class="text-xs leading-relaxed text-slate-700">${personalInfo.summary}</p>
              </section>
            ` : ''}

            <!-- Projects -->
            ${sectionVisibility.projects && projects?.length ? `
              <section>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b pb-1 mb-2.5" style="border-color: ${accentColor};">Projects</h3>
                <div class="space-y-3.5">
                  ${projects.map(p => `
                    <div>
                      <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                        <span>${p.name}</span>
                        <span class="text-[11px] text-slate-500 font-mono">[${p.technologies}]</span>
                      </div>
                      <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                        ${(p.bulletPoints || [p.description]).map(b => `<li>${b}</li>`).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            <!-- Experience -->
            ${sectionVisibility.experience && experience?.length ? `
              <section>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b pb-1 mb-2" style="border-color: ${accentColor};">Experience</h3>
                <div class="space-y-3">
                  ${experience.map(exp => `
                    <div class="text-xs">
                      <div class="flex justify-between font-bold text-slate-900">
                        <span>${exp.position} — ${exp.company}</span>
                        <span class="text-slate-500 text-[11px]">${exp.duration}</span>
                      </div>
                      ${exp.responsibilities ? `<p class="text-slate-700 mt-1">${exp.responsibilities}</p>` : ''}
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            <!-- Achievements -->
            ${sectionVisibility.achievements && achievements?.length ? `
              <section>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-b pb-1 mb-1.5" style="border-color: ${accentColor};">Achievements</h3>
                <ul class="text-xs text-slate-700 space-y-1">
                  ${achievements.map(a => `<li>• <span class="font-bold text-slate-900">${a.title}:</span> ${a.description}</li>`).join('')}
                </ul>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 4. ZETY DIAMOND TEMPLATE (Corporate Polish & Diamond Bullets)
  // Diamond bullets (◆), bold header strip, double hairline dividers
  // =========================================================================
  static renderDiamond(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

    return `
      <div class="resume-document bg-white text-slate-800 p-8 md:p-12" style="${fontStyle} ${cssVars}">
        
        <!-- Diamond Header -->
        <header class="text-center pb-4 border-b-4 border-double" style="border-color: ${accentColor};">
          <h1 class="text-3xl font-extrabold tracking-widest uppercase text-slate-900">${personalInfo.fullName || 'Student Name'}</h1>
          <p class="text-xs font-bold uppercase tracking-widest mt-1" style="color: ${accentColor};">
            ${data.targetJob?.role || 'Software Engineer'} ◆ ${data.targetJob?.company || 'Candidate'}
          </p>
          <div class="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-600 mt-2">
            ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
            ${personalInfo.phone ? `<span>◆ ${personalInfo.phone}</span>` : ''}
            ${personalInfo.email ? `<span>◆ ${personalInfo.email}</span>` : ''}
            ${personalInfo.github ? `<span>◆ ${personalInfo.github}</span>` : ''}
            ${personalInfo.linkedIn ? `<span>◆ ${personalInfo.linkedIn}</span>` : ''}
          </div>
        </header>

        <!-- Summary -->
        ${sectionVisibility.summary && personalInfo.summary ? `
          <div class="mt-4 mb-4 text-xs leading-relaxed text-slate-700 italic text-center max-w-2xl mx-auto">
            "${personalInfo.summary}"
          </div>
        ` : ''}

        <!-- Education -->
        ${sectionVisibility.education && education?.length ? `
          <section class="mt-4 mb-4">
            <h2 class="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b pb-1 mb-2 flex items-center gap-1.5" style="border-color: ${accentColor}; color: ${accentColor};">
              <span>◆</span> Education & Academic Background
            </h2>
            ${education.map(e => `
              <div class="mb-2 text-xs">
                <div class="flex justify-between font-bold text-slate-900">
                  <span>${e.college} — ${e.degree} in ${e.branch}</span>
                  <span class="font-normal text-slate-500">${e.graduationYear ? `Expected ${e.graduationYear}` : ''}</span>
                </div>
                <div class="text-slate-600 mt-0.5">CGPA: ${e.cgpa || 'N/A'} ${e.coursework ? `◆ Relevant Coursework: ${e.coursework}` : ''}</div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Skills -->
        ${sectionVisibility.skills ? `
          <section class="mb-4">
            <h2 class="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b pb-1 mb-2 flex items-center gap-1.5" style="border-color: ${accentColor}; color: ${accentColor};">
              <span>◆</span> Technical Proficiencies
            </h2>
            <div class="text-xs space-y-1 text-slate-700">
              <div><span class="font-bold text-slate-900">Languages:</span> ${(skills.programming || []).join(' ◆ ')}</div>
              <div><span class="font-bold text-slate-900">Web & Cloud:</span> ${[...(skills.web || []), ...(skills.cloud || [])].join(' ◆ ')}</div>
              <div><span class="font-bold text-slate-900">Databases & Tools:</span> ${[...(skills.databases || []), ...(skills.tools || [])].join(' ◆ ')}</div>
            </div>
          </section>
        ` : ''}

        <!-- Projects with Diamond Bullets -->
        ${sectionVisibility.projects && projects?.length ? `
          <section class="mb-4">
            <h2 class="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b pb-1 mb-2.5 flex items-center gap-1.5" style="border-color: ${accentColor}; color: ${accentColor};">
              <span>◆</span> Key Projects & Development
            </h2>
            <div class="space-y-3">
              ${projects.map(p => `
                <div>
                  <div class="flex justify-between font-bold text-xs md:text-sm text-slate-900">
                    <span>${p.name} <span class="font-normal text-slate-500 italic">(${p.technologies})</span></span>
                    ${p.github ? `<a href="${p.github}" target="_blank" class="text-xs hover:underline font-mono" style="color: ${accentColor};">[Code]</a>` : ''}
                  </div>
                  <ul class="text-xs text-slate-700 space-y-0.5 mt-1 ml-2">
                    ${(p.bulletPoints || [p.description]).map(b => `
                      <li class="flex items-start gap-2">
                        <span class="text-[10px] mt-0.5" style="color: ${accentColor};">◆</span>
                        <span>${b}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Experience -->
        ${sectionVisibility.experience && experience?.length ? `
          <section class="mb-4">
            <h2 class="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b pb-1 mb-2 flex items-center gap-1.5" style="border-color: ${accentColor}; color: ${accentColor};">
              <span>◆</span> Professional Experience
            </h2>
            ${experience.map(exp => `
              <div class="text-xs mb-2">
                <div class="flex justify-between font-bold text-slate-900">
                  <span>${exp.position} — ${exp.company}</span>
                  <span class="font-normal text-slate-500">${exp.duration}</span>
                </div>
                <p class="text-slate-700 mt-0.5">${exp.responsibilities}</p>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Achievements -->
        ${sectionVisibility.achievements && achievements?.length ? `
          <section>
            <h2 class="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b pb-1 mb-1.5 flex items-center gap-1.5" style="border-color: ${accentColor}; color: ${accentColor};">
              <span>◆</span> Honors & Competitions
            </h2>
            <ul class="text-xs text-slate-700 space-y-1 ml-2">
              ${achievements.map(a => `
                <li class="flex items-start gap-2">
                  <span class="text-[10px] mt-0.5" style="color: ${accentColor};">◆</span>
                  <span><span class="font-bold text-slate-900">${a.title}:</span> ${a.description}</span>
                </li>
              `).join('')}
            </ul>
          </section>
        ` : ''}
      </div>
    `;
  }

  // =========================================================================
  // 5. ZETY CONCEPT TEMPLATE (Chronological Milestone Year Badges)
  // Year pills on the left side of every project and education entry
  // =========================================================================
  static renderConcept(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, achievements } = data;

    return `
      <div class="resume-document bg-white text-slate-800 p-8 md:p-10" style="${fontStyle} ${cssVars}">
        
        <!-- Concept Header -->
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4 border-slate-200">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">${personalInfo.fullName || 'Student Name'}</h1>
            <p class="text-xs font-bold uppercase tracking-wider mt-1 text-slate-500">${data.targetJob?.role || 'Software Engineering Fresher'}</p>
          </div>
          <div class="text-xs text-slate-600 mt-2 md:mt-0 space-y-0.5 text-left md:text-right">
            ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
            ${personalInfo.github ? `<div>${personalInfo.github}</div>` : ''}
          </div>
        </header>

        <!-- Education with Concept Year Badges -->
        ${sectionVisibility.education && education?.length ? `
          <section class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Academic Timeline</h2>
            ${education.map(e => `
              <div class="grid grid-cols-12 gap-3 mb-3 text-xs items-start">
                <div class="col-span-3 sm:col-span-2">
                  <span class="px-2 py-1 rounded text-[11px] font-bold text-white block text-center shadow-xs" style="background-color: ${accentColor};">
                    ${e.graduationYear || '2026'}
                  </span>
                </div>
                <div class="col-span-9 sm:col-span-10">
                  <div class="font-bold text-slate-900 text-sm">${e.college}</div>
                  <div class="text-slate-700">${e.degree} in ${e.branch} • <span class="font-semibold">GPA: ${e.cgpa || 'N/A'}</span></div>
                  ${e.coursework ? `<div class="text-[11px] text-slate-500 mt-0.5">Coursework: ${e.coursework}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Skills -->
        ${sectionVisibility.skills ? `
          <section class="mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h2 class="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Technical Core</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div><span class="font-bold text-slate-900">Languages:</span> ${(skills.programming || []).join(', ')}</div>
              <div><span class="font-bold text-slate-900">Frameworks:</span> ${[...(skills.web || []), ...(skills.frameworks || [])].join(', ')}</div>
              <div><span class="font-bold text-slate-900">Databases:</span> ${(skills.databases || []).join(', ')}</div>
              <div><span class="font-bold text-slate-900">Tools:</span> ${(skills.tools || []).join(', ')}</div>
            </div>
          </section>
        ` : ''}

        <!-- Projects with Concept Milestone Badges -->
        ${sectionVisibility.projects && projects?.length ? `
          <section class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Project Milestones</h2>
            <div class="space-y-4">
              ${projects.map((p, pIdx) => `
                <div class="grid grid-cols-12 gap-3 text-xs items-start">
                  <div class="col-span-3 sm:col-span-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 block text-center">
                      Project #${pIdx + 1}
                    </span>
                  </div>
                  <div class="col-span-9 sm:col-span-10">
                    <div class="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                      <span>${p.name}</span>
                      ${p.github ? `<a href="${p.github}" target="_blank" class="text-xs font-mono font-normal hover:underline" style="color: ${accentColor};">Source Code ↗</a>` : ''}
                    </div>
                    <div class="text-[11px] font-semibold text-slate-500 font-mono mt-0.5">${p.technologies}</div>
                    <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                      ${(p.bulletPoints || [p.description]).map(b => `<li>${b}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Experience -->
        ${sectionVisibility.experience && experience?.length ? `
          <section class="mb-4">
            <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Experience</h2>
            ${experience.map(exp => `
              <div class="text-xs mb-2 pl-2 border-l-2" style="border-color: ${accentColor};">
                <div class="flex justify-between font-bold text-slate-900">
                  <span>${exp.position} — ${exp.company}</span>
                  <span class="font-normal text-slate-500">${exp.duration}</span>
                </div>
                <p class="text-slate-700 mt-0.5">${exp.responsibilities}</p>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }

  // =========================================================================
  // 6. ZETY VIBES TEMPLATE (Creative, Modern & Icon-Driven)
  // Dynamic header bar, card-like micro-containers, colorful badge accents
  // =========================================================================
  static renderVibes(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, achievements } = data;

    return `
      <div class="resume-document bg-white text-slate-800 p-8 md:p-10" style="${fontStyle} ${cssVars}">
        
        <!-- Vibes Header -->
        <header class="text-center pb-5 mb-5 border-b border-slate-100">
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">${personalInfo.fullName || 'Student Name'}</h1>
          <div class="w-16 h-1 mx-auto my-2 rounded-full" style="background-color: ${accentColor};"></div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-600">${data.targetJob?.role || 'Software Engineer'} • Target: ${data.targetJob?.company || 'Leading Companies'}</p>
          <div class="flex flex-wrap justify-center gap-4 text-xs text-slate-500 mt-3">
            ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
            ${personalInfo.email ? `<span>✉️ ${personalInfo.email}</span>` : ''}
            ${personalInfo.phone ? `<span>📱 ${personalInfo.phone}</span>` : ''}
            ${personalInfo.github ? `<span>💻 <a href="${personalInfo.github}" target="_blank" class="hover:underline font-bold text-slate-800">${personalInfo.github}</a></span>` : ''}
          </div>
        </header>

        <!-- Summary -->
        ${sectionVisibility.summary && personalInfo.summary ? `
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs leading-relaxed text-slate-700 mb-4">
            ${personalInfo.summary}
          </div>
        ` : ''}

        <!-- Education -->
        ${sectionVisibility.education && education?.length ? `
          <section class="mb-4">
            <h2 class="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2" style="color: ${accentColor};">
              <span>🎓</span> Education & Academic Merit
            </h2>
            ${education.map(e => `
              <div class="p-3 rounded-xl bg-white border border-slate-200 mb-2 text-xs">
                <div class="flex justify-between font-bold text-slate-900">
                  <span>${e.college} — ${e.degree} in ${e.branch}</span>
                  <span class="text-slate-500">${e.graduationYear}</span>
                </div>
                <div class="text-slate-600 mt-0.5"><span class="font-bold text-slate-900">GPA: ${e.cgpa || 'N/A'}</span> • ${e.coursework || ''}</div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Projects -->
        ${sectionVisibility.projects && projects?.length ? `
          <section class="mb-4">
            <h2 class="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2" style="color: ${accentColor};">
              <span>💻</span> High-Impact Projects
            </h2>
            <div class="space-y-3">
              ${projects.map(p => `
                <div class="p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
                  <div class="flex justify-between items-baseline font-bold text-slate-900">
                    <span class="text-sm">${p.name}</span>
                    <span class="text-[11px] font-mono text-slate-500 font-normal">[${p.technologies}]</span>
                  </div>
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1.5">
                    ${(p.bulletPoints || [p.description]).map(b => `<li>${b}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Skills -->
        ${sectionVisibility.skills ? `
          <section class="mb-4">
            <h2 class="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2" style="color: ${accentColor};">
              <span>⚡</span> Skills & Competencies
            </h2>
            <div class="flex flex-wrap gap-1.5">
              ${[...(skills.programming || []), ...(skills.web || []), ...(skills.databases || []), ...(skills.tools || [])].map(s => `
                <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                  ${s}
                </span>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Experience -->
        ${sectionVisibility.experience && experience?.length ? `
          <section class="mb-3">
            <h2 class="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2" style="color: ${accentColor};">
              <span>💼</span> Experience
            </h2>
            ${experience.map(exp => `
              <div class="text-xs mb-2 p-3 rounded-xl bg-white border border-slate-200">
                <div class="flex justify-between font-bold text-slate-900">
                  <span>${exp.position} @ ${exp.company}</span>
                  <span class="text-slate-500">${exp.duration}</span>
                </div>
                <p class="text-slate-700 mt-0.5">${exp.responsibilities}</p>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }

  // =========================================================================
  // 7. ZETY CRISP TEMPLATE (Minimalist Executive Clean)
  // Hairline dividing lines, two-column contact header, supreme elegance
  // =========================================================================
  static renderCrisp(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, achievements } = data;

    return `
      <div class="resume-document bg-white text-slate-800 p-8 md:p-12" style="${fontStyle} ${cssVars}">
        
        <!-- Crisp Header -->
        <header class="flex justify-between items-end pb-3 mb-5 border-b-2" style="border-color: ${accentColor};">
          <div>
            <h1 class="text-3xl font-light tracking-tight text-slate-900">${personalInfo.fullName || 'Student Name'}</h1>
            <p class="text-xs uppercase tracking-widest font-bold mt-0.5" style="color: ${accentColor};">${data.targetJob?.role || 'Software Engineering Graduate'}</p>
          </div>
          <div class="text-xs text-slate-500 text-right space-y-0.5">
            ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
            ${personalInfo.github ? `<div>${personalInfo.github}</div>` : ''}
            ${personalInfo.location ? `<div>${personalInfo.location}</div>` : ''}
          </div>
        </header>

        <!-- Summary -->
        ${sectionVisibility.summary && personalInfo.summary ? `
          <div class="mb-5 text-xs leading-relaxed text-slate-600 font-light">
            ${personalInfo.summary}
          </div>
        ` : ''}

        <!-- Education -->
        ${sectionVisibility.education && education?.length ? `
          <section class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-100 pb-1">Education</h2>
            ${education.map(e => `
              <div class="mb-2 text-xs">
                <div class="flex justify-between font-semibold text-slate-900">
                  <span>${e.college} — ${e.degree} in ${e.branch}</span>
                  <span class="text-slate-400 font-normal">${e.graduationYear}</span>
                </div>
                <div class="text-slate-500 mt-0.5">CGPA: ${e.cgpa || 'N/A'} • Coursework: ${e.coursework || ''}</div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Projects -->
        ${sectionVisibility.projects && projects?.length ? `
          <section class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-100 pb-1">Projects</h2>
            <div class="space-y-3">
              ${projects.map(p => `
                <div class="text-xs">
                  <div class="flex justify-between items-baseline font-semibold text-slate-900">
                    <span>${p.name} <span class="font-normal text-slate-400">(${p.technologies})</span></span>
                    ${p.github ? `<a href="${p.github}" target="_blank" class="text-[10px] text-slate-400 hover:text-slate-900">GitHub ↗</a>` : ''}
                  </div>
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-600 space-y-0.5 mt-1 font-light">
                    ${(p.bulletPoints || [p.description]).map(b => `<li>${b}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Skills -->
        ${sectionVisibility.skills ? `
          <section class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-100 pb-1">Skills & Tools</h2>
            <div class="text-xs space-y-1 text-slate-600">
              <div><span class="font-medium text-slate-900">Languages:</span> ${(skills.programming || []).join(' • ')}</div>
              <div><span class="font-medium text-slate-900">Web & Cloud:</span> ${[...(skills.web || []), ...(skills.cloud || [])].join(' • ')}</div>
              <div><span class="font-medium text-slate-900">Databases:</span> ${(skills.databases || []).join(' • ')}</div>
            </div>
          </section>
        ` : ''}

        <!-- Experience -->
        ${sectionVisibility.experience && experience?.length ? `
          <section>
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-100 pb-1">Experience</h2>
            ${experience.map(exp => `
              <div class="text-xs mb-2">
                <div class="flex justify-between font-semibold text-slate-900">
                  <span>${exp.position} — ${exp.company}</span>
                  <span class="text-slate-400 font-normal">${exp.duration}</span>
                </div>
                <p class="text-slate-600 font-light mt-0.5">${exp.responsibilities}</p>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }

  // =========================================================================
  // 8. CLASSIC ATS TEMPLATE (Max ATS Scanner Compatibility)
  // Single column, standard ATS headers, bullet-point oriented
  // =========================================================================
  static renderClassicATS(data, { spacingClasses, fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, certifications, achievements, extracurricular } = data;

    return `
      <div class="resume-document bg-white text-slate-800 p-8 md:p-10 ${spacingClasses}" style="${fontStyle} ${cssVars}">
        <!-- Header -->
        <header class="text-center border-b pb-4 mb-4 border-slate-300">
          <h1 class="text-2xl md:text-3xl font-bold uppercase tracking-wide text-slate-900">${personalInfo.fullName || 'Student Name'}</h1>
          <div class="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs md:text-sm text-slate-600 mt-2">
            ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
            ${personalInfo.phone ? `<span>• ${personalInfo.phone}</span>` : ''}
            ${personalInfo.email ? `<span>• <a href="mailto:${personalInfo.email}" class="hover:underline">${personalInfo.email}</a></span>` : ''}
            ${personalInfo.linkedIn ? `<span>• <a href="https://${personalInfo.linkedIn.replace(/^https?:\/\//, '')}" target="_blank" class="hover:underline">${personalInfo.linkedIn}</a></span>` : ''}
            ${personalInfo.github ? `<span>• <a href="https://${personalInfo.github.replace(/^https?:\/\//, '')}" target="_blank" class="hover:underline">${personalInfo.github}</a></span>` : ''}
            ${personalInfo.portfolio ? `<span>• <a href="https://${personalInfo.portfolio.replace(/^https?:\/\//, '')}" target="_blank" class="hover:underline">${personalInfo.portfolio}</a></span>` : ''}
          </div>
        </header>

        <!-- Professional Summary -->
        ${sectionVisibility.summary && personalInfo.summary ? `
          <section class="mb-4">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5 mb-1.5" style="color: ${accentColor}; border-color: ${accentColor};">
              Professional Summary
            </h2>
            <p class="text-xs leading-relaxed text-slate-700">${personalInfo.summary}</p>
          </section>
        ` : ''}

        <!-- Education -->
        ${sectionVisibility.education && education?.length ? `
          <section class="mb-4">
            <h2 class="text-sm font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style="color: ${accentColor}; border-color: ${accentColor};">
              Education
            </h2>
            ${education.map(edu => `
              <div class="mb-2">
                <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                  <span>${edu.college || 'University Name'}</span>
                  <span class="text-xs font-normal text-slate-600">${edu.graduationYear ? `Expected ${edu.graduationYear}` : ''}</span>
                </div>
                <div class="flex justify-between text-xs text-slate-700">
                  <span class="italic">${edu.degree || 'Bachelor of Science'} in ${edu.branch || 'Computer Science'}</span>
                  ${edu.cgpa ? `<span class="font-medium">CGPA: ${edu.cgpa}</span>` : ''}
                </div>
                ${edu.coursework ? `
                  <p class="text-[11px] text-slate-600 mt-0.5"><span class="font-medium text-slate-700">Coursework:</span> ${edu.coursework}</p>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Technical Skills -->
        ${sectionVisibility.skills ? `
          <section class="mb-4">
            <h2 class="text-sm font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style="color: ${accentColor}; border-color: ${accentColor};">
              Technical Skills
            </h2>
            <div class="text-xs space-y-1 text-slate-700">
              ${skills.programming?.length ? `<div><span class="font-bold text-slate-900">Languages:</span> ${skills.programming.join(', ')}</div>` : ''}
              ${skills.web?.length ? `<div><span class="font-bold text-slate-900">Web Technologies:</span> ${skills.web.join(', ')}</div>` : ''}
              ${skills.databases?.length ? `<div><span class="font-bold text-slate-900">Databases:</span> ${skills.databases.join(', ')}</div>` : ''}
              ${skills.frameworks?.length ? `<div><span class="font-bold text-slate-900">Frameworks:</span> ${skills.frameworks.join(', ')}</div>` : ''}
              ${skills.tools?.length ? `<div><span class="font-bold text-slate-900">Developer Tools:</span> ${skills.tools.join(', ')}</div>` : ''}
              ${skills.cloud?.length ? `<div><span class="font-bold text-slate-900">Cloud & DevOps:</span> ${skills.cloud.join(', ')}</div>` : ''}
              ${skills.aiml?.length ? `<div><span class="font-bold text-slate-900">AI / ML:</span> ${skills.aiml.join(', ')}</div>` : ''}
              ${skills.soft?.length ? `<div><span class="font-bold text-slate-900">Soft Skills:</span> ${skills.soft.join(', ')}</div>` : ''}
            </div>
          </section>
        ` : ''}

        <!-- Projects -->
        ${sectionVisibility.projects && projects?.length ? `
          <section class="mb-4">
            <h2 class="text-sm font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style="color: ${accentColor}; border-color: ${accentColor};">
              Key Technical Projects
            </h2>
            ${projects.map(proj => `
              <div class="mb-3">
                <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                  <span>${proj.name} ${proj.role ? `<span class="font-normal italic text-slate-600">| ${proj.role}</span>` : ''}</span>
                  <div class="text-[11px] font-normal text-slate-500 space-x-2">
                    ${proj.github ? `<a href="${proj.github}" target="_blank" class="hover:underline text-indigo-600">[Code]</a>` : ''}
                    ${proj.link ? `<a href="${proj.link}" target="_blank" class="hover:underline text-indigo-600">[Demo]</a>` : ''}
                  </div>
                </div>
                ${proj.technologies ? `<div class="text-[11px] font-medium text-slate-600 mb-1">Technologies: ${proj.technologies}</div>` : ''}
                <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5">
                  ${(proj.bulletPoints || [proj.description]).map(bp => `<li>${bp}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Experience (Optional for Freshers) -->
        ${sectionVisibility.experience && experience?.length ? `
          <section class="mb-4">
            <h2 class="text-sm font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style="color: ${accentColor}; border-color: ${accentColor};">
              Work & Internship Experience
            </h2>
            ${experience.map(exp => `
              <div class="mb-2.5">
                <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                  <span>${exp.position} — <span class="font-normal">${exp.company}</span></span>
                  <span class="text-xs font-normal text-slate-600">${exp.duration || ''}</span>
                </div>
                ${exp.responsibilities ? `<p class="text-xs text-slate-700 mt-1">${exp.responsibilities}</p>` : ''}
                ${exp.achievements ? `<p class="text-xs text-slate-700 mt-0.5"><span class="font-medium">Impact:</span> ${exp.achievements}</p>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Certifications -->
        ${sectionVisibility.certifications && certifications?.length ? `
          <section class="mb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5" style="color: ${accentColor}; border-color: ${accentColor};">
              Certifications
            </h2>
            <ul class="text-xs text-slate-700 space-y-1">
              ${certifications.map(c => `
                <li class="flex justify-between">
                  <span><span class="font-bold text-slate-900">${c.name}</span> — ${c.issuer}</span>
                  <span class="text-slate-500">${c.date || ''}</span>
                </li>
              `).join('')}
            </ul>
          </section>
        ` : ''}

        <!-- Achievements -->
        ${sectionVisibility.achievements && achievements?.length ? `
          <section class="mb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5" style="color: ${accentColor}; border-color: ${accentColor};">
              Achievements & Honors
            </h2>
            <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1">
              ${achievements.map(a => `
                <li><span class="font-bold text-slate-900">${a.title}:</span> ${a.description}</li>
              `).join('')}
            </ul>
          </section>
        ` : ''}

        <!-- Extracurricular -->
        ${sectionVisibility.extracurricular && extracurricular?.length ? `
          <section>
            <h2 class="text-sm font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5" style="color: ${accentColor}; border-color: ${accentColor};">
              Extracurricular & Leadership
            </h2>
            <div class="text-xs text-slate-700 space-y-1">
              ${extracurricular.map(ex => `
                <div><span class="font-bold text-slate-900">${ex.role || 'Member'}</span>, ${ex.organization} — <span class="text-slate-600">${ex.details}</span></div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    `;
  }

  // =========================================================================
  // 9. MODERN PROFESSIONAL
  // =========================================================================
  static renderModernProfessional(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

    return `
      <div class="resume-document bg-white text-slate-800" style="${fontStyle} ${cssVars}">
        <!-- Top Banner Header -->
        <header class="p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style="background-color: ${accentColor};">
          <div>
            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">${personalInfo.fullName || 'Student Name'}</h1>
            <p class="text-sm opacity-90 font-medium mt-1">${education?.[0]?.degree || 'Aspiring Software Engineer'} • ${data.targetJob?.role || 'Fresher'}</p>
          </div>
          <div class="text-xs space-y-1 text-right md:text-right opacity-95">
            ${personalInfo.location ? `<div>📍 ${personalInfo.location}</div>` : ''}
            ${personalInfo.email ? `<div>✉️ ${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div>📞 ${personalInfo.phone}</div>` : ''}
            ${personalInfo.github ? `<div>💻 ${personalInfo.github}</div>` : ''}
          </div>
        </header>

        <!-- Body 2-Column Layout -->
        <div class="grid grid-cols-12 min-h-[700px]">
          <!-- Left Main Column (7 cols) -->
          <div class="col-span-12 md:col-span-8 p-6 md:p-8 space-y-5 border-r border-slate-100">
            ${sectionVisibility.summary && personalInfo.summary ? `
              <section>
                <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">About Me</h3>
                <p class="text-xs leading-relaxed text-slate-700">${personalInfo.summary}</p>
              </section>
            ` : ''}

            ${sectionVisibility.projects && projects?.length ? `
              <section>
                <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Featured Projects</h3>
                <div class="space-y-4">
                  ${projects.map(proj => `
                    <div class="relative pl-3 border-l-2" style="border-color: ${accentColor};">
                      <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                        <span>${proj.name}</span>
                        <span class="text-[11px] font-normal text-slate-500">${proj.technologies ? `[${proj.technologies}]` : ''}</span>
                      </div>
                      <ul class="mt-1 list-disc list-outside ml-3 text-xs text-slate-600 space-y-0.5">
                        ${(proj.bulletPoints || [proj.description]).map(b => `<li>${b}</li>`).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            ${sectionVisibility.experience && experience?.length ? `
              <section>
                <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Work Experience</h3>
                <div class="space-y-3">
                  ${experience.map(exp => `
                    <div class="relative pl-3 border-l-2 border-slate-300">
                      <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                        <span>${exp.position} • <span class="font-normal text-slate-600">${exp.company}</span></span>
                        <span class="text-[11px] font-normal text-slate-500">${exp.duration}</span>
                      </div>
                      ${exp.responsibilities ? `<p class="text-xs text-slate-600 mt-1">${exp.responsibilities}</p>` : ''}
                      ${exp.achievements ? `<p class="text-xs text-slate-600 mt-0.5"><span class="font-semibold text-slate-700">Outcome:</span> ${exp.achievements}</p>` : ''}
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}
          </div>

          <!-- Right Sidebar Column (4 cols) -->
          <div class="col-span-12 md:col-span-4 p-6 bg-slate-50 space-y-5">
            ${sectionVisibility.education && education?.length ? `
              <section>
                <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Education</h3>
                ${education.map(edu => `
                  <div class="mb-3">
                    <div class="font-bold text-xs text-slate-900">${edu.college}</div>
                    <div class="text-xs text-slate-600">${edu.degree} in ${edu.branch}</div>
                    <div class="text-[11px] text-slate-500 font-medium">CGPA: ${edu.cgpa || 'N/A'} • Grad ${edu.graduationYear}</div>
                  </div>
                `).join('')}
              </section>
            ` : ''}

            ${sectionVisibility.skills ? `
              <section>
                <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Core Skills</h3>
                <div class="space-y-3">
                  <div>
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Languages</div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      ${(skills.programming || []).map(s => `<span class="bg-white px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 shadow-xs border border-slate-200">${s}</span>`).join('')}
                    </div>
                  </div>
                </div>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 10. MINIMAL CLEAN
  // =========================================================================
  static renderMinimal(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, achievements } = data;

    return `
      <div class="resume-document bg-white text-slate-800 p-8 md:p-12" style="${fontStyle} ${cssVars}">
        <header class="mb-6">
          <h1 class="text-3xl font-light text-slate-900 tracking-tight">${personalInfo.fullName || 'Student Name'}</h1>
          <p class="text-xs uppercase tracking-widest font-semibold mt-1" style="color: ${accentColor};">${data.targetJob?.role || 'Software Engineering Graduate'}</p>
          <div class="flex flex-wrap gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
            ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
            ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
            ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
            ${personalInfo.github ? `<span>${personalInfo.github}</span>` : ''}
          </div>
        </header>

        ${sectionVisibility.summary && personalInfo.summary ? `
          <div class="mb-5 text-xs leading-relaxed text-slate-600 font-light">
            ${personalInfo.summary}
          </div>
        ` : ''}

        ${sectionVisibility.education && education?.length ? `
          <section class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Education</h2>
            ${education.map(e => `
              <div class="mb-2">
                <div class="flex justify-between text-xs">
                  <span class="font-semibold text-slate-900">${e.college} — ${e.degree} in ${e.branch}</span>
                  <span class="text-slate-400">${e.graduationYear}</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5">CGPA: ${e.cgpa || 'N/A'} • Coursework: ${e.coursework || ''}</div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${sectionVisibility.projects && projects?.length ? `
          <section class="mb-5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Projects</h2>
            ${projects.map(p => `
              <div class="mb-3">
                <div class="flex justify-between items-baseline text-xs">
                  <span class="font-semibold text-slate-900">${p.name} <span class="font-normal text-slate-400">(${p.technologies})</span></span>
                  ${p.github ? `<a href="${p.github}" target="_blank" class="text-[10px] text-slate-400 hover:text-slate-800">GitHub ↗</a>` : ''}
                </div>
                <ul class="mt-1 list-disc list-outside ml-4 text-xs text-slate-600 space-y-0.5 font-light">
                  ${(p.bulletPoints || [p.description]).map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }

  // =========================================================================
  // 11. SOFTWARE ENGINEER
  // =========================================================================
  static renderSoftwareEngineer(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

    return `
      <div class="resume-document bg-white text-slate-900 p-8 md:p-10" style="${fontStyle} ${cssVars}">
        <header class="border-b-2 pb-4 mb-4" style="border-color: ${accentColor};">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 class="text-2xl md:text-3xl font-mono font-extrabold tracking-tight text-slate-900">${personalInfo.fullName || 'Student Name'}</h1>
              <p class="text-xs font-mono font-bold mt-1 text-slate-600">> ${data.targetJob?.role || 'Full-Stack Developer'} // ${data.targetJob?.company || 'Candidate'}</p>
            </div>
            <div class="text-xs font-mono text-slate-600 mt-2 md:mt-0 text-left md:text-right space-y-0.5">
              ${personalInfo.email ? `<div><span class="text-slate-400">mail:</span> <a href="mailto:${personalInfo.email}" class="hover:underline">${personalInfo.email}</a></div>` : ''}
              ${personalInfo.github ? `<div><span class="text-slate-400">gh:</span> <a href="https://${personalInfo.github.replace(/^https?:\/\//, '')}" target="_blank" class="hover:underline font-semibold text-slate-900">${personalInfo.github}</a></div>` : ''}
              ${personalInfo.location ? `<div><span class="text-slate-400">loc:</span> ${personalInfo.location}</div>` : ''}
            </div>
          </div>
        </header>

        ${sectionVisibility.skills ? `
          <section class="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <h2 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" style="background-color: ${accentColor};"></span> Technical Skills & Stack
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div><span class="font-bold text-slate-800 font-mono text-[11px]">LANGUAGES:</span> <span class="text-slate-700">${(skills.programming || []).join(', ')}</span></div>
              <div><span class="font-bold text-slate-800 font-mono text-[11px]">FRAMEWORKS:</span> <span class="text-slate-700">${[...(skills.web || []), ...(skills.frameworks || [])].join(', ')}</span></div>
              <div><span class="font-bold text-slate-800 font-mono text-[11px]">DATABASES:</span> <span class="text-slate-700">${(skills.databases || []).join(', ')}</span></div>
              <div><span class="font-bold text-slate-800 font-mono text-[11px]">TOOLS & CLOUD:</span> <span class="text-slate-700">${[...(skills.tools || []), ...(skills.cloud || [])].join(', ')}</span></div>
            </div>
          </section>
        ` : ''}

        ${sectionVisibility.projects && projects?.length ? `
          <section class="mb-4">
            <h2 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2.5 flex items-center justify-between" style="border-color: ${accentColor};">
              <span>Engineering Projects</span>
              <span class="text-[10px] font-normal text-slate-400">All repos public & verified</span>
            </h2>
            <div class="space-y-3.5">
              ${projects.map(proj => `
                <div>
                  <div class="flex justify-between items-baseline text-xs md:text-sm font-bold text-slate-900">
                    <span class="flex items-center gap-2">
                      ${proj.name}
                      ${proj.role ? `<span class="text-xs font-normal text-slate-500 font-mono">[${proj.role}]</span>` : ''}
                    </span>
                    <div class="text-[11px] font-mono space-x-2">
                      ${proj.github ? `<a href="${proj.github}" target="_blank" class="hover:underline" style="color: ${accentColor};">github ↗</a>` : ''}
                      ${proj.link ? `<a href="${proj.link}" target="_blank" class="hover:underline text-slate-600">live-demo ↗</a>` : ''}
                    </div>
                  </div>
                  <div class="text-[11px] font-mono text-slate-600 mt-0.5 mb-1 bg-slate-100 inline-block px-1.5 py-0.5 rounded">
                    Stack: ${proj.technologies}
                  </div>
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5">
                    ${(proj.bulletPoints || [proj.description]).map(b => `<li>${b}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${sectionVisibility.education && education?.length ? `
          <section class="mb-4">
            <h2 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2" style="border-color: ${accentColor};">
              Education
            </h2>
            ${education.map(e => `
              <div class="text-xs">
                <div class="flex justify-between font-bold text-slate-900">
                  <span>${e.college} — ${e.degree} in ${e.branch}</span>
                  <span class="font-mono text-slate-600">${e.graduationYear ? `Class of ${e.graduationYear}` : ''}</span>
                </div>
                <div class="text-slate-600 mt-0.5">
                  <span class="font-medium">GPA:</span> ${e.cgpa || 'N/A'} | <span class="font-medium">Relevant Courses:</span> ${e.coursework || 'Algorithms, OS, DBMS'}
                </div>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }

  // =========================================================================
  // 12. COLLEGE FRESHER
  // =========================================================================
  static renderFresher(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, certifications, achievements, extracurricular } = data;

    return `
      <div class="resume-document bg-white text-slate-800 p-8 md:p-10" style="${fontStyle} ${cssVars}">
        <header class="text-center pb-3 border-b-2" style="border-color: ${accentColor};">
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">${personalInfo.fullName || 'Student Name'}</h1>
          <p class="text-xs font-semibold tracking-wider uppercase mt-1" style="color: ${accentColor};">
            ${data.targetJob?.role || 'Fresher Graduate'} • Applying to ${data.targetJob?.company || 'Leading Tech Firms'}
          </p>
          <div class="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-600 mt-2">
            ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
            ${personalInfo.phone ? `<span>📱 ${personalInfo.phone}</span>` : ''}
            ${personalInfo.email ? `<span>✉️ ${personalInfo.email}</span>` : ''}
            ${personalInfo.github ? `<span>💻 <a href="https://${personalInfo.github.replace(/^https?:\/\//, '')}" target="_blank" class="hover:underline text-indigo-600 font-medium">${personalInfo.github}</a></span>` : ''}
            ${personalInfo.linkedIn ? `<span>💼 <a href="https://${personalInfo.linkedIn.replace(/^https?:\/\//, '')}" target="_blank" class="hover:underline text-indigo-600 font-medium">${personalInfo.linkedIn}</a></span>` : ''}
          </div>
        </header>

        ${sectionVisibility.summary && personalInfo.summary ? `
          <section class="mt-3.5 mb-3.5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-1.5" style="border-color: ${accentColor};">
              Career Objective & Profile
            </h2>
            <p class="text-xs leading-relaxed text-slate-700">${personalInfo.summary}</p>
          </section>
        ` : ''}

        ${sectionVisibility.education && education?.length ? `
          <section class="mb-3.5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-2" style="border-color: ${accentColor};">
              Education
            </h2>
            ${education.map(edu => `
              <div class="mb-2">
                <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                  <span>${edu.college}</span>
                  <span class="text-xs font-normal text-slate-500">${edu.graduationYear ? `Graduation: ${edu.graduationYear}` : ''}</span>
                </div>
                <div class="flex justify-between text-xs text-slate-700">
                  <span>${edu.degree} in ${edu.branch}</span>
                  ${edu.cgpa ? `<span class="font-semibold text-slate-900">CGPA / %: ${edu.cgpa}</span>` : ''}
                </div>
                ${edu.coursework ? `<div class="text-[11px] text-slate-600 mt-0.5"><span class="font-medium text-slate-700">Relevant Coursework:</span> ${edu.coursework}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${sectionVisibility.skills ? `
          <section class="mb-3.5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-2" style="border-color: ${accentColor};">
              Technical & Soft Skills
            </h2>
            <div class="text-xs space-y-1 text-slate-700">
              ${skills.programming?.length ? `<div><span class="font-bold text-slate-900">Programming Languages:</span> ${skills.programming.join(', ')}</div>` : ''}
              ${skills.web?.length ? `<div><span class="font-bold text-slate-900">Web & Cloud Technologies:</span> ${[...(skills.web || []), ...(skills.cloud || [])].join(', ')}</div>` : ''}
              ${skills.databases?.length ? `<div><span class="font-bold text-slate-900">Databases & Tools:</span> ${[...(skills.databases || []), ...(skills.tools || [])].join(', ')}</div>` : ''}
              ${skills.soft?.length ? `<div><span class="font-bold text-slate-900">Key Competencies:</span> ${skills.soft.join(', ')}</div>` : ''}
            </div>
          </section>
        ` : ''}

        ${sectionVisibility.projects && projects?.length ? `
          <section class="mb-3.5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-2" style="border-color: ${accentColor};">
              Academic & Personal Projects
            </h2>
            ${projects.map(proj => `
              <div class="mb-3">
                <div class="flex justify-between items-baseline font-bold text-xs md:text-sm text-slate-900">
                  <span>${proj.name} ${proj.role ? `<span class="font-normal italic text-slate-500">(${proj.role})</span>` : ''}</span>
                  <div class="text-[11px] font-normal space-x-2">
                    ${proj.github ? `<a href="${proj.github}" target="_blank" class="hover:underline text-indigo-600 font-medium">GitHub</a>` : ''}
                    ${proj.link ? `<a href="${proj.link}" target="_blank" class="hover:underline text-indigo-600 font-medium">Live Link</a>` : ''}
                  </div>
                </div>
                ${proj.technologies ? `<div class="text-[11px] text-slate-600 font-medium mb-1">Tools: ${proj.technologies}</div>` : ''}
                <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5">
                  ${(proj.bulletPoints || [proj.description]).map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${sectionVisibility.experience && experience?.length ? `
          <section class="mb-3.5">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-2" style="border-color: ${accentColor};">
              Internship Experience
            </h2>
            ${experience.map(exp => `
              <div class="mb-2">
                <div class="flex justify-between items-baseline font-bold text-xs text-slate-900">
                  <span>${exp.position} — <span class="font-normal">${exp.company}</span></span>
                  <span class="text-[11px] font-normal text-slate-500">${exp.duration}</span>
                </div>
                ${exp.responsibilities ? `<p class="text-xs text-slate-700 mt-0.5">${exp.responsibilities}</p>` : ''}
                ${exp.achievements ? `<p class="text-xs text-slate-700 mt-0.5"><span class="font-medium">Impact:</span> ${exp.achievements}</p>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }

  // =========================================================================
  // 13. INTERNSHIP SEEKER
  // =========================================================================
  static renderInternship(data, { fontStyle, cssVars, accentColor, sectionVisibility }) {
    const { personalInfo, education, skills, projects, experience, extracurricular, certifications } = data;

    return `
      <div class="resume-document bg-white text-slate-800 p-8 md:p-10" style="${fontStyle} ${cssVars}">
        <header class="border-b pb-3 mb-3 border-slate-200">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <span class="text-[10px] font-bold tracking-widest uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Internship Candidate</span>
              <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mt-1">${personalInfo.fullName || 'Student Name'}</h1>
              <p class="text-xs text-slate-600 mt-0.5">${education?.[0]?.college || 'University'} • ${education?.[0]?.branch || 'Computer Science'}</p>
            </div>
            <div class="text-xs text-slate-600 mt-2 md:mt-0 text-left md:text-right space-y-0.5">
              ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
              ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
              ${personalInfo.github ? `<div>GitHub: ${personalInfo.github}</div>` : ''}
            </div>
          </div>
        </header>

        ${sectionVisibility.summary && personalInfo.summary ? `
          <div class="mb-4 bg-slate-50 p-3 rounded border border-slate-200 text-xs leading-relaxed text-slate-700">
            <span class="font-bold text-slate-900" style="color: ${accentColor};">Target Objective:</span> ${personalInfo.summary}
          </div>
        ` : ''}

        ${sectionVisibility.education && education?.length ? `
          <section class="mb-4">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b" style="border-color: ${accentColor};">
              Academic Background
            </h2>
            ${education.map(e => `
              <div class="mt-2 text-xs">
                <div class="flex justify-between font-bold text-slate-900">
                  <span>${e.college} — ${e.degree} in ${e.branch}</span>
                  <span class="text-slate-500">${e.currentYear || ''} (Graduating ${e.graduationYear || '2026'})</span>
                </div>
                <div class="flex justify-between text-slate-700 mt-0.5">
                  <span class="font-semibold text-slate-800">Current CGPA: ${e.cgpa || 'N/A'}</span>
                </div>
                ${e.coursework ? `<div class="text-[11px] text-slate-600 mt-1"><span class="font-medium">Relevant Courses:</span> ${e.coursework}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${sectionVisibility.projects && projects?.length ? `
          <section class="mb-4">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b" style="border-color: ${accentColor};">
              Demonstrated Projects
            </h2>
            ${projects.map(proj => `
              <div class="mt-2.5">
                <div class="flex justify-between font-bold text-xs text-slate-900">
                  <span>${proj.name}</span>
                  <span class="text-[11px] font-normal text-slate-500">[${proj.technologies}]</span>
                </div>
                <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                  ${(proj.bulletPoints || [proj.description]).map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }
}
