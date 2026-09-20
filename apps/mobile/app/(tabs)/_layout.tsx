import { Tabs } from "expo-router";
import { Text } from "react-native";
import { tokens } from "../../src/theme";

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: "700",
        color: focused ? tokens.teal : tokens.muted,
      }}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.surface,
          borderTopColor: "#5C677320",
        },
        tabBarActiveTintColor: tokens.teal,
        tabBarInactiveTintColor: tokens.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Clocks",
          tabBarLabel: ({ focused }) => <TabLabel label="Clocks" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="sevis"
        options={{
          title: "SEVIS",
          tabBarLabel: ({ focused }) => <TabLabel label="SEVIS" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          title: "USCIS",
          tabBarLabel: ({ focused }) => <TabLabel label="USCIS" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="h1b"
        options={{
          title: "H-1B",
          tabBarLabel: ({ focused }) => <TabLabel label="H-1B" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
