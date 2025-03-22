import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { getAgendas } from "@/src/http/get-agendas";
import { formatDate } from "@/src/utils/date";

export default function Agendas() {
  const router = useRouter();

  const { isLoading, data } = useQuery({
    queryFn: getAgendas,
    queryKey: ["agendas"],
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <ActivityIndicator className="text-zinc-50" />
      </View>
    );
  }

  return (
    <View className={`flex-1 gap-5 bg-zinc-900 p-4 py-8`}>
      {data?.map((agenda) => {
        const initialDate = formatDate.format(agenda.initialInterval);
        const finalDate = formatDate.format(agenda.finalInterval);

        return (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/(tabs)/(agendas)/[id]",
                params: {
                  id: agenda.id,
                },
              });
            }}
            key={agenda.id}
            className="w-full rounded-xl border border-zinc-600 bg-zinc-800/40 p-4"
          >
            <Text className="pb-2 text-2xl font-semibold text-zinc-50">
              {agenda.title}
            </Text>
            <Text className="font-md text-zinc-300">{agenda.subTitle}</Text>
            <View className="mt-2 h-px bg-zinc-500" />
            <View className="mt-3 flex flex-row justify-end gap-2">
              <Text className="font-semibold text-zinc-400/80">
                Agendamentos de:
              </Text>
              <Text className="font-semibold text-zinc-400/80">
                {initialDate}
              </Text>
              <Text className="font-semibold text-zinc-400/80">Até</Text>
              <Text className="font-semibold text-zinc-400/80">
                {finalDate}
              </Text>
            </View>
            <View className="my-3 h-px bg-zinc-500" />
            <View className="flex items-end gap-1">
              <Text className="font-semibold text-zinc-100">
                {agenda.nutritionist.name}
              </Text>
              <Text className="font-semibold text-zinc-100">
                {agenda.nutritionist.crn}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
