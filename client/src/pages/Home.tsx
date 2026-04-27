import { useState, useEffect, useRef } from "react";
import {
  Phone,
  ChevronDown,
  CheckCircle,
  Star,
  Shield,
  Award,
  Zap,
  Home as HomeIcon,
  FileText,
  Wrench,
  BookOpen,
  MapPin,
  Mail,
  Lock,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import { useScrollAnimation, useCountUp } from "@/hooks/useScrollAnimation";

/* ============================================================
   Home — Orio Electrical Services Landing Page
   Design: Refined Craftsman
   Brand: #0F2340 navy dark, #1B3A5C navy, #00A79D teal, #F8F5F0 warm white
   Fonts: Fraunces (headings/italic emphasis), DM Sans (body)
   ============================================================ */

const HERO_HOUSE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663472875712/4EKQP4C58FS82N3Bo9XcAi/orio-hero-house-YQsiGrXkMUQDaDByfBxrSp.webp";
const OLIVER_PORTRAIT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663472875712/4EKQP4C58FS82N3Bo9XcAi/orio-oliver-portrait-ZGzFCxqSwYonFiF6TM2ZXE.webp";
const INSTALL_ROOF = "https://d2xsxph8kpxj0f.cloudfront.net/310519663472875712/4EKQP4C58FS82N3Bo9XcAi/orio-install-roof-7QjsHVfxQFCamhoKYKBRPh.webp";

// ─── Reusable fade-up wrapper ────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`fade-up ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Star rating component ───────────────────────────────────
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

// ─── Trust pill badge ────────────────────────────────────────
function TrustPill({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
      dark
        ? "border-white/20 text-white/80 bg-white/10"
        : "border-[#00A79D]/30 text-[#00A79D] bg-[#00A79D]/10"
    }`}>
      {label}
    </span>
  );
}

// ─── FAQ item ────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#1B3A5C] text-base group-hover:text-[#00A79D] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {q}
        </span>
        <ChevronDown className={`w-5 h-5 text-[#00A79D] flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className="faq-content"
        style={{ maxHeight: open ? "400px" : "0px", opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a}</p>
      </div>
    </div>
  );
}

// ─── Animated stat counter ───────────────────────────────────
function AnimatedStat({ value, suffix, label, start }: { value: number; suffix?: string; label: string; start: boolean }) {
  const counted = useCountUp(value, 1600, start, 0);
  return (
    <div className="text-center p-6 rounded-2xl bg-white/10 border border-white/10">
      <div className="text-4xl font-bold text-white mb-1 stat-number">
        {counted}{suffix}
      </div>
      <div className="text-sm text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────
export default function Home() {
  const [showMobileBar, setShowMobileBar] = useState(false);
  const [mobileBarVisible, setMobileBarVisible] = useState(false);
  const heroFormRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, visible: statsVisible } = useScrollAnimation(0.2);
  const { ref: starsRef, visible: starsVisible } = useScrollAnimation(0.3);
  const starsCount = useCountUp(5.0, 1200, starsVisible, 1);

  // Sticky mobile bottom bar logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isHidden = !entry.isIntersecting;
        if (isHidden && !mobileBarVisible) {
          setShowMobileBar(true);
          setTimeout(() => setMobileBarVisible(true), 50);
        } else if (!isHidden) {
          setMobileBarVisible(false);
          setTimeout(() => setShowMobileBar(false), 350);
        }
      },
      { threshold: 0.1 }
    );
    if (heroFormRef.current) observer.observe(heroFormRef.current);
    return () => observer.disconnect();
  }, [mobileBarVisible]);

  function scrollToForm() {
    document.getElementById("final-form")?.scrollIntoView({ behavior: "smooth" });
  }

  const faqs = [
    {
      q: "Is my roof suitable for solar panels?",
      a: "Most roofs in West Sussex are suitable. The free survey is specifically designed to check this. Oliver looks at orientation, shading, tile condition and angle. If your roof is not suitable he will tell you honestly rather than sell you something that will not perform.",
    },
    {
      q: "Do solar panels actually work in the UK?",
      a: "Solar panels run on daylight, not direct sunshine. The South East of England receives significantly more solar energy than most of the UK. Paired with a battery, a well-designed system covers most of your daytime usage year-round including in winter.",
    },
    {
      q: "Is there really 0% VAT on solar and battery storage?",
      a: "Yes. Solar PV and battery storage installations are zero-rated for VAT until 31 March 2027, when the rate reverts to 5%. On a typical £10,000 installation that is a saving of £500 to £1,000.",
    },
    {
      q: "How long does installation take?",
      a: "A typical residential solar and battery installation takes 1–2 days. This includes scaffolding, panel fitting, inverter and battery installation, DNO notification and MCS certification.",
    },
    {
      q: "What happens if something goes wrong years later?",
      a: "Your system comes with manufacturer warranties — typically 25 years on panels and 10 years on the inverter. As an MCS certified installer, Orio's workmanship is covered by an insurance-backed guarantee. And Oliver is still here in year five. Same number. Same person.",
    },
    {
      q: "How much does a solar and battery system cost?",
      a: "A typical system in West Sussex costs £8,000 to £14,000 including installation, 0% VAT and commissioning. The exact cost depends on your roof size, usage and battery choice. The free survey gives you a fixed-price written quote with no surprises.",
    },
  ];

  const marqueeItems = [
    "NICEIC Approved", "MCS Certified", "SolarEdge Partner", "No subcontractors",
    "18 years experience", "Free survey", "West Sussex based", "0% VAT until March 2027",
    "5.0 ★★★★★ Google", "31 verified reviews", "Oliver visits personally",
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── SECTION 1: Urgency Bar ── */}
      <div className="w-full py-2.5 px-4 text-center" style={{ backgroundColor: "#0F2340" }}>
        <p className="text-sm font-medium" style={{ color: "#F8F5F0" }}>
          <span className="shimmer-text font-bold">0% VAT</span>
          <span style={{ color: "#F8F5F0" }}> on solar & battery storage — available until March 2027. </span>
          <button onClick={scrollToForm} className="underline font-semibold hover:no-underline" style={{ color: "#00A79D" }}>
            Book your free survey now.
          </button>
        </p>
      </div>

      {/* ── SECTION 2: Sticky Nav ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between py-3">
          <a href="/" className="flex items-center gap-1" aria-label="Orio Electrical Services">
            <span className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              orio<span style={{ color: "#00A79D" }}>.</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="tel:07538527253"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#00A79D]"
              style={{ color: "#1B3A5C" }}
            >
              <Phone className="w-4 h-4" />
              07538 527253
            </a>
            <button
              onClick={scrollToForm}
              className="btn-teal px-5 py-2.5 text-sm font-bold"
            >
              Book Free Survey
            </button>
          </div>
        </div>
      </nav>

      {/* ── SECTION 3: Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F2340 0%, #1B3A5C 100%)" }}
      >
        <div className="container py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Copy + Form */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 pulse-dot flex-shrink-0" />
                <span className="text-sm font-medium" style={{ color: "#F8F5F0", opacity: 0.85 }}>
                  Trusted by West Sussex homeowners
                </span>
              </div>

              {/* H1 */}
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-tight mb-5"
                style={{ fontFamily: "'Fraunces', serif", color: "#F8F5F0" }}
              >
                Stop paying £200 a month for electricity you could be{" "}
                <em style={{ color: "#00A79D", fontStyle: "italic" }}>generating yourself.</em>
              </h1>

              {/* Subheadline */}
              <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(248,245,240,0.75)" }}>
                Oliver Lawrence — NICEIC and MCS certified electrician with 18 years experience — designs and installs solar, battery storage and EV charging across West Sussex. One team. No salespeople. No subcontractors.
              </p>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["MCS Certified", "NICEIC Approved", "SolarEdge Partner", "5.0 ★ Google", "Free Survey"].map(p => (
                  <TrustPill key={p} label={p} dark />
                ))}
              </div>

              {/* Form */}
              <div ref={heroFormRef}>
                <LeadForm id="hero-form" dark />
              </div>
            </div>

            {/* Right: Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={HERO_HOUSE}
                  alt="West Sussex home with solar panels installed by Orio Electrical Services"
                  className="w-full h-64 sm:h-80 lg:h-[480px] object-cover"
                  loading="eager"
                />
                {/* Left gradient bleed */}
                <div
                  className="absolute inset-y-0 left-0 w-1/3 hidden lg:block"
                  style={{ background: "linear-gradient(to right, #1B3A5C, transparent)" }}
                />
                {/* Caption card */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={OLIVER_PORTRAIT}
                      alt="Oliver Lawrence — Founder, Orio Electrical Services"
                      className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-sm" style={{ color: "#1B3A5C", fontFamily: "'Fraunces', serif" }}>
                        Oliver Lawrence
                      </p>
                      <p className="text-xs text-gray-500">Founder, Orio Electrical Services</p>
                      <p className="text-xs text-gray-400">18 years qualified electrician</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Social Proof Strip ── */}
      <section style={{ backgroundColor: "#162d4a" }} className="py-10 overflow-hidden">
        <div ref={starsRef} className="text-center mb-6 px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-3xl font-bold text-white stat-number">{starsCount.toFixed(1)}</span>
          </div>
          <p className="text-sm" style={{ color: "rgba(248,245,240,0.65)" }}>
            31 verified Google reviews
          </p>
        </div>
        {/* Marquee */}
        <div className="relative overflow-hidden">
          <div className="flex gap-0 marquee-track" style={{ width: "max-content" }}>
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center px-6 text-sm font-semibold whitespace-nowrap"
                style={{ color: "rgba(248,245,240,0.7)" }}
              >
                <span className="mr-6" style={{ color: "#00A79D" }}>✦</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Pain Section ── */}
      <section style={{ backgroundColor: "#F8F5F0" }} className="py-16 md:py-20">
        <div className="container">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#00A79D" }}>
              Sound familiar?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-10" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              You've tried{" "}
              <em style={{ color: "#00A79D", fontStyle: "italic" }}>everything.</em>{" "}
              The bills keep climbing.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "You switched supplier",
                body: "Saved £20 a month for six months. Then it crept back up.",
                icon: <Zap className="w-6 h-6" />,
              },
              {
                title: "You turned things off",
                body: "Barely made a dent on a £220 bill.",
                icon: <HomeIcon className="w-6 h-6" />,
              },
              {
                title: "You Googled solar",
                body: "Got 12 different answers and still aren't sure who to trust.",
                icon: <Shield className="w-6 h-6" />,
              },
            ].map((card, i) => (
              <FadeUp key={i} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#00A79D1A", color: "#00A79D" }}>
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Cost comparison */}
          <FadeUp>
            <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="rounded-2xl p-6 text-center border-2 border-red-100 bg-red-50">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Cost of doing nothing</p>
                <p className="text-4xl font-bold text-red-500 stat-number mb-1">~£30,000</p>
                <p className="text-sm text-red-400">10 years at current rates</p>
              </div>
              <div className="rounded-2xl p-6 text-center border-2 border-emerald-100 bg-emerald-50">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">With solar & battery</p>
                <p className="text-4xl font-bold text-emerald-600 stat-number mb-1">£14–18k</p>
                <p className="text-sm text-emerald-500">estimated saving over 10 years</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp className="text-center">
            <button
              onClick={scrollToForm}
              className="btn-teal px-8 py-4 text-base font-bold w-full sm:w-auto"
            >
              Get My Free Survey — No Obligation
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 6: How It Works ── */}
      <section style={{ backgroundColor: "#0F2340" }} className="py-16 md:py-20">
        <div className="container">
          <FadeUp className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#00A79D" }}>
              The process
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: "#F8F5F0" }}>
              Simple from start to finish.{" "}
              <em style={{ color: "#00A79D", fontStyle: "italic" }}>We handle everything.</em>
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                icon: <HomeIcon className="w-6 h-6" />,
                title: "Free home survey",
                body: "Oliver visits personally. 45 minutes. No pressure.",
              },
              {
                num: "02",
                icon: <FileText className="w-6 h-6" />,
                title: "Written proposal in 48 hours",
                body: "Itemised. Honest. No surprises.",
              },
              {
                num: "03",
                icon: <Wrench className="w-6 h-6" />,
                title: "Professional installation",
                body: "Our own team. 1–2 days. Home left spotless.",
              },
              {
                num: "04",
                icon: <BookOpen className="w-6 h-6" />,
                title: "Full handover",
                body: "App set up. SEG enrolled. Oliver walks you through everything.",
              },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 120}>
                <div className="relative">
                  {/* Connector line (desktop) */}
                  {i < 3 && (
                    <div
                      className="hidden lg:block absolute top-8 left-full w-full h-px z-0"
                      style={{ backgroundColor: "rgba(0,167,157,0.2)", width: "calc(100% - 3rem)", left: "calc(50% + 1.5rem)" }}
                    />
                  )}
                  <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold" style={{ color: "#00A79D" }}>{step.num}</span>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#00A79D20", color: "#00A79D" }}>
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                      {step.title}
                    </h3>
                    <p className="text-sm" style={{ color: "rgba(248,245,240,0.6)" }}>{step.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: Oliver Section ── */}
      <section style={{ backgroundColor: "#0F2340" }} className="py-16 md:py-20 border-t border-white/5">
        <div className="container">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>
              Who you're dealing with
            </h2>
          </FadeUp>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Oliver photo */}
            <FadeUp>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={OLIVER_PORTRAIT}
                    alt="Oliver Lawrence — Founder and Lead Electrician, Orio Electrical Services"
                    className="w-full h-80 sm:h-96 object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#00A79D] text-white rounded-xl p-4 shadow-xl hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-wider">NICEIC Approved</p>
                  <p className="text-xs opacity-80">MCS Certified</p>
                </div>
              </div>
            </FadeUp>

            {/* Quote + info */}
            <FadeUp delay={100}>
              <div>
                <p className="font-bold text-white mb-1" style={{ fontFamily: "'Fraunces', serif", fontSize: "1.25rem" }}>
                  Oliver Lawrence
                </p>
                <p className="text-sm mb-6" style={{ color: "#00A79D" }}>
                  Founder and Lead Electrician — Orio Electrical Services
                </p>
                <blockquote
                  className="text-xl leading-relaxed mb-8 italic"
                  style={{ fontFamily: "'Fraunces', serif", color: "#00A79D" }}
                >
                  "I am a qualified electrician first. I moved into solar because I was seeing families paying £250, £300 a month on electricity and I knew there was a proper solution. When I install your system, I am the person who surveys it, designs it and oversees every part of the installation. If something goes wrong in year five, I am still the same person you call."
                </blockquote>
                {/* Accreditation badges */}
                <div className="flex flex-wrap gap-3">
                  {["NICEIC Approved Contractor", "MCS Certified Installer", "SolarEdge Partner"].map(b => (
                    <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ borderColor: "rgba(0,167,157,0.3)", color: "#00A79D", backgroundColor: "rgba(0,167,157,0.1)" }}>
                      <CheckCircle className="w-3 h-3" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Stats grid */}
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatedStat value={18} suffix="+" label="Years as a qualified electrician" start={statsVisible} />
            <AnimatedStat value={0} label="Jobs subcontracted — ever" start={statsVisible} />
            <div className="text-center p-6 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-4xl font-bold text-white mb-1 stat-number" style={{ fontFamily: "'Fraunces', serif" }}>
                <MapPin className="w-8 h-8 text-[#00A79D] mx-auto mb-1" />
              </div>
              <div className="text-sm text-white/60">Based in Shoreham, your local installer</div>
            </div>
            <AnimatedStat value={1} label="Person responsible for your installation" start={statsVisible} />
          </div>
        </div>
      </section>

      {/* ── SECTION 8: Reviews ── */}
      <section style={{ backgroundColor: "#F8F5F0" }} className="py-16 md:py-20">
        <div className="container">
          <FadeUp className="text-center mb-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#00A79D" }}>
              What West Sussex homeowners say
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              Real people.{" "}
              <em style={{ color: "#00A79D", fontStyle: "italic" }}>Real results.</em>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Stars />
              <span className="font-bold text-[#1B3A5C]">5.0</span>
              <span className="text-gray-500 text-sm">— Based on 31 verified Google reviews</span>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                name: "Sarah T.",
                location: "Worthing",
                text: "I was so nervous about being pressured into something expensive. Oliver was the complete opposite — calm, honest, and realistic. Three months on our bills are down by over £130 a month. Wish we had done it sooner.",
              },
              {
                name: "Mark and Jenny H.",
                location: "Shoreham-by-Sea",
                text: "Every other company sent a salesperson. Oliver came himself, looked at our roof, asked about our usage and gave us a straight answer. Bills dropped from £285 to under £90 most months.",
              },
              {
                name: "David C.",
                location: "Burgess Hill",
                text: "We had been putting it off for two years. After Oliver's survey I finally understood exactly what we were getting. He handled all the paperwork. Could not have been easier.",
              },
            ].map((review, i) => (
              <FadeUp key={i} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
                  <Stars />
                  <blockquote className="flex-1 mt-4 text-gray-700 text-sm leading-relaxed italic">
                    "{review.text}"
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-bold text-sm" style={{ color: "#1B3A5C" }}>{review.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {review.location}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FAQ ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-3xl mx-auto">
          <FadeUp className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              Answers before you{" "}
              <em style={{ color: "#00A79D", fontStyle: "italic" }}>pick up the phone.</em>
            </h2>
          </FadeUp>
          <FadeUp>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 10: Final CTA ── */}
      <section
        id="final-cta"
        className="py-16 md:py-20"
        style={{ background: "linear-gradient(135deg, #0F2340 0%, #1B3A5C 100%)" }}
      >
        <div className="container max-w-2xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
              Ready to{" "}
              <em style={{ color: "#00A79D", fontStyle: "italic" }}>stop paying</em>{" "}
              for electricity you could be generating yourself?
            </h2>
            <p className="text-base mb-8" style={{ color: "rgba(248,245,240,0.75)" }}>
              Book your free, no-obligation home survey. Oliver visits personally, assesses your roof and energy usage, and gives you a straight answer within 48 hours. No pressure. No salespeople. No call centre.
            </p>
          </FadeUp>
          <FadeUp delay={100}>
            <LeadForm id="final-form" dark />
          </FadeUp>
          <FadeUp delay={200}>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Lock className="w-3.5 h-3.5 text-white/40" />
              <p className="text-xs text-white/40">
                No spam. No cold calls. Your details go to Oliver only. He will call you back within 2 hours.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 11: Footer ── */}
      <footer style={{ backgroundColor: "#0A1929" }} className="py-10 border-t border-white/5">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <span className="text-2xl font-bold mb-3 block" style={{ fontFamily: "'Fraunces', serif", color: "#F8F5F0" }}>
                orio<span style={{ color: "#00A79D" }}>.</span>
              </span>
              <p className="text-sm" style={{ color: "rgba(248,245,240,0.5)" }}>
                Orio Electrical Services Ltd<br />
                Shoreham-by-Sea, West Sussex, BN43 5RE
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#00A79D" }}>Contact</p>
              <div className="space-y-2">
                <a href="tel:07538527253" className="flex items-center gap-2 text-sm hover:text-[#00A79D] transition-colors" style={{ color: "rgba(248,245,240,0.65)" }}>
                  <Phone className="w-3.5 h-3.5" />
                  07538 527253
                </a>
                <a href="mailto:hello@orio.me" className="flex items-center gap-2 text-sm hover:text-[#00A79D] transition-colors" style={{ color: "rgba(248,245,240,0.65)" }}>
                  <Mail className="w-3.5 h-3.5" />
                  hello@orio.me
                </a>
                <a href="https://orio.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-[#00A79D] transition-colors" style={{ color: "rgba(248,245,240,0.65)" }}>
                  orio.me
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#00A79D" }}>Accreditations</p>
              <div className="flex flex-wrap gap-2">
                {["NICEIC Approved", "MCS Certified", "SolarEdge Partner"].map(b => (
                  <span key={b} className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: "rgba(0,167,157,0.25)", color: "rgba(248,245,240,0.5)" }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "rgba(248,245,240,0.35)" }}>
              © 2026 Orio Electrical Services Ltd. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-xs hover:text-[#00A79D] transition-colors" style={{ color: "rgba(248,245,240,0.35)" }}>Privacy Policy</a>
              <a href="#" className="text-xs hover:text-[#00A79D] transition-colors" style={{ color: "rgba(248,245,240,0.35)" }}>Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── SECTION 12: Sticky Mobile Bottom Bar ── */}
      {showMobileBar && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-2xl ${mobileBarVisible ? "slide-up-enter" : ""}`}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <a
              href="tel:07538527253"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-colors"
              style={{ borderColor: "#1B3A5C", color: "#1B3A5C" }}
            >
              <Phone className="w-4 h-4" />
              Call Oliver
            </a>
            <button
              onClick={scrollToForm}
              className="flex-1 btn-teal py-3 text-sm font-bold"
            >
              Book Free Survey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
