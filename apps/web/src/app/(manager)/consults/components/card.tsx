"use client";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Ban, Edit, Eye } from "lucide-react";
import { useCallback, useRef } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { queryClient } from "@/lib/query-client";
import { useNutritionistStore } from "@/store/nutritionist";

import { ModalConsult, type ModalConsultProps } from "./modal-new-consult";

type FooterCardProps = ModalConsultProps;

const useReset = () => {
  const reset = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["consults"],
    });
    queryClient.invalidateQueries({
      queryKey: ["consults"],
    });
    queryClient.invalidateQueries({
      queryKey: ["consults-modal"],
    });
    queryClient.refetchQueries({
      queryKey: ["consults-modal"],
    });
  }, []);
  return {
    reset,
  };
};

function FooterCard({ ...modalProps }: FooterCardProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const refAction = useRef<HTMLButtonElement>(null);

  const { reset } = useReset();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const consultCollection = collection(db, "consults");
      const currentDoc = doc(consultCollection, modalProps.id as string);

      await deleteDoc(currentDoc);
    },
    onSuccess: () => {
      reset();
      refAction.current?.click();
    },
  });

  return (
    <>
      <footer className="mt-4 flex gap-3">
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
                <AlertDialogCancel ref={refAction}>Cancelar</AlertDialogCancel>
                <Button onClick={() => deleteMutation.mutate()}>
                  Confirmar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      </footer>
      <ModalConsult {...modalProps} ref={ref} />
    </>
  );
}

type CadConsultProps = ModalConsultProps & { index: number };

export function CardConsult({ index, ...footerProps }: CadConsultProps) {
  const store = useNutritionistStore();
  const { date, hour, patient } = footerProps;

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
      <strong className="inline-block truncate text-lg">{patient}</strong>
      <ul className="my-2 inline-block space-y-2">
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs font-semibold">
            Dia:
          </span>
          <strong className="text-primary text-xs font-semibold">
            {format((date as any).toDate(), "dd/MM/yyyy")}
          </strong>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs font-semibold">
            Hora:
          </span>
          <strong className="text-primary text-xs font-semibold">
            {hour?.replace("-", " - ")}
          </strong>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs font-semibold">
            Nutricionista:
          </span>
          <strong className="text-primary text-xs font-semibold">
            {store.currentNutritionist.name}
          </strong>
        </li>
      </ul>
      <FooterCard {...footerProps} />
    </motion.div>
  );
}
