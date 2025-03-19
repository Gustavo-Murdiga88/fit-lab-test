import { deleteDoc, doc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function deleteAgenda({
  id,
}: {
  id: string;
  ref: HTMLButtonElement;
}) {
  const agenda = doc(db, "agendas", id);
  await deleteDoc(agenda);
}
