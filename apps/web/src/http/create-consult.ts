import { addDoc, collection } from "firebase/firestore";

import type { PayloadConsultProps } from "@/app/(manager)/consults/components/modal-new-consult";
import { db } from "@/lib/firebase";

export async function createNewConsult(data: PayloadConsultProps) {
  const consultsCollection = collection(db, "consults");
  await addDoc(consultsCollection, data);
}
