import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Pagination } from "../components/pagination";
import { CardConsult } from "./components/card";

export default function ConsultPage() {
  return (
    <>
      <Button className="ml-auto">
        <PlusCircle className="size-4" />
        Criar uma nova consulta
      </Button>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <CardConsult key={index} index={index} />
        ))}
      </div>
      <Pagination />
    </>
  );
}
