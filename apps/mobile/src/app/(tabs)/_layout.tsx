import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols"


export default function RootLayout() {
  return (
    <Tabs
      initialRouteName="(agendas)"
      screenOptions={{
        tabBarInactiveTintColor: "#fff",
        tabBarActiveTintColor: "#fff",
        headerShown: false,
        animation: "none",
        sceneStyle: {
          backgroundColor: "#18181b",
        },
        headerStyle: {
          backgroundColor: "#18181b",
        },
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: "#18181b",
        }
      }}
    >
      <Tabs.Screen name="(agendas)"
        options={{
          title: "Agendas disponíveis",
          tabBarIcon: () => <SymbolView name="house" weight="bold" tintColor={"#fff"} />,
        }}
      />
      <Tabs.Screen name="consults"
        options={{
          tabBarIcon: () => <SymbolView name="book" weight="bold" tintColor={"#fff"} />,
          title: "Consultas",
        }}
      />
    </Tabs>
  );
}
