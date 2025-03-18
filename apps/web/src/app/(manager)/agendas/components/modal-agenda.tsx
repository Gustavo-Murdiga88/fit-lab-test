import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { PlusCircle, Trash2 } from "lucide-react";
import { type Ref } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import {
  Dialog,
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

import { TimesSelect } from "./times";

const scheme = z.object({
  title: z.string().min(1),
  subTitle: z.string().min(1),
  times: z.array(
    z.object({
      interval: z.object({
        start: z.date(),
        end: z.date(),
      }),
      hours: z.array(
        z.object({
          start: z.string(),
          end: z.string(),
        }),
      ),
    }),
  ),
});

export type AgendaProps = z.infer<typeof scheme>;

export function ModalAgenda({
  ref,
  id,
  times,
  title,
  subTitle,
}: {
  ref: Ref<HTMLButtonElement>;
  id?: string;
  times?: AgendaProps["times"];
  title?: string;
  subTitle?: string;
}) {
  const form = useForm<AgendaProps>({
    defaultValues: {
      title: title || "",
      subTitle: subTitle || "",
      times: times || [
        {
          interval: {
            end: new Date(),
            start: new Date(),
          },
          hours: [
            {
              start: "00:00-01:00",
              end: "23:00-00:00",
            },
          ],
        },
      ],
    },
    resolver: zodResolver(scheme),
  });

  const { fields, append, remove } = useFieldArray({
    name: "times",
    control: form.control,
  });

  const mutation = useMutation({
    mutationFn: async (data: AgendaProps) => {
      await addDoc(collection(db, "agendas"), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendas"] });
      queryClient.refetchQueries({ queryKey: ["agendas"] });
      (ref as any)?.current?.click();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AgendaProps) => {
      const agenda = doc(db, "agendas", id as string);
      await updateDoc(agenda, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendas"] });
      queryClient.refetchQueries({ queryKey: ["agendas"] });
      (ref as any)?.current?.click();
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (id) {
      updateMutation.mutate(data);
    } else {
      mutation.mutate(data);
    }
  });

  return (
    <FormProvider {...form}>
      <Dialog>
        <DialogTrigger ref={ref} />
        <DialogContent className="max-w-[700px] min-w-max">
          <DialogHeader>
            <DialogTitle>Gerencie seu agenda</DialogTitle>
            <DialogDescription className="border-b pb-2">
              Crie seus horários e agendas disponíveis para seu pacientes
              poderem se consultar com você
            </DialogDescription>
          </DialogHeader>
          <div className="grid max-h-[650px] w-full grid-cols-12 gap-4 overflow-auto pr-2 pl-1">
            <div className="col-span-12 flex flex-col gap-2">
              <Label htmlFor="title">
                Titulo
                <sup>*</sup>
              </Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Agenda do mês de março"
              />
            </div>
            <div className="col-span-12 flex flex-col gap-2">
              <Label htmlFor="subtitle">
                Descricao
                <sup>*</sup>
              </Label>
              <Input
                id="subtitle"
                {...form.register("subTitle")}
                placeholder="Neste mês trabalharemos com os seguintes horários"
              />
            </div>

            <div
              role="separator"
              className="bg-muted col-span-12 h-[0.5008px]"
            />
            <div className="col-span-12">
              <h1 className="text-lg font-bold">Configure seus horários</h1>
            </div>
            {fields.map(({ id }, index) => (
              <div
                className="relative col-span-12 flex flex-col gap-6"
                key={id}
              >
                <Button
                  className="absolute top-1 right-2 h-6 w-2 rounded-xs"
                  variant={"destructive"}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-3" />
                </Button>
                <div key={id} className="col-span-12 flex gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="interval">Intervalo</Label>
                    <DatePickerWithRange id="interval" />
                  </div>
                </div>

                <TimesSelect index={index} />

                <div
                  role="separator"
                  className="bg-muted col-span-12 h-[0.5008px]"
                />
              </div>
            ))}
            <div className="col-span-12">
              <Button
                size="sm"
                onClick={() => {
                  append({
                    interval: {
                      end: new Date(),
                      start: new Date(),
                    },
                    hours: [
                      {
                        start: "00:00-01:00",
                        end: "23:00-00:00",
                      },
                    ],
                  });
                }}
              >
                <PlusCircle className="size-4" />
                Adicionar um novo horário
              </Button>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant={"destructive"} asChild>
              <DialogClose>Cancelar</DialogClose>
            </Button>
            <Button variant={"default"} onClick={handleSubmit}>
              <PlusCircle className="size-4" />
              {id ? "Editar agenda" : "Criar agenda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
