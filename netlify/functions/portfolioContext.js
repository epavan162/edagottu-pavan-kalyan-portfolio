// Centralized Portfolio Context for Pavan AI
const portfolioContext = {
  personalInfo: {
    name: "Edagottu Pavan Kalyan",
    shortName: "Pavan Kalyan",
    title: "Software Development Engineer (SDE-I)",
    company: "Coffeebeans Consulting",
    location: "Bengaluru, Karnataka, India",
    email: "epavan162@gmail.com",
    phone: "+91 9490131185",
    portfolioUrl: "https://edagottu-pavan-kalyan-portfolio.netlify.app/",
    githubUrl: "https://github.com/epavan162",
    linkedinUrl: "https://www.linkedin.com/in/pavan-kalyan-edagottu-281681236/",
    experienceYears: "1.6+ years",
    summary: "Full-Stack and GenAI Engineer specializing in building scalable web, mobile, and AI-driven applications using React, React Native, Node.js, Go, FastAPI, PostgreSQL, pgvector, and LLM integrations."
  },
  skills: {
    languages: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "C", "C++", "Java"],
    frontend: ["React.js", "React Native (Expo)", "Next.js", "Vite", "Tailwind CSS", "Shadcn UI", "HTML5/CSS3", "Zustand"],
    backend: ["Node.js (Express)", "Golang (Gin)", "FastAPI", "Django REST Framework", "Drizzle ORM", "SQLAlchemy", "Prisma", "GORM"],
    databases: ["PostgreSQL", "pgvector (Vector Database)"],
    genAI: ["Retrieval-Augmented Generation (RAG)", "OpenAI API (gpt-4o-mini)", "Gemini API", "Vector Search & Embeddings", "Grounding Safety Gates", "Prompt Engineering", "Claude Code", "Antigravity"],
    tools: ["Docker", "Docker Compose", "Git", "GitHub", "GitHub Actions", "Swagger", "Postman"],
    integrations: ["AWS S3", "Google Drive API", "Google OAuth 2.0", "Google Calendar API", "Google Meet API", "SendGrid", "Slack API", "Google Sheets API"]
  },
  experience: [
    {
      company: "Coffeebeans Consulting",
      role: "Software Development Engineer – L1 (Full-time)",
      period: "May 2025 – Present",
      location: "Bengaluru, Karnataka",
      highlights: [
        {
          project: "Enterprise Onboarding & AI Policy Assistant Platform (Coffeebeans-X)",
          stack: "React 18, Vite, Node.js (Express), PostgreSQL (pgvector), Drizzle ORM, OpenAI, Gemini LLM, AWS S3, Google Drive API, Tailwind CSS, Shadcn UI",
          details: "Architected an enterprise onboarding platform and GenAI Policy Assistant chatbot using RAG. Built 2D PDF table extraction, vector similarity search using pgvector, HR synonym query expansion, dynamic space normalization, and grounding safety gates for zero-hallucination policy lookup. Integrated AWS S3 and Google Drive APIs for secure document storage. Supported DevOps teams with Docker, Kubernetes Helm Charts, and ArgoCD deployments."
        },
        {
          project: "Applicant Tracking System (TalentBean / ATS)",
          stack: "React, Vite, FastAPI, PostgreSQL, SendGrid, Google Calendar API, Google Meet API, Docker",
          details: "Developed interview scheduling workflows, Google Calendar & Meet API integrations for automatic meeting link creation, SendGrid email notification workflows, candidate management UI, and resolved calendar sync and API bugs."
        },
        {
          project: "Smart EV Charging Platform (VoltLink)",
          stack: "React Native (Expo), React, Vite, Tailwind CSS, Shadcn UI, Node.js, Express, Go (Gin), PostgreSQL, GORM",
          details: "Built driver and consumer mobile app flows using React Native Expo. Implemented AI-based charging recommendations, station discovery, live booking, live session tracking, credit management, V2G sessions, and supported Go backend microservices."
        },
        {
          project: "Predictive Maintenance Platform (KPC)",
          stack: "OutSystems, JavaScript, FastAPI",
          details: "Built low-code UI screens, integrated REST APIs for truck maintenance work orders, fluid monitoring, contracts, and invoices. Contributed to FastAPI backend updates."
        },
        {
          project: "Slack Lunch Automation (LunchBot)",
          stack: "Node.js, Slack API, Google Sheets API",
          details: "Resolved production issues in Slack message lifecycle management, automated reminder expiration, cutoff closures, and Google Sheets sync."
        }
      ]
    },
    {
      company: "Coffeebeans Consulting",
      role: "Software Development Engineer (Intern)",
      period: "Feb 2025 – May 2025",
      location: "Bengaluru, Karnataka",
      highlights: [
        {
          project: "Resource Management Platform (CRU)",
          stack: "React.js, Vite, Zustand, Nx Monorepo, Django REST Framework, PostgreSQL, Vitest",
          details: "Developed frontend components for internal staffing, project allocation, and asset tracking. Implemented role-based access for Super Admin, Admin, Viewer, and Requester. Contributed to Django backend and Vitest unit testing."
        }
      ]
    }
  ],
  personalProjects: [
    {
      name: "Google OAuth Authentication System",
      category: "Personal / Open-Source Project",
      stack: "React, TypeScript, Go (Gin), PostgreSQL, Docker, Nginx",
      description: "Secure authentication platform with Google OAuth 2.0, JWT tokens in HTTP-only cookies, public user profiles (/u/username), privacy controls, and automated schema migrations with golang-migrate.",
      links: { github: "https://github.com/epavan162/Google-OAuth-Login-System", type: "github" }
    },
    {
      name: "Nestify — Multi-Tenant Apartment Management SaaS",
      category: "Personal / Open-Source Project",
      stack: "React, TypeScript, FastAPI, PostgreSQL, SQLAlchemy, Docker",
      description: "Full-stack SaaS application for apartment societies supporting Admin, Resident, Security, and Treasurer roles. Features multi-tenant database isolation, maintenance billing, complaint tracking, visitor logs, and facility bookings.",
      links: { github: "https://github.com/epavan162/NESTIFY", type: "github" }
    },
    {
      name: "The Atelier — Mobile Learning Platform (LMS)",
      category: "Personal / Open-Source Project",
      stack: "React Native (Expo), TypeScript, SecureStore, AsyncStorage, GitHub Actions",
      description: "Production-ready mobile LMS app with offline-first SWR caching, two-tier JWT security, LegendList virtualization, WebView course rendering, and automated GitHub Actions CI/CD.",
      links: { github: "https://github.com/epavan162/edtech-lms-app", type: "github" }
    },
    {
      name: "Amazon Web Scraper",
      category: "Personal Project",
      stack: "Python, BeautifulSoup, Web Scraping",
      description: "Python-based web scraping tool to gather product information from Amazon including title, price, rating, reviews, and availability for analysis."
    },
    {
      name: "Image Search App",
      category: "Personal Project",
      stack: "JavaScript, Unsplash API, HTML/CSS",
      description: "Dynamic web application for searching and displaying high-resolution images using Unsplash API with responsive design and direct download options."
    },
    {
      name: "Social Media Data Retrieval",
      category: "Personal Project",
      stack: "Python, Instaloader, Data Analysis",
      description: "Python script using Instaloader to fetch public data from Instagram including profile info, posts, and follower counts for data analysis."
    },
    {
      name: "Job Application Portal",
      category: "Personal Project",
      stack: "HTML, CSS, Responsive Design",
      description: "Responsive job application user interface providing seamless experience across mobile and desktop devices."
    },
    {
      name: "Content Management Tool",
      category: "Personal Project",
      stack: "HTML, CSS, JavaScript",
      description: "Content management system featuring static site generation and easy content updates."
    },
    {
      name: "Todo Application",
      category: "Personal Project",
      stack: "HTML, CSS, JavaScript",
      description: "Interactive todo list application with local storage persistence."
    }
  ],
  education: [
    {
      degree: "B.Tech — Computer Science & Engineering",
      institution: "Sree Vidyanikethan Engineering College, Tirupati, AP",
      period: "2021 – 2024",
      score: "82.27%"
    },
    {
      degree: "Diploma in Computer Engineering",
      institution: "Sri Venkateswara Government Polytechnic, Tirupati, AP",
      period: "2018 – 2021",
      score: "76.86%"
    }
  ],
  certifications: [
    { name: "Claude 101", provider: "Anthropic", url: "https://verify.skilljar.com/c/rj9h3sja9pzs" },
    { name: "Claude Code 101", provider: "Anthropic", url: "https://verify.skilljar.com/c/bindhfgp3d8q" },
    { name: "Claude Code in Action", provider: "Anthropic", url: "https://verify.skilljar.com/c/4uugb5czh8bi" },
    { name: "Python For Beginners", provider: "Udemy", date: "Nov 2022" },
    { name: "HTML, CSS, JavaScript", provider: "Udemy", date: "Jul 2024" },
    { name: "Python 101 for Data Science", provider: "Cognitive Class", date: "Oct 2022" }
  ],
  problemSolvingStats: {
    problemsSolved: "250+",
    projectsBuilt: "9+",
    certificationsCount: "5+"
  }
};

module.exports = portfolioContext;
exports.portfolioContext = portfolioContext;
exports.default = portfolioContext;
