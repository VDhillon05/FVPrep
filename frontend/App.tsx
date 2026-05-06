import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import TabBar, { TabId } from "./components/TabBar";
import GameScreen from "./screens/GameScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import StandingsScreen from "./screens/StandingsScreen";
import TeamScreen from "./screens/TeamScreen";
import { colors } from "./theme";

type DetailFrame = { kind: "game"; id: number } | { kind: "team"; id: string };

export default function App() {
  const [tab, setTab] = useState<TabId>("schedule");
  const [stack, setStack] = useState<DetailFrame[]>([]);

  // Settings popover state lifted to App so it persists across screens.
  const [notifications, setNotifications] = useState(true);
  const [dark, setDark] = useState(false);

  const top = stack[stack.length - 1];
  const back = () => setStack((s) => s.slice(0, -1));
  const openGame = (id: number) => setStack((s) => [...s, { kind: "game", id }]);
  const openTeam = (abbr: string) => setStack((s) => [...s, { kind: "team", id: abbr }]);

  const settingsProps = {
    notifications,
    onNotificationsChange: setNotifications,
    dark,
    onDarkChange: setDark,
  };

  let screen;
  if (top?.kind === "game") {
    screen = <GameScreen gameId={top.id} onBack={back} />;
  } else if (top?.kind === "team") {
    screen = <TeamScreen teamAbbr={top.id} onBack={back} onOpenGame={openGame} />;
  } else if (tab === "schedule") {
    screen = <ScheduleScreen onOpenGame={openGame} {...settingsProps} />;
  } else {
    screen = <StandingsScreen onOpenTeam={openTeam} {...settingsProps} />;
  }

  const showTabBar = !top;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.body}>{screen}</View>
      {showTabBar && (
        <TabBar
          active={tab}
          onChange={(t) => {
            setStack([]);
            setTab(t);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  body: { flex: 1 },
});
