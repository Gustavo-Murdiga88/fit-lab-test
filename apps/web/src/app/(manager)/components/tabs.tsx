"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export function Tabs() {
  const pathname = usePathname();

  return (
    <div className="mx-auto mt-10 max-w-[71.25rem] border-b">
      <Button className="rounded-b-none" asChild variant={"ghost"}>
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
      <Button className="rounded-b-none" asChild variant={"ghost"}>
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
