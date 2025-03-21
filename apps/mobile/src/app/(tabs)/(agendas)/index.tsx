import { getAgendas } from "@/src/http/get-agendas";
import { formatDate } from "@/src/utils/date";
import { useQuery } from "@tanstack/react-query";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Agendas() {
  const router = useRouter();

  const { isLoading, data } = useQuery({
    queryFn: getAgendas,
    queryKey: ["agendas"],
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <ActivityIndicator className="text-zinc-50" />
      </View>
    )
  }

  return (
    <View
      className={`flex-1 gap-5 p-4 py-8 bg-zinc-900`}>
      {
        data?.map((agenda) => {
          const initialDate = formatDate.format(agenda.initialInterval);
          const finalDate = formatDate.format(agenda.finalInterval);

          return (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/(agendas)/[id]",
                  params: {
                    id: agenda.id
                  }
                })
              }}
              key={agenda.id} className="w-full rounded-xl bg-zinc-800/40 p-4 border-zinc-600 border">
              <Text className="text-zinc-50 text-2xl font-semibold pb-2">{agenda.title}</Text>
              <Text className="text-zinc-300 font-md">{agenda.subTitle}</Text>
              <View className="h-px bg-zinc-500 my-3" />
              <View className="flex flex-row justify-end gap-2">
                <Text className="text-zinc-100 font-semibold">Agendamentos de:</Text>
                <Text className="text-zinc-100 font-semibold">{initialDate}</Text>
                <Text className="text-zinc-100 font-semibold">Até</Text>
                <Text className="text-zinc-100 font-semibold">{finalDate}</Text>
              </View>
            </TouchableOpacity>
          )
        })
      }
    </View >
  );
}