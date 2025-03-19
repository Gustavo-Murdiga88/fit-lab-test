"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useNutritionistStore } from "@/store/nutritionist";

export function Tabs() {
  const { currentNutritionist } = useNutritionistStore();

  const pathname = usePathname();

  return (
    <div className="mx-auto mt-10 max-w-[71.25rem] border-b px-4">
      <Button
        className="rounded-b-none"
        disabled={!currentNutritionist.id}
        asChild
        variant={"ghost"}
      >
        <Link className="relative" href={"/consults"} prefetch>
          Consultas
          {pathname === "/consults" && (
            <motion.span
              layoutId="underline"
              className="bg-primary absolute inset-x-0 bottom-0 h-px"
            />
          )}
        </Link>
      </Button>
      <Button
        disabled={!currentNutritionist.id}
        className="rounded-b-none"
        asChild
        variant={"ghost"}
      >
        <Link className="relative" href={"/agendas"}>
          Agendas
          {pathname === "/agendas" && (
            <motion.span
              layoutId="underline"
              className="bg-primary absolute inset-x-0 bottom-0 h-px"
            />
          )}
        </Link>
      </Button>
    </div>
  );
}
