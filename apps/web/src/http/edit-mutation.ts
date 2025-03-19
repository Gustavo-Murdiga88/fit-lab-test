import { collection, doc, updateDoc } from "firebase/firestore";

import type { PayloadConsultProps } from "@/app/(manager)/consults/components/modal-new-consult";
import { db } from "@/lib/firebase";

export async function editConsult(data: PayloadConsultProps & { id: string }) {
  const consultsCollection = collection(db, "consults");
  const currentConsult = doc(consultsCollection, data.id);
  await updateDoc(currentConsult, data);
}
