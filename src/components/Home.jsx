import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Authentication",
    description:
      "Industry-standard JWT tokens and bcrypt password hashing keep your data safe.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built with React and Express for a snappy, responsive experience on any device.",
  },
  {
    icon: Lock,
    title: "Protected Dashboard",
    description:
      "Manage your profile, update settings, and control your account from one place.",
  },
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
      { threshold: 0.15 },
    );

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Animated background */}
      <div className="landing-bg">
        <div className="grid-overlay" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-badge animate-fade-down">
          <Sparkles size={14} />
          <span>Secure Full-Stack Auth</span>
        </div>

        <h1 className="hero-title animate-fade-up">
          Welcome to{" "}
          <span className="text-gradient">AuthFlow</span>
        </h1>

        <p className="hero-subtitle animate-fade-up" style={{ animationDelay: "0.15s" }}>
          A modern authentication platform with a sleek dashboard.
          Sign up, log in, and take control of your account — all in one place.
        </p>

        <div
          className="hero-actions animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link to="/signup" className="btn-primary group">
            Get Started
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link to="/login" className="btn-outline">
            Sign In
          </Link>
        </div>

        <div className="scroll-indicator animate-bounce-slow">
          <ChevronDown size={24} className="text-emerald-400/60" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title scroll-reveal">
          Why <span className="text-gradient">AuthFlow</span>?
        </h2>
        <p className="section-subtitle scroll-reveal">
          Everything you need for a complete authentication experience
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card scroll-reveal"
              style={{ transitionDelay: `${index * 0.1}s` }}
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

      {/* CTA Section */}
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
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 AuthFlow. Built with React &amp; Express.</p>
      </footer>
    </div>
  );
};

export default Home;
