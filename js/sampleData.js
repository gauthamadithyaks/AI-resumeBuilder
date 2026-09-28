// sampleData.js - Realistic sample student data for freshers & college students

export const SAMPLE_STUDENT = {
  profileStatus: "student", // 'student', 'fresher', 'experienced'
  yearsOfExperience: "0",   // '0' (No experience), '0-1' (Internship), '1-2', '3-5', '5+'
  personalInfo: {
    fullName: "Alex Chen",
    email: "alex.chen@university.edu",
    phone: "+1 (555) 382-9401",
    location: "San Jose, CA",
    linkedIn: "linkedin.com/in/alexchen-tech",
    github: "github.com/alexchen-dev",
    portfolio: "alexchen.dev",
    summary: "Aspiring Software Engineer and Computer Science senior with strong fundamentals in full-stack web development, data structures, and algorithms. Proven experience building scalable web applications and collaborating in fast-paced hackathons. Eager to contribute technical skills and fresh perspective to impactful engineering teams."
  },
  education: [
    {
      id: "edu-1",
      college: "California State University",
      degree: "Bachelor of Science",
      branch: "Computer Science & Engineering",
      currentYear: "Senior (4th Year)",
      graduationYear: "2026",
      cgpa: "3.84 / 4.0",
      coursework: "Data Structures & Algorithms, Database Management Systems, Operating Systems, Web Development, Software Engineering, Object-Oriented Design, Computer Networks"
    }
  ],
  skills: {
    programming: ["JavaScript (ES6+)", "TypeScript", "Python", "Java", "C++", "SQL"],
    web: ["React.js", "Next.js", "HTML5", "CSS3 / Tailwind CSS", "Node.js", "RESTful APIs", "GraphQL"],
    databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
    frameworks: ["Express.js", "Spring Boot (Basics)", "Django (Basics)"],
    tools: ["Git & GitHub", "Docker (Basics)", "Postman", "VS Code", "Linux / Bash", "Jest"],
    cloud: ["AWS (S3, Lambda Basics)", "Vercel", "Firebase"],
    aiml: ["Scikit-Learn", "Prompt Engineering", "OpenAI / Gemini API Integration"],
    soft: ["Problem Solving", "Team Collaboration", "Agile / Scrum Basics", "Effective Technical Communication", "Quick Learner"]
  },
  projects: [
    {
      id: "proj-1",
      name: "CampusSync — Student Resource Marketplace",
      role: "Lead Full-Stack Developer",
      technologies: "React, Node.js, Express, PostgreSQL, Tailwind CSS, Stripe API",
      link: "https://campussync.dev",
      github: "https://github.com/alexchen-dev/campussync",
      description: "A peer-to-peer web marketplace enabling university students to buy, sell, and rent textbooks and dorm essentials securely.",
      features: "User authentication with university email verification; Real-time chat using WebSockets; Secure payments via Stripe; Search and category filtering.",
      bulletPoints: [
        "Architected a responsive full-stack marketplace using React and Express, serving 1,200+ verified active campus users.",
        "Implemented real-time messaging with WebSockets, reducing buyer-seller inquiry response times by 40%.",
        "Designed relational database schemas in PostgreSQL with parameterized queries, ensuring sub-100ms response times for catalog searches.",
        "Integrated Stripe checkout and webhook listeners to process transactions with automated payment receipts."
      ]
    },
    {
      id: "proj-2",
      name: "AlgoVisual — Interactive Data Structure Visualizer",
      role: "Solo Creator",
      technologies: "TypeScript, React, Canvas API, Tailwind CSS, Jest",
      link: "https://algovisual.io",
      github: "https://github.com/alexchen-dev/algovisual",
      description: "Interactive visualizer designed to assist college students in understanding sorting, graph traversal, and tree algorithms through step-by-step animations.",
      features: "Interactive speed controls; Step-by-step code execution display; Custom array/graph input generation; Time and space complexity breakdown.",
      bulletPoints: [
        "Built an interactive algorithmic learning tool in TypeScript rendering step-by-step execution for 10+ sorting and graph algorithms.",
        "Utilized the HTML5 Canvas API and requestAnimationFrame for 60fps animations of complex operations like Dijkstra and QuickSort.",
        "Conducted unit tests with Jest achieving 88% code coverage across core algorithmic traversal routines."
      ]
    },
    {
      id: "proj-3",
      name: "SmartShelf — AI Book & Research Paper Assistant",
      role: "Developer & ML Integrator",
      technologies: "Python, FastAPI, React, Google Gemini API, Pinecone, Tailwind",
      link: "https://smartshelf.app",
      github: "https://github.com/alexchen-dev/smart-shelf",
      description: "An AI-powered academic paper summarizer and question-answering tool built to help undergraduate researchers quickly synthesize academic literature.",
      features: "PDF document parsing; Semantic vector search with Pinecone; Contextual Q&A using Gemini API; Exportable study notes.",
      bulletPoints: [
        "Developed a document Q&A web application integrating Gemini API and vector embeddings to extract key findings from research papers.",
        "Constructed a lightweight asynchronous FastAPI backend handling PDF parsing and citation extraction in under 2 seconds.",
        "Engineered strict grounding prompts to eliminate hallucination in mathematical formulas and methodology summaries."
      ]
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "InnovateLabs (University Tech Incubator)",
      position: "Software Engineering Intern",
      duration: "Jun 2025 – Aug 2025",
      responsibilities: "Collaborated in an agile sprint team of 4 developers to build internal dashboard widgets and refactor frontend components.",
      achievements: "Refactored legacy vanilla JavaScript tables into reusable React components, reducing page load times by 28%. Wrote 25+ integration test cases with Cypress to ensure CI/CD release reliability."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services (AWS)",
      date: "Aug 2025",
      link: "https://aws.amazon.com/verification/12345"
    },
    {
      id: "cert-2",
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera / Meta",
      date: "Mar 2025",
      link: "https://coursera.org/verify/meta123"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "1st Place Winner — HackBay University Hackathon (out of 45 teams)",
      description: "Developed 'EcoRoute', a green commute planner application in 36 hours; judged on technical difficulty, UI polish, and social impact."
    },
    {
      id: "ach-2",
      title: "Dean's Honor List (4 Consecutive Semesters)",
      description: "Recognized for maintaining a semester GPA above 3.80 across upper-division CS coursework."
    },
    {
      id: "ach-3",
      title: "Finalist — Google Solution Challenge Campus Round",
      description: "Ranked Top 5 out of 60 student submissions for designing an accessible campus navigation mobile prototype."
    }
  ],
  extracurricular: [
    {
      id: "extra-1",
      organization: "ACM Student Chapter (Association for Computing Machinery)",
      role: "Technical Workshop Lead",
      details: "Organized and mentored weekly hands-on workshops on Git/GitHub, React fundamentals, and LeetCode problem-solving for 70+ junior students."
    },
    {
      id: "extra-2",
      organization: "Code For Community Club",
      role: "Volunteer Developer",
      details: "Contributed open-source web enhancements for local non-profit animal rescue shelter website."
    }
  ],
  targetJob: {
    company: "Google",
    role: "Associate Software Engineer / SDE Intern",
    jobDescription: "Seeking enthusiastic Software Engineering freshers and interns with a strong grasp of computer science fundamentals, data structures, algorithms, object-oriented programming, and web technologies. Key responsibilities include designing scalable features, writing clean and testable code in languages like Java, C++, Python, or TypeScript, participating in code reviews, and collaborating in cross-functional engineering teams. Nice to have: experience with modern frameworks like React, distributed systems basics, and cloud services."
  }
};

