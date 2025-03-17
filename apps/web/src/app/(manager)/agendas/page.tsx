import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Edit,
  PlusCircle,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Pagination } from "../components/pagination";

export default function ConsultPage() {
  return (
    <>
      <Button className="ml-auto">
        <PlusCircle className="size-4" />
        Nova Agenda
      </Button>

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-card flex flex-col rounded-md border p-4"
        >
          <strong className="text-lg">Agenda de março</strong>
          <p className="text-muted-foreground mt-3 text-sm font-normal">
            Agenda do mês de março este mês temos termos todos os dias
            disponíveis.
          </p>
          <footer className="mt-4 flex gap-3">
            <Button variant={"outline"}>
              <Edit className="size-4" />
              Editar
            </Button>
            <Button variant={"outline"}>
              <Trash2 className="size-4" />
              Excluir
            </Button>
          </footer>
        </div>
      ))}

      <Pagination />
    </>
  );
}
