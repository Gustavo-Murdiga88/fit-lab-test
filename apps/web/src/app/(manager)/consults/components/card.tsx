"use client";
import { motion } from "framer-motion";
import { Ban, Edit, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CardConsult({ index }: { index: number }) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
        delay: index * 0.08,
      }}
      className="bg-card relative flex flex-col rounded-md border p-4"
    >
      {index === 0 && (
        <div className="absolute top-4 right-4 rounded-sm border border-emerald-400 bg-emerald-600 p-1 text-xs font-semibold">
          Finalizada
        </div>
      )}
      {index === 1 && (
        <div className="absolute top-4 right-4 rounded-sm border border-red-400 bg-red-500 p-1 text-xs font-semibold">
          Cancelada
        </div>
      )}

      {index === 2 && (
        <div className="absolute top-4 right-4 rounded-sm border border-amber-400 bg-amber-500 p-1 text-xs font-semibold">
          Agendada
        </div>
      )}

      <strong className="text-lg">Gustavo Murdiga</strong>
      <ul className="my-2 inline-block space-y-2">
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-sm font-normal">
            Dia:
          </span>
          <strong className="text-primary text-sm font-semibold">
            20/04/2025
          </strong>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-sm font-normal">
            Hora:
          </span>
          <strong className="text-primary text-sm font-semibold">
            20/04/2025
          </strong>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-sm font-normal">
            Nutricionista:
          </span>
          <strong className="text-primary text-sm font-semibold">
            Gustavo Murdiga
          </strong>
        </li>
      </ul>
      <footer className="mt-4 flex gap-3">
        {index === 0 && (
          <Button>
            <Eye className="size-4" />
            Visualizar
          </Button>
        )}
        {index > 0 && (
          <>
            <Button variant={"default"}>
              <Edit className="size-4" />
              Editar consulta
            </Button>
            <Button variant={"destructive"}>
              <Ban className="size-4" />
              Cancelar consulta
            </Button>
          </>
        )}
      </footer>
    </motion.div>
  );
}
