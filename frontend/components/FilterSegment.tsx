import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../context/ThemeContext";
import type { ThemePalette } from "../theme";

type Props<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
};

export default function FilterSegment<T extends string>({ value, options, onChange }: Props<T>) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.seg}>
      {options.map((o) => {
        const active = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            style={[styles.button, active && [styles.activeButton, shadow.s1]]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    seg: {
      alignSelf: "flex-start",
      flexDirection: "row",
      backgroundColor: c.bgMuted,
      borderRadius: 999,
      padding: 4,
    },
    button: {
      height: 30,
      paddingHorizontal: 14,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 1,
    },
    activeButton: {
      backgroundColor: c.bgSurface,
    },
    label: {
      fontSize: 13,
      fontWeight: "600",
      color: c.fg2,
    },
    activeLabel: {
      color: c.fg1,
    },
  });
}
