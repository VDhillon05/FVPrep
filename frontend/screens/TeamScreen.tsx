import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import GameCard from "../components/GameCard";
import TeamLogo from "../components/TeamLogo";
import { FV_GAMES, FV_TEAMS } from "../data";
import { colors } from "../theme";

type Props = {
  teamAbbr: string;
  onBack: () => void;
  onOpenGame: (id: number) => void;
};

export default function TeamScreen({ teamAbbr, onBack, onOpenGame }: Props) {
  const team = FV_TEAMS[teamAbbr];
  if (!team) return null;
  const games = FV_GAMES.filter((g) => g.home === teamAbbr || g.away === teamAbbr);
  const wins = games.filter(
    (g) =>
      g.status === "final" &&
      ((g.home === teamAbbr && (g.hScore ?? 0) > (g.aScore ?? 0)) ||
        (g.away === teamAbbr && (g.aScore ?? 0) > (g.hScore ?? 0))),
  ).length;
  const losses = games.filter(
    (g) =>
      g.status === "final" &&
      ((g.home === teamAbbr && (g.hScore ?? 0) < (g.aScore ?? 0)) ||
        (g.away === teamAbbr && (g.aScore ?? 0) < (g.hScore ?? 0))),
  ).length;

  return (
    <View style={styles.screen}>
      <View style={[styles.hero, { backgroundColor: team.color }]}>
        <View style={styles.heroBar}>
          <Pressable onPress={onBack} style={styles.iconBtnLight} accessibilityLabel="Back">
            <Feather name="chevron-left" size={22} color="#ffffff" />
          </Pressable>
          <Pressable style={styles.iconBtnLight} accessibilityLabel="Favorite">
            <Feather name="star" size={20} color="#ffffff" />
          </Pressable>
        </View>
        <View style={styles.heroBody}>
          <View style={styles.logoFrame}>
            <TeamLogo team={team} size={64} radius={14} />
          </View>
          <Text style={styles.name}>{team.name}</Text>
          <Text style={styles.city}>
            {team.city} · {team.seed} seed
          </Text>
          <View style={styles.stats}>
            <View style={styles.statCell}>
              <Text style={styles.statNum}>{team.record}</Text>
              <Text style={styles.statLbl}>Record</Text>
            </View>
            <View style={styles.vrule} />
            <View style={styles.statCell}>
              <Text style={styles.statNum}>{wins}</Text>
              <Text style={styles.statLbl}>Wins</Text>
            </View>
            <View style={styles.vrule} />
            <View style={styles.statCell}>
              <Text style={styles.statNum}>{losses}</Text>
              <Text style={styles.statLbl}>Losses</Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.dateHeader}>This week</Text>
        <View style={styles.cardStack}>
          {games.map((g) => (
            <GameCard key={g.id} game={g} onPress={() => onOpenGame(g.id)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  hero: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 22,
  },
  heroBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtnLight: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBody: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  logoFrame: {
    padding: 4,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  name: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
    marginTop: 8,
  },
  city: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
  },
  statCell: { alignItems: "center" },
  statNum: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  statLbl: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10.5,
    fontWeight: "500",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 2,
  },
  vrule: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.18)" },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  dateHeader: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    color: colors.fg3,
    marginTop: 18,
    marginBottom: 10,
    marginHorizontal: 4,
  },
  cardStack: { gap: 10 },
});
