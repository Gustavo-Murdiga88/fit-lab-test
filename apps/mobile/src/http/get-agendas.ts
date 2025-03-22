import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

type AgendaProps = {
  title: string;
  subTitle: string;
  times: {
    interval: {
      start: Timestamp;
      end: Timestamp;
    };
    hours: {
      start: string;
      end: string;
    };
  }[];
};

export async function getAgendas() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const q = query(collection(db, "agendas"), where("intervalEnd", ">=", today));
  const result = await getDocs(q);

  const agendas = [];

  for (const agenda of result.docs) {
    const nutritionist = await getDoc(
      doc(
        collection(db, "nutritionists"),
        (agenda.data() as any).nutritionistId,
      ),
    );

    agendas.push({
      nutritionist: {
        id: (agenda.data() as any).nutritionistId as string,
        name: (nutritionist.data() as any).name as string,
        crn: (nutritionist.data() as any).crn as string,
      },
      initialInterval: (
        agenda.data().intervalInit as unknown as Timestamp
      ).toDate(),
      finalInterval: (
        agenda.data().intervalEnd as unknown as Timestamp
      ).toDate(),
      title: agenda.data().title as string,
      subTitle: agenda.data().subTitle as string,
      times: (agenda.data().times as AgendaProps["times"]).map(
        ({ hours, interval }) => ({
          hours,
          interval: {
            end: (interval.end as unknown as Timestamp).toDate(),
            start: (interval.start as unknown as Timestamp).toDate(),
          },
        }),
      ),
      id: agenda.id,
    });
  }

  return agendas;
}
