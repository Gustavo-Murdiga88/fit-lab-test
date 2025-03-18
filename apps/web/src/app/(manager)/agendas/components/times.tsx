"use client";

import clsx from "clsx";
import { Minus, PlusCircle } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
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

import type { FormProviderProps } from "./modal-agenda";

export function Options() {
  const options = useMemo(() => {
    return Array.from({ length: 24 }).map((_, index) => {
      const value = `${String(index).padStart(2, "0")}:00-${String(index + 1 === 24 ? 0 : index + 1).padStart(2, "0")}:00`;
      const label = `${String(index).padStart(2, "0")}:00 - ${String(index + 1 === 24 ? 0 : index + 1).padStart(2, "0")}:00`;
      return (
        <SelectItem key={index} value={value}>
          {label}
        </SelectItem>
      );
    });
  }, []);

  return options;
}

export function TimesSelect({ index }: { index: number }) {
  const { control } = useFormContext<FormProviderProps>();

  const { append, fields, remove, update } = useFieldArray({
    name: `times.${index}.hours`,
    control: control,
  });

  console.log(fields);

  return fields.map(({ id, end, start }, hourIndex) => (
    <div className="col-span-12 flex gap-3" key={id}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="init-time">Horário inicial</Label>
        <Select
          value={start}
          onValueChange={(value) => {
            update(hourIndex, {
              start: value,
              end,
            });
          }}
        >
          <SelectTrigger id="init-time" className="w-[230px]">
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="end-time">Horário final</Label>
        <Select
          value={end}
          onValueChange={(value) => {
            update(hourIndex, {
              start,
              end: value,
            });
          }}
        >
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
      <div className="col-span-12 mt-2 ml-2 flex gap-2">
        <Button
          size={"icon"}
          onClick={() =>
            append({
              end: "23:00-00:00",
              start: "00:00-01:00",
            })
          }
          variant={"default"}
          className="mt-auto"
        >
          <PlusCircle className="size-4" />
        </Button>
        <Button
          size={"icon"}
          onClick={() => remove(hourIndex)}
          variant={"destructive"}
          className={clsx(hourIndex === 0 && "hidden", "mt-auto")}
        >
          <Minus className="size-4" />
        </Button>
      </div>
    </div>
  ));
}
