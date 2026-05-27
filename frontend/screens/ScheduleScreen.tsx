import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import FilterSegment from "../components/FilterSegment";
import GameCard from "../components/GameCard";
import SettingsPopover from "../components/SettingsPopover";
import TopNav from "../components/TopNav";
import { useTheme } from "../context/ThemeContext";
import { fetchGames, fetchTeams } from "../api";
import { Game, Team } from "../data";
import type { ThemePalette } from "../theme";

const FILTERS = ["All", "Live", "Upcoming", "Final"] as const;
type Filter = (typeof FILTERS)[number];

type Props = {
  onOpenGame: (id: number) => void;
  notifications: boolean;
  onNotificationsChange: (next: boolean) => void;
};

export default function ScheduleScreen({
  onOpenGame,
  notifications,
  onNotificationsChange,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [filter, setFilter] = useState<Filter>("All");
  const [games, setGames] = useState<Game[]>([]);
  const [teamsByAbbr, setTeamsByAbbr] = useState<Record<string, Team>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const [nextTeams, nextGames] = await Promise.all([fetchTeams(), fetchGames()]);
    setTeamsByAbbr(Object.fromEntries(nextTeams.map((t) => [t.abbr, t])));
    setGames(nextGames);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load schedule");
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

  const filtered = useMemo(
    () =>
      games.filter((g) => {
        if (filter === "All") return true;
        if (filter === "Live") return g.status === "live";
        if (filter === "Upcoming") return g.status === "upcoming";
        return g.status === "final";
      }),
    [games, filter],
  );

  const groups = useMemo(
    () =>
      filtered.reduce<Record<string, Game[]>>((acc, g) => {
        (acc[g.time] ||= []).push(g);
        return acc;
      }, {}),
    [filtered],
  );

  return (
    <View style={styles.screen}>
      <TopNav
        title="Schedule"
        action={
          <SettingsPopover
            notifications={notifications}
            onNotificationsChange={onNotificationsChange}
          />
        }
      />
      <View style={styles.pad}>
        <FilterSegment value={filter} options={FILTERS} onChange={setFilter} />
      </View>
      <ScrollView
        contentContainerStyle={styles.list}
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
            <Text style={styles.stateText}>Loading schedule…</Text>
          </View>
        ) : null}
        {!loading && error ? (
          <View style={styles.state}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        {Object.entries(groups).map(([date, items]) => (
          <View key={date}>
            <Text style={styles.dateHeader}>{date}</Text>
            <View style={styles.cardStack}>
              {items.map((g) => (
                <GameCard
                  key={g.id}
                  game={g}
                  teamsByAbbr={teamsByAbbr}
                  onPress={() => onOpenGame(g.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bgApp,
    },
    pad: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    list: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    state: {
      paddingTop: 24,
      paddingBottom: 8,
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
    cardStack: {
      gap: 10,
    },
  });
}
