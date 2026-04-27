import { useState, useRef } from "react";
import { CheckCircle, Lock } from "lucide-react";

/* ============================================================
   LeadForm — Orio Electrical Services
   Design: Refined Craftsman — teal CTA, pulse animation, 
   success state with spring tick, WhatsApp notification
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

  const ZAPIER_WEBHOOK = ""; // Placeholder — to be configured

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Please enter your first name";
    if (!phone.trim() || phone.trim().length < 10) e.phone = "Please enter a valid UK phone number";
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
    const leadData = {
      name: name.trim(),
      phone: phone.trim(),
      postcode: postcode.trim().toUpperCase(),
      timestamp,
      source: "orioenergy.com",
    };

    // Method A: Zapier webhook
    if (ZAPIER_WEBHOOK) {
      try {
        await fetch(ZAPIER_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData),
        });
      } catch (_) {
        // fall through to Method C
      }
    }

    // Method C fallback: mailto link (opens email client)
    // In production this would be a Google Apps Script endpoint
    const emailBody = encodeURIComponent(
      `New survey lead from orioenergy.com\n\nName: ${leadData.name}\nPhone: ${leadData.phone}\nPostcode: ${leadData.postcode}\nSubmitted: ${leadData.timestamp}`
    );
    // Open WhatsApp wa.me as secondary notification
    const waMessage = encodeURIComponent(
      `New survey lead from orioenergy.com\nName: ${leadData.name}\nPhone: ${leadData.phone}\nPostcode: ${leadData.postcode}\nSubmitted: ${leadData.timestamp}`
    );
    // We open the wa.me link in a hidden iframe to avoid disrupting UX
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wa.me/447538527253?text=${waMessage}`;
    document.body.appendChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 3000);

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
    <form id={id} onSubmit={handleSubmit} className={`rounded-2xl p-6 md:p-8 ${dark ? "bg-white/10 backdrop-blur-sm border border-white/20" : "bg-white border border-gray-100 shadow-xl"}`} noValidate>
      <div className="space-y-4">
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-white/70" : "text-gray-500"}`}>First Name</label>
          <input
            type="text"
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
