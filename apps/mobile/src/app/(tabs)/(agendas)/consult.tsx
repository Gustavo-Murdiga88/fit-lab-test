import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";

import { createNewConsult } from "@/src/http/create-consult";
import { queryClient } from "@/src/lib/query";

type Params = {
  nutritionistId: string;
  date: string;
  hour: string;
  agendaId: string;
  nutritionistName: string;
  nutritionistCRN: string;
};
export default function Consult() {
  const router = useRouter();
  const textInput = useRef<string>("");

  const params = useLocalSearchParams() as Params;

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      createNewConsult({
        date: new Date(params.date),
        hour: params.hour,
        nutritionistId: params.nutritionistId,
        patient: textInput.current,
        agendaId: params.agendaId,
      }),
    onSuccess: async ({ id }) => {
      await queryClient.refetchQueries({
        queryKey: ["consults", params.agendaId],
      });

      const lastConsults = JSON.parse(
        (await AsyncStorage.getItem("@fit-lab::consultas")) || "[]",
      ) as Array<any>;
      lastConsults.push({
        date: params.date,
        id,
        hour: params.hour,
        nutritionistId: params.nutritionistId,
        patient: textInput.current,
        agendaId: params.agendaId,
        nutritionistName: params.nutritionistName,
        nutritionistCRN: params.nutritionistCRN,
      });

      const json = JSON.stringify(lastConsults);
      await AsyncStorage.setItem("@fit-lab::consultas", json);
      toast.success("Consulta agendada com sucesso!");
      router.dismiss();
    },
  });

  return (
    <View className="flex-1 items-center justify-start bg-zinc-900 p-8">
      <Text className="my-2 mt-10 text-2xl font-bold text-zinc-100">
        {params.nutritionistName}
      </Text>

      <Text className="my-1 text-xl font-semibold text-zinc-100">
        {params.hour}
      </Text>
      <Text className="my-2 mb-10 text-center text-sm font-semibold text-zinc-300">
        Apenas diga seu nome para agendar uma nova consulta, com o nosso
        nutricionista.
      </Text>

      <TextInput
        onChangeText={(value) => {
          textInput.current = value;
        }}
        placeholder="Digite seu nome aqui"
        className="w-full rounded-lg border border-zinc-400 bg-zinc-500/15 p-4 text-zinc-100"
      />

      <TouchableOpacity
        onPress={() => {
          mutate();
        }}
        disabled={isPending}
        className="mt-5 w-full flex-row items-center justify-center gap-4 rounded-lg bg-zinc-100 p-4"
      >
        <Text className="justify-center text-center font-semibold">
          Agendar uma nova consulta
        </Text>
        <SymbolView name="calendar" tintColor={"#000"} />
      </TouchableOpacity>
    </View>
  );
}
