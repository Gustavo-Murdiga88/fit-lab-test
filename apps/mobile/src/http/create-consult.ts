import { addDoc, collection } from "firebase/firestore";

import type { PayloadConsultProps } from "../hooks/use-hours-availible";
import { db } from "../lib/firebase";

export async function createNewConsult(data: PayloadConsultProps) {
  const consultsCollection = collection(db, "consults");
  await addDoc(consultsCollection, data);
}
