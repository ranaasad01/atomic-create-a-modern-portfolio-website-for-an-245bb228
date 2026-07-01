"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Code2 as Github, Briefcase as Linkedin, MessageCircle as Twitter, Mail, ExternalLink, Star, Sparkles, Activity, Terminal, FileCode, GitBranch, Check, Download, ChevronRight, Circle } from 'lucide-react';
import { BRAND, socialLinks } from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  scaleIn,
  slideInFromBottom,
} from "@/lib/motion";

// ─── Icon map ────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ReactNode> = {
  Github: <Github size={18} />,
  Linkedin: <Linkedin size={18} />,
  Twitter: <Twitter size={18} />,
  Mail: <Mail size={18} />,
};

// ─── Inline data ─────────────────────────────────────────────────────────────

const skills = [
  {
    category: "Machine Learning",
    icon: <Activity size={20} />,
    color: "from-violet-600 to-violet-400",
    glow: "rgba(124,58,237,0.3)",
    items: ["PyTorch", "TensorFlow", "Scikit-learn", "XGBoost", "JAX", "Hugging Face"],
  },
  {
    category: "Deep Learning",
    icon: <Sparkles size={20} />,
    color: "from-cyan-500 to-cyan-400",
    glow: "rgba(6,182,212,0.3)",
    items: ["Transformers", "CNNs", "Diffusion Models", "RL / PPO", "GNNs", "RLHF"],
  },
  {
    category: "MLOps & Infra",
    icon: <Terminal size={20} />,
    color: "from-emerald-500 to-emerald-400",
    glow: "rgba(16,185,129,0.3)",
    items: ["Kubernetes", "Ray", "MLflow", "Weights & Biases", "Docker", "Triton"],
  },
  {
    category: "Languages & Tools",
    icon: <FileCode size={20} />,
    color: "from-amber-500 to-amber-400",
    glow: "rgba(245,158,11,0.3)",
    items: ["Python", "CUDA", "Rust", "SQL", "TypeScript", "Bash"],
  },
  {
    category: "Data & Pipelines",
    icon: <GitBranch size={20} />,
    color: "from-pink-500 to-pink-400",
    glow: "rgba(236,72,153,0.3)",
    items: ["Spark", "Airflow", "dbt", "Kafka", "Snowflake", "DuckDB"],
  },
  {
    category: "Cloud & Deployment",
    icon: <Circle size={20} />,
    color: "from-blue-500 to-blue-400",
    glow: "rgba(59,130,246,0.3)",
    items: ["AWS SageMaker", "GCP Vertex AI", "Azure ML", "Lambda", "FastAPI", "vLLM"],
  },
];

const projects = [
  {
    title: "NeuralSearch",
    subtitle: "Semantic retrieval at billion-scale",
    description:
      "A production-grade dense retrieval system combining bi-encoder fine-tuning with HNSW indexing. Serves 40M+ daily queries at sub-20ms p99 latency across a 1.2B document corpus.",
    tags: ["PyTorch", "FAISS", "Triton", "Kubernetes"],
    metrics: [
      { label: "Daily queries", value: "40M+" },
      { label: "p99 latency", value: "18ms" },
      { label: "MRR@10 gain", value: "+31%" },
    ],
    accent: "violet",
    accentHex: "#7c3aed",
    github: "https://github.com/aidenpark/neuralsearch",
    demo: "#",
    featured: true,
    image: "https://preview.redd.it/google-still-leads-search-over-chatgpt-by-12-7-billion-v0-8fx0x79ow3af1.jpg?width=600&format=pjpg&auto=webp&s=9cbd8ebc2196480068994570ffa76a903ae6e584",
  },
  {
    title: "DriftGuard",
    subtitle: "Real-time model monitoring",
    description:
      "An open-source framework for detecting data and concept drift in deployed ML models. Integrates with any prediction pipeline via a lightweight SDK and surfaces alerts through a Grafana dashboard.",
    tags: ["Python", "Kafka", "Prometheus", "Grafana"],
    metrics: [
      { label: "GitHub stars", value: "2.4k" },
      { label: "Drift detection", value: "99.1%" },
      { label: "Overhead", value: "<2ms" },
    ],
    accent: "cyan",
    accentHex: "#06b6d4",
    github: "https://github.com/aidenpark/driftguard",
    demo: "#",
    featured: true,
    image: "https://avatars.githubusercontent.com/u/61242156?s=200&v=4",
  },
  {
    title: "FineTuneKit",
    subtitle: "LLM fine-tuning toolkit",
    description:
      "A batteries-included toolkit for instruction-tuning and RLHF on open-weight LLMs. Supports LoRA, QLoRA, and full fine-tuning with automatic mixed precision and gradient checkpointing.",
    tags: ["Hugging Face", "PEFT", "DeepSpeed", "RLHF"],
    metrics: [
      { label: "Models supported", value: "12+" },
      { label: "GPU memory saved", value: "68%" },
      { label: "Downloads/mo", value: "18k" },
    ],
    accent: "emerald",
    accentHex: "#10b981",
    github: "https://github.com/aidenpark/finetunekit",
    demo: "#",
    featured: false,
    image: "https://picsum.photos/seed/ecc497bc7f72/800/600",
  },
  {
    title: "VisionPipe",
    subtitle: "End-to-end CV pipeline",
    description:
      "A modular computer vision pipeline for training, evaluating, and deploying detection and segmentation models. Includes auto-labeling with SAM and active learning loop integration.",
    tags: ["PyTorch", "SAM", "ONNX", "FastAPI"],
    metrics: [
      { label: "mAP improvement", value: "+22%" },
      { label: "Label cost cut", value: "75%" },
      { label: "Inference FPS", value: "120" },
    ],
    accent: "amber",
    accentHex: "#f59e0b",
    github: "https://github.com/aidenpark/visionpipe",
    demo: "#",
    featured: false,
    image: "https://carnegienetworks.zendesk.com/hc/en-us/article_attachments/115002124627/Screen_Shot_2017-01-11_at_12.33.10_PM.png",
  },
];

