// src/utils/firestoreDelivery.js

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// Save delivery info to Firestore
export const saveDeliveryInfo = async (deliveryInfo) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid, "deliveryInfo", "default");
  await setDoc(ref, deliveryInfo);
  console.log("✅ Delivery info saved.");
};

// Fetch saved delivery info from Firestore
export const fetchDeliveryInfo = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid, "deliveryInfo", "default");
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};
