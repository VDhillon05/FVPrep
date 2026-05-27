import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { fetchGames, fetchStandings, fetchTeams } from "./api";
import SplashScreen from "./components/SplashScreen";
import TabBar, { TabId } from "./components/TabBar";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import AdminLoginScreen from "./screens/AdminLoginScreen";
import GameScreen from "./screens/GameScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import StandingsScreen from "./screens/StandingsScreen";
import TeamScreen from "./screens/TeamScreen";

type DetailFrame =
  | { kind: "game"; id: number }
  | { kind: "team"; id: string }
  | { kind: "admin-login" }
  | { kind: "admin-dashboard"; pin: string };

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { colors, isDark } = useTheme();
  const [isAppReady, setIsAppReady] = useState(false);
  const gates = useRef({ animation: false, prefetch: false });

  const [tab, setTab] = useState<TabId>("schedule");
  const [stack, setStack] = useState<DetailFrame[]>([]);

  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    Promise.all([fetchTeams(), fetchGames(), fetchStandings()])
      .catch(() => {
        /* Schedule / Standings show their own errors */
      })
      .finally(() => {
        gates.current.prefetch = true;
        if (gates.current.animation) setIsAppReady(true);
      });
  }, []);

  const onSplashAnimationEnd = useCallback(() => {
    gates.current.animation = true;
    if (gates.current.prefetch) setIsAppReady(true);
  }, []);

  const top = stack[stack.length - 1];
  const back = () => setStack((s) => s.slice(0, -1));
  const openGame = (id: number) => setStack((s) => [...s, { kind: "game", id }]);
  const openTeam = (abbr: string) => setStack((s) => [...s, { kind: "team", id: abbr }]);
  const openAdmin = () => setStack((s) => [...s, { kind: "admin-login" }]);

  const settingsProps = {
    notifications,
    onNotificationsChange: setNotifications,
    onAdmin: openAdmin,
  };

  let screen;
  if (top?.kind === "game") {
    screen = <GameScreen gameId={top.id} onBack={back} />;
  } else if (top?.kind === "team") {
    screen = <TeamScreen teamAbbr={top.id} onBack={back} onOpenGame={openGame} />;
  } else if (top?.kind === "admin-login") {
    screen = (
      <AdminLoginScreen
        onBack={back}
        onSuccess={(pin) => setStack((s) => [...s.slice(0, -1), { kind: "admin-dashboard", pin }])}
      />
    );
  } else if (top?.kind === "admin-dashboard") {
    screen = <AdminDashboardScreen pin={top.pin} onBack={back} />;
  } else if (tab === "schedule") {
    screen = <ScheduleScreen onOpenGame={openGame} {...settingsProps} />;
  } else {
    screen = <StandingsScreen onOpenTeam={openTeam} {...settingsProps} />;
  }

  const showTabBar = !top;

  if (!isAppReady) {
    return (
      <View style={styles.bootRoot}>
        <StatusBar style="light" />
        <SplashScreen onAnimationEnd={onSplashAnimationEnd} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgApp }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
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
  bootRoot: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safe: {
    flex: 1,
  },
  body: { flex: 1 },
});
