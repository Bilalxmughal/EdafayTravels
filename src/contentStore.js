// ─── contentStore.js — Edafay CMS Data Store ─────────────────────────────────
// All pages read from here. Dashboard writes here. localStorage persists data.

export const DEFAULTS = {

  // ── Global Visibility Toggles ────────────────────────────────────────────
  sections: {
    hero:       true,
    umrah:      true,
    carRental:  true,
    features:   true,
    visa:       true,
    reviews:    true,
    cta:        true,
  },

  // ── Hero Section ─────────────────────────────────────────────────────────
  hero: {
    heading1: "Discover Your",
    headingAccent: "Umrah",
    headingItalic: "Package",
    subtext: "Plan unforgettable journeys with our expert Umrah travel guides — your perfect Umrah trip awaits.",
    stat1Num: "10K+", stat1Label: "Happy Travelers",
    stat2Num: "20+",  stat2Label: "Destinations",
    stat3Num: "5Yr",  stat3Label: "Experience",
    badgeLabel: "Next Umrah",
    badgeSub: "Makkah & Madina",
    heroImage: "https://scontent.flhe3-2.fna.fbcdn.net/v/t39.30808-6/648106452_122114880333209329_4710445315082844352_n.png?_nc_cat=102&ccb=1-7&_nc_sid=2a1932&_nc_ohc=jTYChci6zIcQ7kNvwE9yl85&_nc_oc=Adkv4jV6vZpsOWfDhQdPv4fdTrExSj7SYVYaQP1p54PMkdBj7X8yt-HBFfClXc_SoyI&_nc_zt=23&_nc_ht=scontent.flhe3-2.fna&_nc_gid=2nCmH9BrzPt5eW4pCemgnA&_nc_ss=8&oh=00_Afyrm0_NbeWCRM1_XA1B2bZFu9pyTKmuQenH71yHYYdktQ&oe=69B4F9E2",
  },

  // ── Umrah Section ────────────────────────────────────────────────────────
  umrahSection: {
    heading: "Umrah",
    headingAccent: "Packages",
    subtext: "We offer carefully designed Umrah packages for every budget — from economy to luxury — including visa processing, flights, hotel accommodation, and transportation.",
  },
  umrahPackages: [
    { id:1, name:"Economy Umrah Package",  category:"Economy",  img:"https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=600&q=80",  price:"PKR 195,000", rating:"4.8", reviews:"1.2k", tag:"Best Value",     days:"15 Days" },
    { id:2, name:"Standard Umrah Package", category:"Standard", img:"https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80",  price:"PKR 280,000", rating:"4.9", reviews:"2.4k", tag:"Popular",        days:"21 Days" },
    { id:3, name:"Premium Umrah Package",  category:"Premium",  img:"https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&q=80",  price:"PKR 420,000", rating:"5.0", reviews:"980",  tag:"Recommended",   days:"14 Days" },
    { id:4, name:"Luxury Umrah Package",   category:"Luxury",   img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",  price:"PKR 650,000", rating:"5.0", reviews:"540",  tag:"Exclusive",     days:"18 Days" },
    { id:5, name:"Family Umrah Package",   category:"Family",   img:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",  price:"PKR 520,000", rating:"4.9", reviews:"760",  tag:"Family Special", days:"20 Days" },
    { id:6, name:"Group Umrah Package",    category:"Economy",  img:"https://images.unsplash.com/photo-1516571137133-b5d1a6f14e96?w=600&q=80",  price:"PKR 175,000", rating:"4.7", reviews:"1.8k", tag:"Group Deal",    days:"12 Days" },
  ],

  // ── Car Rental Section ───────────────────────────────────────────────────
  carsSection: {
    heading: "Book the",
    headingAccent: "Car You Love",
    subtext: "From hatchbacks to coaches — 4 to 28 seats. Toyota, Honda, Suzuki and more. With driver or self drive — your choice!",
  },
  carRentalHighlights: [
    { id:1, name:"Toyota Corolla",     company:"Toyota", type:"Sedan",       seats:4,  img:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80", price:"PKR 8,000",  tag:"Most Popular", available:true  },
    { id:2, name:"Toyota Fortuner",    company:"Toyota", type:"SUV",         seats:6,  img:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80", price:"PKR 22,000", tag:"Luxury SUV",   available:true  },
    { id:3, name:"Toyota Coaster",     company:"Toyota", type:"Coaster",     seats:28, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", price:"PKR 35,000", tag:"Group Travel", available:true  },
    { id:4, name:"Honda Civic",        company:"Honda",  type:"Sedan",       seats:4,  img:"https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80", price:"PKR 9,500",  tag:"Premium",      available:true  },
    { id:5, name:"KIA Sportage",       company:"KIA",    type:"SUV",         seats:6,  img:"https://images.unsplash.com/photo-1580711508375-56e8c39e8d7d?w=600&q=80", price:"PKR 16,000", tag:"Modern SUV",   available:true  },
    { id:6, name:"Toyota HiAce Cabin", company:"Toyota", type:"Grand Cabin", seats:13, img:"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80", price:"PKR 18,000", tag:"Family Cabin", available:true  },
  ],

  // ── Visa Section ─────────────────────────────────────────────────────────
  visaSection: {
    heading: "Get Your",
    headingAccent: "Visa",
    headingEnd: "Hassle-Free",
    subtext: "We provide tourist visa services for 8+ countries with fast processing and a high approval rate.",
  },
  visasList: [
    { id:1, country:"Malaysia",     flag:"🇲🇾", img:"https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80", type:"Tourist",         processing:"3-5 Days",  fee:"PKR 8,500",  approvalRate:"99%" },
    { id:2, country:"UAE (Dubai)",  flag:"🇦🇪", img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", type:"Tourist",         processing:"2-4 Days",  fee:"PKR 22,000", approvalRate:"98%" },
    { id:3, country:"Turkey",       flag:"🇹🇷", img:"https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", type:"e-Visa",          processing:"1-3 Days",  fee:"PKR 12,000", approvalRate:"97%" },
    { id:4, country:"Maldives",     flag:"🇲🇻", img:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", type:"Visa On Arrival", processing:"On Arrival",fee:"FREE",       approvalRate:"100%" },
    { id:5, country:"Azerbaijan",   flag:"🇦🇿", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", type:"e-Visa",          processing:"3 Days",    fee:"PKR 9,500",  approvalRate:"98%" },
    { id:6, country:"Saudi Arabia", flag:"🇸🇦", img:"https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80", type:"Tourist / Umrah", processing:"7-10 Days", fee:"PKR 28,000", approvalRate:"96%" },
  ],

  // ── Reviews Section ──────────────────────────────────────────────────────
  reviewsSection: {
    heading: "What Our",
    headingAccent: "Travelers",
    headingEnd: "Say",
    subtext: "Real stories from real adventures. Join 10,000+ happy pilgrims who have completed Umrah with Edafay.",
  },

  // ── CTA Section ──────────────────────────────────────────────────────────
  ctaSection: {
    heading: "Ready for Your Next",
    headingAccent: "Trip?",
    subtext: "Join thousands of explorers who have discovered the world with Edafay. Subscribe and get exclusive deals, tips and early access.",
  },
};

const STORAGE_KEY = "edafay_cms_v1";
const EVENT_NAME  = "edafay_content_updated";

export function getContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
    const saved = JSON.parse(raw);
    // Deep merge: defaults fill any missing keys
    return deepMerge(JSON.parse(JSON.stringify(DEFAULTS)), saved);
  } catch {
    return JSON.parse(JSON.stringify(DEFAULTS));
  }
}

export function saveContent(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    console.error("CMS save error:", e);
  }
}

export function resetContent() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export { EVENT_NAME };

function deepMerge(target, source) {
  if (!source) return target;
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (Array.isArray(source[key])) {
      out[key] = source[key];
    } else if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      out[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}