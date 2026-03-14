// ─── blogStore.js — Blog Posts Store ─────────────────────────────────────────
const KEY = "edafay_blog_v1";
const EV  = "edafay_blog_updated";

const DEFAULT_POSTS = [
  {
    id:"BLOG-001", slug:"umrah-guide-2026", status:"published",
    category:"Umrah", tags:["Umrah","Guide","2026"],
    title:"Complete Umrah Guide 2026 — Everything You Need to Know",
    excerpt:"Planning your Umrah trip in 2026? This comprehensive guide covers visa requirements, best hotels near Haram, transportation options, and spiritual preparation tips.",
    coverImage:"https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80",
    content:`<h2>Introduction</h2><p>Performing Umrah is one of the most spiritually rewarding experiences a Muslim can undertake. Whether it's your first time or your tenth, proper preparation makes all the difference.</p><h2>Visa Requirements</h2><p>Pakistani citizens require a valid Umrah visa sponsored by a licensed tour operator. The process typically takes 7–10 working days. Required documents include a valid passport (minimum 6 months validity), passport-size photographs, and a confirmed hotel booking.</p><h2>Best Time to Visit</h2><p>The most comfortable months are October through February when temperatures in Makkah and Madinah are between 15–25°C. Avoid the summer months of June–August when temperatures can exceed 45°C.</p><h2>Accommodation Near Haram</h2><p>Hotels within 500 meters of Masjid al-Haram offer the most convenience. Abraj Al-Bait (Makkah Clock Tower) and Hilton Suites are popular premium choices, while more budget-friendly options are available in Ajyad and Aziziyah districts.</p><h2>Packing List</h2><p>For men: two sets of Ihram cloth, comfortable walking shoes, and modest clothing for Madinah. For women: abayas, comfortable closed-toe shoes, and a small daypack. Both: a small Quran, tasbeeh, and any necessary medications.</p><h2>Transportation</h2><p>Edafay provides private transportation between Jeddah Airport, Makkah, and Madinah as part of all our packages. The journey from Jeddah to Makkah takes approximately 1.5 hours.</p>`,
    author:"Edafay Editorial Team", authorAvatar:"ET",
    publishedAt:"2026-02-15T08:00:00Z", updatedAt:"2026-02-15T08:00:00Z",
    views:1240, readTime:"8 min read",
  },
  {
    id:"BLOG-002", slug:"dubai-tourist-visa-guide", status:"published",
    category:"Visa", tags:["Dubai","UAE","Visa","Tourist"],
    title:"UAE Tourist Visa for Pakistanis — Updated 2026 Process",
    excerpt:"Step-by-step guide for Pakistanis applying for a UAE tourist visa. Includes fees, document checklist, and processing time.",
    coverImage:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    content:`<h2>Overview</h2><p>The UAE remains one of the top travel destinations for Pakistani tourists. In 2026, the visa process has become more streamlined with online applications available through approved travel agents like Edafay.</p><h2>Visa Types</h2><p>30-day single entry (PKR 18,000), 60-day single entry (PKR 28,000), and 90-day multiple entry visas are available. Transit visas for layovers over 8 hours are also available.</p><h2>Required Documents</h2><p>A valid passport (6+ months validity), colored passport photographs (white background), confirmed return flight ticket, hotel booking confirmation, and bank statement showing minimum PKR 50,000 balance are required.</p><h2>Processing Time</h2><p>Standard processing is 2–4 working days. Express processing (24 hours) is available at additional cost. Edafay's approval rate for UAE visas is 98%.</p><h2>Tips for Approval</h2><p>Ensure your passport has no travel bans. Provide a clear travel itinerary. Book refundable hotels until the visa is approved. Having a strong bank statement significantly improves chances of approval.</p>`,
    author:"Visa Team", authorAvatar:"VT",
    publishedAt:"2026-02-28T09:00:00Z", updatedAt:"2026-02-28T09:00:00Z",
    views:892, readTime:"5 min read",
  },
  {
    id:"BLOG-003", slug:"top-destinations-pakistan-2026", status:"published",
    category:"Travel Tips", tags:["Travel","Destinations","2026"],
    title:"Top 5 International Destinations for Pakistani Travelers in 2026",
    excerpt:"From the beaches of Maldives to the historic streets of Istanbul — discover the best destinations that Pakistani passport holders can visit easily.",
    coverImage:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80",
    content:`<h2>1. Maldives — Visa Free Paradise</h2><p>Pakistani passport holders get visa on arrival in Maldives. With its crystal-clear waters and overwater bungalows, it's perfect for honeymoons and anniversaries. Best time: November to April.</p><h2>2. Turkey — Cultural Marvel</h2><p>Istanbul's Hagia Sophia, the Grand Bazaar, and Cappadocia's fairy chimneys make Turkey an unforgettable destination. Pakistanis can get an e-Visa easily. Direct flights from Lahore operate several times weekly.</p><h2>3. Azerbaijan — Hidden Gem</h2><p>Baku, the capital, blends modern architecture with medieval old city charm. Pakistani citizens can get an e-Visa within 3 days. Azerbaijan is significantly more affordable than Western European destinations.</p><h2>4. Malaysia — Asian Favourite</h2><p>Kuala Lumpur, Penang, and Langkawi offer diverse experiences from city sightseeing to beach relaxation. Tourist visa is easy to obtain. Halal food is widely available.</p><h2>5. UAE — Business and Tourism Hub</h2><p>Dubai and Abu Dhabi offer world-class shopping, entertainment, and dining. With direct flights from most Pakistani cities, UAE remains the most popular international destination for Pakistanis.</p>`,
    author:"Travel Editor", authorAvatar:"TE",
    publishedAt:"2026-03-05T10:00:00Z", updatedAt:"2026-03-05T10:00:00Z",
    views:2100, readTime:"6 min read",
  },
  {
    id:"BLOG-004", slug:"travel-insurance-why-important", status:"published",
    category:"Insurance", tags:["Insurance","Travel Safety"],
    title:"Why Travel Insurance is Non-Negotiable in 2026",
    excerpt:"Medical emergencies abroad can cost tens of thousands of dollars. Learn why travel insurance is essential and how to choose the right plan.",
    coverImage:"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
    content:`<h2>The Reality of Medical Emergencies Abroad</h2><p>A single hospitalization in the UAE can cost USD 5,000–20,000. In Europe or the USA, this figure can exceed USD 50,000. Without insurance, travelers are personally liable for these costs.</p><h2>What Good Travel Insurance Covers</h2><p>Medical emergency and evacuation, trip cancellation and interruption, lost or delayed baggage, flight delays, and personal liability. Premium plans may also cover adventure sports and pre-existing conditions.</p><h2>How to Choose the Right Plan</h2><p>Match coverage to your destination. Medical costs in the USA require much higher coverage than Southeast Asia. Consider trip length — longer trips benefit from multi-entry or annual plans. Check for COVID-19 coverage if traveling to destinations with requirements.</p><h2>Edafay's Insurance Partners</h2><p>We work with TPL, EFU, Adamjee, Allianz, and AXA to offer competitive rates starting from PKR 1,200 per person for a one-week plan. Family plans provide better value for groups.</p>`,
    author:"Insurance Specialist", authorAvatar:"IS",
    publishedAt:"2026-03-10T08:00:00Z", updatedAt:"2026-03-10T08:00:00Z",
    views:675, readTime:"7 min read",
  },
  {
    id:"BLOG-005", slug:"car-rental-tips-lahore", status:"draft",
    category:"Car Rental", tags:["Car Rental","Lahore","Tips"],
    title:"Car Rental Guide — How to Book the Right Car in Lahore",
    excerpt:"Hatchback or SUV? With driver or self-drive? This guide helps you choose the perfect rental car for your trip.",
    coverImage:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80",
    content:`<h2>Choosing the Right Car Type</h2><p>For city commutes and short trips, a hatchback like Suzuki Alto or Wagon R is economical and easy to park. For family trips or longer journeys, a sedan like Toyota Corolla offers more comfort. For hill stations or off-road adventures, an SUV like Toyota Fortuner is the best choice.</p><h2>With Driver vs Self-Drive</h2><p>Edafay recommends the with-driver option for most customers, especially for airport transfers and long-distance trips. Our drivers know the routes, handle parking, and ensure a stress-free experience. Self-drive is available for customers with a valid driving license.</p><h2>Booking Tips</h2><p>Book at least 24 hours in advance for standard vehicles. For premium SUVs and coaches, book 3–5 days ahead. Always confirm the pickup location precisely. Mention any special requirements like child seats or specific routes at the time of booking.</p>`,
    author:"Operations Team", authorAvatar:"OT",
    publishedAt:null, updatedAt:"2026-03-12T10:00:00Z",
    views:0, readTime:"4 min read",
  },
];

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || DEFAULT_POSTS; } catch { return DEFAULT_POSTS; } }
function emit() { window.dispatchEvent(new Event(EV)); }

export function getBlogPosts()  { return load(); }
export function getPublished()  { return load().filter(p => p.status === "published"); }

export function saveBlogPost(post) {
  const all = load();
  const exists = all.find(p => p.id === post.id);
  const updated = exists
    ? all.map(p => p.id === post.id ? { ...p, ...post, updatedAt:new Date().toISOString() } : p)
    : [{ ...post, id:`BLOG-${String(all.length+1).padStart(3,"0")}`, views:0, publishedAt: post.status==="published"?new Date().toISOString():null, updatedAt:new Date().toISOString() }, ...all];
  localStorage.setItem(KEY, JSON.stringify(updated));
  emit();
}

export function deleteBlogPost(id) {
  localStorage.setItem(KEY, JSON.stringify(load().filter(p => p.id !== id)));
  emit();
}

export function incrementViews(id) {
  const all = load().map(p => p.id === id ? { ...p, views:(p.views||0)+1 } : p);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export { EV as BLOG_EV };