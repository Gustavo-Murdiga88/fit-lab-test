import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";

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
import { deleteAgenda } from "@/http/delete-agenda";
import { getAgendas } from "@/http/get-agendas";
import { queryClient } from "@/lib/query-client";
import { useNutritionistStore } from "@/store/nutritionist";

import { ModalAgenda } from "./modal-agenda";

export function Cards() {
  const store = useNutritionistStore();

  const { data, isLoading } = useQuery({
    queryKey: ["agendas", store.currentNutritionist.id],
    queryFn: async () =>
      getAgendas({ nutritionistId: store.currentNutritionist.id }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAgenda,
    onSuccess: (_, { ref }) => {
      queryClient.invalidateQueries({
        queryKey: ["agendas", store.currentNutritionist.id],
      });
      queryClient.refetchQueries({
        queryKey: ["agendas", store.currentNutritionist.id],
      });
      ref.click();
    },
  });

  if (isLoading || data?.length === 0) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 px-4">
      {data?.map(({ title, subTitle, ref, id, times, alertRef }, index) => {
        return (
          <motion.div
            key={id}
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
            className="bg-card h flex flex-col rounded-md border p-4"
          >
            <strong className="text-lg break-words">{title}</strong>
            <p className="text-muted-foreground mt-3 text-sm font-normal break-words">
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
                    <AlertDialogCancel ref={alertRef}>
                      Cancelar
                    </AlertDialogCancel>
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
      })}
    </div>
  );
}
