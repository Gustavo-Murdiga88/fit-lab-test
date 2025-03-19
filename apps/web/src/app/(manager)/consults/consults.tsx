"use client";

import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";

import { CardConsult } from "./components/card";
import type { PayloadConsultProps } from "./components/modal-new-consult";

export function Consults() {
  const { data } = useQuery({
    queryKey: ["consults"],
    queryFn: async () => {
      const consultsCollection = collection(db, "consults");
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const q = query(consultsCollection, where("date", "==", date));

      const consults = await getDocs(q);

      return consults.docs.map((current) => {
        return {
          ...(current.data() as PayloadConsultProps),
          id: current.id,
        };
      });
    },
  });

  console.log(data);

  return data?.map(({ id, date, hour, patient, agendaId }, index) => (
    <CardConsult
      key={id}
      id={id}
      index={index}
      date={date}
      hour={hour}
      patient={patient}
      agendaId={agendaId}
    />
  ));
}
