import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import SettingsPopover from "../components/SettingsPopover";
import TeamLogo from "../components/TeamLogo";
import TopNav from "../components/TopNav";
import { FV_STANDINGS } from "../data";
import { colors, radius, shadow } from "../theme";

type Props = {
  onOpenTeam: (abbr: string) => void;
  notifications: boolean;
  onNotificationsChange: (next: boolean) => void;
  dark: boolean;
  onDarkChange: (next: boolean) => void;
};

export default function StandingsScreen({
  onOpenTeam,
  notifications,
  onNotificationsChange,
  dark,
  onDarkChange,
}: Props) {
  return (
    <View style={styles.screen}>
      <TopNav
        title="Standings"
        action={
          <SettingsPopover
            notifications={notifications}
            onNotificationsChange={onNotificationsChange}
            dark={dark}
            onDarkChange={onDarkChange}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, shadow.s1]}>
          <View style={[styles.row, styles.headRow]}>
            <Text style={[styles.headText, { width: 28 }]}> </Text>
            <Text style={[styles.headText, styles.teamCol]}>Team</Text>
            <Text style={[styles.headText, styles.numCol]}>W–L</Text>
            <Text style={[styles.headText, styles.numCol]}>PF</Text>
            <Text style={[styles.headText, styles.numCol]}>L5</Text>
          </View>
          {FV_STANDINGS.map((t, i) => (
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
              <View style={[styles.seed, i < 2 && styles.seedGold, i >= 2 && i < 4 && styles.seedWarm]}>
                <Text style={[styles.seedText, i < 2 && styles.seedTextGold, i >= 2 && i < 4 && styles.seedTextWarm]}>
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
                  <Feather name="arrow-up" size={12} color={colors.green500} />
                )}
                {t.trend === "down" && (
                  <Feather name="arrow-down" size={12} color={colors.red500} />
                )}
                <Text style={styles.num}>{t.last5}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.seed, styles.seedGold]}>
              <Text style={[styles.seedText, styles.seedTextGold]}>1</Text>
            </View>
            <Text style={styles.legendText}>Top seed · auto bracket</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.seed, styles.seedWarm]}>
              <Text style={[styles.seedText, styles.seedTextWarm]}>3</Text>
            </View>
            <Text style={styles.legendText}>Wild-card eligible</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  body: { padding: 16, paddingBottom: 28 },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: colors.border1,
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
    backgroundColor: colors.cream50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
  },
  headText: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    color: colors.fg3,
  },
  dataRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border1,
  },
  firstDataRow: { borderTopWidth: 0 },
  pressed: { backgroundColor: colors.cream50 },
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
    backgroundColor: colors.navy100,
    alignItems: "center",
    justifyContent: "center",
  },
  seedGold: { backgroundColor: colors.orange100 },
  seedWarm: { backgroundColor: colors.cream200 },
  seedText: { fontSize: 11, fontWeight: "700", color: colors.navy700 },
  seedTextGold: { color: colors.orange700 },
  seedTextWarm: { color: colors.navy700 },
  teamName: { fontSize: 14, fontWeight: "600", color: colors.fg1 },
  teamCity: { fontSize: 11, fontWeight: "500", color: colors.fg3, marginTop: 2 },
  num: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.fg2,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  numBold: { color: colors.fg1, fontWeight: "700" },
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
    color: colors.fg3,
  },
});
