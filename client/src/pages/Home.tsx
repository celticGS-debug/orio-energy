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
import { motion, AnimatePresence } from "framer-motion";
import LeadForm from "@/components/LeadForm";
import {
  trackContact,
  trackViewContent,
  trackInitiateCheckout,
  trackScrollDepth,
  trackVideoEngagement,
  trackFAQEngagement,
} from "@/lib/pixel";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { GoogleReviews } from "@/components/GoogleReviews";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Timeline } from "@/components/ui/timeline";

/* ============================================================
   Home — Orio Electrical Services Landing Page
   Design: Refined Craftsman
   Brand: #0F2340 navy dark, #1B3A5C navy, #00A79D teal, #F8F5F0 warm white
   Fonts: Fraunces (headings/italic emphasis), DM Sans (body)
   21st.dev upgrades:
   - AnimatedTestimonials (Aceternity) — reviews section
   - Marquee (MagicUI) — social proof strip
   - NumberTicker (MagicUI) — stats section
   - Timeline (Aceternity) — how it works
   - Animated text cycle — hero headline
   - Aurora-style animated gradient — CTA section
   ============================================================ */

// ── Asset URLs — served from /public/images/ (works on Netlify) ──
const ORIO_LOGO = "/images/orio-logo.webp";
const HERO_HOUSE = "/images/orio-hero-house.jpg";
const OLIVER_PORTRAIT = "/images/oliver-lawrence.webp";
const INSTALL_ROOF = "/images/orio-install-roof.jpg";
const BATTERY_STORAGE = "/images/orio-battery-storage.jpg";

// ─── Animated text cycle (upgrade #5) ───────────────────────
const PAIN_PHRASES = ["£200 a month", "£250 a month", "£300 a month"];

