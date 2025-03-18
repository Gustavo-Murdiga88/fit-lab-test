"use client";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { PlusCircle, User2 } from "lucide-react";
import { useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";

import { ModalNutritionist } from "./modal-new-nutritionist";

export function Switcher() {
  const [nutritionist, setNutritionist] = useState<string | null>(null);

  const { data, isLoading, status } = useQuery({
    queryKey: ["nutritionists"],
    queryFn: async () => {
      const q = query(
        collection(db, "nutritionists"),
        orderBy("name", "desc"),
        limit(5),
      );
      const result = await getDocs(q);
      const nutritionistsFromDb = result.docs.map((current) => {
        return {
          name: current.data().name as string,
          crn: current.data().crn as string,
          id: current.id,
        };
      });

      return nutritionistsFromDb;
    },
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
          {nutritionist || "Selecione um nutricionista"}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={10}>
          {data?.map((nutritionist) => (
            <DropdownMenuItem
              onClick={() => {
                setNutritionist(nutritionist.name);
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
          <DropdownMenuSeparator />
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
