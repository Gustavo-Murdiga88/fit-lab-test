import { collection, getDocs, limit, query, where } from "firebase/firestore";

import type { AgendaProps } from "@/app/(manager)/agendas/components/modal-agenda";
import { db } from "@/lib/firebase";

export async function fetchModalAgendas({
  nutritionistId,
}: {
  nutritionistId: string;
}) {
  const q = query(
    collection(db, "agendas"),
    where("nutritionistId", "==", nutritionistId),
    limit(1),
  );
  const agendas = await getDocs(q);

  return agendas.docs.map((current) => {
    return {
      ...(current.data() as AgendaProps),
      id: current.id,
    };
  });
}
