"use client";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { PlusCircle, User2 } from "lucide-react";
import { useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getNutritionists } from "@/http/get-nutritionists";
import { useNutritionistStore } from "@/store/nutritionist";

import { ModalNutritionist } from "./modal-new-nutritionist";

export function Switcher() {
  const store = useNutritionistStore();

  const { data, isLoading, status } = useQuery({
    queryKey: ["nutritionists"],
    queryFn: getNutritionists,
  });

  const ref = useRef<HTMLButtonElement>(null);

  if (isLoading || status === "error") {
    return <Skeleton className="h-8 w-64" />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-1 text-sm">
          <User2 className="mr-2 inline-block size-4" />
          {store.currentNutritionist.name || "Selecione um nutricionista"}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={10}>
          {data?.map((nutritionist) => (
            <DropdownMenuItem
              onClick={() => {
                store.setCurrentNutritionist({
                  crn: nutritionist.crn,
                  id: nutritionist.id,
                  name: nutritionist.name,
                });
              }}
              key={nutritionist.id}
            >
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <AvatarFallback>
                  {nutritionist.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              {nutritionist.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator
            className={clsx(data?.length === 0 && "hidden")}
          />
          <DropdownMenuItem onClick={() => ref.current?.click()}>
            <PlusCircle className="mr-2 size-4" />
            Adicione um novo nutricionista
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalNutritionist ref={ref} />
    </>
  );
}
