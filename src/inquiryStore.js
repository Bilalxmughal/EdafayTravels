// ─── inquiryStore.js — Ticket & Inquiry Management ───────────────────────────
const KEY = "edafay_inquiries_v2";
const EV  = "edafay_inquiries_updated";

export const CATEGORIES = {
  umrah:     { label:"Umrah Package", icon:"🕌", color:"#1a3c6e" },
  visa:      { label:"Visa",          icon:"🛂", color:"#0369a1" },
  insurance: { label:"Insurance",     icon:"🛡️", color:"#16a34a" },
  flight:    { label:"Flight",        icon:"✈️", color:"#7c3aed" },
  car:       { label:"Car Rental",    icon:"🚗", color:"#dc2626" },
};

export const STATUSES = {
  open:        { label:"Open",        color:"#dc2626", bg:"rgba(239,68,68,0.1)"  },
  in_progress: { label:"In Progress", color:"#ea580c", bg:"rgba(234,88,12,0.1)" },
  closed:      { label:"Closed",      color:"#16a34a", bg:"rgba(22,163,74,0.1)" },
};

export const PRIORITIES = {
  high:   { label:"High",   color:"#dc2626" },
  medium: { label:"Medium", color:"#ea580c" },
  low:    { label:"Low",    color:"#16a34a" },
};

// ── Seed demo data so dashboard isn't empty ───────────────────────────────────
const SEED = [
  { id:"TK-0001", category:"umrah",     status:"open",        priority:"high",   createdAt:"2026-03-01T09:00:00Z", assignedTo:null, comments:[],
    form:{ name:"Ahmed Khan",    phone:"0300-1234567", email:"ahmed@gmail.com",  pkg:"Premium Umrah Package – PKR 420,000", persons:2, notes:"Need wheelchair accessible rooms" }},
  { id:"TK-0002", category:"car",       status:"in_progress", priority:"medium", createdAt:"2026-03-02T10:30:00Z", assignedTo:"content@edafay.com", comments:[{ id:1, author:"Content Manager", text:"Driver assigned, will call tomorrow.", time:"2026-03-02T14:00:00Z" }],
    form:{ name:"Bilal Mughal",  phone:"0321-9876543", email:"bilal@gmail.com",  carType:"SUV", carName:"Toyota Fortuner", city:"Lahore", pickLoc:"DHA Phase 5", dropArea:"Gulberg", pickDate:"2026-03-20", returnDate:"2026-03-25" }},
  { id:"TK-0003", category:"visa",      status:"closed",      priority:"low",    createdAt:"2026-03-03T08:00:00Z", assignedTo:"content@edafay.com", comments:[{ id:1, author:"Content Manager", text:"Visa approved and sent.", time:"2026-03-05T10:00:00Z" }],
    form:{ name:"Sara Malik",    phone:"0333-5555555", email:"sara@hotmail.com", country:"UAE (Dubai)", visaType:"Tourist Visa", persons:1 }},
  { id:"TK-0004", category:"flight",    status:"open",        priority:"medium", createdAt:"2026-03-04T11:00:00Z", assignedTo:null, comments:[],
    form:{ name:"Zain Abbas",    phone:"0312-4444444", email:"",                 tripType:"Return", from:"LHE – Lahore", to:"DXB – Dubai", depDate:"2026-04-01", cabinClass:"Business Class", adults:2, children:0 }},
  { id:"TK-0005", category:"insurance", status:"open",        priority:"low",    createdAt:"2026-03-05T09:30:00Z", assignedTo:null, comments:[],
    form:{ name:"Fatima Rizvi",  phone:"0345-3333333", email:"f.rizvi@gmail.com",country:"Malaysia", duration:"2 Weeks", startDate:"2026-04-10", planType:"Family Plan" }},
  { id:"TK-0006", category:"umrah",     status:"in_progress", priority:"high",   createdAt:"2026-03-06T07:00:00Z", assignedTo:"admin@edafay.com", comments:[{ id:1, author:"Super Admin", text:"Package confirmed, visa in process.", time:"2026-03-07T09:00:00Z" }],
    form:{ name:"Hamza Nawaz",   phone:"0301-2222222", email:"hamza@gmail.com",  pkg:"Luxury Umrah Package – PKR 650,000", persons:4, notes:"VIP hotel requested" }},
  { id:"TK-0007", category:"car",       status:"open",        priority:"medium", createdAt:"2026-03-07T13:00:00Z", assignedTo:null, comments:[],
    form:{ name:"Nadia Tariq",   phone:"0322-1111111", email:"nadia@gmail.com",  carType:"Hatchback", carName:"Suzuki Alto", city:"Karachi", pickLoc:"Clifton", dropArea:"PECHS", pickDate:"2026-03-18", returnDate:"2026-03-18" }},
  { id:"TK-0008", category:"visa",      status:"open",        priority:"high",   createdAt:"2026-03-08T10:00:00Z", assignedTo:null, comments:[],
    form:{ name:"Omar Sheikh",   phone:"0316-8888888", email:"omar@outlook.com", country:"United Kingdom", visaType:"Tourist Visa", persons:3 }},
];

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || SEED; }
  catch { return SEED; }
}
function emit() { window.dispatchEvent(new Event(EV)); }

export function getInquiries() { return load(); }

export function addInquiry(category, form) {
  const all = load();
  const num = String(all.length + 1).padStart(4, "0");
  const ticket = {
    id:         `TK-${num}`,
    category,
    status:     "open",
    priority:   "medium",
    createdAt:  new Date().toISOString(),
    assignedTo: null,
    comments:   [],
    form,
  };
  const updated = [ticket, ...all];
  localStorage.setItem(KEY, JSON.stringify(updated));
  emit();
  return ticket;
}

export function updateInquiry(id, patch) {
  const all = load().map(t => t.id === id ? { ...t, ...patch } : t);
  localStorage.setItem(KEY, JSON.stringify(all));
  emit();
}

export function addComment(id, author, text) {
  const all = load().map(t => {
    if (t.id !== id) return t;
    return { ...t, comments: [...t.comments, { id: Date.now(), author, text, time: new Date().toISOString() }] };
  });
  localStorage.setItem(KEY, JSON.stringify(all));
  emit();
}

export { EV as INQUIRY_EVENT };