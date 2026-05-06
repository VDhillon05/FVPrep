import { StyleSheet, Text, View } from "react-native";

import { Team } from "../data";

type Props = {
  team: Team;
  size?: number;
  radius?: number;
};

export default function TeamLogo({ team, size = 32, radius }: Props) {
  const r = radius ?? Math.round(size * 0.22);
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: r, backgroundColor: team.color },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: team.textColor, fontSize: Math.round(size * 0.34) },
        ]}
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
