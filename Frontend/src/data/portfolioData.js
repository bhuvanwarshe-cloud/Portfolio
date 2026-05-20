// ─── Portfolio Data ───────────────────────────────────────────────
// Centralized dataset for Bhuvan Warshe's portfolio
import { links } from './links';

export const personalInfo = {
  name: "Bhuvan Warshe",
  role: "Full Stack Developer",
  tagline: "I build real systems, not just projects.",
  email: links.email,
  location: "India",
  github: links.github,
  linkedin: links.linkedin,
  twitter: "https://twitter.com/bhuvanwarshe",
  resume: "#",
  avatar: null,
  bio: [
    "I'm Bhuvan Warshe — a Full Stack Developer who engineers real systems with purpose. I don't just write code; I architect solutions that scale, perform, and endure. From pixel-perfect UIs to battle-tested backend APIs, I build end-to-end.",
    "Driven by discipline and powered by curiosity, I approach every project with the methodical precision of an engineer and the creative instinct of a builder. My philosophy: ship fast, think deep, build right.",
  ],
  stats: [
    { label: "Projects Built", value: "10+" },
    { label: "Technologies", value: "15+" },
    { label: "Lines of Code", value: "50k+" },
    { label: "Cups of Coffee", value: "∞" },
  ],
};

export const skills = [
  {
    category: "Frontend",
    icon: "⚛️",
    color: "#00d4ff",
    items: [
      { name: "React.js", level: 90 },
      { name: "JavaScript (ES6+)", level: 88 },
      { name: "TypeScript", level: 80 },
      { name: "Tailwind CSS", level: 88 },
      { name: "HTML5 / CSS3", level: 92 },
      { name: "Framer Motion", level: 78 },
    ],
  },
  {
    category: "Backend",
    icon: "⚙️",
    color: "#ef4444",
    items: [
      { name: "Node.js", level: 88 },
      { name: "Express.js", level: 85 },
      { name: "REST APIs", level: 90 },
      { name: "Python", level: 75 },
      { name: "JWT / Auth", level: 82 },
      { name: "WebSockets", level: 70 },
    ],
  },
  {
    category: "Databases",
    icon: "🗄️",
    color: "#a855f7",
    items: [
      { name: "PostgreSQL", level: 85 },
      { name: "Supabase", level: 88 },
      { name: "MongoDB", level: 80 },
      { name: "MySQL", level: 78 },
      { name: "Redis", level: 65 },
      { name: "Prisma ORM", level: 75 },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: "🛠️",
    color: "#f59e0b",
    items: [
      { name: "Git / GitHub", level: 92 },
      { name: "Docker", level: 70 },
      { name: "Vite / Webpack", level: 82 },
      { name: "Linux / Bash", level: 72 },
      { name: "Vercel / Render", level: 80 },
      { name: "Figma", level: 68 },
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "CricPulseX",
    description:
      "A real-time cricket analytics platform delivering live scores, player statistics, match predictions, and deep performance insights. Built with high-performance APIs and a sleek, data-rich dashboard interface.",
    tech: ["React", "Node.js", "Express", "Cricket API", "WebSockets"],
    color: "#00d4ff",
    gradient: "linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)",
    github: links.github,
    demo: "#",
    featured: true,
    category: "Full Stack",
    icon: "🏏",
    status: "live",
  },
  {
    id: 2,
    title: "CampusFlow",
    description:
      "An enterprise-grade Learning Management System for colleges. Features role-based access control (Admin, Teacher, Student), AI-powered assignment evaluation via OpenRouter, real-time notifications, and a comprehensive Supabase + PostgreSQL backend.",
    tech: ["React", "Node.js", "Supabase", "PostgreSQL", "OpenRouter AI"],
    color: "#a855f7",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    github: links.campusflowRepo,
    demo: links.campusflow,
    featured: true,
    category: "Full Stack",
    icon: "🎓",
    status: "live",
  },
  {
    id: 3,
    title: "SHIELD",
    description:
      "An AI-powered developer security and code intelligence platform. Scans repositories for vulnerabilities, suggests hardened patterns, and provides real-time threat intelligence — like Iron Man's JARVIS, but for your codebase.",
    tech: ["React", "Python", "FastAPI", "OpenAI", "Docker"],
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    github: "#",
    demo: "#",
    featured: true,
    category: "AI / Security",
    icon: "🛡️",
    status: "future",
  },
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Mindset", href: "#mindset" },
  { label: "Contact", href: "#contact" },
];

export const socialLinks = [
  { label: "GitHub", href: links.github, icon: "github" },
  { label: "LinkedIn", href: links.linkedin, icon: "linkedin" },
  { label: "Twitter", href: "https://twitter.com/bhuvanwarshe", icon: "twitter" },
  { label: "Email", href: links.mailto, icon: "mail" },
];

export const mindsetValues = [
  {
    icon: "🛡️",
    title: "Discipline",
    subtitle: "Captain America",
    description: "No shortcuts. No excuses. Code written with intention, tested with rigor, delivered with pride.",
    color: "#00d4ff",
    accent: "cap",
  },
  {
    icon: "⚡",
    title: "Innovation",
    subtitle: "Tony Stark",
    description: "Push boundaries. Think three moves ahead. Build systems that didn't exist yesterday.",
    color: "#ef4444",
    accent: "stark",
  },
  {
    icon: "🔄",
    title: "Consistency",
    subtitle: "The Foundation",
    description: "Greatness isn't a moment. It's showing up every day, shipping every week, improving every sprint.",
    color: "#a855f7",
    accent: "neutral",
  },
  {
    icon: "🏗️",
    title: "Builder Mindset",
    subtitle: "Real Execution",
    description: "I don't just plan. I prototype, iterate, and ship. Ideas without execution are just dreams.",
    color: "#f59e0b",
    accent: "neutral",
  },
];

export const codeSnippet = `// Bhuvan's developer philosophy 🚀
const developer = {
  name: "Bhuvan Warshe",
  stack: ["React", "Node.js", "PostgreSQL"],
  currentlyBuilding: "real systems",
  philosophy: "Build it right, not just fast",
  
  async solve(problem) {
    const plan = this.architect(problem);
    const code = await this.build(plan);
    const result = this.ship(code.tested());
    return result; // always production-ready
  },
  
  values: {
    code: "clean & purposeful",
    systems: "scalable & resilient",
    mindset: "Tony's innovation + Cap's discipline",
  }
};

developer.solve("your next big challenge");
`;
