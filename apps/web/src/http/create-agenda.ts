import { addDoc, collection } from "firebase/firestore";

import type { AgendaProps } from "@/app/(manager)/agendas/components/modal-agenda";
import { db } from "@/lib/firebase";

export async function createAgenda(
  data: AgendaProps & {
    nutritionistId: string;
  },
) {
  const start = data.times.slice(-1)[0]?.interval.start;
  start?.setHours(0, 0, 0, 0);
  const end = data.times.slice(-1)[0]?.interval.end;
  end?.setHours(0, 0, 0, 0);

  await addDoc(collection(db, "agendas"), {
    ...data,
    intervalInit: start,
    intervalEnd: end,
  });
}
