import { db } from "../firebase";
import {
  collection, doc, getDocs, setDoc,
  updateDoc, deleteDoc
} from "firebase/firestore";

const COL = "admin_users";

// Default users — pehli baar Firebase mein seed honge
const DEFAULT_USERS = [
  { id:"1", name:"Super Admin",     email:"admin@edafay.com",    password:"admin123",   role:"super_admin", color:"#1a3c6e", active:true, createdAt:"2024-01-01", lastLogin:null },
  { id:"2", name:"Content Manager", email:"content@edafay.com",  password:"content123", role:"editor",      color:"#16a34a", active:true, createdAt:"2024-02-15", lastLogin:null },
  { id:"3", name:"Viewer Staff",    email:"view@edafay.com",     password:"view123",    role:"viewer",      color:"#7c3aed", active:true, createdAt:"2024-03-10", lastLogin:null },
];

// ✅ Seed default users (pehli baar chalega)
export async function seedUsers() {
  try {
    const snap = await getDocs(collection(db, COL));
    if (snap.empty) {
      for (const user of DEFAULT_USERS) {
        await setDoc(doc(db, COL, user.id), user);
      }
      console.log("✅ Default users seeded");
    }
  } catch (err) {
    console.error("❌ Seed error:", err);
    throw err;  // Error propagate karo taake login fail ho (safe)
  }
}

// ✅ Sare users fetch karo
export async function getUsers() {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ✅ Email + password se login
export async function loginWithEmail(email, password) {
  const snap = await getDocs(collection(db, COL));
  const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return users.find(
    u => u.email.toLowerCase() === email.toLowerCase() &&
         u.password === password &&
         u.active
  ) || null;
}

// ✅ LastLogin update karo
export async function updateLastLogin(userId) {
  await updateDoc(doc(db, COL, String(userId)), {
    lastLogin: new Date().toISOString()
  });
}

// ✅ User save/update karo
export async function saveUser(user) {
  await setDoc(doc(db, COL, String(user.id)), user);
}

// ✅ Multiple users save karo (bulk update ke liye)
export async function saveUsers(users) {
  for (const user of users) {
    await setDoc(doc(db, COL, String(user.id)), user);
  }
}

// ✅ User delete karo
export async function deleteUser(userId) {
  await deleteDoc(doc(db, COL, String(userId)));
}

// ✅ Session localStorage mein
export function getAuth() { 
  try { 
    return JSON.parse(localStorage.getItem("edafay_auth_v1")); 
  } catch { 
    return null; 
  } 
}

export function setAuthSession(user) { 
  localStorage.setItem("edafay_auth_v1", JSON.stringify(user)); 
}

export function clearAuth() { 
  localStorage.removeItem("edafay_auth_v1"); 
}