"use client";

import { PlusCircle, Slash, User2 } from "lucide-react";
import { useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ModalNutritionist } from "./modal-new-nutritionist";

export function ManagerHeader() {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="h-16 w-full border-b p-3 px-6">
        <div className="mx-auto flex max-w-[71.25rem] items-center">
          <span className="text-muted-foreground text-sm font-semibold">
            Fit Lab Manager
          </span>
          <Slash className="stroke-muted-foreground m-2 size-4 -rotate-[25deg]" />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-1 text-sm">
              <User2 className="mr-2 inline-block size-4" />
              Selecione um nutricionista
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={10}>
              <DropdownMenuItem>
                <Avatar>
                  <AvatarImage src="https://github.com/gustavo-murdiga88.png" />
                  <AvatarFallback>GM</AvatarFallback>
                </Avatar>
                Gustavo Muriga
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => ref.current?.click()}>
                <PlusCircle className="mr-2 size-4" />
                Adicione um novo nutricionista
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ModalNutritionist ref={ref} />
    </>
  );
}
