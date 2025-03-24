import { collection, deleteDoc, doc } from "firebase/firestore";

import { db } from "../lib/firebase";

export async function cancelConsult(id: string) {
  const consultsCollection = doc(collection(db, "consults"), id);
  await deleteDoc(consultsCollection);
}
