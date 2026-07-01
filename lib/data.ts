export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: string;
};

// ─── Brand constants ────────────────────────────────────────────────────────
export const BRAND = {
  name: "Aiden Park",
  title: "AI/ML Engineer",
  tagline: "Building intelligent systems at the intersection of research and production.",
  email: "aiden@aidenpark.dev",
  location: "San Francisco, CA",
  resumeUrl: "/Aiden_Park_Resume.pdf",
} as const;

// ─── Navigation (single source of truth) ────────────────────────────────────
// Route links start with "/"; section anchors start with "#".
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

// Primary CTA shown in the navbar
export const navCTA = {
  label: "Resume",
  href: BRAND.resumeUrl,
} as const;

// ─── Social links ────────────────────────────────────────────────────────────
export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/aidenpark",
    icon: "Github",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/aidenpark",
    icon: "Linkedin",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/aidenpark",
    icon: "Twitter",
  },
  {
    label: "Email",
    href: `mailto:${BRAND.email}`,
    icon: "Mail",
  },
];