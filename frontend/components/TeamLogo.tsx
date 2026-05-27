import { StyleSheet, Text, View } from "react-native";

import { Team } from "../data";
import { useTheme } from "../context/ThemeContext";

type Props = {
  team: Team;
  size?: number;
  radius?: number;
};

/** Monochrome badges: API team colors are ignored for strict B&W UI. */
export default function TeamLogo({ team, size = 32, radius }: Props) {
  const { colors } = useTheme();
  const r = radius ?? Math.round(size * 0.22);
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: r, backgroundColor: colors.logoBg },
      ]}
    >
      <Text
        style={[styles.label, { color: colors.logoFg, fontSize: Math.round(size * 0.34) }]}
      >
        {team.abbr}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "800",
    letterSpacing: -0.4,
  },
});
