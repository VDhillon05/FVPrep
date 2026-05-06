import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

type Props = {
  title: string;
  action?: ReactNode;
};

export default function TopNav({ title, action }: Props) {
  return (
    <View style={styles.bar}>
      <Text style={styles.title}>{title}</Text>
      <View>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.fg1,
    letterSpacing: -0.6,
  },
});
