import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  differenceInDays,
  isBefore,
  isSameDay,
  isToday,
} from "date-fns";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useHoursAvailable } from "@/src/hooks/use-hours-availible";
import { getAgendaById } from "@/src/http/get-agenda-by-id";
import { fetchConsultsByDate } from "@/src/http/get-consults-by-date";
import { forMonth } from "@/src/utils/date";
import { generateTimerValues } from "@/src/utils/generate-timer-values";

const defaultDate = new Date();
defaultDate.setHours(0, 0, 0, 0);

export default function Agenda() {
  const [dateSelected, selectedDate] = useState(defaultDate);
  const [hourSelected, selectedHour] = useState("");

  const params = useGlobalSearchParams();
  const router = useRouter();

  const {
    isLoading,
    data,
    isPending: isLoadingAgenda,
  } = useQuery({
    queryKey: ["agenda", params.id],
    queryFn: () => getAgendaById({ id: params.id as string }),
  });

  const {
    data: consultsData,
    isPending,
    isLoading: isLoadingConsult,
  } = useQuery({
    enabled: !!data?.nutritionist.id,
    queryKey: ["consults", params.id, dateSelected.getDate()],
    queryFn: async () =>
      fetchConsultsByDate({
        nutritionistId: data?.nutritionist.id as string,
        date: dateSelected,
      }),
  });

  function handleSelectHour() {
    if (hourSelected && dateSelected) {
      router.push({
        pathname: "/(tabs)/(agendas)/consult",
        params: {
          nutritionistName: data?.nutritionist.name,
          nutritionistCRN: data?.nutritionist.crn,
          agendaId: params.id,
          nutritionistId: data?.nutritionist.id,
          date: dateSelected.toISOString(),
          hour: hourSelected,
        },
      });
    }
  }

  const days = useMemo(() => {
    if (!data) {
      return {
        days: [],
      };
    }
    const difference = differenceInDays(
      data?.finalInterval,
      data?.initialInterval,
    );

    const days = Array.from({ length: difference })
      .map((_, index) => {
        const date = addDays(data.initialInterval, index);

        return {
          day: date.getDate(),
          month: forMonth.format(date),
          date,
        };
      })
      .filter(({ date }) => isToday(date) || !isBefore(date, new Date()));

    return {
      days,
    };
  }, [data]);

  const options = useMemo(() => {
    return generateTimerValues();
  }, []);

  const { hoursAvailableToday } = useHoursAvailable({
    options,
    data,
    consultsData,
  });

  if (isLoading || isPending || isLoadingConsult || isLoadingAgenda) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <ActivityIndicator className="text-zinc-50" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-start bg-zinc-900 pt-4">
      <View className="py-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
          data={days.days}
          keyExtractor={({ date, month }) => `${date}-${month}`}
          renderItem={({ item }) => {
            const isEqualDate = isSameDay(dateSelected, item.date);

            return (
              <TouchableOpacity
                onPress={() => selectedDate(item.date)}
                disabled={isPending}
                className={`mx-1 flex-col items-center justify-center gap-1 rounded-md border border-zinc-400 p-2 px-6 py-2 ${isEqualDate ? "bg-emerald-600" : ""} `}
              >
                <Text
                  className={`text-sm text-zinc-400 ${isEqualDate ? "text-zinc-50" : "text-zinc-100"} `}
                >
                  Dia
                </Text>
                <Text
                  className={`text-lg text-zinc-50 ${isEqualDate ? "text-zinc-50" : "text-zinc-100"} `}
                >
                  {item.day}
                </Text>
                <Text
                  className={`text-sm capitalize text-zinc-400 ${isEqualDate ? "text-zinc-50" : "text-zinc-100"} `}
                >
                  {item.month}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View className="m-5 flex-row gap-5 border-y border-zinc-400/40 px-4 py-8">
        <Image
          className="h-20 w-20 rounded-full border border-zinc-400"
          source={{
            uri: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
        />
        <View className="gap-2">
          <Text className="text-2xl font-bold text-zinc-50">
            {data?.nutritionist.name}
          </Text>
          <Text className="text-lg font-semibold text-zinc-400">
            CRN: {data?.nutritionist.crn}
          </Text>
        </View>
      </View>
      <ScrollView>
        <View className="m-5 flex-row flex-wrap justify-center gap-4">
          {hoursAvailableToday.length === 0 && !consultsData && (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator className="text-zinc-50" size={"small"} />
            </View>
          )}

          {hoursAvailableToday.map(({ label, value }) => {
            const isEqualDate = hourSelected === value;
            return (
              <TouchableOpacity
                key={label}
                disabled={isPending}
                onPress={() => {
                  selectedHour(value);
                }}
                className={`flex-col items-center justify-center gap-1 rounded-md border border-zinc-400 p-3 py-2 ${isEqualDate ? "bg-emerald-600" : "bg-zinc-800"} `}
              >
                <Text
                  className={`text-sm text-zinc-400 ${isEqualDate ? "text-zinc-50" : "text-zinc-100"} `}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View className="p-4">
        <TouchableOpacity
          disabled={!hourSelected}
          onPress={() => {
            handleSelectHour();
          }}
          className={`w-full rounded-lg border border-zinc-600/45 bg-zinc-700/90 p-4 ${!hourSelected ? "opacity-50" : ""}`}
        >
          <Text className="text-center font-bold text-zinc-200">Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
