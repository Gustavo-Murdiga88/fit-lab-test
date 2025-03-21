import { getAgendaById } from "@/src/http/get-agenda-by-id";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { differenceInDays, addDays, isBefore, isToday, isEqual } from "date-fns";
import { useHoursAvailable } from "@/src/hooks/use-hours-availible";
import { generateTimerValues } from "@/src/utils/generate-timer-values";
import { fetchConsultsByDate } from "@/src/http/get-consults-by-date";
import { forMonth } from "@/src/utils/date";

export default function Agenda() {
  const [dateSelected, selectedDate] = useState(new Date());
  const [hourSelected, selectedHour] = useState("");

  const params = useGlobalSearchParams();
  const router = useRouter();

  const { isLoading, data } = useQuery({
    queryKey: ["agenda", params.id],
    queryFn: () => getAgendaById({ id: params.id as string }),
  })

  const { data: consultsData } = useQuery({
    queryKey: ["consults", params.id, dateSelected.getDate()],
    queryFn: async () =>
      fetchConsultsByDate({ nutritionistId: params.id as string, date: new Date() }),
  });

  function handleSelectHour() {

    if (hourSelected && dateSelected) {
      router.push({
        pathname: "/(tabs)/(agendas)/consult",
        params: {
          id: params.id,
          date: dateSelected.toISOString(),
          hour: hourSelected
        }
      })
    }

  }

  const days = useMemo(() => {
    if (!data) {
      return {
        days: []
      }
    }
    const difference = differenceInDays(data?.finalInterval, data?.initialInterval);

    const days = Array.from({ length: difference }).map((_, index) => {
      const date = addDays(data.initialInterval, index + 1);

      return {
        day: date.getDate(),
        month: forMonth.format(date),
        date,
      }
    }).filter(({ date }) => isToday(date) || !isBefore(date, new Date()));

    return {
      days
    }
  }, [data])

  const options = useMemo(() => {
    return generateTimerValues();
  }, [])

  const { hoursAvailableToday } = useHoursAvailable({
    options,
    data,
    consultsData,
  })

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <ActivityIndicator className="text-zinc-50" />
      </View>
    )
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
            const isEqualDate = isEqual(dateSelected, item.date);

            return (
              <TouchableOpacity
                onPress={() => selectedDate(item.date)}
                className={
                  `p-2 px-6 py-2 flex-col gap-1 mx-1 items-center border-zinc-400 border rounded-md justify-center
                ${isEqualDate ? "bg-emerald-600" : ""}
                `
                }>
                <Text className={
                  `text-sm text-zinc-400
                  ${isEqualDate ? "text-zinc-50" : "text-zinc-100"}
                  `
                }>
                  Dia
                </Text>
                <Text className={
                  `text-lg text-zinc-50
                  ${isEqualDate ? "text-zinc-50" : "text-zinc-100"}
                  `
                }>
                  {item.day}
                </Text>
                <Text className={
                  `text-sm capitalize text-zinc-400
                  ${isEqualDate ? "text-zinc-50" : "text-zinc-100"}
                  `
                }>
                  {item.month}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
      <View className="m-5 border-y flex-row gap-5 border-zinc-400/40 py-8 px-4">
        <Image
          className="w-20 h-20 rounded-full border border-zinc-400"
          source={{
            uri: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }}
        />
        <View className="gap-2">
          <Text className="text-zinc-50 text-2xl font-bold">
            {data?.nutritionist.name}
          </Text>
          <Text className="text-zinc-400 font-semibold text-lg">
            CRN: {data?.nutritionist.crn}
          </Text>
        </View>
      </View>
      <ScrollView>
        <View className="m-5 flex-row flex-wrap gap-4 justify-center">
          {
            hoursAvailableToday.map(({ label, value }) => {
              const isEqualDate = hourSelected === value;
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => {
                    selectedHour(value)
                  }}
                  className={`
                    p-3 py-2 flex-col gap-1 items-center border-zinc-400 border rounded-md justify-center
                    ${isEqualDate ? "bg-emerald-600" : "bg-zinc-800"}
                  `}>
                  <Text className={`
                      text-sm text-zinc-400
                      ${isEqualDate ? "text-zinc-50" : "text-zinc-100"}
                    `}>
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
      </ScrollView>
      <View className="p-4">
        <TouchableOpacity
          onPress={() => {
            handleSelectHour()
          }}
          className="w-full p-4 bg-zinc-700/90 border border-zinc-600/45 rounded-lg">
          <Text className="text-center font-bold text-zinc-200">Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}