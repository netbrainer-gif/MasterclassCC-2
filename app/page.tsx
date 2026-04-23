'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const [heroEmail, setHeroEmail] = useState('');
  const [heroFormStatus, setHeroFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [heroFormMessage, setHeroFormMessage] = useState('');

  useEffect(() => {
    // Sticky nav shadow
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
      if (navbar) {
        navbar.style.boxShadow = window.scrollY > 24 ? '0 4px 32px rgba(0,0,0,0.5)' : 'none';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Service card scroll-in
    const cards = document.querySelectorAll('.service-card');
    const cardIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt((entry.target as HTMLElement).dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          cardIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach((card, i) => {
      (card as HTMLElement).dataset.delay = String(i * 85);
      cardIO.observe(card);
    });

    // Pain item scroll-in
    const painItems = document.querySelectorAll('.pain-item');
    const painIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt((entry.target as HTMLElement).dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          painIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    painItems.forEach((item, i) => {
      (item as HTMLElement).dataset.delay = String(i * 130);
      painIO.observe(item);
    });

    // Animated stat counters
    const statEls = document.querySelectorAll<HTMLElement>('.stat-num[data-count]');
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.count || '0', 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1200;
          const start = performance.now();
          const update = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(progress * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
          statIO.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    statEls.forEach((el) => statIO.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cardIO.disconnect();
      painIO.disconnect();
      statIO.disconnect();
    };
  }, []);

  const handleHeroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!heroEmail || !re.test(heroEmail)) {
      setHeroFormMessage('Please enter a valid email address.');
      setHeroFormStatus('error');
      return;
    }
    setHeroFormStatus('submitting');
    setHeroFormMessage('');
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: heroEmail, source: 'hero' }),
    });
    const data = await res.json();
    if (res.ok) {
      setHeroFormMessage("You're in. Check your inbox for The Dental AI Roadmap.");
      setHeroFormStatus('success');
      setHeroEmail('');
    } else {
      setHeroFormMessage(data.error || 'Something went wrong. Please try again.');
      setHeroFormStatus('error');
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !re.test(email)) {
      setFormMessage('Please enter a valid email address.');
      setFormStatus('error');
      return;
    }
    setFormStatus('submitting');
    setFormMessage('');
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'cta' }),
    });
    const data = await res.json();
    if (res.ok) {
      setFormMessage("You're in. Check your inbox for The Dental AI Roadmap.");
      setFormStatus('success');
      setEmail('');
    } else {
      setFormMessage(data.error || 'Something went wrong. Please try again.');
      setFormStatus('error');
    }
  };

  const faqs = [
    {
      q: 'Is patient data safe with AI tools?',
      a: 'We only recommend tools that are HIPAA-compliant with signed Business Associate Agreements (BAAs). Every solution is vetted for dental-specific compliance requirements before we bring it to your practice. Patient data security is a prerequisite, not an afterthought.',
    },
    {
      q: 'Will my staff actually use this?',
      a: "That's the most important question — and the one most AI vendors ignore. Team training and change management are core parts of every implementation. We make sure your front desk, hygienists, and assistants are confident using it before we consider the job done.",
    },
    {
      q: 'Do I have to adopt all five systems at once?',
      a: "Absolutely not — we'd advise against it. Our entire approach is built around sequencing: starting with the one or two systems that will have the most impact on your practice, then building momentum from there. Overwhelm is the enemy we're here to solve, not recreate.",
    },
    {
      q: 'How is this different from buying software directly from a vendor?',
      a: "Software vendors sell you their product. We're on your side. We evaluate multiple vendors objectively, recommend only what fits your practice, and don't earn commissions. Our only incentive is your success. Think of us as your AI strategic advisor, not another salesperson.",
    },
  ];

  return (
    <>
      {/* NAV */}
      <nav id="navbar">
        <a href="#" className="logo" aria-label="Netbrainer AI — Home">
          <div className="logo-mark">
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 18 L4 4 L18 18 L18 4" stroke="rgba(28,30,26,0.92)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="logo-name">Netbrainer <span>AI</span></span>
        </a>
        <div className="nav-links">
          <a href="#services" className="nav-link">Services</a>
          <a href="#process" className="nav-link">How It Works</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <a href="#cta" className="btn-nav">Let&apos;s Talk</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
<div className="hero-glow-gold" aria-hidden="true" />
        <div className="hero-glow-sage" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-label">AI Strategy for Dental Practices</div>
            <h1 style={{ color: 'var(--charcoal)' }}>
              AI That <em>Actually</em><br />Works for Your<br /><span className="accent">Practice.</span>
            </h1>
            <p className="hero-sub">
              Most dental practices spend 6–8 hours a week on tasks AI handles in minutes. We show you exactly which ones, in the right order — and make sure your team actually uses them.
            </p>
            <div className="hero-actions">
              <form className="hero-email-form" onSubmit={handleHeroSubmit} noValidate>
                <input
                  type="email"
                  className="hero-email-input"
                  placeholder="your@practice.com"
                  autoComplete="email"
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  aria-label="Your email address"
                />
                <button type="submit" className="btn-primary" disabled={heroFormStatus === 'submitting'}>
                  {heroFormStatus === 'submitting' ? 'Sending…' : (
                    <>
                      Get the Free Roadmap
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </>
                  )}
                </button>
              </form>
              {heroFormMessage && (
                <div className={`form-msg ${heroFormStatus}`} role="status" aria-live="polite">
                  {heroFormMessage}
                </div>
              )}
              <a href="#services" className="btn-ghost">
                See what we build
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
            <p className="hero-trust">HIPAA-Conscious · Vendor-Neutral · Free 30-Min Strategy Call</p>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual">
            <div className="hero-quote-panel">
              <blockquote className="hero-quote">
                &ldquo;We cut documentation time in half in the first week. My hygienists actually thanked me.&rdquo;
              </blockquote>
              <div className="hero-quote-attr">
                <span className="hero-quote-name">Dr. Sarah Okonkwo</span>
                <span className="hero-quote-practice">Lakeview Family Dental · Chicago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section id="pain">
        <div className="pain-inner">
          <div className="pain-headline">
            Sound<br />familiar?
            <em>You&apos;re not alone.</em>
          </div>
          <div className="pain-list">
            <div className="pain-item">
              <div className="pain-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="pain-copy">
                <strong>You&apos;re being pitched 20 AI tools at once.</strong>
                <p>Every conference, every vendor, every colleague has a &quot;must-have&quot; solution. You&apos;re overwhelmed before you&apos;ve even started — and nothing actually changes.</p>
              </div>
            </div>
            <div className="pain-item">
              <div className="pain-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="pain-copy">
                <strong>Your team is resistant — and you don&apos;t blame them.</strong>
                <p>Asking your front desk and hygienists to adopt new technology mid-workflow feels like throwing fuel on a fire. Change without a plan creates chaos, not efficiency.</p>
              </div>
            </div>
            <div className="pain-item">
              <div className="pain-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                </svg>
              </div>
              <div className="pain-copy">
                <strong>You don&apos;t know where to start — so nothing gets started.</strong>
                <p>Without a clear roadmap, paralysis compounds. Meanwhile, practices down the street are quietly getting ahead. The window for easy adoption won&apos;t stay open forever.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="on-light">
        <div className="section-inner">
          <div className="services-header">
            <div>
              <div className="section-label">What We Build</div>
              <h2>Five AI systems.<br />One clear plan.</h2>
            </div>
            <p className="section-sub">We don&apos;t throw tools at you and leave. We figure out what fits your practice, implement in the right order, and make sure your team actually uses it.</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="card-visual cv-1">
                <span className="card-num" aria-hidden="true">01</span>
                <svg className="card-visual-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" /><path d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7-11-7-11-7z" />
                </svg>
              </div>
              <div className="card-body">
                <h3>Visual AI Diagnostics</h3>
                <p>Builds patient trust by turning AI findings into clear visuals that make diagnoses easier to understand and treatments easier to accept.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="card-visual cv-2">
                <span className="card-num" aria-hidden="true">02</span>
                <svg className="card-visual-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              </div>
              <div className="card-body">
                <h3>Dental Voice Documentation</h3>
                <p>Reduces documentation time using dental-native voice intelligence that records and converts conversations into structured, chart-ready notes.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="card-visual cv-3">
                <span className="card-num" aria-hidden="true">03</span>
                <svg className="card-visual-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <polyline points="9 15 11 17 15 13" />
                </svg>
              </div>
              <div className="card-body">
                <h3>Claims Submission Automation</h3>
                <p>Automates the most labor-intensive part of claims submissions — reducing manual errors, cutting staff time, and accelerating reimbursements.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="card-visual cv-4">
                <span className="card-num" aria-hidden="true">04</span>
                <svg className="card-visual-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div className="card-body">
                <h3>Real-Time Insurance Eligibility</h3>
                <p>Automates insurance eligibility with real-time verification directly from 95% of payers to get more claims paid, faster.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="card-visual cv-5">
                <span className="card-num" aria-hidden="true">05</span>
                <svg className="card-visual-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="8" y="2" width="8" height="4" rx="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="16" x2="13" y2="16" />
                </svg>
              </div>
              <div className="card-body">
                <h3>SOP Documentation System</h3>
                <p>Documents your standard operating procedures, both clinical and administrative, to make onboarding and training staff a no-brainer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process">
        <div className="section-inner">
          <div className="process-header">
            <div className="section-label">How We Work</div>
            <h2>No chaos. No overwhelm.<br />Just a clear path forward.</h2>
            <p className="section-sub">We assist practice owners in figuring out what&apos;s worth it, in what order, and how to bring their team along without the chaos.</p>
          </div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-num">01</div>
              <h3>Assess</h3>
              <p>We map your current workflows, pain points, and real opportunities — so AI investments land where they actually matter for your practice.</p>
            </div>
            <div className="process-step">
              <div className="step-num">02</div>
              <h3>Prioritize</h3>
              <p>We tell you what&apos;s worth it, in what order. A ranked roadmap built for your practice — not a buffet of options that leads nowhere.</p>
            </div>
            <div className="process-step">
              <div className="step-num">03</div>
              <h3>Implement</h3>
              <p>We bring your team along with hands-on training and change management so adoption actually sticks — not just launches and fades.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-num" data-count="95" data-suffix="%">95%</div>
            <div className="stat-label">of payers covered<br />for real-time eligibility</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" data-count="2" data-suffix="h+">2h+</div>
            <div className="stat-label">per day saved on<br />documentation per provider</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" data-count="5" data-suffix="">5</div>
            <div className="stat-label">AI systems, one<br />coordinated roadmap</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" data-count="30" data-suffix="">30</div>
            <div className="stat-label">minute free strategy<br />call to get started</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="cta-inner">
          <div className="section-label">Free Resource</div>
          <h2>Get The Dental AI Roadmap — Free</h2>
          <p className="section-sub">The 5 AI systems every independent practice should implement, in the right order — what to look for, what to avoid, and how to bring your team along.</p>
          <div className="cta-card">
            <form className="cta-form" onSubmit={handleSubmit} noValidate>
              <input
                type="email"
                className="cta-input"
                placeholder="your@practice.com"
                autoComplete="email"
                required
                aria-label="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={formStatus === 'submitting'}>
                {formStatus === 'submitting' ? 'Sending…' : (
                  <>
                    Send My Roadmap
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </>
                )}
              </button>
            </form>
            <p className="cta-fine">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              No spam. HIPAA-conscious. Unsubscribe anytime.
            </p>
            {formMessage && (
              <div className={`form-msg ${formStatus}`} role="status" aria-live="polite">
                {formMessage}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="faq-inner">
          <div className="faq-header">
            <div className="section-label">FAQ</div>
            <h2>Common questions</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
              <button
                className="faq-q"
                aria-expanded={openFaq === i}
                onClick={() => toggleFaq(i)}
              >
                {faq.q}
                <span className="faq-icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
              <div
                className="faq-a"
                role="region"
                style={{ maxHeight: openFaq === i ? '400px' : '0' }}
              >
                <div className="faq-a-inner">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-left">
          <a href="#" className="logo" aria-label="Netbrainer AI — Home">
            <div className="logo-mark" style={{ width: 30, height: 30, borderRadius: 8 }}>
              <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                <path d="M4 18 L4 4 L18 18 L18 4" stroke="rgba(28,30,26,0.9)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="logo-name" style={{ fontSize: 15 }}>Netbrainer <span>AI</span></span>
          </a>
          <span className="footer-tagline">Making AI a no-brainer for your practice.</span>
        </div>
        <div className="footer-right">
          <span className="hipaa-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2z" /></svg>
            HIPAA Conscious
          </span>
          <a href="#services">Services</a>
          <a href="#process">How It Works</a>
          <a href="#faq">FAQ</a>
          <a href="#cta">Contact</a>
          <span style={{ fontSize: 13, color: 'var(--charcoal-2)' }}>© 2025 Netbrainer AI. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}
