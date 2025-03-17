import { PlusCircle } from "lucide-react";
import type { Ref } from "react";

import { Button } from "@/components/ui/button";
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

export function ModalNutritionist({ ref }: { ref: Ref<HTMLButtonElement> }) {
  return (
    <Dialog>
      <DialogTrigger ref={ref} />
      <DialogContent>
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Crie um(a) novo nutricionista</DialogTitle>
          <DialogDescription>
            Adicione um(a) novo nutricionista para atender seus alunos!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input placeholder="Jhon Doe" />
          </div>

          <div className="space-y-2">
            <Label>Nome</Label>
            <Input placeholder="Jhon Doe" />
          </div>
        </div>
        <DialogFooter className="mt-2 border-t pt-4">
          <Button asChild variant={"destructive"}>
            <DialogClose>Cancelar</DialogClose>
          </Button>
          <Button>
            <PlusCircle className="size-4" />
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
