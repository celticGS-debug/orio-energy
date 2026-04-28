/* ============================================================
   Meta Pixel Utility — Orio Electrical Services
   Pixel ID: 529343246650504

   Events fired:
   - PageView   → automatically on every page load (via index.html base code)
   - Lead       → on form submit with advanced matching (fn, ph)
   - Contact    → on phone number click (nav + footer)
   ============================================================ */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

/** Hash a string with SHA-256 and return the hex digest.
 *  Meta advanced matching requires hashed PII when sent via fbq(). */
async function sha256(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Normalise a UK phone number to E.164 format (e.g. 07700900123 → 447700900123).
 *  Meta expects digits only, country code prefix, no + sign. */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "44" + digits.slice(1);
  if (digits.startsWith("44")) return digits;
  return digits;
}

/** Fire the Lead event with advanced matching (first name + phone).
 *  Called immediately after successful form submission. */
export async function trackLead(firstName: string, phone: string): Promise<void> {
  if (typeof window === "undefined" || !window.fbq) return;

  const normPhone = normalisePhone(phone);
  const [hashedFn, hashedPh] = await Promise.all([
    sha256(firstName),
    sha256(normPhone),
  ]);

  // Advanced matching — passed as the third argument to fbq('track', ...)
  window.fbq("track", "Lead", {
    content_name: "Free Solar Survey",
    content_category: "Solar",
  }, {
    eventID: `lead_${Date.now()}`,
    // Advanced matching fields (hashed)
    fn: hashedFn,
    ph: hashedPh,
  });
}

/** Fire the Contact event when the phone number is clicked. */
export function trackContact(): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "Contact", {
    content_name: "Phone Call",
  });
}
