import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import StatusChip from "../components/StatusChip";
import TeamLogo from "../components/TeamLogo";
import { useTheme } from "../context/ThemeContext";
import { fetchGames, fetchTeams } from "../api";
import { Game, Team } from "../data";
import { scheduleGameReminder } from "../notifications";
import { radius, type ThemePalette } from "../theme";

type Props = {
  gameId: number;
  onBack: () => void;
  notificationsEnabled: boolean;
};

export default function GameScreen({ gameId, onBack, notificationsEnabled }: Props) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [games, setGames] = useState<Game[]>([]);
  const [teamsByAbbr, setTeamsByAbbr] = useState<Record<string, Team>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);

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
          { q: "Q4", h: "–", a: "–" },
        ];

  const scheduleReminder = async () => {
    if (!game || !home || !away) return;
    if (!notificationsEnabled) {
      setReminderStatus("Turn on notifications in Settings to schedule reminders.");
      return;
    }

    const now = new Date();
    let start = new Date(now);

    const m = game.when.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (m) {
      const hoursRaw = parseInt(m[1], 10);
      const minutes = parseInt(m[2], 10);
      const suffix = m[3]?.toLowerCase();
      let hours = hoursRaw;
      if (suffix === "pm" && hours < 12) hours += 12;
      if (suffix === "am" && hours === 12) hours = 0;

      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0,
        0,
      );
    } else {
      // Fallback: assume game starts 30 minutes from now.
      start = new Date(now.getTime() + 30 * 60 * 1000);
    }

    let trigger = new Date(start.getTime() - 15 * 60 * 1000);
    if (trigger <= now) {
      trigger = new Date(now.getTime() + 2 * 60 * 1000);
    }

    try {
      const title = "Game reminder";
      const body = `${away.name} vs ${home.name} at ${game.court} starts in 15 minutes!`;
      await scheduleGameReminder(trigger, title, body);
      setReminderStatus("Reminder set 15 minutes before tipoff.");
    } catch (e) {
      setReminderStatus("Unable to schedule reminder on this device.");
    }
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.state}>
          <ActivityIndicator color={colors.fg2} />
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
            <Feather name="chevron-left" size={22} color={colors.fgOnInverse} />
          </Pressable>
          <Text style={styles.heroTitle}>{game.round.toUpperCase()}</Text>
          <Pressable style={styles.iconBtnLight} accessibilityLabel="Share">
            <Feather name="share" size={20} color={colors.fgOnInverse} />
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
            onPress={scheduleReminder}
          >
            <Feather name="bell" size={16} color={colors.primaryButtonFg} />
            <Text style={styles.btnPrimaryText}>Notify me</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnTertiary, pressed && styles.pressed]}
          >
            <Feather name="calendar" size={16} color={colors.secondaryButtonFg} />
            <Text style={styles.btnTertiaryText}>Add to calendar</Text>
          </Pressable>
        </View>
        {reminderStatus ? (
          <View style={styles.reminderRow}>
            <Text style={styles.reminderText}>{reminderStatus}</Text>
          </View>
        ) : null}

        <View style={[styles.boxscore, shadow.s1]}>
          <View style={[styles.boxRow, styles.boxHead]}>
            <Text style={[styles.boxHeadText, { flex: 1 }]}>Team</Text>
            {periods.map((p) => (
              <Text key={p.q} style={[styles.boxHeadText, styles.boxNum]}>
                {p.q}
              </Text>
            ))}
            <Text style={[styles.boxHeadText, styles.boxNum, { fontWeight: "800", color: colors.fg1 }]}>
              T
            </Text>
          </View>
          <View style={[styles.boxRow, styles.boxDataRow]}>
            <View style={styles.boxTeam}>
              <TeamLogo team={home} size={22} radius={6} />
              <Text style={styles.boxTeamText}>{home.abbr}</Text>
            </View>
            {periods.map((p) => (
              <Text key={p.q} style={[styles.num, styles.boxNum]}>
                {p.h}
              </Text>
            ))}
            <Text style={[styles.num, styles.boxNum, styles.numBold]}>{game.hScore ?? "–"}</Text>
          </View>
          <View style={[styles.boxRow, styles.boxDataRow]}>
            <View style={styles.boxTeam}>
              <TeamLogo team={away} size={22} radius={6} />
              <Text style={styles.boxTeamText}>{away.abbr}</Text>
            </View>
            {periods.map((p) => (
              <Text key={p.q} style={[styles.num, styles.boxNum]}>
                {p.a}
              </Text>
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
      color: c.fgOnInverseMuted,
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 1,
    },
    iconBtnLight: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: c.heroControlBg,
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
      color: c.fgOnInverseMuted,
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
    teamName: { color: c.fgOnInverse, fontSize: 16, fontWeight: "700" },
    teamRecord: { color: c.fgOnInverseMuted, fontSize: 11, fontWeight: "500" },
    vs: {
      color: c.fgOnInverseMuted,
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
      color: c.fgOnInverse,
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
    btnPrimary: { backgroundColor: c.primaryButtonBg },
    btnPrimaryText: { color: c.primaryButtonFg, fontSize: 14, fontWeight: "600" },
    btnTertiary: {
      backgroundColor: c.secondaryButtonBg,
      borderWidth: 1,
      borderColor: c.secondaryButtonBorder,
    },
    btnTertiaryText: { color: c.secondaryButtonFg, fontSize: 14, fontWeight: "600" },
    pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
    boxscore: {
      backgroundColor: c.bgSurface,
      borderWidth: 1,
      borderColor: c.border1,
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
      backgroundColor: c.bgMuted,
      borderBottomWidth: 1,
      borderBottomColor: c.border1,
    },
    boxHeadText: {
      fontSize: 10.5,
      fontWeight: "700",
      letterSpacing: 0.9,
      textTransform: "uppercase",
      color: c.fg3,
    },
    boxNum: { width: 40, textAlign: "right" },
    boxDataRow: { borderTopWidth: 1, borderTopColor: c.border1 },
    boxTeam: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
    boxTeamText: { fontSize: 13, fontWeight: "700", color: c.fg1, letterSpacing: 0.4 },
    num: { fontSize: 13, fontWeight: "600", color: c.fg2, fontVariant: ["tabular-nums"] },
    numBold: { color: c.fg1, fontWeight: "700" },
    metaList: {
      backgroundColor: c.bgSurface,
      borderWidth: 1,
      borderColor: c.border1,
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
    metaRowBordered: { borderTopWidth: 1, borderTopColor: c.border1 },
    metaText: { fontSize: 14, fontWeight: "500", color: c.fg1 },
    reminderRow: {
      marginBottom: 10,
      paddingHorizontal: 4,
    },
    reminderText: {
      fontSize: 12,
      fontWeight: "500",
      color: c.fg2,
    },
  });
}
