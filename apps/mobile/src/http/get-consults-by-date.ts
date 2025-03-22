import { collection, getDocs, query, where } from "firebase/firestore";

import type { PayloadConsultProps } from "../hooks/use-hours-availible";
import { db } from "../lib/firebase";

export async function fetchConsultsByDate({
  nutritionistId,
  date,
}: {
  nutritionistId: string;
  date: Date;
}) {
  const consultsCollection = collection(db, "consults");
  date.setHours(0, 0, 0, 0);
  const q = query(
    consultsCollection,
    where("nutritionistId", "==", nutritionistId),
    where("date", "==", date),
  );

  const consults = await getDocs(q);

  return consults.docs.map((current) => {
    return {
      ...(current.data() as PayloadConsultProps),
      id: current.id,
    };
  });
}
