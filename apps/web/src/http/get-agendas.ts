import {
  collection,
  getDocs,
  limit,
  query,
  type Timestamp,
  where,
} from "firebase/firestore";
import { createRef } from "react";

import type { AgendaProps } from "@/app/(manager)/agendas/components/modal-agenda";
import { db } from "@/lib/firebase";

export async function getAgendas({
  nutritionistId,
}: {
  nutritionistId: string;
}) {
  const q = query(
    collection(db, "agendas"),
    where("nutritionistId", "==", nutritionistId),
    limit(4),
  );
  const result = await getDocs(q);
  const agendas = result.docs.map((current) => {
    const ref = createRef<HTMLButtonElement>();
    const alertRef = createRef<HTMLButtonElement>();
    return {
      title: current.data().title as string,
      subTitle: current.data().subTitle as string,
      times: (current.data().times as AgendaProps["times"]).map(
        ({ hours, interval }) => ({
          hours,
          interval: {
            end: (interval.end as unknown as Timestamp).toDate(),
            start: (interval.start as unknown as Timestamp).toDate(),
          },
        }),
      ),
      id: current.id,
      ref,
      alertRef,
    };
  });

  return agendas;
}