function AnimatedPainPhrase() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % PAIN_PHRASES.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block" style={{ minWidth: "10ch" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="inline-block"
          style={{ color: "#00A79D", fontStyle: "italic" }}
        >
          {PAIN_PHRASES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

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

// ─// ─── FAQ item ────────────────────────────────────────────
function FaqItem({ q, a, onOpen }: { q: string; a: string; onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => { const next = !open; setOpen(next); if (next && onOpen) onOpen(); }}
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

// ─── Main component ──────────────────────────────────────────
export default function Home() {
  const [showMobileBar, setShowMobileBar] = useState(false);
  const heroFormRef = useRef<HTMLDivElement>(null);
  const oliverSectionRef = useRef<HTMLElement>(null);
  const { ref: statsRef, visible: statsVisible } = useScrollAnimation(0.2);

  // Sticky mobile bottom bar — show after scrolling 200px
  useEffect(() => {
    const handleScroll = () => {
      setShowMobileBar(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Scroll depth tracking (25 / 50 / 75 / 90) ────────────────
  useEffect(() => {
    const fired = new Set<number>();
    const milestones: Array<25 | 50 | 75 | 90> = [25, 50, 75, 90];
    const handleDepth = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);
      for (const m of milestones) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          trackScrollDepth(m);
        }
      }
    };
    window.addEventListener("scroll", handleDepth, { passive: true });
    return () => window.removeEventListener("scroll", handleDepth);
  }, []);

  // ── ViewContent: Oliver section enters viewport ───────────────
  useEffect(() => {
    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          trackViewContent("Oliver Lawrence — Who You're Dealing With");
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (oliverSectionRef.current) observer.observe(oliverSectionRef.current);
    return () => observer.disconnect();
  }, []);

  function scrollToForm(trigger = "CTA Button") {
    trackInitiateCheckout(trigger);
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

  // ── Marquee items ──────────────────────────────────────────
  const marqueeItems = [
    { icon: "✦", text: "NICEIC Approved" },
    { icon: "✦", text: "MCS Certified" },
    { icon: "✦", text: "SolarEdge Partner" },
    { icon: "✦", text: "No subcontractors" },
    { icon: "✦", text: "20+ Years In Construction" },
    { icon: "✦", text: "Free survey" },
    { icon: "✦", text: "West Sussex based" },
    { icon: "✦", text: "0% VAT until March 2027" },
    { icon: "★", text: "5.0 Google rating" },
    { icon: "✦", text: "31 verified reviews" },
    { icon: "✦", text: "Oliver visits personally" },
  ];

  // ── Testimonials data ──────────────────────────────────────
  const testimonials = [
    {
      quote: "I was so nervous about being pressured into something expensive. Oliver was the complete opposite — calm, honest, and realistic. Three months on our bills are down by over £130 a month. Wish we had done it sooner.",
      name: "Sarah T.",
      designation: "Worthing, West Sussex",
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
    },
    {
      quote: "Every other company sent a salesperson. Oliver came himself, looked at our roof, asked about our usage and gave us a straight answer. Bills dropped from £285 to under £90 most months.",
      name: "Mark & Jenny H.",
      designation: "Shoreham-by-Sea, West Sussex",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    },
    {
      quote: "We had been putting it off for two years. After Oliver's survey I finally understood exactly what we were getting. He handled all the paperwork. Could not have been easier.",
      name: "David C.",
      designation: "Burgess Hill, West Sussex",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    },
  ];

  // ── Timeline data (How It Works) ───────────────────────────
  const timelineData = [
    {
      title: "Step 1",
      content: (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#00A79D1A", color: "#00A79D" }}>
              <HomeIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              Free home survey
            </h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Oliver visits personally. 45 minutes. He checks your roof orientation, shading, tile condition and energy usage. No pressure. No salesperson. Just honest advice.
          </p>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663472875712/4EKQP4C58FS82N3Bo9XcAi/survey-home-visit-CGybeAYwUsxQwu9PLy5LkK.webp"
            alt="Solar surveyor visiting a home"
            className="w-full h-48 object-cover object-center rounded-xl"
          />
        </div>
      ),
    },
    {
      title: "Step 2",
      content: (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#00A79D1A", color: "#00A79D" }}>
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              Written proposal in 48 hours
            </h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            A clear, itemised, fixed-price quote. No hidden costs. No upselling. You'll know exactly what you're getting and what it will cost before you commit to anything.
          </p>
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
            alt="Couple reviewing solar proposal at dining table"
            className="w-full h-48 object-cover rounded-xl"
            loading="lazy"
          />
        </div>
      ),
    },
    {
      title: "Step 3",
      content: (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#00A79D1A", color: "#00A79D" }}>
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              Professional installation
            </h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our own team - no subcontractors. Typically 1-2 days. Your home is left spotless. Oliver oversees every part of the installation himself.
          </p>
          <img
            src={INSTALL_ROOF}
            alt="Solar panel installation by Orio Electrical Services"
            className="w-full h-40 object-cover rounded-xl mt-4"
            loading="lazy"
          />
        </div>
      ),
    },
    {
      title: "Step 4",
      content: (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#00A79D1A", color: "#00A79D" }}>
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              Full handover
            </h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            App set up. SEG enrolled. MCS certificate issued. Oliver walks you through everything so you know exactly how to get the most from your system from day one.
          </p>
          <img
            src={BATTERY_STORAGE}
            alt="Battery storage system installed by Orio"
            className="w-full h-40 object-cover rounded-xl mt-4"
            loading="lazy"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── SECTION 1: Urgency Bar ── */}
      <div className="w-full py-2.5 px-4 text-center" style={{ backgroundColor: "#0F2340" }}>
        <p className="text-sm font-medium" style={{ color: "#F8F5F0" }}>
          <span className="shimmer-text font-bold">0% VAT</span>
          <span style={{ color: "#F8F5F0" }}> on solar & battery storage — available until March 2027. </span>
          <button onClick={() => scrollToForm("Announcement Bar")} className="underline font-semibold hover:no-underline" style={{ color: "#00A79D" }}>
            Book your free survey now.
          </button>
        </p>
      </div>

      {/* ── SECTION 2: Sticky Nav ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between py-3">
          <a href="/" aria-label="Orio Electrical Services">
            <img src={ORIO_LOGO} alt="Orio Electrical Services Ltd" className="h-10 w-auto" />
          </a>
          <div className="flex items-center gap-3">
            <a
              href="tel:07538527253"
              onClick={() => trackContact("phone")}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#00A79D]"
              style={{ color: "#1B3A5C" }}
            >
              <Phone className="w-4 h-4" />
              07538 527253
            </a>
            <button
              onClick={() => scrollToForm("Nav Bar")}
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

              {/* H1 with animated pain phrase */}
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-tight mb-5"
                style={{ fontFamily: "'Fraunces', serif", color: "#F8F5F0" }}
              >
                Stop paying{" "}
                <AnimatedPainPhrase />{" "}
                for electricity you could be{" "}
                <em style={{ color: "#00A79D", fontStyle: "italic" }}>generating yourself.</em>
              </h1>

              {/* Subheadline */}
              <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(248,245,240,0.75)" }}>
                Oliver Lawrence - 20+ years in the construction industry, 10 years as a qualified electrician. Designs and installs solar, battery storage and EV charging across West Sussex. One team. No salespeople. No subcontractors.
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
              {/* Sunshine hook — above the image */}
              <div className="mb-5">
                <p
                  className="text-xl sm:text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Fraunces', serif", color: "#00A79D", fontStyle: "italic" }}
                >
                  "The price of sunshine has never gone up."
                </p>
                <p className="text-sm" style={{ color: "rgba(248,245,240,0.65)", fontFamily: "'Outfit', sans-serif", textAlign: 'center' }}>
                  Solar locks your energy cost at zero for years.
                </p>
              </div>
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
                      <p className="text-xs text-gray-400">20+ years construction, 10 years qualified electrician</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Social Proof Strip (Marquee upgrade) ── */}
      <section style={{ backgroundColor: "#162d4a" }} className="py-10 overflow-hidden">
        <div className="text-center mb-6 px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-3xl font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>5.0</span>
          </div>

        </div>

        {/* MagicUI Marquee */}
        <Marquee pauseOnHover className="[--duration:35s]">
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center px-6 text-sm font-semibold whitespace-nowrap"
              style={{ color: "rgba(248,245,240,0.75)" }}
            >
              <span className="mr-3 text-[#00A79D]">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </Marquee>
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
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-full">
                  <img
                    src={[
                      "https://d2xsxph8kpxj0f.cloudfront.net/310519663472875712/4EKQP4C58FS82N3Bo9XcAi/pain-switch-tariff-MzjFPZHyBaofekPGKokidE.webp",
                      "https://d2xsxph8kpxj0f.cloudfront.net/310519663472875712/4EKQP4C58FS82N3Bo9XcAi/pain-turn-off-lights-URaRfxRhzfF2tnt84bipEM.webp",
                      "https://d2xsxph8kpxj0f.cloudfront.net/310519663472875712/4EKQP4C58FS82N3Bo9XcAi/pain-solar-confusion-9d9e8rxUGcCTKCP6ccN4iL.webp",
                    ][i]}
                    alt={card.title}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#00A79D1A", color: "#00A79D" }}>
                      {card.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{card.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Cost comparison */}
          <FadeUp>
            <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="rounded-2xl p-6 text-center border-2 border-red-100 bg-red-50">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Cost of doing nothing</p>
                <p className="text-4xl font-bold text-red-500 mb-1">~£30,000</p>
                <p className="text-sm text-red-400">10 years at current rates</p>
              </div>
              <div className="rounded-2xl p-6 text-center border-2 border-emerald-100 bg-emerald-50">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">With solar & battery</p>
                <p className="text-4xl font-bold text-emerald-600 mb-1">£14–18k</p>
                <p className="text-sm text-emerald-500">estimated saving over 10 years</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp className="text-center">
            <button
              onClick={() => scrollToForm("Pain Section CTA")}
              className="btn-teal px-8 py-4 text-base font-bold w-full sm:w-auto"
            >
              Get My Free Survey — No Obligation
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 6: How It Works (Aceternity Timeline upgrade) ── */}
      <section style={{ backgroundColor: "#F8F5F0" }} className="py-16 md:py-20 border-t border-gray-100">
        <div className="container">
          <FadeUp className="text-center mb-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#00A79D" }}>
              The process
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              Simple from start to finish.{" "}
              <em style={{ color: "#00A79D", fontStyle: "italic" }}>We handle everything.</em>
            </h2>
          </FadeUp>
          <Timeline data={timelineData} />
        </div>
      </section>

      {/* ── SECTION 7: Oliver Section (NumberTicker stats upgrade) ── */}
      <section ref={oliverSectionRef} style={{ backgroundColor: "#0F2340" }} className="py-16 md:py-20">
        <div className="container">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>
              Who you're dealing with
            </h2>
          </FadeUp>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Oliver photo */}
            <FadeUp>
              <div className="relative">                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <video
                    src="/videos/oliver-waving.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onPlay={trackVideoEngagement}
                    className="w-full h-80 sm:h-96 object-cover object-top"
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
                  Founder and Lead Electrician - Orio Electrical Services
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

          {/* Stats grid — NumberTicker upgrade */}
          <div ref={statsRef} className="flex flex-wrap justify-center gap-4">
            <div className="text-center p-6 rounded-2xl bg-white/10 border border-white/10 min-w-[140px]">
              <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                {statsVisible ? <NumberTicker value={20} className="text-white" /> : "0"}
                <span>+</span>
              </div>
              <div className="text-sm text-white/60">Years in the construction industry</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/10 border border-white/10 min-w-[140px]">
              <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                {statsVisible ? <NumberTicker value={10} className="text-white" /> : "0"}
                <span>+</span>
              </div>
              <div className="text-sm text-white/60">Years as a qualified electrician</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/10 border border-white/10 min-w-[140px]">
              <div className="text-4xl font-bold text-white mb-1">
                <MapPin className="w-8 h-8 text-[#00A79D] mx-auto" />
              </div>
              <div className="text-sm text-white/60">Based in Shoreham, your local installer</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/10 border border-white/10 min-w-[140px]">
              <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                {statsVisible ? <NumberTicker value={1} className="text-white" /> : "0"}
              </div>
              <div className="text-sm text-white/60">Person responsible for your installation</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: Reviews (AnimatedTestimonials upgrade) ── */}
      <section style={{ backgroundColor: "#F8F5F0" }} className="py-16 md:py-20">
        <div className="container">
          <FadeUp className="text-center mb-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#00A79D" }}>
              Google Verified Reviews
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Fraunces', serif", color: "#1B3A5C" }}>
              Real people.{" "}
              <em style={{ color: "#00A79D", fontStyle: "italic" }}>Real results.</em>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Stars />
              <span className="font-bold text-[#1B3A5C]">5.0</span>
            </div>
          </FadeUp>

          {/* Google Reviews card carousel */}
          <FadeUp>
            <GoogleReviews />
          </FadeUp>
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
                <FaqItem key={i} q={faq.q} a={faq.a} onOpen={() => trackFAQEngagement(faq.q)} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 10: Final CTA (Aurora gradient upgrade) ── */}
      <section
        id="final-cta"
        className="py-16 md:py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F2340 0%, #1B3A5C 100%)" }}
      >
        {/* Aurora animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #00A79D 0%, transparent 70%)" }}
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #00A79D 0%, transparent 70%)" }}
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </div>

        <div className="container max-w-2xl mx-auto text-center relative z-10">
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

            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 11: Footer ── */}
      <footer style={{ backgroundColor: "#0A1929" }} className="py-10 border-t border-white/5">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
            <img src={ORIO_LOGO} alt="Orio Electrical Services Ltd" className="h-10 w-auto" style={{ filter: "brightness(0) invert(1)" }} />
            <div className="flex items-center gap-6">
              <a href="tel:07538527253" onClick={() => trackContact("phone")} className="flex items-center gap-2 text-sm hover:text-[#00A79D] transition-colors" style={{ color: "rgba(248,245,240,0.65)" }}>
                <Phone className="w-3.5 h-3.5" />
                07538 527253
              </a>
              <a href="mailto:hello@orio.me" onClick={() => trackContact("email")} className="flex items-center gap-2 text-sm hover:text-[#00A79D] transition-colors" style={{ color: "rgba(248,245,240,0.65)" }}>
                <Mail className="w-3.5 h-3.5" />
                hello@orio.me
              </a>
              <a href="https://orio.me" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-[#00A79D] transition-colors" style={{ color: "rgba(248,245,240,0.65)" }}>
                orio.me
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {["NICEIC Approved", "MCS Certified", "SolarEdge Partner"].map(b => (
                <span key={b} className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: "rgba(0,167,157,0.25)", color: "rgba(248,245,240,0.5)" }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "rgba(248,245,240,0.35)" }}>
              © 2026 Orio Electrical Services Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ── SECTION 12: Sticky Mobile Bottom Bar ── */}
      {showMobileBar && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-2xl slide-up-enter"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <a
              href="tel:07538527253"
              onClick={() => trackContact("phone")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-colors"
              style={{ borderColor: "#1B3A5C", color: "#1B3A5C" }}
            >
              <Phone className="w-4 h-4" />
              Call Oliver
            </a>
            <button
              onClick={() => scrollToForm("Sticky Mobile Bar")}
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
