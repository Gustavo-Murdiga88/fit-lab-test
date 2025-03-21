import {
  collection,
  getDocs, query,
  Timestamp,
  where
} from "firebase/firestore";
import { db } from "../lib/firebase";


type AgendaProps = {
  title: string;
  subTitle: string;
  times: {
    interval: {
      start: Timestamp,
      end: Timestamp,
    },
    hours: {
      start: string;
      end: string;
    }
  }[]
}

export async function getAgendas() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, "agendas"),
    where("intervalEnd", ">=", today)
  );
  const result = await getDocs(q);
  const agendas = result.docs.map((current) => {
    return {
      initialInterval: (current.data().intervalInit as unknown as Timestamp).toDate(),
      finalInterval: (current.data().intervalEnd as unknown as Timestamp).toDate(),
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
    };
  });

  return agendas;
}
