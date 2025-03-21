import { Stack } from "expo-router";

export default function ConsultasLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="page" options={{ title: "Consultas" }} />
    </Stack>
  );
}