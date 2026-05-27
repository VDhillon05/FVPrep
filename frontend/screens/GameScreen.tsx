import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import StatusChip from "../components/StatusChip";
import TeamLogo from "../components/TeamLogo";
import { fetchGames, fetchTeams } from "../api";
import { Game, Team } from "../data";
import { colors, radius, shadow } from "../theme";

type Props = {
  gameId: number;
  onBack: () => void;
};

export default function GameScreen({ gameId, onBack }: Props) {
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
        setError(err instanceof Error ? err.message : "Failed to load game");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [gameId]);

  const game = useMemo(() => games.find((g) => g.id === gameId), [games, gameId]);
  const home = game ? teamsByAbbr[game.home] : undefined;
  const away = game ? teamsByAbbr[game.away] : undefined;

  const periods =
    game?.status === "final"
      ? [
          { q: "Q1", h: "18", a: "14" },
          { q: "Q2", h: "22", a: "20" },
          { q: "Q3", h: "19", a: "21" },
          { q: "Q4", h: "19", a: "17" },
        ]
      : [
          { q: "Q1", h: "18", a: "14" },
          { q: "Q2", h: "22", a: "20" },
          { q: "Q3", h: "12", a: "14" },
          { q: "Q4", h: "–",  a: "–" },
        ];

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.state}>
          <ActivityIndicator />
          <Text style={styles.stateText}>Loading game…</Text>
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

  if (!game || !home || !away) {
    return (
      <View style={styles.screen}>
        <View style={styles.state}>
          <Text style={styles.errorText}>Game not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.heroBar}>
          <Pressable onPress={onBack} style={styles.iconBtnLight} accessibilityLabel="Back">
            <Feather name="chevron-left" size={22} color="#ffffff" />
          </Pressable>
          <Text style={styles.heroTitle}>{game.round.toUpperCase()}</Text>
          <Pressable style={styles.iconBtnLight} accessibilityLabel="Share">
            <Feather name="share" size={20} color="#ffffff" />
          </Pressable>
        </View>
        <View style={styles.statusRow}>
          <StatusChip status={game.status} period={game.period} />
          <Text style={styles.heroMeta}>{game.court}</Text>
        </View>
        <View style={styles.matchRow}>
          <View style={styles.teamSide}>
            <TeamLogo team={home} size={40} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.teamName}>{home.name}</Text>
              <Text style={styles.teamRecord}>{home.record}</Text>
            </View>
          </View>
          <Text style={styles.vs}>VS</Text>
          <View style={[styles.teamSide, styles.teamSideEnd]}>
            <View style={{ marginRight: 10, alignItems: "flex-end" }}>
              <Text style={styles.teamName}>{away.name}</Text>
              <Text style={styles.teamRecord}>{away.record}</Text>
            </View>
            <TeamLogo team={away} size={40} />
          </View>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{game.hScore ?? "–"}</Text>
          <Text style={styles.score}>{game.aScore ?? "–"}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.pressed]}
          >
            <Feather name="bell" size={16} color="#ffffff" />
            <Text style={styles.btnPrimaryText}>Notify me</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnTertiary, pressed && styles.pressed]}
          >
            <Feather name="calendar" size={16} color={colors.fg1} />
            <Text style={styles.btnTertiaryText}>Add to calendar</Text>
          </Pressable>
        </View>

        <View style={[styles.boxscore, shadow.s1]}>
          <View style={[styles.boxRow, styles.boxHead]}>
            <Text style={[styles.boxHeadText, { flex: 1 }]}>Team</Text>
            {periods.map((p) => (
              <Text key={p.q} style={[styles.boxHeadText, styles.boxNum]}>{p.q}</Text>
            ))}
            <Text style={[styles.boxHeadText, styles.boxNum, { fontWeight: "800", color: colors.fg1 }]}>T</Text>
          </View>
          <View style={[styles.boxRow, styles.boxDataRow]}>
            <View style={styles.boxTeam}>
              <TeamLogo team={home} size={22} radius={6} />
              <Text style={styles.boxTeamText}>{home.abbr}</Text>
            </View>
            {periods.map((p) => (
              <Text key={p.q} style={[styles.num, styles.boxNum]}>{p.h}</Text>
            ))}
            <Text style={[styles.num, styles.boxNum, styles.numBold]}>{game.hScore ?? "–"}</Text>
          </View>
          <View style={[styles.boxRow, styles.boxDataRow]}>
            <View style={styles.boxTeam}>
              <TeamLogo team={away} size={22} radius={6} />
              <Text style={styles.boxTeamText}>{away.abbr}</Text>
            </View>
            {periods.map((p) => (
              <Text key={p.q} style={[styles.num, styles.boxNum]}>{p.a}</Text>
            ))}
            <Text style={[styles.num, styles.boxNum, styles.numBold]}>{game.aScore ?? "–"}</Text>
          </View>
        </View>

        <View style={[styles.metaList, shadow.s1]}>
          <View style={styles.metaRow}>
            <Feather name="map-pin" size={16} color={colors.fg3} />
            <Text style={styles.metaText}>{game.court}</Text>
          </View>
          <View style={[styles.metaRow, styles.metaRowBordered]}>
            <Feather name="clock" size={16} color={colors.fg3} />
            <Text style={styles.metaText}>
              {game.when} · {game.time}
            </Text>
          </View>
          <View style={[styles.metaRow, styles.metaRowBordered]}>
            <Feather name="award" size={16} color={colors.fg3} />
            <Text style={styles.metaText}>{game.round}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
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
    color: colors.fg3,
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.red500,
    textAlign: "center",
  },
  hero: {
    backgroundColor: colors.navy900,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
  },
  heroBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  heroTitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  iconBtnLight: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  heroMeta: {
    color: colors.navy200,
    fontSize: 11.5,
    fontWeight: "500",
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  teamSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  teamSideEnd: { justifyContent: "flex-end" },
  teamName: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  teamRecord: { color: colors.navy200, fontSize: 11, fontWeight: "500" },
  vs: {
    color: colors.navy300,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    paddingHorizontal: 12,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 4,
  },
  score: {
    color: "#ffffff",
    fontSize: 56,
    fontWeight: "800",
    letterSpacing: -1.2,
    fontVariant: ["tabular-nums"],
    lineHeight: 56,
  },
  body: {
    padding: 16,
    paddingBottom: 28,
  },
  actionRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  btn: {
    flex: 1,
    height: 42,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnPrimary: { backgroundColor: colors.orange500 },
  btnPrimaryText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
  btnTertiary: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: colors.border2,
  },
  btnTertiaryText: { color: colors.fg1, fontSize: 14, fontWeight: "600" },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  boxscore: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: 16,
  },
  boxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  boxHead: {
    backgroundColor: colors.cream50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
  },
  boxHeadText: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    color: colors.fg3,
  },
  boxNum: { width: 40, textAlign: "right" },
  boxDataRow: { borderTopWidth: 1, borderTopColor: colors.border1 },
  boxTeam: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  boxTeamText: { fontSize: 13, fontWeight: "700", color: colors.fg1, letterSpacing: 0.4 },
  num: { fontSize: 13, fontWeight: "600", color: colors.fg2, fontVariant: ["tabular-nums"] },
  numBold: { color: colors.fg1, fontWeight: "700" },
  metaList: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  metaRowBordered: { borderTopWidth: 1, borderTopColor: colors.border1 },
  metaText: { fontSize: 14, fontWeight: "500", color: colors.fg1 },
});
