import { Stack } from "expo-router";

export default function AgendasLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#18181b",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="index"
        options={{
          headerTitle: "Agendas disponíveis",
        }}
      />
      <Stack.Screen name="[id]"
        options={{
          headerTitle: "Agenda",
        }}
      />
      <Stack.Screen name="consult"
        options={{
          headerTitle: "Criar nova consulta",
        }}
      />
    </Stack>
  );
}