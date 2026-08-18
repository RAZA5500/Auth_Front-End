import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Users,
  KeyRound,
  Globe,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Fingerprint,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Quantum-Grade Auth",
    description:
      "Dual-token architecture with short-lived JWT access tokens and secure refresh token rotation for bank-level security.",
    color: "from-indigo-500/20 to-purple-500/10",
  },
  {
    icon: Zap,
    title: "Instant Seamless Speeds",
    description:
      "Engineered with React 19 and Express for sub-50ms token validation and flawless responsive interactions.",
    color: "from-cyan-500/20 to-blue-500/10",
  },
  {
    icon: Fingerprint,
    title: "Bcrypt Hash Protection",
    description:
      "Multi-round salted password encryption ensures user credentials can never be reverse-engineered or leaked.",
    color: "from-rose-500/20 to-pink-500/10",
  },
  {
    icon: RefreshCw,
    title: "Silent Token Refresh",
    description:
      "Proactive background token renewal prevents unexpected logouts without interrupting active user workflows.",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Users,
    title: "Dynamic Profile Engine",
    description:
      "Full profile customizer with avatar image uploads, real-time age computation, bio editing, and instant sync.",
    color: "from-purple-500/20 to-indigo-500/10",
  },
  {
    icon: Globe,
    title: "Edge & Serverless Ready",
    description:
      "Optimized for global edge deployment on Vercel with built-in cold-start auto-wake and resilience handlers.",
    color: "from-amber-500/20 to-orange-500/10",
  },
];

const stats = [
  { value: "10m", label: "Access Token TTL" },
  { value: "10d", label: "Refresh Window" },
  { value: "256-bit", label: "AES Encryption" },
  { value: "99.9%", label: "Auth Reliability" },
];

const Home = () => {
  const heroRef = useRef(null);
  const [activeTabDemo, setActiveTabDemo] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Animated Cosmic Background */}
      <div className="landing-bg page-bg">
        <div className="grid-overlay" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
        <div className="particles">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="particle" />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-badge animate-fade-down">
          <Sparkles size={16} className="animate-float-slow text-cyan-400" />
          <span>⚡ Next-Generation Full-Stack Authentication</span>
        </div>

        <h1 className="hero-title animate-fade-up">
          Authentication Reimagined in{" "}
          <span className="text-gradient animate-text-glow">Pure Elegance</span>
        </h1>

        <p
          className="hero-subtitle animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          Secure your application with state-of-the-art JWT rotation, encrypted sessions, 
          real-time profile management, and a jaw-dropping modern glassmorphic interface.
        </p>

        <div
          className="hero-actions animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link to="/signup" className="btn-primary group">
            <span>Get Started Free</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
          <Link to="/login" className="btn-outline">
            <Lock size={16} className="text-indigo-400" />
            <span>Sign In to Dashboard</span>
          </Link>
        </div>

        {/* Live Interactive Security Architecture Preview */}
        <div 
          className="mt-16 w-full max-w-4xl rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-2xl shadow-2xl animate-fade-up scroll-reveal"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-zinc-400">authflow-v2.0 // architecture.live</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="grid gap-4 pt-4 sm:grid-cols-3 text-left">
            <div 
              onClick={() => setActiveTabDemo(0)}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                activeTabDemo === 0 
                  ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                  : "border-white/5 bg-slate-950/40 hover:border-white/15"
              }`}
            >
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Shield size={14} /> Dual Token Engine
              </div>
              <div className="text-white text-sm font-semibold">10-Min Rotating JWT</div>
              <div className="text-xs text-zinc-400 mt-1">Automatic silent renewal in background</div>
            </div>

            <div 
              onClick={() => setActiveTabDemo(1)}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                activeTabDemo === 1 
                  ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                  : "border-white/5 bg-slate-950/40 hover:border-white/15"
              }`}
            >
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                <KeyRound size={14} /> Password Security
              </div>
              <div className="text-white text-sm font-semibold">Bcrypt 10-Salt Cryptography</div>
              <div className="text-xs text-zinc-400 mt-1">Protected against rainbow table attacks</div>
            </div>

            <div 
              onClick={() => setActiveTabDemo(2)}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                activeTabDemo === 2 
                  ? "border-rose-500/50 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.2)]" 
                  : "border-white/5 bg-slate-950/40 hover:border-white/15"
              }`}
            >
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Cpu size={14} /> Serverless Edge
              </div>
              <div className="text-white text-sm font-semibold">Cold Start Wake Hook</div>
              <div className="text-xs text-zinc-400 mt-1">Immediate warm-up on page load</div>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div
          className="hero-stats animate-fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <div className="hero-stat-value">{stat.value}</div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="scroll-indicator animate-bounce-slow">
          <ChevronDown size={28} />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="text-center mb-4">
          <span className="section-tag scroll-reveal">Enterprise Security</span>
        </div>
        <h2 className="section-title scroll-reveal">
          Engineered for <span className="text-gradient">Maximum Security &amp; Speed</span>
        </h2>
        <p className="section-subtitle scroll-reveal">
          AuthFlow delivers everything required for a production-grade authentication 
          experience with delightful micro-interactions and bulletproof reliability.
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card scroll-reveal"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">
                <feature.icon size={26} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Architecture Highlights */}
      <section className="features-section" style={{ paddingTop: 0 }}>
        <div className="panel border-white/10 bg-slate-900/60 p-8 scroll-reveal">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <span className="section-tag mb-3">Next-Gen Tech Stack</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Built with Modern Industry Standards
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                From frontend state management to backend cryptographic hashing, every layer of 
                AuthFlow adheres to the highest OWASP authentication security practices.
              </p>
              
              <div className="space-y-3">
                {[
                  "Stateless JWT Access Tokens stored in memory & local storage",
                  "Silent background token refreshing without session drops",
                  "MongoDB secure projection ensuring passwords are never returned in queries",
                  "Responsive mobile-first dashboard with instant photo uploads",
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-zinc-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Frontend</div>
                <div className="text-lg font-bold text-white">React 19 + Vite</div>
                <div className="text-xs text-zinc-500 mt-1">Blazing fast HMR and sub-second builds</div>
              </div>
              <div className="stat-card">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">Backend</div>
                <div className="text-lg font-bold text-white">Express &amp; Node</div>
                <div className="text-xs text-zinc-500 mt-1">Clean controller-based REST API</div>
              </div>
              <div className="stat-card">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">Database</div>
                <div className="text-lg font-bold text-white">MongoDB Atlas</div>
                <div className="text-xs text-zinc-500 mt-1">High-availability cloud document store</div>
              </div>
              <div className="stat-card">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Deployment</div>
                <div className="text-lg font-bold text-white">Vercel Ready</div>
                <div className="text-xs text-zinc-500 mt-1">Automated CI/CD serverless pipelines</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section scroll-reveal">
        <div className="cta-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} className="text-amber-400" /> Start in seconds
          </div>
          <h2 className="cta-title">Ready to Experience AuthFlow?</h2>
          <p className="cta-text">
            Join thousands of developers building secure modern applications with 
            flawless authentication and user management.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary group">
              <span>Create Free Account</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </Link>
            <Link to="/login" className="btn-outline">
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-indigo-400" />
            <span className="font-bold text-white">AuthFlow</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 text-xs">&copy; 2026 AuthFlow Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <span className="hover:text-white transition-colors cursor-pointer">Security Protocol</span>
            <span className="hover:text-white transition-colors cursor-pointer">API Docs</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
