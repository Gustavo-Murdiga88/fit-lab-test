"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getConsults } from "@/http/get-consults";
import { getRealTime } from "@/http/get-realtime";
import { queryClient } from "@/lib/query-client";
import { useNutritionistStore } from "@/store/nutritionist";

import { CardConsult } from "./components/card";

export function Consults() {
  const store = useNutritionistStore();

  const { data } = useQuery({
    queryKey: ["consults", store.currentNutritionist.id],
    queryFn: async () =>
      getConsults({ nutritionistId: store.currentNutritionist.id }),
  });

  useEffect(() => {
    const { unsubscribe } = getRealTime({
      collection: "consults",
      onEvent: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["consults"],
        });
        await queryClient.refetchQueries({
          queryKey: ["consults"],
        });
      },
    });

    return () => unsubscribe();
  }, []);

  if (data?.length === 0) {
    return Array.from({ length: 9 }).map((_, index) => (
      <Skeleton key={index} className="h-64" />
    ));
  }

  return data?.map((props, index) => (
    <CardConsult
      key={props.id}
      {...props}
      index={index}
      nutritionistId={store.currentNutritionist.id}
    />
  ));
}
