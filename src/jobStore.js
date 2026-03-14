// ─── jobStore.js — Careers & Job Applications ────────────────────────────────
const JOBS_KEY = "edafay_jobs_v1";
const APPS_KEY = "edafay_applications_v1";
const JOB_EV  = "edafay_jobs_updated";

export const APP_STATUSES = {
  new:      { label:"New",       color:"#1a3c6e", bg:"rgba(26,60,110,0.1)"  },
  reviewing:{ label:"Reviewing", color:"#ea580c", bg:"rgba(234,88,12,0.1)"  },
  interview:{ label:"Interview", color:"#7c3aed", bg:"rgba(124,58,237,0.1)" },
  hired:    { label:"Hired",     color:"#16a34a", bg:"rgba(22,163,74,0.1)"  },
  rejected: { label:"Rejected",  color:"#dc2626", bg:"rgba(239,68,68,0.1)"  },
};

const DEFAULT_JOBS = [
  { id:"JOB-001", title:"Senior Travel Consultant", department:"Sales", type:"Full-time", location:"Lahore", salary:"PKR 80,000–120,000/month", description:"We are looking for an experienced travel consultant to manage client relationships and design customized Umrah and tour packages. You will be responsible for handling inquiries, making bookings, and ensuring client satisfaction.", requirements:["3+ years travel industry experience","Strong communication skills","Knowledge of Umrah packages and visa processes","Proficiency in MS Office"], active:true, postedAt:"2026-03-01" },
  { id:"JOB-002", title:"Digital Marketing Executive", department:"Marketing", type:"Full-time", location:"Lahore / Remote", salary:"PKR 60,000–90,000/month", description:"Manage our social media presence, run digital campaigns, and grow our online brand. You will work on Facebook, Instagram, and Google Ads to drive leads for our travel services.", requirements:["2+ years digital marketing experience","Experience with Meta & Google Ads","Content creation skills","SEO knowledge a plus"], active:true, postedAt:"2026-03-05" },
  { id:"JOB-003", title:"Customer Support Agent", department:"Support", type:"Full-time", location:"Lahore", salary:"PKR 40,000–55,000/month", description:"Handle customer inquiries via phone, WhatsApp, and email. Assist clients with package information, booking confirmations, and post-travel support.", requirements:["Excellent verbal and written communication","Patience and problem-solving ability","Travel industry knowledge preferred","Urdu and English fluency"], active:true, postedAt:"2026-03-08" },
  { id:"JOB-004", title:"Visa Processing Officer", department:"Operations", type:"Full-time", location:"Lahore", salary:"PKR 50,000–70,000/month", description:"Handle visa applications for UAE, Saudi Arabia, Malaysia, and other destinations. Ensure all documentation is complete and submitted on time.", requirements:["Experience in visa processing preferred","Attention to detail","Knowledge of embassy requirements","Good organizational skills"], active:false, postedAt:"2026-02-15" },
];

const DEFAULT_APPS = [
  { id:"APP-001", jobId:"JOB-001", jobTitle:"Senior Travel Consultant", name:"Ahmad Raza", phone:"0301-1234567", email:"ahmad@gmail.com", coverLetter:"I have 5 years of experience in the travel industry and have managed Umrah packages for hundreds of clients.", resumeName:"Ahmad_Raza_CV.pdf", status:"interview", statusReason:"", appliedAt:"2026-03-02T10:00:00Z", assignedTo:null, notes:"" },
  { id:"APP-002", jobId:"JOB-001", jobTitle:"Senior Travel Consultant", name:"Sara Khan", phone:"0321-9876543", email:"sara.k@outlook.com", coverLetter:"Passionate travel professional with 4 years experience. Strong client management skills.", resumeName:"Sara_CV.pdf", status:"reviewing", statusReason:"", appliedAt:"2026-03-03T14:00:00Z", assignedTo:null, notes:"" },
  { id:"APP-003", jobId:"JOB-002", jobTitle:"Digital Marketing Executive", name:"Bilal Hassan", phone:"0333-5555555", email:"bilal@gmail.com", coverLetter:"Digital marketing specialist with expertise in Meta Ads and content creation.", resumeName:"Bilal_Portfolio.pdf", status:"new", statusReason:"", appliedAt:"2026-03-06T09:00:00Z", assignedTo:null, notes:"" },
  { id:"APP-004", jobId:"JOB-003", jobTitle:"Customer Support Agent", name:"Nadia Malik", phone:"0312-4444444", email:"nadia.m@gmail.com", coverLetter:"Experienced customer service professional. Fluent in Urdu and English.", resumeName:"Nadia_CV.pdf", status:"hired", statusReason:"Best candidate for the role", appliedAt:"2026-03-09T11:00:00Z", assignedTo:null, notes:"Start date: March 20" },
];

function loadJobs()  { try { return JSON.parse(localStorage.getItem(JOBS_KEY)) || DEFAULT_JOBS; } catch { return DEFAULT_JOBS; } }
function loadApps()  { try { return JSON.parse(localStorage.getItem(APPS_KEY)) || DEFAULT_APPS; } catch { return DEFAULT_APPS; } }
function emit()      { window.dispatchEvent(new Event(JOB_EV)); }

export function getJobs()           { return loadJobs(); }
export function saveJobs(jobs)      { localStorage.setItem(JOBS_KEY, JSON.stringify(jobs)); emit(); }
export function getApplications()   { return loadApps(); }
export function saveApplications(a) { localStorage.setItem(APPS_KEY, JSON.stringify(a)); emit(); }

export function addJob(job) {
  const jobs = loadJobs();
  const num  = String(jobs.length + 1).padStart(3, "0");
  const newJob = { ...job, id:`JOB-${num}`, postedAt:new Date().toISOString().split("T")[0] };
  saveJobs([...jobs, newJob]);
  return newJob;
}
export function updateJob(id, patch)     { saveJobs(loadJobs().map(j => j.id===id ? { ...j, ...patch } : j)); }
export function deleteJob(id)            { saveJobs(loadJobs().filter(j => j.id!==id)); }
export function updateApplication(id, patch) { saveApplications(loadApps().map(a => a.id===id ? { ...a, ...patch } : a)); }

export function submitApplication(jobId, jobTitle, form) {
  const apps = loadApps();
  const num  = String(apps.length + 1).padStart(3, "0");
  const app  = { ...form, id:`APP-${num}`, jobId, jobTitle, status:"new", statusReason:"", appliedAt:new Date().toISOString(), assignedTo:null, notes:"" };
  saveApplications([app, ...apps]);
  return app;
}

export { JOB_EV };