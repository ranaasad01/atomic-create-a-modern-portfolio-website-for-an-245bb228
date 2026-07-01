"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Code2 as Github, Briefcase as Linkedin, MessageCircle as Twitter, Mail, ArrowUp } from 'lucide-react';
import { navLinks, BRAND, socialLinks } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const iconMap: Record<string, React.ReactNode> = {
  Github: <Github size={16} />,
  Linkedin: <Linkedin size={16} />,
  Twitter: <Twitter size={16} />,
  Mail: <Mail size={16} />,
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  const pathname = usePathname();

  function handleAnchorClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (pathname === "/" && href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function resolveHref(href: string): string {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : `/${href}`;
    }
    return href;
  }

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#0a0a0f]">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
        >
          {/* Brand column */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm font-[family-name:var(--font-space-grotesk)] shadow-[0_0_16px_rgba(124,58,237,0.4)]">
                AP
              </span>
              <span className="font-semibold text-white/90 font-[family-name:var(--font-space-grotesk)]">
                {BRAND.name}
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-[240px]">
              {BRAND.tagline}
            </p>
            <p className="text-xs text-white/30">{BRAND.location}</p>
          </motion.div>

          {/* Nav links */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Navigation
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={resolveHref(link.href)}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social + contact */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Connect
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors duration-200 group"
                  >
                    <span className="text-violet-400/70 group-hover:text-violet-400 transition-colors">
                      {iconMap[social.icon]}
                    </span>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} {BRAND.name}. Crafted with precision.
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors duration-200 group"
          >
            Back to top
            <span className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center group-hover:border-violet-500/50 group-hover:text-violet-400 transition-all">
              <ArrowUp size={10} />
            </span>
          </button>
        </motion.div>
      </div>
    </footer>
  );
}