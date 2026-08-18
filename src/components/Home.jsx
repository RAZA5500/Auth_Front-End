import { useEffect, useRef } from "react";
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
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Authentication",
    description:
      "JWT access tokens, refresh tokens, and bcrypt password hashing keep your data safe.",
    color: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built with React and Express for a snappy, responsive experience on any device.",
    color: "from-cyan-500/20 to-blue-500/10",
  },
  {
    icon: Lock,
    title: "Protected Dashboard",
    description:
      "Manage your profile, update settings, and control your account from one place.",
    color: "from-pink-500/20 to-rose-500/10",
  },
];

const stats = [
  { value: "10m", label: "Token Expiry" },
  { value: "10d", label: "Refresh Window" },
  { value: "256-bit", label: "Encryption" },
];

const Home = () => {
  const heroRef = useRef(null);

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

      <section ref={heroRef} className="hero-section">
        <div className="hero-badge animate-fade-down">
          <Sparkles size={14} className="animate-float-slow" />
          <span>Secure Full-Stack Auth Platform</span>
        </div>

        <h1 className="hero-title animate-fade-up">
          Welcome to{" "}
          <span className="text-gradient animate-text-glow">AuthFlow</span>
        </h1>

        <p
          className="hero-subtitle animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          A stunning authentication platform with refresh tokens, protected
          dashboard, and a modern animated UI — built to impress.
        </p>

        <div
          className="hero-actions animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link to="/signup" className="btn-primary group">
            Get Started Free
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
          <Link to="/login" className="btn-outline">
            Sign In
          </Link>
        </div>

        <div
          className="hero-stats animate-fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <div className="hero-stat-value">{stat.value}</div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="scroll-indicator animate-bounce-slow">
          <ChevronDown size={26} />
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title scroll-reveal">
          Why choose <span className="text-gradient">AuthFlow</span>?
        </h2>
        <p className="section-subtitle scroll-reveal">
          Everything you need for a complete, production-ready auth experience
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card scroll-reveal"
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              <div className="feature-icon">
                <feature.icon size={28} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section" style={{ paddingTop: 0 }}>
        <div className="features-grid">
          {[
            { icon: Users, title: "User Profiles", desc: "Rich profile management with avatar, bio & more" },
            { icon: KeyRound, title: "Token Refresh", desc: "Automatic silent refresh keeps users logged in" },
            { icon: Globe, title: "Deploy Ready", desc: "Works on Vercel with cold-start recovery built in" },
          ].map((item, index) => (
            <div
              key={item.title}
              className="feature-card scroll-reveal"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">
                <item.icon size={26} />
              </div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-description">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section scroll-reveal">
        <div className="cta-card">
          <h2 className="cta-title">Ready to get started?</h2>
          <p className="cta-text">
            Create your account in seconds and access your personal dashboard.
          </p>
          <Link to="/signup" className="btn-primary group">
            Create Free Account
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 AuthFlow. Built with React &amp; Express.</p>
      </footer>
    </div>
  );
};

export default Home;
