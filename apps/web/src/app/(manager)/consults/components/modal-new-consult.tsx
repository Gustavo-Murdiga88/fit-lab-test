import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { type Ref, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePickerSingle } from "@/components/ui/date-picker";
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
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { queryClient } from "@/lib/query-client";
import { generateTimerValues } from "@/utils/generate-timer-values";

import type { AgendaProps } from "../../agendas/components/modal-agenda";

const scheme = z.object({
  patient: z.string().min(1),
  date: z.date(),
  hour: z.string(),
});

type ConsultFormProps = z.infer<typeof scheme>;

export type PayloadConsultProps = ConsultFormProps & {
  nutritionistId: string;
  agendaId: string;
};

export function ModalConsult({
  ref,
  id,
  date,
  hour,
  patient,
  agendaId,
  nutritionistId,
}: {
  ref: Ref<HTMLButtonElement>;
  id?: string;
  date?: Date;
  hour?: string;
  patient?: string;
  agendaId: string;
  nutritionistId: string;
}) {
  const form = useForm<ConsultFormProps>({
    resolver: zodResolver(scheme),
    defaultValues: {
      date: date || new Date(),
      hour: hour || "",
      patient: patient || "",
    },
  });

  const { data } = useQuery({
    queryKey: ["agendas-modal-consults"],
    queryFn: async () => {
      const agendasCollection = collection(db, "agendas");
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const q = query(
        agendasCollection,
        where("intervalEnd", ">=", date),
        orderBy("intervalEnd", "desc"),
        limit(1),
      );
      const agendas = await getDocs(q);

      return agendas.docs.map((current) => {
        return {
          ...(current.data() as AgendaProps),
          id,
        };
      });
    },
  });

  const { data: consultsData } = useQuery({
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

  const mutation = useMutation({
    mutationFn: async (data: PayloadConsultProps) => {
      const consultsCollection = collection(db, "consults");

      await addDoc(consultsCollection, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consults"] });
      queryClient.refetchQueries({ queryKey: ["consults"] });
      (ref as any).current?.click();
      form.reset();
    },
  });

  const handleSubmit = form.handleSubmit(
    async (data) => {
      mutation.mutate({
        ...data,
        agendaId,
        nutritionistId,
      });
    },
    (err) => {
      console.log(err);
    },
  );

  const options = useMemo(() => generateTimerValues(), []);

  const hoursAvailableToday = useMemo(() => {
    let rangeOptions: Array<{ label: string; value: string }> = [];
    if (data?.length) {
      data.forEach(({ times }) =>
        times.forEach(({ hours }) =>
          hours.forEach(({ end, start }) => {
            const initIndex = options.findIndex((hour) => hour.value === start);
            const endIndex = options.findIndex((hour) => hour.value === end);

            const optionsIndex = options.slice(initIndex, endIndex + 1);

            rangeOptions.push(...optionsIndex);
          }),
        ),
      );
    }

    if (consultsData?.length) {
      rangeOptions = rangeOptions.filter(
        ({ value }) =>
          !consultsData.some((consult) => consult.hour === value) ||
          value === hour,
      );
    }

    return rangeOptions;
  }, [data, consultsData]);

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
            <Input {...form.register("patient")} placeholder="John Doe" />
          </div>

          <div className="col-span-12 space-y-2">
            <Label>Data</Label>
            <DatePickerSingle
              onSelect={(data) => {
                if (data) {
                  form.setValue("date", data as never);
                }
              }}
            />
          </div>
          <div className="col-span-12 space-y-2">
            <Label>Horário</Label>
            <Select
              defaultValue={hour}
              onValueChange={(value) => {
                form.setValue("hour", value);
              }}
            >
              <SelectTrigger id="end-time" className="w-[230px]">
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Selecione um horário</SelectLabel>
                  {hoursAvailableToday.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="border-t pt-4">
          <Button asChild variant={"destructive"}>
            <DialogClose>Cancelar</DialogClose>
          </Button>
          <Button variant={"default"} onClick={handleSubmit}>
            Criar consulta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
