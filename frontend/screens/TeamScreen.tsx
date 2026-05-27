import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import GameCard from "../components/GameCard";
import TeamLogo from "../components/TeamLogo";
import { useTheme } from "../context/ThemeContext";
import { fetchGames, fetchTeams } from "../api";
import { Game, Team } from "../data";
import type { ThemePalette } from "../theme";

type Props = {
  teamAbbr: string;
  onBack: () => void;
  onOpenGame: (id: number) => void;
};

export default function TeamScreen({ teamAbbr, onBack, onOpenGame }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [games, setGames] = useState<Game[]>([]);
  const [teamsByAbbr, setTeamsByAbbr] = useState<Record<string, Team>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setError(null);
      try {
        const [nextTeams, nextGames] = await Promise.all([fetchTeams(), fetchGames()]);
        setTeamsByAbbr(Object.fromEntries(nextTeams.map((t) => [t.abbr, t])));
        setGames(nextGames);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load team");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [teamAbbr]);

  const team = teamsByAbbr[teamAbbr];
  const teamGames = useMemo(
    () => games.filter((g) => g.home === teamAbbr || g.away === teamAbbr),
    [games, teamAbbr],
  );
  const wins = teamGames.filter(
    (g) =>
      g.status === "final" &&
      ((g.home === teamAbbr && (g.hScore ?? 0) > (g.aScore ?? 0)) ||
        (g.away === teamAbbr && (g.aScore ?? 0) > (g.hScore ?? 0))),
  ).length;
  const losses = teamGames.filter(
    (g) =>
      g.status === "final" &&
      ((g.home === teamAbbr && (g.hScore ?? 0) < (g.aScore ?? 0)) ||
        (g.away === teamAbbr && (g.aScore ?? 0) < (g.hScore ?? 0))),
  ).length;

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.state}>
          <ActivityIndicator color={colors.fg2} />
          <Text style={styles.stateText}>Loading team…</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <View style={styles.state}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.screen}>
        <View style={styles.state}>
          <Text style={styles.errorText}>Team not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.heroBar}>
          <Pressable onPress={onBack} style={styles.iconBtnLight} accessibilityLabel="Back">
            <Feather name="chevron-left" size={22} color={colors.fgOnInverse} />
          </Pressable>
          <Pressable style={styles.iconBtnLight} accessibilityLabel="Favorite">
            <Feather name="star" size={20} color={colors.fgOnInverse} />
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
          {teamGames.map((g) => (
            <GameCard
              key={g.id}
              game={g}
              teamsByAbbr={teamsByAbbr}
              onPress={() => onOpenGame(g.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bgApp },
    state: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      gap: 10,
    },
    stateText: {
      fontSize: 12.5,
      fontWeight: "600",
      color: c.fg3,
    },
    errorText: {
      fontSize: 12.5,
      fontWeight: "700",
      color: c.fg1,
      textAlign: "center",
    },
    hero: {
      backgroundColor: c.heroBg,
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
      backgroundColor: c.heroControlBg,
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
      backgroundColor: c.heroControlBg,
    },
    name: {
      color: c.fgOnInverse,
      fontSize: 28,
      fontWeight: "800",
      letterSpacing: -0.6,
      marginTop: 8,
    },
    city: {
      color: c.fgOnInverseMuted,
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
      backgroundColor: c.heroControlBg,
      borderRadius: 14,
    },
    statCell: { alignItems: "center" },
    statNum: {
      color: c.fgOnInverse,
      fontSize: 22,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },
    statLbl: {
      color: c.fgOnInverseMuted,
      fontSize: 10.5,
      fontWeight: "500",
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginTop: 2,
    },
    vrule: { width: 1, height: 32, backgroundColor: c.heroHairline },
    body: {
      paddingHorizontal: 16,
      paddingBottom: 28,
    },
    dateHeader: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.9,
      textTransform: "uppercase",
      color: c.fg3,
      marginTop: 18,
      marginBottom: 10,
      marginHorizontal: 4,
    },
    cardStack: { gap: 10 },
  });
}
