import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveBooking = async (category, formData) => {
  try {
    await addDoc(collection(db, `${category}_bookings`), {
      ...formData,
      createdAt: serverTimestamp(),
      status: "pending"
    });
    console.log("Booking saved!");
  } catch (error) {
    console.error("Error saving booking:", error);
    throw error;
  }
};