const experiences = [
  {
    role: "Senior ML Engineer",
    company: "Anthropic",
    period: "2023 — Present",
    location: "San Francisco, CA",
    description:
      "Leading RLHF infrastructure for Claude model family. Designed scalable reward modeling pipelines processing 2M+ human preference pairs per week. Reduced training iteration time by 40% through distributed training optimizations.",
    highlights: [
      "Built preference data flywheel serving 200+ annotators",
      "Shipped Constitutional AI evaluation harness",
      "Reduced GPU cost per RLHF run by 35% via gradient checkpointing",
    ],
    accent: "#7c3aed",
  },
  {
    role: "ML Engineer II",
    company: "Scale AI",
    period: "2021 — 2023",
    location: "San Francisco, CA",
    description:
      "Developed active learning and data quality systems for large-scale annotation pipelines. Built model-assisted labeling tools that cut annotation cost by 60% across vision and NLP tasks.",
    highlights: [
      "Launched auto-QA system with 97.3% agreement with human reviewers",
      "Designed embedding-based deduplication saving $2M/yr in annotation spend",
      "Mentored 4 junior engineers; led ML platform working group",
    ],
    accent: "#06b6d4",
  },
  {
    role: "Research Engineer",
    company: "Stanford HAI",
    period: "2019 — 2021",
    location: "Stanford, CA",
    description:
      "Conducted research on robustness and fairness in NLP models. Co-authored 3 papers on distribution shift and adversarial evaluation. Maintained open-source evaluation benchmarks used by 50+ research groups.",
    highlights: [
      "Published at NeurIPS 2020 and ACL 2021",
      "Built HELM evaluation suite (now widely adopted)",
      "Awarded Stanford Graduate Fellowship",
    ],
    accent: "#10b981",
  },
];

const publications = [
  {
    title: "Scaling Reward Models for RLHF: Lessons from Production",
    venue: "NeurIPS 2023",
    authors: "A. Park, J. Chen, S. Reddy",
    tags: ["RLHF", "LLMs", "Scalability"],
    link: "#",
  },
  {
    title: "Distribution Shift in the Wild: A Large-Scale Empirical Study",
    venue: "NeurIPS 2020",
    authors: "A. Park, P. Liang, T. Hashimoto",
    tags: ["Robustness", "Evaluation", "NLP"],
    link: "#",
  },
  {
    title: "Adversarial Evaluation Beyond Accuracy: Calibration and Coverage",
    venue: "ACL 2021",
    authors: "A. Park, R. Bommasani, P. Liang",
    tags: ["Adversarial", "Calibration", "Benchmarks"],
    link: "#",
  },
];

