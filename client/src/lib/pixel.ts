/* ============================================================
   Meta Pixel Utility — Orio Electrical Services
   Pixel ID: 529343246650504

   Standard events fired:
   - PageView              → automatically on every page load (index.html base code)
   - Lead                  → form submit with advanced matching (fn, ph)
   - Contact               → phone or email link click
   - ViewContent           → scroll past 50% OR Oliver section in viewport
   - InitiateCheckout      → CTA button click (intent to book) OR first form keystroke

   Custom events fired (trackCustom):
   - ScrollDepth           → 25 / 50 / 75 / 90 scroll milestones
   - FAQEngagement         → any FAQ accordion opened (question text included)
   - VideoEngagement       → Oliver waving video plays
   - ReviewsEngagement     → Google Reviews carousel interacted with
   ============================================================ */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

/** Guard — returns false if fbq is not available (SSR / ad-blocker). */
function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
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

// ─── Standard Events ─────────────────────────────────────────

/** Lead — form submit with advanced matching (first name + phone hashed). */
export async function trackLead(firstName: string, phone: string): Promise<void> {
  if (!canTrack()) return;
  const normPhone = normalisePhone(phone);
  const [hashedFn, hashedPh] = await Promise.all([sha256(firstName), sha256(normPhone)]);
  window.fbq("track", "Lead", {
    content_name: "Free Solar Survey",
    content_category: "Solar Installation",
    value: 0,
    currency: "GBP",
  }, {
    eventID: `lead_${Date.now()}`,
    fn: hashedFn,
    ph: hashedPh,
  });
}

/** Contact — phone or email link clicked.
 *  @param method  "phone" | "email" — distinguishes the channel. */
export function trackContact(method: "phone" | "email" = "phone"): void {
  if (!canTrack()) return;
  window.fbq("track", "Contact", {
    content_name: method === "phone" ? "Phone Call" : "Email",
    content_category: "Solar Installation",
  });
}

/** ViewContent — fired when a meaningful section enters the viewport.
 *  @param contentName  Human-readable label for the section viewed. */
export function trackViewContent(contentName: string): void {
  if (!canTrack()) return;
  window.fbq("track", "ViewContent", {
    content_name: contentName,
    content_category: "Solar Installation",
    content_type: "section",
  });
}

/** InitiateCheckout — fired when a visitor signals intent to book.
 *  Used for CTA button clicks and first form keystroke. */
export function trackInitiateCheckout(trigger: string): void {
  if (!canTrack()) return;
  window.fbq("track", "InitiateCheckout", {
    content_name: "Free Solar Survey",
    content_category: "Solar Installation",
    trigger,
    value: 0,
    currency: "GBP",
  });
}

// ─── Custom Events ────────────────────────────────────────────

/** ScrollDepth — fires once per milestone (25 / 50 / 75 / 90). */
export function trackScrollDepth(percent: 25 | 50 | 75 | 90): void {
  if (!canTrack()) return;
  window.fbq("trackCustom", "ScrollDepth", {
    percent,
    page: "orioenergy.com",
  });
}

/** FAQEngagement — visitor opened an FAQ accordion item. */
export function trackFAQEngagement(question: string): void {
  if (!canTrack()) return;
  window.fbq("trackCustom", "FAQEngagement", {
    question,
    content_category: "Solar Installation",
  });
}

/** VideoEngagement — Oliver waving video started playing. */
export function trackVideoEngagement(): void {
  if (!canTrack()) return;
  window.fbq("trackCustom", "VideoEngagement", {
    video_title: "Oliver Lawrence Introduction",
    content_category: "Solar Installation",
  });
}

/** ReviewsEngagement — visitor interacted with the Google Reviews carousel. */
export function trackReviewsEngagement(): void {
  if (!canTrack()) return;
  window.fbq("trackCustom", "ReviewsEngagement", {
    content_name: "Google Reviews Carousel",
    content_category: "Social Proof",
  });
}
