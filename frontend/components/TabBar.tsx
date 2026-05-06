import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

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
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const on = t.id === active;
        const tint = on ? colors.orange500 : colors.fg3;
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

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 1,
    borderTopColor: colors.border1,
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
