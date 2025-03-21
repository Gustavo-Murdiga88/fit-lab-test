import { Stack } from "expo-router";
import "./global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/query";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}