import { Link, Stack } from "expo-router";
import { View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex flex-1 items-center justify-center bg-zinc-900">
        <Link href="/(tabs)/(agendas)" replace className="text-zinc-50">
          Go to home screen
        </Link>
      </View>
    </>
  );
}
