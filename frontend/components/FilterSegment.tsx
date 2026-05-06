import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, shadow } from "../theme";

type Props<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
};

export default function FilterSegment<T extends string>({ value, options, onChange }: Props<T>) {
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

const styles = StyleSheet.create({
  seg: {
    alignSelf: "flex-start",
    flexDirection: "row",
    backgroundColor: colors.navy100,
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
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.fg2,
  },
  activeLabel: {
    color: colors.fg1,
  },
});
