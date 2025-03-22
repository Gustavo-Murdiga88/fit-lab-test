import { Stack } from "expo-router";

export default function ConsultasLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#18181b",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Consultas confirmadas" }} />
    </Stack>
  );
}
