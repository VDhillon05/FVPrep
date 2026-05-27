import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { verifyAdminPin } from "../api";
import { useTheme } from "../context/ThemeContext";
import { radius, type ThemePalette } from "../theme";

type Props = {
  onBack: () => void;
  onSuccess: (pin: string) => void;
};

export default function AdminLoginScreen({ onBack, onSuccess }: Props) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!pin.trim()) {
      setError("Enter your admin PIN.");
      return;
    }
    try {
      setSubmitting(true);
      await verifyAdminPin(pin.trim());
      onSuccess(pin.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to authenticate.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.card, shadow.s2]}>
        <Text style={styles.title}>Admin Login</Text>
        <Text style={styles.caption}>Enter Admin PIN to continue</Text>
        <TextInput
          value={pin}
          onChangeText={setPin}
          placeholder="PIN"
          placeholderTextColor={colors.fg3}
          keyboardType="number-pad"
          secureTextEntry
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable onPress={submit} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
          <Text style={styles.primaryText}>{submitting ? "Checking..." : "Continue"}</Text>
        </Pressable>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
          <Text style={styles.secondaryText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bgApp,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    card: {
      width: "100%",
      maxWidth: 380,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border1,
      backgroundColor: c.bgSurface,
      padding: 16,
      gap: 10,
    },
    title: {
      color: c.fg1,
      fontSize: 24,
      fontWeight: "800",
    },
    caption: {
      color: c.fg3,
      fontSize: 13,
      fontWeight: "500",
      marginBottom: 2,
    },
    input: {
      borderWidth: 1,
      borderColor: c.border2,
      borderRadius: radius.md,
      height: 44,
      paddingHorizontal: 12,
      color: c.fg1,
      backgroundColor: c.bgSurface,
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 1.5,
    },
    error: {
      color: c.fg1,
      fontSize: 12.5,
      fontWeight: "700",
    },
    primary: {
      height: 42,
      borderRadius: radius.md,
      backgroundColor: c.primaryButtonBg,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 4,
    },
    primaryText: {
      color: c.primaryButtonFg,
      fontSize: 14,
      fontWeight: "700",
    },
    secondary: {
      height: 42,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.secondaryButtonBorder,
      backgroundColor: c.secondaryButtonBg,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryText: {
      color: c.secondaryButtonFg,
      fontSize: 14,
      fontWeight: "700",
    },
    pressed: { opacity: 0.9, transform: [{ scale: 0.985 }] },
  });
}