export const JOB_PRESETS = [
  {
    company: "Google",
    role: "Associate Software Engineer",
    description: "Seeking enthusiastic Software Engineering freshers with strong computer science fundamentals, data structures, algorithms, OOP, and web technologies. Responsibilities include building scalable services, writing clean code in TypeScript/Python/Java, and cross-team collaboration."
  },
  {
    company: "Microsoft",
    role: "Software Developer (New Grad)",
    description: "Looking for motivated new grads ready to develop innovative cloud and web applications. Ideal candidate has experience in React, TypeScript, C# or Java, RESTful APIs, and modern development workflows with Git."
  },
  {
    company: "Amazon",
    role: "SDE Intern",
    description: "Amazon is looking for passionate SDE Interns to build large-scale distributed systems and user-facing applications. Must be proficient in CS fundamentals, problem solving, data structures, and at least one modern programming language."
  },
  {
    company: "Infosys",
    role: "Specialist Programmer / Graduate Engineer",
    description: "Hiring engineering freshers with high analytical capability, foundational knowledge of Java/Python, database design (SQL), web application development, and eagerness to undergo enterprise technology training."
  },
  {
    company: "TCS",
    role: "TCS Digital — Software Engineer",
    description: "Opportunities for fresh graduates with proficiency in modern web stacks, Python/Java, Cloud fundamentals, database management, and agile problem solving."
  },
  {
    company: "Early-Stage Tech Startup",
    role: "Full-Stack Developer (Fresher)",
    description: "Fast-moving startup looking for a proactive fresher skilled in React, Node.js, PostgreSQL/MongoDB, and building end-to-end features with high velocity and autonomy."
  }
];
