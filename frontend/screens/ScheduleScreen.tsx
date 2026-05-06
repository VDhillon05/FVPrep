import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import FilterSegment from "../components/FilterSegment";
import GameCard from "../components/GameCard";
import SettingsPopover from "../components/SettingsPopover";
import TopNav from "../components/TopNav";
import { FV_GAMES, Game } from "../data";
import { colors } from "../theme";

const FILTERS = ["All", "Live", "Upcoming", "Final"] as const;
type Filter = (typeof FILTERS)[number];

type Props = {
  onOpenGame: (id: number) => void;
  notifications: boolean;
  onNotificationsChange: (next: boolean) => void;
  dark: boolean;
  onDarkChange: (next: boolean) => void;
};

export default function ScheduleScreen({
  onOpenGame,
  notifications,
  onNotificationsChange,
  dark,
  onDarkChange,
}: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const filtered = FV_GAMES.filter((g) => {
    if (filter === "All") return true;
    if (filter === "Live") return g.status === "live";
    if (filter === "Upcoming") return g.status === "upcoming";
    return g.status === "final";
  });
  const groups = filtered.reduce<Record<string, Game[]>>((acc, g) => {
    (acc[g.time] ||= []).push(g);
    return acc;
  }, {});

  return (
    <View style={styles.screen}>
      <TopNav
        title="Schedule"
        action={
          <SettingsPopover
            notifications={notifications}
            onNotificationsChange={onNotificationsChange}
            dark={dark}
            onDarkChange={onDarkChange}
          />
        }
      />
      <View style={styles.pad}>
        <FilterSegment value={filter} options={FILTERS} onChange={setFilter} />
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {Object.entries(groups).map(([date, items]) => (
          <View key={date}>
            <Text style={styles.dateHeader}>{date}</Text>
            <View style={styles.cardStack}>
              {items.map((g) => (
                <GameCard key={g.id} game={g} onPress={() => onOpenGame(g.id)} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  pad: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
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
  cardStack: {
    gap: 10,
  },
});
