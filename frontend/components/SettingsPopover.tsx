import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../context/ThemeContext";
import { radius, type ThemePalette } from "../theme";
import Toggle from "./Toggle";

type Props = {
  notifications: boolean;
  onNotificationsChange: (next: boolean) => void;
  onAdmin?: () => void;
};

export default function SettingsPopover({
  notifications,
  onNotificationsChange,
  onAdmin,
}: Props) {
  const { colors, shadow, isDark, setDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityLabel="Settings"
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.iconBtn,
          pressed && { opacity: 0.85, transform: [{ scale: 0.94 }] },
        ]}
      >
        <Feather name="settings" size={20} color={colors.fg1} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.scrim} onPress={() => setOpen(false)}>
          <Pressable style={[styles.popover, shadow.s3]} onPress={() => {}}>
            <View style={styles.arrow} />
            <View style={styles.row}>
              <Text style={styles.label}>Notifications</Text>
              <Toggle on={notifications} onChange={onNotificationsChange} />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>{isDark ? "Dark mode" : "Light mode"}</Text>
              <Toggle on={isDark} onChange={setDark} />
            </View>
            <Pressable
              onPress={() => {
                setOpen(false);
                onAdmin?.();
              }}
              style={({ pressed }) => [
                styles.adminBtn,
                pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={styles.adminText}>Admin</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: c.bgMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    scrim: {
      flex: 1,
      backgroundColor: c.scrim,
    },
    popover: {
      position: "absolute",
      top: 96,
      right: 16,
      width: 264,
      backgroundColor: c.bgSurface,
      borderWidth: 1,
      borderColor: c.border1,
      borderRadius: radius.lg,
      padding: 8,
    },
    arrow: {
      position: "absolute",
      top: -6,
      right: 14,
      width: 12,
      height: 12,
      backgroundColor: c.bgSurface,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      borderColor: c.border1,
      transform: [{ rotate: "45deg" }],
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 10,
    },
    label: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: c.fg1,
    },
    divider: {
      height: 1,
      backgroundColor: c.border1,
      marginHorizontal: 8,
      marginVertical: 2,
    },
    adminBtn: {
      height: 40,
      marginTop: 8,
      marginHorizontal: 2,
      borderRadius: radius.md,
      backgroundColor: c.primaryButtonBg,
      alignItems: "center",
      justifyContent: "center",
    },
    adminText: {
      color: c.primaryButtonFg,
      fontSize: 14,
      fontWeight: "600",
    },
  });
}
