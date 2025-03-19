"use client";

import { PlusCircle } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

import { ModalConsult } from "./modal-new-consult";

export function NewConsult() {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button className="ml-auto" onClick={() => ref.current?.click()}>
        <PlusCircle className="size-4" />
        Criar uma nova consulta
      </Button>
      <ModalConsult
        ref={ref}
        agendaId="Zj12iLRXven8QazgTO63"
        nutritionistId="7q2k1k5kDfMRHsgR3mLc"
      />
    </>
  );
}
