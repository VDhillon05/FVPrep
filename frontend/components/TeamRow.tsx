import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Team } from "../data";
import type { ThemePalette } from "../theme";
import { useTheme } from "../context/ThemeContext";
import TeamLogo from "./TeamLogo";

type Props = {
  team: Team;
  score?: number | null;
  dim?: boolean;
};

export default function TeamRow({ team, score, dim }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <TeamLogo team={team} size={32} />
      <View style={styles.meta}>
        <Text style={styles.name}>{team.name}</Text>
        <Text style={styles.record}>{team.record}</Text>
      </View>
      {score != null && (
        <Text style={[styles.score, dim && styles.scoreDim]}>{score}</Text>
      )}
    </View>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 4,
    },
    meta: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    name: {
      fontSize: 15,
      fontWeight: "600",
      color: c.fg1,
    },
    record: {
      fontSize: 11.5,
      fontWeight: "500",
      color: c.fg3,
    },
    score: {
      fontSize: 26,
      fontWeight: "700",
      color: c.fg1,
      fontVariant: ["tabular-nums"],
      lineHeight: 26,
    },
    scoreDim: {
      color: c.fg3,
    },
  });
}
