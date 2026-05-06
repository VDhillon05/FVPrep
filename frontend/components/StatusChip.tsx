import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

type Props = {
  status: "live" | "upcoming" | "final";
  period?: string | null;
};

export default function StatusChip({ status, period }: Props) {
  if (status === "live") return <LiveChip period={period ?? ""} />;
  if (status === "final") {
    return (
      <View style={[styles.chip, styles.final]}>
        <Text style={[styles.text, styles.textOnDark]}>FINAL</Text>
      </View>
    );
  }
  return (
    <View style={[styles.chip, styles.upcoming]}>
      <Text style={[styles.text, styles.upcomingText]}>Upcoming</Text>
    </View>
  );
}

function LiveChip({ period }: { period: string }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <View style={[styles.chip, styles.live]}>
      <Animated.View style={[styles.dot, { opacity: pulse }]} />
      <Text style={[styles.text, styles.textOnDark]}>LIVE · {period}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 999,
  },
  text: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  textOnDark: { color: "#ffffff" },
  live: { backgroundColor: colors.red500 },
  final: { backgroundColor: colors.navy900 },
  upcoming: { backgroundColor: colors.amber100 },
  upcomingText: {
    color: "#7a5500",
    letterSpacing: 0.2,
    fontWeight: "600",
    textTransform: "none",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
    marginRight: 6,
  },
});
