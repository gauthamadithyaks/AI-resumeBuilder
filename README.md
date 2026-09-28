# ResumeForge AI — Modern AI-Powered Resume Builder for College Students & Freshers

A modern, production-grade SaaS web application engineered specifically for **college students, engineering undergraduates, and freshers** to build ATS-friendly, company-tailored resumes based on their actual skills, projects, education, certifications, and achievements.

---

## 🌟 Key Features

1. **Strict Anti-Fabrication Guarantee**
   - The AI **never** invents fake jobs, fake degrees, or false metrics.
   - It elevates genuine student projects with strong action verbs (e.g. *Architected*, *Engineered*, *Implemented*), structures bullet points for maximum ATS readability, and optimizes keywords for the target role.

2. **Full 9-Step Student Input Flow**
   - **Step 1 — Personal & Contact Information**: Name, Email, Phone, Location, GitHub, LinkedIn, Portfolio, and Career Summary.
   - **Step 2 — Education & Coursework**: College/University, Degree, Branch, Current Year, Graduation Year, CGPA/Percentage, and Relevant CS Coursework.
   - **Step 3 — Technical & Soft Skills**: Programming languages, Web technologies, Databases, Frameworks, Developer tools, Cloud, AI/ML, and Soft skills with quick-add chips.
   - **Step 4 — Projects**: Project Name, Role, Tech Stack, Links (GitHub & Demo), Description, and 🪄 **"AI Polish"** action-verb generator.
   - **Step 5 — Experience**: Internships & Freelance history (clearly marked **Optional for Freshers**).
   - **Step 6 — Certifications**: AWS, Meta, Coursera, HackerRank, etc. with credential verification links.
   - **Step 7 — Achievements**: Hackathons, coding competitions, Dean's List honors, and scholarships.
   - **Step 8 — Extracurricular**: ACM/IEEE chapters, technical mentoring, open-source clubs, and sports.
   - **Step 9 — Career Target & AI Tailoring**: Target company (Google, Microsoft, Amazon, Infosys, TCS, Startups) and target role, with optional job description matching.

3. **13 Professional Resume Templates**
   - **⭐ Zety-Inspired Signature Designs**:
     - **Cascade (Zety #1 Most Popular)**: World-famous two-column design with shaded sidebar, skills meters, and clean lines.
     - **Primo (Timeline Storyteller)**: Signature vertical timeline spine with circular milestone nodes and monogram badge.
     - **Cubic (Geometric Contrast)**: Solid accent-colored header block with high-contrast two-column structure.
     - **Diamond (Executive Polish)**: Distinctive diamond bullet points (◆), dark accent bar, and double hairline dividers.
     - **Concept (Milestone Years)**: Visual year and date badges alongside education and projects for fast recruiter scanning.
     - **Vibes (Modern Creative)**: Dynamic section icon headers, gradient underline, and crisp cards.
     - **Crisp (Executive Clean)**: Minimalist masterpiece with hairline dividers and balanced spacing.
   - **🎓 College & Fresher Designs**:
     - **College Fresher (Recommended)**: Places Education, CGPA, and Projects at the top before experience.
     - **Software Engineer**: Technical resume with skills upfront, prominent GitHub links, and code-heavy project highlights.
     - **Classic ATS**: Single-column standard formatting designed for 100% pass rates across enterprise ATS scanners.
     - **Modern Professional**: Contemporary two-column layout with sidebar and contact badges.
     - **Minimal Clean**: Elegant whitespace balance with refined typographic hierarchy.
     - **Internship Seeker**: Highlights CS coursework, campus leadership, and fast learning agility.

4. **Split-Screen Live Preview & Customizer**
   - Left side: 9-step responsive student editor.
   - Right side: Pixel-perfect live A4 resume preview updating in real-time.
   - Customizer toolbar: Switch templates, fonts (Inter, Roboto, Merriweather, JetBrains Mono, Outfit), accent color palettes, and spacing.

5. **AI Resume Score & Gap Analysis (Out of 100)**
   - Radial score gauge with letter grade.
   - Breakdown across 6 dimensions: ATS Compatibility, Skills Relevance, Project Relevance, Keyword Optimization, Content Quality, and Formatting.
   - "Why This Resume Fits Your Target Role": Matched skills checklist vs Potential Gaps (clearly labeled as recommendations to learn for interviews).

6. **Interactive Resume AI Assistant (Slide-out Drawer)**
   - Context-aware chatbot with student's active resume loaded.
   - Instant suggested chips: *"Improve project bullet points"*, *"Write summary for Google"*, *"What skills should I highlight?"*.

7. **Export Options**
   - **PDF Print Engine**: Clean A4 print media stylesheet that hides all website chrome and produces crystal-clear vector PDFs.
   - **Word DOCX Export**: Structured `.doc` XML format that opens cleanly in Microsoft Word and Google Docs.
   - **JSON Backup**: Export and import full profile state.

8. **Database & Backend Architecture**
   - **Node.js Gateway Server (`server.js`)**: Zero-dependency backend serving static files and handling AI API proxying.
   - **Google Gemini API Support**: Uses `GEMINI_API_KEY` when provided, and automatically falls back to the intelligent rule-based local AI engine when offline or unconfigured.
   - **PostgreSQL / Supabase Schema (`database/supabase_schema.sql`)**: 11 normalized tables with Row Level Security (RLS) policies.

---

## 🚀 How to Run the Website

### Option A: Zero-Dependency Node.js Server (Recommended)
No `npm install` needed! Simply run:
```bash
node server.js
```
Then open your browser to:
```
http://localhost:3000
```

### Option B: Direct In-Browser (Instant)
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

---

## 📁 Project Structure

```
first/
├── index.html                   # Modern SaaS single-page application shell
├── css/
│   └── styles.css               # Design system, glassmorphism, print media rules
├── js/
│   ├── app.js                   # Application state manager, 9-step reactive forms, event hooks
│   ├── sampleData.js            # Realistic student profile (Alex Chen - CS Senior) & role presets
│   ├── aiEngine.js              # ATS scoring, keyword matching, role tailoring & AI chat engine
│   ├── templates.js             # 6 distinct professional resume template renderers
│   └── exportUtils.js           # PDF print trigger, structured DOCX export, and JSON backup
├── database/
│   └── supabase_schema.sql      # Supabase PostgreSQL schema with RLS security policies
├── server.js                    # Zero-dependency Node.js HTTP server & Gemini AI gateway
└── package.json                 # Project configuration
```

---

## 🔒 Privacy & Security

- **Client Data Isolation**: Profiles and resumes are scoped to the user and auto-saved in local browser storage.
- **Backend Key Protection**: LLM API keys are kept securely on the server and never sent to browser source code.
- **Row Level Security (RLS)**: Included PostgreSQL schema enforces `auth.uid() = user_id` on all tables.
