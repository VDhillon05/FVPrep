import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../context/ThemeContext";

type Props = {
  status: "live" | "upcoming" | "final";
  period?: string | null;
};

export default function StatusChip({ status, period }: Props) {
  if (status === "live") return <LiveChip period={period ?? ""} />;
  if (status === "final") {
    return <ChipVariant kind="final" label="FINAL" />;
  }
  return <ChipVariant kind="upcoming" label="Upcoming" normalCase />;
}

function ChipVariant({
  kind,
  label,
  normalCase,
}: {
  kind: "final" | "upcoming";
  label: string;
  normalCase?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createChipStyles(), []);

  const bg = kind === "final" ? colors.chipFinalBg : colors.chipUpcomingBg;
  const fg = kind === "final" ? colors.chipFinalFg : colors.chipUpcomingFg;

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.text, normalCase ? styles.textUpcoming : undefined, { color: fg }]}>
        {label}
      </Text>
    </View>
  );
}

function LiveChip({ period }: { period: string }) {
  const { colors } = useTheme();
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

  const styles = useMemo(() => createChipStyles(), []);

  return (
    <View style={[styles.chip, { backgroundColor: colors.chipLiveBg }]}>
      <Animated.View
        style={[styles.dot, { opacity: pulse, backgroundColor: colors.chipLiveFg }]}
      />
      <Text style={[styles.text, { color: colors.chipLiveFg }]}>LIVE · {period}</Text>
    </View>
  );
}

function createChipStyles() {
  return StyleSheet.create({
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
    textUpcoming: {
      letterSpacing: 0.2,
      fontWeight: "600",
      textTransform: "none",
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },
  });
}
