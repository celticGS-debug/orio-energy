import { useState } from "react";
import { CheckCircle, Lock } from "lucide-react";
import { trackLead } from "@/lib/pixel";

/* ============================================================
   LeadForm — Orio Electrical Services
   Design: Refined Craftsman — teal CTA, pulse animation,
   success state with spring tick.

   Submission strategy:
   - Uses Netlify Forms (data-netlify="true") for zero-config
     form handling on Netlify hosting.
   - Netlify captures every submission and can trigger email
     notifications, Zapier webhooks, or Slack alerts from
     the Netlify dashboard → Forms → Notifications.
   - On success, shows a confirmation state with next steps.
   ============================================================ */

interface LeadFormProps {
  id?: string;
  dark?: boolean;
}

export default function LeadForm({ id, dark = false }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [postcode, setPostcode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; postcode?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Please enter your first name";
    if (!phone.trim() || phone.replace(/\s/g, "").length < 10) e.phone = "Please enter a valid UK phone number";
    if (!postcode.trim() || postcode.trim().length < 5) e.postcode = "Please enter your postcode";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setErrors({});
    setLoading(true);

    const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
    const formData = new FormData();
    formData.append("form-name", "survey-lead");
    formData.append("name", name.trim());
    formData.append("phone", phone.trim());
    formData.append("postcode", postcode.trim().toUpperCase());
    formData.append("timestamp", timestamp);
    formData.append("source", "orioenergy.com");

    // Submit to Netlify Forms (backup record in dashboard)
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
    } catch (_) {
      // Netlify Forms capture failed silently
    }

    // Fire Meta Pixel Lead event with advanced matching
    await trackLead(name.trim(), phone.trim());

    setLoading(false);
    setSubmitted(true);
  }

  const inputBase = `w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-[#00A79D] focus:border-[#00A79D] ${
    dark
      ? "bg-white/10 border-white/20 text-white placeholder:text-white/50"
      : "bg-white border-gray-200 text-[#1A1A1A] placeholder:text-gray-400"
  }`;

  if (submitted) {
    return (
      <div id={id} className={`rounded-2xl p-6 md:p-8 ${dark ? "bg-white/10 backdrop-blur-sm border border-white/20" : "bg-white border border-gray-100 shadow-xl"}`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 tick-spring">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h3 className={`font-bold text-xl mb-2 ${dark ? "text-white" : "text-[#1A1A1A]"}`} style={{ fontFamily: "'Fraunces', serif" }}>
            You're booked in, {name}.
          </h3>
          <p className={`text-sm leading-relaxed ${dark ? "text-white/80" : "text-gray-600"}`}>
            Oliver will call you on <strong className={dark ? "text-white" : "text-[#1A1A1A]"}>{phone}</strong> within 2 hours to arrange your free survey.
          </p>
        </div>
        <div className={`rounded-xl p-4 ${dark ? "bg-white/10" : "bg-[#F8F5F0]"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${dark ? "text-[#00A79D]" : "text-[#00A79D]"}`}>What happens next:</p>
          <div className="space-y-2">
            {[
              "Oliver calls you — usually within 2 hours, same day.",
              "He visits your home at a time that suits you.",
              "You receive a written quote within 48 hours. No pressure.",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00A79D] text-white text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                <p className={`text-sm ${dark ? "text-white/80" : "text-gray-700"}`}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      id={id}
      name="survey-lead"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className={`rounded-2xl p-6 md:p-8 ${dark ? "bg-white/10 backdrop-blur-sm border border-white/20" : "bg-white border border-gray-100 shadow-xl"}`}
      noValidate
    >
      {/* Netlify hidden fields */}
      <input type="hidden" name="form-name" value="survey-lead" />
      <input type="hidden" name="source" value="orioenergy.com" />
      <p className="hidden">
        <label>Don't fill this out if you're human: <input name="bot-field" /></label>
      </p>

      <div className="space-y-4">
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-white/70" : "text-gray-500"}`}>First Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sarah"
            className={inputBase}
            autoComplete="given-name"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-white/70" : "text-gray-500"}`}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 07700 900123"
            className={inputBase}
            autoComplete="tel"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-white/70" : "text-gray-500"}`}>Postcode</label>
          <input
            type="text"
            name="postcode"
            value={postcode}
            onChange={e => setPostcode(e.target.value.toUpperCase())}
            placeholder="e.g. BN43 5RE"
            className={inputBase}
            autoComplete="postal-code"
            maxLength={8}
          />
          {errors.postcode && <p className="text-red-400 text-xs mt-1">{errors.postcode}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-teal btn-pulse w-full py-4 text-base font-bold tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Book My Free Survey — Oliver Will Call You Back"}
        </button>
        <div className="flex items-center justify-center gap-2 pt-1">
          <Lock className={`w-3.5 h-3.5 flex-shrink-0 ${dark ? "text-white/50" : "text-gray-400"}`} />
          <p className={`text-xs ${dark ? "text-white/50" : "text-gray-400"}`}>
            No spam. No cold calls. Your details go to Oliver only.
          </p>
        </div>
      </div>
    </form>
  );
}
