import { db } from "../firebase";
import {
  collection, addDoc, updateDoc, doc,
  onSnapshot, query, orderBy, arrayUnion
} from "firebase/firestore";

const COL = "inquiries";

// ✅ Real-time inquiries fetch
export function subscribeInquiries(callback) {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}

// ✅ Inquiry add karna
export async function addInquiry(category, form) {
  const docRef = await addDoc(collection(db, COL), {
    category,
    status:     "open",
    priority:   "medium",
    createdAt:  new Date().toISOString(),
    assignedTo: null,
    comments:   [],
    form,
  });
  return docRef.id;
}

// ✅ Inquiry update karna
export async function updateInquiry(id, patch) {
  await updateDoc(doc(db, COL, id), patch);
}

// ✅ Comment add karna
export async function addComment(id, author, text) {
  await updateDoc(doc(db, COL, id), {
    comments: arrayUnion({
      id:     Date.now(),
      author,
      text,
      time:   new Date().toISOString(),
    }),
  });
}