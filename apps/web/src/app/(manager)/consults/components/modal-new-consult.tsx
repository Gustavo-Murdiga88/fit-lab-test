import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { type Ref, useEffect, useMemo, useState } from "react";
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
import { createNewConsult } from "@/http/create-consult";
import { editConsult } from "@/http/edit-mutation";
import { fetchModalAgendas } from "@/http/fetch-modal-agendas";
import { fetchModalConsults } from "@/http/fetch-modal-consults";
import { generateTimerValues } from "@/utils/generate-timer-values";

import { useHoursAvailable } from "../hooks/use-hours-available";
import { useInitAndEndDate } from "../hooks/use-init-and-end-date";
import { useReset } from "../hooks/use-reset";

const scheme = z.object({
  patient: z.string().min(1),
  date: z.date(),
  hour: z.string(),
  agendaId: z.string().optional(),
});

type ConsultFormProps = z.infer<typeof scheme>;

export type PayloadConsultProps = ConsultFormProps & {
  nutritionistId: string;
};

export type ModalConsultProps = {
  id?: string;
  date?: Date;
  hour?: string;
  patient?: string;
  agendaId?: string;
  nutritionistId: string;
};

const dateDefault = new Date();
dateDefault.setHours(0, 0, 0, 0);
export function ModalConsult({
  ref,
  id,
  date,
  hour,
  patient,
  agendaId,
  nutritionistId,
}: ModalConsultProps & { ref: Ref<HTMLButtonElement> }) {
  const [fetchEnable, setFetchEnable] = useState(false);

  const form = useForm<ConsultFormProps>({
    resolver: zodResolver(scheme),
    defaultValues: {
      date: (date as unknown as Timestamp)?.toDate() || dateDefault,
      hour: hour || "",
      patient: patient || "",
      agendaId: agendaId || "",
    },
  });

  const dateSelect = form.watch("date");
  const { reset } = useReset({ nutritionistId });

  const { data } = useQuery({
    enabled: fetchEnable,
    queryKey: ["agendas-modal-consults", nutritionistId],
    queryFn: async () =>
      fetchModalAgendas({
        nutritionistId,
      }),
  });

  const { data: consultsData } = useQuery({
    queryKey: ["consults-modal", dateSelect.getDate()],
    enabled: !!nutritionistId && fetchEnable,
    queryFn: async () =>
      fetchModalConsults({ nutritionistId, date: dateSelect }),
  });

  const mutation = useMutation({
    mutationFn: createNewConsult,
    onSuccess: () => {
      reset();
      (ref as any).current?.click();
      form.reset();
    },
  });

  const editMutation = useMutation({
    mutationFn: editConsult,
    onSuccess: () => {
      reset();
      (ref as any).current?.click();
      form.reset();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    data.date.setHours(0, 0, 0, 0);
    if (id) {
      editMutation.mutate({
        date: data.date,
        hour: data.hour,
        patient: data.patient,
        agendaId: data.agendaId,
        nutritionistId,
        id,
      });
    } else {
      mutation.mutate({
        date: data.date,
        hour: data.hour,
        patient: data.patient,
        agendaId: data.agendaId,
        nutritionistId,
      });
    }
  });

  const options = useMemo(() => generateTimerValues(), []);
  const { hoursAvailableToday } = useHoursAvailable({
    consultsData,
    data,
    hour,
    options,
  });

  const { initAndEndDate } = useInitAndEndDate({
    data,
  });

  useEffect(() => {
    const agenda = form.getValues("agendaId");

    if (!agenda && data && data?.length > 0) {
      form.setValue("agendaId", data[0]?.id);
    }
  }, [data]);

  return (
    <Dialog
      onOpenChange={(open) => {
        setFetchEnable(open);
      }}
    >
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
              disabled={
                initAndEndDate && {
                  after: initAndEndDate.end,
                  before: dateDefault,
                }
              }
              onSelect={(date) => {
                if (date) {
                  (date as Date).setHours(0, 0, 0, 0);
                  form.setValue("date", date as never);
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
