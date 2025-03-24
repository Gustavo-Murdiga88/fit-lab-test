import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";

import { cancelConsult } from "@/src/http/cancel-consult";
import { getRealTime } from "@/src/http/get-realtime";

type StorageConsults = {
  date: string;
  hour: string;
  nutritionistId: string;
  patient: string;
  agendaId: string;
  nutritionistName: string;
  nutritionistCRN: string;
  id: string;
};
export default function Consultas() {
  const [lastConsults, setConsults] = useState<StorageConsults[]>([]);

  const getLastConsults = useCallback(() => {
    AsyncStorage.getItem("@fit-lab::consultas").then((data) => {
      const lastConsults = JSON.parse(data || "[]") as Array<StorageConsults>;
      setConsults(lastConsults);
    });
  }, []);

  const removeConsults = useCallback(
    async (id: string, showToast = true) => {
      const copyConsults = lastConsults.filter((consult) => consult.id !== id);
      await AsyncStorage.setItem(
        "@fit-lab::consultas",
        JSON.stringify(copyConsults),
      );

      if (showToast) toast.success("Consulta cancelada com sucesso!");

      setConsults(copyConsults);
    },
    [lastConsults],
  );

  const cancelConsultMutation = useMutation({
    mutationFn: cancelConsult,
    onSuccess: async (_, id) => await removeConsults(id),
  });

  useFocusEffect(getLastConsults);

  useEffect(() => {
    const { unsubscribe } = getRealTime({
      collection: "consults",
      onEvent: async (data) => {
        const currentChanges = data
          .docChanges()
          .filter((change) => change.type === "removed")
          .map((change) => {
            return {
              ...change.doc.data(),
              id: change.doc.id,
            };
          });

        for (const consult of currentChanges) {
          await removeConsults(consult.id, false);
        }
      },
    });

    return () => unsubscribe();
  }, [removeConsults]);

  if (lastConsults.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900 px-10">
        <Text className="text-center text-2xl font-bold text-zinc-100">
          Você não possuí consultas agendadas até o momento!
        </Text>
        <Link
          href={"/(tabs)/(agendas)"}
          replace
          className="mt-5 rounded-lg border border-zinc-500/50 bg-zinc-600/35 p-3 text-center text-lg font-bold text-zinc-100"
        >
          Agende uma consulta agora mesmo
        </Link>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-zinc-900 p-4"
      data={lastConsults}
      keyExtractor={({ id }) => id}
      renderItem={({ item }) => (
        <View className="my-2 w-full rounded-xl border border-zinc-600 bg-zinc-800/40 p-4">
          <Text className="font-semibold text-zinc-500">Paciente:</Text>
          <Text className="pb-2 text-2xl font-semibold text-zinc-50">
            {item.patient}
          </Text>
          <View className="mt-2 h-px bg-zinc-500" />
          <View className="mt-3 flex flex-row gap-2">
            <Text className="font-semibold text-zinc-400/80">Dia:</Text>
            <Text className="font-semibold text-zinc-400/80">
              {format(item.date, "dd/MM/yyyy")}
            </Text>
          </View>
          <View className="mt-3 flex flex-row gap-2">
            <Text className="font-semibold text-zinc-400/80">Agendado às:</Text>
            <Text className="font-semibold text-zinc-400/80">{item.hour}</Text>
          </View>
          <View className="my-3 h-px bg-zinc-500" />
          <View className="flex gap-1">
            <Text className="font-semibold text-zinc-100">Nutricionista:</Text>
            <Text className="font-semibold text-zinc-100">
              {item.nutritionistName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => cancelConsultMutation.mutate(item.id)}
            className="mt-4 flex gap-1 rounded-lg bg-red-500/40 p-4"
          >
            <Text className="self-center font-semibold text-zinc-100">
              Cancelar consulta 🚫
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}
