import { useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

import { useTheme } from "../context/ThemeContext";
import type { ThemePalette } from "../theme";

type Props = {
  on: boolean;
  onChange: (next: boolean) => void;
};

export default function Toggle({ on, onChange }: Props) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const anim = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: on ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [on, anim]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.toggleTrackOff, colors.toggleTrackOn],
  });
  const knobLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 21],
  });

  return (
    <Pressable onPress={() => onChange(!on)} hitSlop={8}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.knob, shadow.s1, { left: knobLeft, backgroundColor: colors.toggleKnob }]} />
        <View style={styles.spacer} />
      </Animated.View>
    </Pressable>
  );
}

function createStyles(_c: ThemePalette) {
  return StyleSheet.create({
    track: {
      width: 44,
      height: 26,
      borderRadius: 999,
      justifyContent: "center",
    },
    knob: {
      position: "absolute",
      top: 3,
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    spacer: { width: 44, height: 26 },
  });
}
