import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../context/ThemeContext";
import type { ThemePalette } from "../theme";

export type TabId = "schedule" | "standings";

type Props = {
  active: TabId;
  onChange: (id: TabId) => void;
};

const TABS: { id: TabId; icon: keyof typeof Feather.glyphMap; label: string }[] = [
  { id: "schedule", icon: "calendar", label: "Schedule" },
  { id: "standings", icon: "award", label: "Standings" },
];

export default function TabBar({ active, onChange }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const on = t.id === active;
        const tint = on ? colors.tabActive : colors.tabInactive;
        return (
          <Pressable key={t.id} onPress={() => onChange(t.id)} style={styles.tab}>
            <Feather name={t.icon} size={22} color={tint} />
            <Text style={[styles.label, { color: tint }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    bar: {
      flexDirection: "row",
      backgroundColor: c.tabBarBg,
      borderTopWidth: 1,
      borderTopColor: c.tabBarBorder,
      paddingHorizontal: 8,
      paddingTop: 6,
      paddingBottom: 18,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 6,
      gap: 2,
    },
    label: {
      fontSize: 10.5,
      fontWeight: "600",
    },
  });
}
