import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type StorageConsults = {
  date: string;
  hour: string;
  nutritionistId: string;
  patient: string;
  agendaId: string;
  nutritionistName: string;
  nutritionistCRN: string;
};
export default function Consultas() {
  const [isLoading, setLoading] = useState(true);
  const [lastConsults, setConsults] = useState<StorageConsults[]>([]);

  const getLastConsults = useCallback(async () => {
    const lastConsults = JSON.parse(
      (await AsyncStorage.getItem("@fit-lab::consultas")) || "[]",
    ) as Array<StorageConsults>;

    setConsults(lastConsults);
    setLoading(false);
  }, []);

  useFocusEffect(() => {
    getLastConsults();
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <ActivityIndicator className="text-zinc-50" />
      </View>
    );
  }

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
      keyExtractor={({ date, hour }) => `${date.toString()}${hour.toString()}`}
      renderItem={({ item }) => (
        <View className="my-2 w-full rounded-xl border border-zinc-600 bg-zinc-800/40 p-4">
          <Text className="font-semibold text-zinc-500">Paciente:</Text>
          <Text className="pb-2 text-2xl font-semibold text-zinc-50">
            {item.patient}
          </Text>
          <View className="mt-2 h-px bg-zinc-500" />
          <View className="mt-3 flex flex-row justify-end gap-2">
            <Text className="font-semibold text-zinc-400/80">Dia:</Text>
            <Text className="font-semibold text-zinc-400/80">
              {format(item.date, "dd/MM/yyyy")}
            </Text>
          </View>
          <View className="mt-3 flex flex-row justify-end gap-2">
            <Text className="font-semibold text-zinc-400/80">Agendado às:</Text>
            <Text className="font-semibold text-zinc-400/80">{item.hour}</Text>
          </View>
          <View className="my-3 h-px bg-zinc-500" />
          <View className="flex items-end gap-1">
            <Text className="font-semibold text-zinc-100">Nutricionista:</Text>
            <Text className="font-semibold text-zinc-100">
              {item.nutritionistName}
            </Text>
          </View>
        </View>
      )}
    />
  );
}
