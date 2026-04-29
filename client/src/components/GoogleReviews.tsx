import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackReviewsEngagement } from "@/lib/pixel";

/* ============================================================
   GoogleReviews — Orio Electrical Services
   Design: Matches Google Reviews widget style from screenshot.
   - White cards with rounded corners and subtle border/shadow
   - Avatar: circular photo or coloured initial
   - Blue verified tick (Google checkmark)
   - "X months ago on Google" with Google wordmark
   - 5 gold stars
   - Truncated review text with "Read more" expand
   - Horizontal scroll with prev/next arrow buttons
   ============================================================ */

interface Review {
  name: string;
  initial: string;
  avatarColor: string;
  avatarImg?: string;
  timeAgo: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    name: "Jessica Ham...",
    initial: "J",
    avatarColor: "#E8A87C",
    avatarImg: "https://lh3.googleusercontent.com/a/ACg8ocILzOYFpMBfKbKSXFVfhVnAiRUNJsYNJFJqGHFHMQVd=s40-c",
    timeAgo: "1 month ago",
    text: "Fantastic company to deal with, from start to finish, Ollys expertise and professionalism was second to none. He was very thorough in his assessment and the installation was completed to a very high standard.",
  },
  {
    name: "dannyboy26...",
    initial: "d",
    avatarColor: "#6B7280",
    timeAgo: "1 month ago",
    text: "Used Orio to have some new lighting and ring main put in. Oliver was very professional and tidy. Would highly recommend and will be using again for future electrical work.",
  },
  {
    name: "Rich",
    initial: "R",
    avatarColor: "#D97706",
    timeAgo: "1 month ago",
    text: "Easy communication, turned up on time and did a good job for a fair price. Would definitely recommend and use again.",
  },
  {
    name: "Nic Robinson",
    initial: "N",
    avatarColor: "#7C3AED",
    timeAgo: "2 months ago",
    text: "Olly installed solar panels and batteries. The system works brilliantly and we are already seeing the savings on our electricity bills. Olly was professional, tidy and explained everything clearly.",
  },
  {
    name: "V C",
    initial: "V",
    avatarColor: "#059669",
    timeAgo: "2 months ago",
    text: "Olly is unbelievably thorough. His knowledge is hugely impressive and he takes the time to explain everything in detail. The installation was completed to an extremely high standard.",
  },
  {
    name: "Sarah T.",
    initial: "S",
    avatarColor: "#2563EB",
    timeAgo: "3 months ago",
    text: "I was so nervous about being pressured into something expensive. Oliver was the complete opposite — calm, honest, and realistic. Three months on our bills are down by over £130 a month.",
  },
  {
    name: "Mark H.",
    initial: "M",
    avatarColor: "#DC2626",
    timeAgo: "3 months ago",
    text: "Every other company sent a salesperson. Oliver came himself, looked at our roof, asked about our usage and gave us a straight answer. Bills dropped from £285 to under £90 most months.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="#FBBC04">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Google "G" wordmark SVG
function GoogleWordmark() {
  return (
    <svg viewBox="0 0 75 24" className="h-4 w-auto" aria-label="Google">
      <path d="M29.89 12.27c0 3.74-2.93 6.5-6.5 6.5s-6.5-2.76-6.5-6.5 2.93-6.5 6.5-6.5 6.5 2.76 6.5 6.5zm-2.85 0c0-2.34-1.7-3.94-3.65-3.94s-3.65 1.6-3.65 3.94 1.7 3.94 3.65 3.94 3.65-1.6 3.65-3.94z" fill="#EA4335"/>
      <path d="M44.89 12.27c0 3.74-2.93 6.5-6.5 6.5s-6.5-2.76-6.5-6.5 2.93-6.5 6.5-6.5 6.5 2.76 6.5 6.5zm-2.85 0c0-2.34-1.7-3.94-3.65-3.94s-3.65 1.6-3.65 3.94 1.7 3.94 3.65 3.94 3.65-1.6 3.65-3.94z" fill="#FBBC05"/>
      <path d="M59.39 6.1v12.55c0 5.17-3.05 7.28-6.65 7.28-3.39 0-5.43-2.27-6.2-4.13l2.48-1.03c.48 1.14 1.64 2.49 3.72 2.49 2.43 0 3.94-1.5 3.94-4.32v-1.06h-.1c-.72.9-2.12 1.68-3.88 1.68-3.69 0-7.07-3.21-7.07-7.34 0-4.16 3.38-7.4 7.07-7.4 1.75 0 3.15.78 3.88 1.65h.1V6.1h2.71zm-2.51 6.2c0-2.29-1.53-3.97-3.48-3.97-1.97 0-3.62 1.68-3.62 3.97 0 2.27 1.65 3.91 3.62 3.91 1.95 0 3.48-1.64 3.48-3.91z" fill="#4285F4"/>
      <path d="M64.89 1v17.5h-2.79V1h2.79z" fill="#34A853"/>
      <path d="M75.39 14.97l2.21 1.47c-.71 1.05-2.43 2.83-5.4 2.83-3.68 0-6.43-2.84-6.43-6.5 0-3.87 2.77-6.5 6.11-6.5 3.37 0 5.01 2.18 5.55 3.36l.3.73-8.66 3.59c.66 1.3 1.69 1.96 3.13 1.96 1.45 0 2.45-.71 3.19-1.94zm-6.8-2.33l5.79-2.4c-.32-.81-1.27-1.37-2.4-1.37-1.44 0-3.44 1.27-3.39 3.77z" fill="#EA4335"/>
      <path d="M10.2 10.75V8.03h9.3c.09.48.14.98.14 1.56 0 1.93-.53 4.32-2.23 6.01-1.65 1.71-3.77 2.62-6.21 2.62C5.1 18.22.75 14 .75 7.88.75 1.76 5.1-2.46 11.2-2.46c3.52 0 6.03 1.38 7.91 3.18L17.2 2.63c-1.38-1.3-3.25-2.3-6-2.3-4.9 0-8.74 3.95-8.74 8.85 0 4.9 3.84 8.85 8.74 8.85 3.18 0 5-1.28 6.16-2.44 1-1 1.65-2.43 1.9-4.38l-8.06-.46z" fill="#4285F4"/>
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const SHORT_LIMIT = 120;
  const isLong = review.text.length > SHORT_LIMIT;
  const displayText = expanded || !isLong ? review.text : review.text.slice(0, SHORT_LIMIT) + "…";

  return (
    <div className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      {/* Header: avatar + name + time + Google */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {review.avatarImg ? (
            <img
              src={review.avatarImg}
              alt={review.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base"
              style={{ backgroundColor: review.avatarColor }}
            >
              {review.initial}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm text-gray-900 truncate">{review.name}</span>
            {/* Blue verified checkmark */}
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="#1A73E8">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-gray-500">{review.timeAgo} on</span>
            <GoogleWordmark />
          </div>
        </div>
      </div>

      {/* Stars */}
      <Stars />

      {/* Review text */}
      <div className="flex-1">
        <p className="text-sm text-gray-700 leading-relaxed">
          {displayText}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-sm font-medium mt-1 hover:underline"
            style={{ color: "#1A73E8" }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}

export function GoogleReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    trackReviewsEngagement();
  }

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors hidden sm:flex"
        aria-label="Previous reviews"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {REVIEWS.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors hidden sm:flex"
        aria-label="Next reviews"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
