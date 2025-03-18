"use client";
import { motion } from "framer-motion";
import { Ban, Edit, Eye } from "lucide-react";
import { useRef } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { ModalConsult } from "./modal-new-consult";

function FooterCard({ index }: { index: number }) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <>
      <footer className="mt-4 flex gap-3">
        {index === 0 && (
          <Button>
            <Eye className="size-4" />
            Visualizar
          </Button>
        )}
        {index > 0 && (
          <>
            <Button onClick={() => ref.current?.click()} variant={"default"}>
              <Edit className="size-4" />
              Editar consulta
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"}>
                  <Ban className="size-4" />
                  Cancelar consulta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="border-b p-2">
                    Você tem certeza?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-normal">
                    Esta ação irá cancelar a consulta e não poderá ser desfeita,
                    após a confirmação a agenda do seu paciente será atualizada.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="border-t pt-4">
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </footer>
      <ModalConsult id="1asda" ref={ref} />
    </>
  );
}

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
          <span className="text-muted-foreground text-xs font-semibold">
            Dia:
          </span>
          <strong className="text-primary text-xs font-semibold">
            20/04/2025
          </strong>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs font-semibold">
            Hora:
          </span>
          <strong className="text-primary text-xs font-semibold">
            20/04/2025
          </strong>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs font-semibold">
            Nutricionista:
          </span>
          <strong className="text-primary text-xs font-semibold">
            Gustavo Murdiga
          </strong>
        </li>
      </ul>
      <FooterCard index={index} />
    </motion.div>
  );
}
