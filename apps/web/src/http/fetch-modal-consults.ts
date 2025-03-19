import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import type { PayloadConsultProps } from "@/app/(manager)/consults/components/modal-new-consult";
import { db } from "@/lib/firebase";

export async function fetchModalConsults({
  nutritionistId,
  date,
}: {
  nutritionistId: string;
  date: Date;
}) {
  const consultsCollection = collection(db, "consults");

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
