import {
  collection,
  doc,
  getDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";


export type AgendaProps = {
  title: string;
  subTitle: string;
  times: {
    interval: {
      start: Date,
      end: Date,
    },
    hours: {
      start: string;
      end: string;
    }[]
  }[]
}

export async function getAgendaById({
  id
}: { id: string }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await getDoc(doc(collection(db, "agendas"), id));
  const current = result.data() as any

  const nutritionist = await getDoc(doc(collection(db, "nutritionists"), current.nutritionistId));

  return {
    nutritionist: {
      name: (nutritionist.data() as any).name as string,
      crn: (nutritionist.data() as any).crn as string
    },
    initialInterval: (current.intervalInit as unknown as Timestamp).toDate(),
    finalInterval: (current.intervalEnd as unknown as Timestamp).toDate(),
    title: current.title as string,
    subTitle: current.subTitle as string,
    times: (current.times as AgendaProps["times"]).map(
      ({ hours, interval }) => ({
        hours,
        interval: {
          end: (interval.end as unknown as Timestamp).toDate(),
          start: (interval.start as unknown as Timestamp).toDate(),
        },
      }),
    )
  }
}
