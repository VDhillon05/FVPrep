import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Game, Team } from "../data";
import { colors, radius, shadow } from "../theme";
import StatusChip from "./StatusChip";
import TeamRow from "./TeamRow";

type Props = {
  game: Game;
  teamsByAbbr: Record<string, Team | undefined>;
  onPress?: () => void;
};

const fallbackTeam = (abbr: string): Team => ({
  abbr,
  name: abbr,
  city: "",
  record: "\u2013",
  seed: 0,
  color: "#111827",
  textColor: "#ffffff",
});

export default function GameCard({ game, teamsByAbbr, onPress }: Props) {
  const home = teamsByAbbr[game.home] ?? fallbackTeam(game.home);
  const away = teamsByAbbr[game.away] ?? fallbackTeam(game.away);
  const winner =
    game.status === "final"
      ? (game.hScore ?? 0) > (game.aScore ?? 0)
        ? game.home
        : game.away
      : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadow.s1,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.head}>
        <StatusChip status={game.status} period={game.period} />
        <Text style={styles.meta}>
          {game.court} · {game.round}
        </Text>
      </View>
      <TeamRow team={home} score={game.hScore} dim={!!winner && winner !== game.home} />
      <View style={styles.divider} />
      <TeamRow team={away} score={game.aScore} dim={!!winner && winner !== game.away} />
      {game.status === "upcoming" && (
        <View style={styles.foot}>
          <Feather name="clock" size={14} color={colors.fg3} />
          <Text style={styles.footText}>
            {game.time} · {game.when}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  pressed: { opacity: 0.96, transform: [{ scale: 0.99 }] },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  meta: { fontSize: 11.5, fontWeight: "500", color: colors.fg3 },
  divider: {
    height: 1,
    backgroundColor: colors.border1,
    marginVertical: 4,
    opacity: 0.7,
  },
  foot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border1,
    borderStyle: "dashed",
  },
  footText: { fontSize: 12, fontWeight: "500", color: colors.fg3 },
});
