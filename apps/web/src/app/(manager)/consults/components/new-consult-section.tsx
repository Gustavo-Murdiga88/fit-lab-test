"use client";

import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { getAgendas } from "@/http/get-agendas";
import { useNutritionistStore } from "@/store/nutritionist";

import { ModalConsult } from "./modal-new-consult";

export function NewConsult() {
  const router = useRouter();
  const store = useNutritionistStore();
  const ref = useRef<HTMLButtonElement>(null);

  const { data } = useQuery({
    queryKey: ["agendas", store.currentNutritionist.id],
    queryFn: async () =>
      getAgendas({ nutritionistId: store.currentNutritionist.id }),
  });

  if (!data?.length) {
    return (
      <Button
        className="mx-4 md:ml-auto"
        onClick={() => router.push("/agendas")}
      >
        <PlusCircle className="size-4" />
        Crie uma agenda primeiro
      </Button>
    );
  }

  return (
    <>
      <Button className="mx-4 md:ml-auto" onClick={() => ref.current?.click()}>
        <PlusCircle className="size-4" />
        Criar uma nova consulta
      </Button>
      <ModalConsult ref={ref} nutritionistId={store.currentNutritionist.id} />
    </>
  );
}
