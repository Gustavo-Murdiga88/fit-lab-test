import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { SymbolView } from "expo-symbols"
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Consult() {
  const router = useRouter();

  const params = useLocalSearchParams();
  console.log(params)


  return (
    <View className="flex-1 bg-zinc-900 items-center justify-start p-8">

      <Text className="text-zinc-100 text-2xl font-bold my-2 mt-10">
        Gustavo Murdiga
      </Text>
      <Text className="text-zinc-100 text-xl font-semibold my-1">
        19:00 - 20:00
      </Text>
      <Text className="text-sm text-zinc-300 font-semibold my-2 mb-10 text-center">
        Apenas diga seu nome para agendar uma nova consulta, com o nosso nutricionista.
      </Text>

      <TextInput
        placeholder="Digite seu nome aqui:"
        className="bg-zinc-500/15 w-full p-4 rounded-lg border border-zinc-400 text-zinc-100" />

      <TouchableOpacity
        onPress={() => {
          router.dismissAll()
        }
        }
        className="bg-zinc-100 flex-row items-center justify-center gap-4 p-4 w-full mt-5 rounded-lg">
        <Text className="text-center font-semibold justify-center">
          Agendar uma nova consulta
        </Text>
        <SymbolView name="calendar" tintColor={"#000"} />
      </TouchableOpacity>
    </View >
  );
}