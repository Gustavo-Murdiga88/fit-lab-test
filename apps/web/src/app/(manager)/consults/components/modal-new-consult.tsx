import type { Ref } from "react";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Options } from "../../agendas/components/times";

export function ModalConsult({
  ref,
  id,
}: {
  ref: Ref<HTMLButtonElement>;
  id?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger ref={ref} />
      <DialogContent className="max-w-[700px] min-w-max">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>{id ? "Editar consulta" : "Criar consulta"}</DialogTitle>
          <DialogDescription>
            Crie uma nova consulta em sua agenda
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[43.75rem] grid-cols-12 gap-4 overflow-auto">
          <div className="col-span-12 space-y-2">
            <Label>Paciente</Label>
            <Input placeholder="John Doe" />
          </div>

          <div className="col-span-12 space-y-2">
            <Label>Data</Label>
            <DatePickerWithRange />
          </div>
          <div className="col-span-12 space-y-2">
            <Label>Horário</Label>
            <Select>
              <SelectTrigger id="end-time" className="w-[230px]">
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Selecione um horário</SelectLabel>
                  <Options />
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="border-t pt-4">
          <Button asChild variant={"destructive"}>
            <DialogClose>Cancelar</DialogClose>
          </Button>
          <Button variant={"default"}>Criar consulta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
