// exportUtils.js - PDF, DOCX, and JSON export utilities

export class ExportUtils {
  /**
   * Generates a high-quality PDF printout of the resume
   */
  static printToPDF(resumeElementId = 'resume-live-preview', title = 'Resume') {
    const resumeEl = document.getElementById(resumeElementId);
    if (!resumeEl) {
      alert('Resume element not found for export.');
      return;
    }

    // Set document title temporarily so saved PDF gets a clean filename
    const originalTitle = document.title;
    document.title = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume`;

    // Trigger standard browser print with custom print stylesheet
    window.print();

    // Restore title after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }

  /**
   * Generates and downloads a clean, formatted DOCX/Word-compatible file
   */
  static downloadDOCX(studentData, filename = 'Resume') {
    const { personalInfo, education, skills, projects, experience, certifications, achievements } = studentData;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${personalInfo.fullName || 'Resume'}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.3; color: #222; }
          h1 { font-size: 20pt; text-align: center; margin-bottom: 4pt; text-transform: uppercase; }
          .contact { text-align: center; font-size: 9.5pt; color: #555; margin-bottom: 14pt; }
          h2 { font-size: 12pt; border-bottom: 1.5pt solid #333; text-transform: uppercase; margin-top: 12pt; margin-bottom: 4pt; color: #111; }
          .bold { font-weight: bold; }
          .italic { font-style: italic; }
          .right { float: right; }
          ul { margin-top: 2pt; margin-bottom: 6pt; padding-left: 18pt; }
          li { margin-bottom: 2pt; }
        </style>
      </head>
      <body>
        <h1>${personalInfo.fullName || 'Student Name'}</h1>
        <div class="contact">
          ${[personalInfo.location, personalInfo.phone, personalInfo.email, personalInfo.linkedIn, personalInfo.github].filter(Boolean).join(' | ')}
        </div>

        ${personalInfo.summary ? `
          <h2>Professional Summary</h2>
          <p>${personalInfo.summary}</p>
        ` : ''}

        <h2>Education</h2>
        ${(education || []).map(e => `
          <p>
            <span class="bold">${e.college}</span> — ${e.degree} in ${e.branch} <span class="right">${e.graduationYear ? `Expected ${e.graduationYear}` : ''}</span><br>
            <span class="italic">CGPA: ${e.cgpa || 'N/A'}</span><br>
            ${e.coursework ? `<span>Relevant Coursework: ${e.coursework}</span>` : ''}
          </p>
        `).join('')}

        <h2>Technical Skills</h2>
        <p>
          <span class="bold">Languages:</span> ${(skills.programming || []).join(', ')}<br>
          <span class="bold">Web Technologies:</span> ${(skills.web || []).join(', ')}<br>
          <span class="bold">Databases & Tools:</span> ${[...(skills.databases || []), ...(skills.tools || [])].join(', ')}<br>
          <span class="bold">Soft Skills:</span> ${(skills.soft || []).join(', ')}
        </p>

        <h2>Projects</h2>
        ${(projects || []).map(p => `
          <p><span class="bold">${p.name}</span> | <span class="italic">${p.technologies}</span></p>
          <ul>
            ${(p.bulletPoints || [p.description]).map(b => `<li>${b}</li>`).join('')}
          </ul>
        `).join('')}

        ${experience?.length ? `
          <h2>Work & Internship Experience</h2>
          ${experience.map(exp => `
            <p><span class="bold">${exp.position}</span> — ${exp.company} <span class="right">${exp.duration}</span></p>
            <p>${exp.responsibilities}</p>
            ${exp.achievements ? `<p><span class="italic">Impact:</span> ${exp.achievements}</p>` : ''}
          `).join('')}
        ` : ''}

        ${certifications?.length ? `
          <h2>Certifications</h2>
          <ul>
            ${certifications.map(c => `<li><span class="bold">${c.name}</span> — ${c.issuer} (${c.date})</li>`).join('')}
          </ul>
        ` : ''}

        ${achievements?.length ? `
          <h2>Honors & Achievements</h2>
          <ul>
            ${achievements.map(a => `<li><span class="bold">${a.title}:</span> ${a.description}</li>`).join('')}
          </ul>
        ` : ''}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export resume as JSON
   */
  static exportJSON(studentData, filename = 'Resume_Data') {
    const jsonStr = JSON.stringify(studentData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
