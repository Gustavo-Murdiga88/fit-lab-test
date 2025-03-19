import { doc, updateDoc } from "firebase/firestore";

import type { AgendaProps } from "@/app/(manager)/agendas/components/modal-agenda";
import { db } from "@/lib/firebase";

export async function editAgenda(
  data: AgendaProps & { id: string; nutritionistId: string },
) {
  const agenda = doc(db, "agendas", data.id);
  await updateDoc(agenda, {
    ...data,
    intervalEnd: data.times.slice(-1)[0]?.interval.end,
    intervalInit: data.times.slice(-1)[0]?.interval.start,
  });
}
