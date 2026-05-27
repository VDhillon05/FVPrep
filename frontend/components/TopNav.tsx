import { ReactNode, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../context/ThemeContext";
import type { ThemePalette } from "../theme";

type Props = {
  title: string;
  action?: ReactNode;
};

export default function TopNav({ title, action }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.bar}>
      <Text style={styles.title}>{title}</Text>
      <View>{action}</View>
    </View>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    bar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
      backgroundColor: c.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: c.border1,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: c.fg1,
      letterSpacing: -0.6,
    },
  });
}