const testimonials = [
  {
    quote:
      "Aiden's work on our reward modeling infrastructure was transformative. He brought both deep research intuition and production-grade engineering discipline to every problem.",
    name: "Asad",
    title: "Research Lead, Anthropic",
    avatar: "https://i.ytimg.com/vi/_V6s5WWmM90/maxresdefault.jpg",
  },
  {
    quote:
      "One of the sharpest ML engineers I've worked with. Aiden shipped our active learning system in half the expected time and it's still running flawlessly two years later.",
    name: "Marcus Webb",
    title: "VP Engineering, Scale AI",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/JMarcus_Webb.JPG/960px-JMarcus_Webb.JPG",
  },
  {
    quote:
      "Aiden has a rare ability to translate cutting-edge research into real systems. His contributions to HELM shaped how the field evaluates language models.",
    name: "Prof. Percy Liang",
    title: "Director, Stanford HAI",
    avatar: "https://hai.stanford.edu/_next/image?url=https%3A%2F%2Fhai.stanford.edu%2Fassets%2Fimages%2Favatars%2Fpercy--4%20(1).png&w=3840&q=100",
  },
];

// ─── Accent color helpers ─────────────────────────────────────────────────────
const accentClasses: Record<string, { border: string; text: string; bg: string; badge: string }> = {
  violet: {
    border: "border-violet-500/30",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    badge: "bg-violet-500/15 text-violet-300",
  },
  cyan: {
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    badge: "bg-cyan-500/15 text-cyan-300",
  },
  emerald: {
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  amber: {
    border: "border-amber-500/30",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    badge: "bg-amber-500/15 text-amber-300",
  },
};

// ─── Contact form state type ──────────────────────────────────────────────────
type FormState = {
  name: string;
  email: string;
  message: string;
};

// ─── Page component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSent(true);
  }

  const motionProps = shouldReduceMotion
    ? {}
    : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" } };

  return (
    <main className="bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-16 pb-24 overflow-hidden"
      >
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Status badge */}
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Open to senior ML roles
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeInUp} className="space-y-3">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] font-[family-name:var(--font-space-grotesk)]">
                  <span className="text-white">AI/ML</span>
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                    Engineer
                  </span>
                  <br />
                  <span className="text-white/80 text-4xl lg:text-5xl xl:text-6xl" style={{ color: "#ef4444" }}>
                    &amp; Researcher
                  </span>
                </h1>
              </motion.div>

              {/* Subtext */}
              <motion.p
                variants={fadeInUp}
                className="text-lg text-white/55 leading-relaxed max-w-[480px] text-pretty"
              >
                I build intelligent systems that bridge the gap between research and production.
                From RLHF pipelines to billion-scale retrieval, I ship ML that actually works.
              </motion.p>

              {/* Stats row */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-6 pt-2"
              >
                {[
                  { value: "5+", label: "Years in ML" },
                  { value: "3", label: "NeurIPS / ACL papers" },
                  { value: "40M+", label: "Daily queries served" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-0.5">
                    <div className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/40">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-violet-400 transition-all duration-300 shadow-[0_0_24px_rgba(124,58,237,0.4)] hover:shadow-[0_0_32px_rgba(124,58,237,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  View Projects
                  <ArrowRight size={16} />
                </a>
                <a
                  href={BRAND.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 font-semibold text-sm hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <Download size={16} />
                  Resume
                </a>
              </motion.div>

              {/* Social links */}
              <motion.div variants={fadeInUp} className="flex items-center gap-3 pt-1">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-200"
                  >
                    {iconMap[s.icon] ?? <Mail size={18} />}
                  </a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: terminal card */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 blur-2xl" />
                <div className="relative rounded-2xl border border-white/[0.08] bg-[#111118] shadow-[0_8px_64px_rgba(0,0,0,0.6)] overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                    <span className="w-3 h-3 rounded-full bg-red-500/70" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    <span className="ml-3 text-xs text-white/30 font-mono">aiden@ml-workstation</span>
                  </div>
                  {/* Terminal body */}
                  <div className="p-6 font-mono text-sm space-y-3">
                    {[
                      { prompt: "~", cmd: "python train.py --model llama-70b", color: "text-violet-400" },
                      { prompt: null, cmd: "Loading checkpoint... ✓", color: "text-white/40" },
                      { prompt: null, cmd: "Epoch 1/3 | loss: 0.842 | acc: 0.71", color: "text-white/40" },
                      { prompt: null, cmd: "Epoch 2/3 | loss: 0.531 | acc: 0.83", color: "text-white/40" },
                      { prompt: null, cmd: "Epoch 3/3 | loss: 0.318 | acc: 0.91 ✓", color: "text-emerald-400" },
                      { prompt: "~", cmd: "python eval.py --benchmark MMLU", color: "text-violet-400" },
                      { prompt: null, cmd: "MMLU score: 78.4  (+6.2 vs base)", color: "text-cyan-400" },
                      { prompt: "~", cmd: "deploy --target prod --replicas 8", color: "text-violet-400" },
                      { prompt: null, cmd: "Deployment successful. Serving traffic.", color: "text-emerald-400" },
                    ].map((line, i) => (
                      <div key={i} className="flex gap-2">
                        {line.prompt && (
                          <span className="text-violet-500 select-none">$</span>
                        )}
                        {!line.prompt && (
                          <span className="text-white/20 select-none w-3 shrink-0" />
                        )}
                        <span className={line.color}>{line.cmd}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 items-center">
                      <span className="text-violet-500 select-none">$</span>
                      <span className="w-2 h-4 bg-violet-400 animate-pulse rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-xs text-white/25 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
            {/* Image side */}
            <motion.div
              variants={fadeInLeft}
              {...motionProps}
              className="relative"
            >
              <div className="relative aspect-[4/5] max-w-sm mx-auto lg:mx-0">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 blur-xl" />
                <img
                  src="https://media.licdn.com/dms/image/v2/D5603AQGuIaBBElYOaQ/profile-displayphoto-scale_200_200/B56ZplhXxZG0AY-/0/1762639841192?e=2147483647&v=beta&t=Qf4pjdYs-IyHr__zN0HRtLqb0_vycPOnpqV2kXBfnTY"
                  alt="Aiden Park, AI/ML Engineer"
                  className="relative w-full h-full object-cover rounded-2xl border border-white/[0.08] shadow-[0_8px_48px_rgba(0,0,0,0.5)]"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-[#111118] border border-white/[0.08] rounded-xl px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                  <div className="text-xs text-white/40 mb-0.5">Current role</div>
                  <div className="text-sm font-semibold text-white">Anthropic</div>
                  <div className="text-xs text-violet-400">Senior ML Engineer</div>
                </div>
              </div>
            </motion.div>

            {/* Copy side */}
            <motion.div
              variants={staggerContainer}
              {...motionProps}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp}>
                <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                  About me
                </span>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl lg:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] text-balance"
              >
                Research instincts,{" "}
                <span className="text-white/50">production discipline.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-white/55 leading-relaxed text-pretty">
                I&apos;m an AI/ML engineer with 5+ years building systems at the frontier of language
                models and large-scale machine learning. My work spans RLHF infrastructure at
                Anthropic, active learning pipelines at Scale AI, and NLP robustness research at
                Stanford HAI.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-white/55 leading-relaxed text-pretty">
                I care deeply about the gap between a model that works in a notebook and one that
                serves millions of users reliably. That means thinking hard about data quality,
                evaluation rigor, and the operational complexity of keeping models healthy in
                production.
              </motion.p>
              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { label: "Education", value: "M.S. CS, Stanford" },
                  { label: "Specialization", value: "LLMs & RLHF" },
                  { label: "Location", value: BRAND.location },
                  { label: "Status", value: "Open to work" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                  >
                    <div className="text-xs text-white/35 mb-1">{item.label}</div>
                    <div className="text-sm font-medium text-white/80">{item.value}</div>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeInUp} className="pt-2">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors group"
                >
                  Get in touch
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────────────────── */}
      <section id="skills" className="relative py-28 md:py-36 bg-white/[0.015]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            {...motionProps}
            className="text-center mb-16 space-y-4"
          >
            <motion.span variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Technical skills
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]"
            >
              The full stack of ML
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/50 max-w-xl mx-auto text-pretty">
              From research prototypes to distributed training clusters, I work across the entire
              ML lifecycle.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            {...motionProps}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {skills.map((skill) => (
              <motion.div
                key={skill.category}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-white/[0.06] bg-[#111118] p-6 hover:border-white/[0.12] transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center text-white`}
                    style={{ boxShadow: `0 0 16px ${skill.glow}` }}
                  >
                    {skill.icon}
                  </div>
                  <h3 className="font-semibold text-white/90 font-[family-name:var(--font-space-grotesk)]">
                    {skill.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 group-hover:text-white/70 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────────────────── */}
      <section id="projects" className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            {...motionProps}
            className="mb-16 space-y-4"
          >
            <motion.span variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Projects
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]"
            >
              Things I&apos;ve built
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/50 max-w-xl text-pretty">
              A selection of open-source tools and production systems. Each one started as a real
              problem I needed to solve.
            </motion.p>
          </motion.div>

          {/* Featured projects — large cards */}
          <div className="space-y-8 mb-8">
            {projects
              .filter((p) => p.featured)
              .map((project, i) => {
                const ac = accentClasses[project.accent] ?? accentClasses.violet;
                return (
                  <motion.div
                    key={project.title}
                    variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                    {...motionProps}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className={`group rounded-2xl border ${ac.border} bg-[#111118] overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_48px_rgba(0,0,0,0.5)] transition-all duration-300`}
                  >
                    <div className={`grid lg:grid-cols-[1.4fr_1fr] ${i % 2 === 1 ? "lg:grid-cols-[1fr_1.4fr]" : ""}`}>
                      {/* Content */}
                      <div className={`p-8 lg:p-10 space-y-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className={`text-xs font-semibold uppercase tracking-widest ${ac.text} mb-2`}>
                              {project.subtitle}
                            </div>
                            <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                              {project.title}
                            </h3>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub"
                              className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
                            >
                              <Github size={15} />
                            </a>
                            <a
                              href={project.demo}
                              aria-label="Demo"
                              className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
                            >
                              <ExternalLink size={15} />
                            </a>
                          </div>
                        </div>
                        <p className="text-white/55 leading-relaxed text-sm text-pretty">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span key={tag} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${ac.badge}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          {project.metrics.map((m) => (
                            <div key={m.label} className={`rounded-xl ${ac.bg} border ${ac.border} px-3 py-2.5 text-center`}>
                              <div className={`text-lg font-bold ${ac.text} font-[family-name:var(--font-space-grotesk)]`}>
                                {m.value}
                              </div>
                              <div className="text-[10px] text-white/40 mt-0.5">{m.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Image */}
                      <div className={`relative min-h-[220px] lg:min-h-0 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                        <img
                          src={project.image}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-500"
                        />
                        <div
                          className={`absolute inset-0 ${i % 2 === 0 ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-[#111118] via-[#111118]/20 to-transparent`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* Non-featured projects — smaller grid */}
          <motion.div
            variants={staggerContainer}
            {...motionProps}
            className="grid sm:grid-cols-2 gap-5"
          >
            {projects
              .filter((p) => !p.featured)
              .map((project) => {
                const ac = accentClasses[project.accent] ?? accentClasses.violet;
                return (
                  <motion.div
                    key={project.title}
                    variants={scaleIn}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`group rounded-2xl border ${ac.border} bg-[#111118] p-7 space-y-4 shadow-[0_2px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_32px_rgba(0,0,0,0.4)] transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className={`text-xs font-semibold uppercase tracking-widest ${ac.text} mb-1.5`}>
                          {project.subtitle}
                        </div>
                        <h3 className="text-xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                          {project.title}
                        </h3>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white transition-all"
                        >
                          <Github size={15} />
                        </a>
                        <a
                          href={project.demo}
                          aria-label="Demo"
                          className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white transition-all"
                        >
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed text-pretty">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${ac.badge}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="text-center">
                          <div className={`text-base font-bold ${ac.text} font-[family-name:var(--font-space-grotesk)]`}>
                            {m.value}
                          </div>
                          <div className="text-[10px] text-white/35">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>
        </div>
      </section>

      {/* ── EXPERIENCE ───────────────────────────────────────────────────── */}
      <section id="experience" className="relative py-28 md:py-36 bg-white/[0.015]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
            {/* Left sticky label */}
            <motion.div
              variants={fadeInLeft}
              {...motionProps}
              className="lg:sticky lg:top-24 lg:self-start space-y-4"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                Experience
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Where I&apos;ve worked
              </h2>
              <p className="text-white/50 leading-relaxed text-pretty">
                Five years across frontier AI labs, data infrastructure companies, and academic
                research groups.
              </p>
              {/* Publications teaser */}
              <div className="mt-8 rounded-2xl border border-white/[0.06] bg-[#111118] p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white/80">Selected Publications</h3>
                {publications.map((pub) => (
                  <a
                    key={pub.title}
                    href={pub.link}
                    className="block group space-y-1 hover:opacity-80 transition-opacity"
                  >
                    <div className="text-xs font-medium text-white/70 leading-snug group-hover:text-white transition-colors">
                      {pub.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-violet-400 font-semibold">{pub.venue}</span>
                      <span className="text-[10px] text-white/30">{pub.authors}</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              variants={staggerContainer}
              {...motionProps}
              className="relative space-y-6"
            >
              {/* Vertical line */}
              <div className="absolute left-0 top-3 bottom-3 w-px bg-gradient-to-b from-violet-500/40 via-white/[0.06] to-transparent hidden lg:block" />

              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  variants={fadeInUp}
                  className="relative lg:pl-8 group"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[-4.5px] top-5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a0f] hidden lg:block transition-all duration-300 group-hover:scale-150"
                    style={{ backgroundColor: exp.accent }}
                  />

                  <div className="rounded-2xl border border-white/[0.06] bg-[#111118] p-7 space-y-4 hover:border-white/[0.12] transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold" style={{ color: exp.accent }}>
                            {exp.company}
                          </span>
                          <span className="text-white/20">·</span>
                          <span className="text-xs text-white/40">{exp.location}</span>
                        </div>
                      </div>
                      <span className="text-xs text-white/35 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full shrink-0">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed text-pretty">
                      {exp.description}
                    </p>
                    <ul className="space-y-2">
                      {exp.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm text-white/60">
                          <Check size={14} className="mt-0.5 shrink-0" style={{ color: exp.accent }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-violet-600/5 blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            {...motionProps}
            className="text-center mb-16 space-y-4"
          >
            <motion.span variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Testimonials
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]"
            >
              What colleagues say
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            {...motionProps}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`rounded-2xl border border-white/[0.06] bg-[#111118] p-7 space-y-5 shadow-[0_2px_16px_rgba(0,0,0,0.3)] hover:border-white/[0.12] transition-all duration-300 ${i === 1 ? "md:mt-8" : ""}`}
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/65 text-sm leading-relaxed text-pretty italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/[0.08]"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-white/40">{t.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="relative py-28 md:py-36 bg-white/[0.015]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <motion.div
              variants={staggerContainer}
              {...motionProps}
              className="space-y-6"
            >
              <motion.span variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                Contact
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl lg:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] text-balance"
              >
                Let&apos;s build something{" "}
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  remarkable
                </span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-white/55 leading-relaxed text-pretty">
                Whether you&apos;re looking for a senior ML engineer, want to collaborate on research,
                or just want to talk about language models, I&apos;d love to hear from you.
              </motion.p>

              <motion.div variants={fadeInUp} className="space-y-3 pt-2">
                {[
                  { icon: <Mail size={16} />, label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
                  { icon: <Github size={16} />, label: "GitHub", value: "github.com/aidenpark", href: "https://github.com/aidenpark" },
                  { icon: <Linkedin size={16} />, label: "LinkedIn", value: "linkedin.com/in/aidenpark", href: "https://linkedin.com/in/aidenpark" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-[#111118] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs text-white/35">{item.label}</div>
                      <div className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                        {item.value}
                      </div>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: form */}
            <motion.div variants={fadeInRight} {...motionProps}>
              <div className="rounded-2xl border border-white/[0.06] bg-[#111118] p-8 shadow-[0_4px_32px_rgba(0,0,0,0.4)]">
                {formSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <Check size={24} className="text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                      Message sent
                    </h3>
                    <p className="text-white/50 text-sm">
                      Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <h3 className="text-lg font-bold text-white font-[family-name:var(--font-space-grotesk)] mb-6">
                      Send a message
                    </h3>
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-medium text-white/40 uppercase tracking-wider">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={handleFormChange}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-medium text-white/40 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={handleFormChange}
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-medium text-white/40 uppercase tracking-wider">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formState.message}
                        onChange={handleFormChange}
                        placeholder="Tell me about your project or opportunity..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all duration-200 resize-none"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-violet-400 transition-all duration-300 shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:shadow-[0_0_32px_rgba(124,58,237,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 flex items-center justify-center gap-2"
                    >
                      Send Message
                      <ArrowRight size={16} />
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}