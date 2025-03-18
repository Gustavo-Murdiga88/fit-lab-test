import { useMutation, useQuery } from "@tanstack/react-query";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { createRef } from "react";

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
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { queryClient } from "@/lib/query-client";

import { type AgendaProps, ModalAgenda } from "./modal-agenda";

export function Cards() {
  const { data, isLoading } = useQuery({
    queryKey: ["agendas"],
    queryFn: async () => {
      const q = query(collection(db, "agendas"), limit(4));
      const result = await getDocs(q);
      const agendas = result.docs.map((current) => {
        const ref = createRef<HTMLButtonElement>();
        const alertRef = createRef<HTMLButtonElement>();
        return {
          title: current.data().title as string,
          subTitle: current.data().subTitle as string,
          times: (current.data().times as AgendaProps["times"]).map(
            ({ hours, interval }) => ({
              hours,
              interval: {
                end: (interval.end as any).toDate(),
                start: (interval.start as any).toDate(),
              },
            }),
          ),
          id: current.id,
          ref,
          alertRef,
        };
      });
      return agendas;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string; ref: HTMLButtonElement }) => {
      const agenda = doc(db, "agendas", id);
      await deleteDoc(agenda);
    },

    onSuccess: (_, { ref }) => {
      queryClient.invalidateQueries({ queryKey: ["agendas"] });
      queryClient.refetchQueries({ queryKey: ["agendas"] });
      ref.click();
    },
  });

  if (isLoading) {
    return Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={index} className="h-32 w-full" />
    ));
  }

  return data?.map(({ title, subTitle, ref, id, times, alertRef }, index) => {
    return (
      <motion.div
        key={index}
        initial={{
          scale: 0.95,
          opacity: 0,
        }}
        transition={{
          delay: index * 0.08,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        className="bg-card flex flex-col rounded-md border p-4"
      >
        <strong className="text-lg">{title}</strong>
        <p className="text-muted-foreground mt-3 text-sm font-normal">
          {subTitle || "🍕"}
        </p>
        <footer className="mt-4 flex gap-3">
          <Button variant={"outline"} onClick={() => ref.current?.click()}>
            <Edit className="size-4" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outline"}>
                <Trash2 className="size-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deseja realmente excluir essa agenda?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel ref={alertRef}>Cancelar</AlertDialogCancel>
                <Button
                  onClick={() =>
                    deleteMutation.mutate({ id, ref: alertRef.current! })
                  }
                >
                  Confirmar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </footer>
        <ModalAgenda
          ref={ref}
          title={title}
          subTitle={subTitle}
          times={times}
          id={id}
        />
      </motion.div>
    );
  });
}
