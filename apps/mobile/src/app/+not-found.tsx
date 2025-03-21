import { Link, Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className='bg-zinc-900 flex items-center justify-center flex-1'>
        <Link href="/(tabs)/(agendas)" replace className='text-zinc-50'>Go to home screen</Link>
      </View>
    </>
  );
}
