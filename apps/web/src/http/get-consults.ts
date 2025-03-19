import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import type { PayloadConsultProps } from "@/app/(manager)/consults/components/modal-new-consult";
import { db } from "@/lib/firebase";

export async function getConsults({
  nutritionistId,
}: {
  nutritionistId: string;
}) {
  const consultsCollection = collection(db, "consults");

  const q = query(
    consultsCollection,
    where("nutritionistId", "==", nutritionistId),
    orderBy("date", "asc"),
    limit(100),
  );

  const consults = await getDocs(q);

  return consults.docs.map((current) => {
    return {
      ...(current.data() as PayloadConsultProps),
      id: current.id,
    };
  });
}
