import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore";
import { PlusCircle } from "lucide-react";
import type { Ref } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { db } from "@/lib/firebase";
import { queryClient } from "@/lib/query-client";

const scheme = z.object({
  name: z.string().min(1),
  crn: z.string().min(1),
});

type FormProps = z.infer<typeof scheme>;
export function ModalNutritionist({ ref }: { ref: Ref<HTMLButtonElement> }) {
  const form = useForm<FormProps>({
    defaultValues: {
      crn: "",
      name: "",
    },
    resolver: zodResolver(scheme),
  });
  const { register } = form;

  const mutation = useMutation({
    mutationFn: ({ crn, name }: { name: string; crn: string }) => {
      return addDoc(collection(db, "nutritionists"), {
        crn,
        name,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionists"] });
      queryClient.refetchQueries({ queryKey: ["nutritionists"] });
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (ref) (ref as any).current?.click();
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    mutation.mutate({ crn: data.crn, name: data.name });
  });

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
            <Input {...register("name")} placeholder="Jhon Doe" />
          </div>

          <div className="space-y-2">
            <Label>CRN</Label>
            <Input {...register("crn")} placeholder="CRN-3 XXXYZ" />
          </div>
        </div>
        <DialogFooter className="mt-2 border-t pt-4">
          <Button asChild variant={"destructive"}>
            <DialogClose>Cancelar</DialogClose>
          </Button>
          <Button onClick={handleSubmit}>
            <PlusCircle className="size-4" />
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
