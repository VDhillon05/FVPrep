import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import SettingsPopover from "../components/SettingsPopover";
import TeamLogo from "../components/TeamLogo";
import TopNav from "../components/TopNav";
import { useTheme } from "../context/ThemeContext";
import { fetchStandings } from "../api";
import { StandingsRow } from "../data";
import { radius, type ThemePalette } from "../theme";

type Props = {
  onOpenTeam: (abbr: string) => void;
  notifications: boolean;
  onNotificationsChange: (next: boolean) => void;
};

export default function StandingsScreen({
  onOpenTeam,
  notifications,
  onNotificationsChange,
}: Props) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const next = await fetchStandings();
    setStandings(next);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load standings");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.screen}>
      <TopNav
        title="Standings"
        action={
          <SettingsPopover
            notifications={notifications}
            onNotificationsChange={onNotificationsChange}
          />
        }
      />
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.fg3}
          />
        }
      >
        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator color={colors.fg2} />
            <Text style={styles.stateText}>Loading standings…</Text>
          </View>
        ) : null}
        {!loading && error ? (
          <View style={styles.state}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={[styles.card, shadow.s1]}>
          <View style={[styles.row, styles.headRow]}>
            <Text style={[styles.headText, { width: 28 }]}> </Text>
            <Text style={[styles.headText, styles.teamCol]}>Team</Text>
            <Text style={[styles.headText, styles.numCol]}>W–L</Text>
            <Text style={[styles.headText, styles.numCol]}>PF</Text>
            <Text style={[styles.headText, styles.numCol]}>L5</Text>
          </View>
          {standings.map((t, i) => (
            <Pressable
              key={t.abbr}
              onPress={() => onOpenTeam(t.abbr)}
              style={({ pressed }) => [
                styles.row,
                styles.dataRow,
                i === 0 && styles.firstDataRow,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[styles.seed, i < 2 && styles.seedStrong, i >= 2 && i < 4 && styles.seedMuted]}
              >
                <Text
                  style={[styles.seedText, i < 2 && styles.seedTextStrong, i >= 2 && i < 4 && styles.seedTextMuted]}
                >
                  {i + 1}
                </Text>
              </View>
              <View style={styles.teamCol}>
                <TeamLogo team={t} size={26} />
                <View style={{ marginLeft: 10, flexShrink: 1 }}>
                  <Text style={styles.teamName}>{t.name}</Text>
                  <Text style={styles.teamCity}>{t.city}</Text>
                </View>
              </View>
              <Text style={[styles.num, styles.numBold, styles.numCol]}>{t.record}</Text>
              <Text style={[styles.num, styles.numCol]}>{t.pf.toLocaleString()}</Text>
              <View style={[styles.numCol, styles.last5]}>
                {t.trend === "up" && (
                  <Feather name="arrow-up" size={12} color={colors.trendStrong} />
                )}
                {t.trend === "down" && (
                  <Feather name="arrow-down" size={12} color={colors.trendSoft} />
                )}
                <Text style={styles.num}>{t.last5}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.seed, styles.seedStrong]}>
              <Text style={[styles.seedText, styles.seedTextStrong]}>1</Text>
            </View>
            <Text style={styles.legendText}>Top seed · auto bracket</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.seed, styles.seedMuted]}>
              <Text style={[styles.seedText, styles.seedTextMuted]}>3</Text>
            </View>
            <Text style={styles.legendText}>Wild-card eligible</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bgApp },
    body: { padding: 16, paddingBottom: 28 },
    state: {
      paddingTop: 18,
      paddingBottom: 12,
      alignItems: "center",
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
    card: {
      backgroundColor: c.bgSurface,
      borderWidth: 1,
      borderColor: c.border1,
      borderRadius: radius.lg,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 10,
    },
    headRow: {
      backgroundColor: c.bgMuted,
      borderBottomWidth: 1,
      borderBottomColor: c.border1,
    },
    headText: {
      fontSize: 10.5,
      fontWeight: "700",
      letterSpacing: 0.9,
      textTransform: "uppercase",
      color: c.fg3,
    },
    dataRow: {
      borderTopWidth: 1,
      borderTopColor: c.border1,
    },
    firstDataRow: { borderTopWidth: 0 },
    pressed: { backgroundColor: c.bgSubtle },
    teamCol: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    numCol: {
      width: 56,
      textAlign: "right",
    },
    seed: {
      width: 24,
      height: 24,
      borderRadius: 6,
      backgroundColor: c.bgMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    seedStrong: { backgroundColor: c.fg1 },
    seedMuted: { backgroundColor: c.border1 },
    seedText: { fontSize: 11, fontWeight: "700", color: c.fg1 },
    seedTextStrong: { color: c.bgSurface },
    seedTextMuted: { color: c.fg1 },
    teamName: { fontSize: 14, fontWeight: "600", color: c.fg1 },
    teamCity: { fontSize: 11, fontWeight: "500", color: c.fg3, marginTop: 2 },
    num: {
      fontSize: 13,
      fontWeight: "600",
      color: c.fg2,
      textAlign: "right",
      fontVariant: ["tabular-nums"],
    },
    numBold: { color: c.fg1, fontWeight: "700" },
    last5: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 4,
    },
    legend: {
      marginTop: 14,
      gap: 6,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    legendText: {
      fontSize: 12,
      fontWeight: "500",
      color: c.fg3,
    },
  });
}
