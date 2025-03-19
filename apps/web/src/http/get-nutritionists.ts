import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function getNutritionists() {
  const q = query(
    collection(db, "nutritionists"),
    orderBy("name", "asc"),
    limit(5),
  );
  const result = await getDocs(q);
  const nutritionistsFromDb = result.docs.map((current) => {
    return {
      name: current.data().name as string,
      crn: current.data().crn as string,
      id: current.id,
    };
  });

  return nutritionistsFromDb;
}
