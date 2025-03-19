"use client";

import { PlusCircle } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

import { ModalAgenda } from "./modal-agenda";

export function NewAgenda() {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button className="mx-4 md:ml-auto" onClick={() => ref.current?.click()}>
        <PlusCircle className="size-4" />
        Nova Agenda
      </Button>

      <ModalAgenda ref={ref} />
    </>
  );
}
