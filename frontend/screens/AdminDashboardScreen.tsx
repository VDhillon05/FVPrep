import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { createGame, createTeam, deleteTeam, fetchTeams } from "../api";
import type { Team } from "../data";
import { useTheme } from "../context/ThemeContext";
import { radius, type ThemePalette } from "../theme";

type Props = {
  pin: string;
  onBack: () => void;
};

export default function AdminDashboardScreen({ pin, onBack }: Props) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [time, setTime] = useState("");
  const [court, setCourt] = useState("");
  const [round, setRound] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newAbbr, setNewAbbr] = useState("");
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");
  const [teamMessage, setTeamMessage] = useState<string | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [savingTeam, setSavingTeam] = useState(false);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams()
      .then(setTeams)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load teams"))
      .finally(() => setLoadingTeams(false));
  }, []);

  const resetForm = () => {
    setHome("");
    setAway("");
    setTime("");
    setCourt("");
    setRound("");
  };

  const resetTeamForm = () => {
    setNewAbbr("");
    setNewName("");
    setNewCity("");
  };

  const submit = async () => {
    setError(null);
    setMessage(null);
    if (!home || !away || !time.trim() || !court.trim() || !round.trim()) {
      setError("Fill Home, Away, Time, Court, and Round.");
      return;
    }
    if (home === away) {
      setError("Home and away teams must be different.");
      return;
    }
    try {
      setSubmitting(true);
      const game = await createGame(
        {
          home,
          away,
          time: time.trim(),
          court: court.trim(),
          round: round.trim(),
        },
        pin,
      );
      setMessage(`Game #${game.id} created successfully.`);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitTeam = async () => {
    setTeamError(null);
    setTeamMessage(null);
    const abbr = newAbbr.trim().toUpperCase();
    const name = newName.trim();
    const city = newCity.trim();
    if (!abbr || !name || !city) {
      setTeamError("Enter abbreviation, name, and city.");
      return;
    }
    try {
      setSavingTeam(true);
      const team = await createTeam({ abbr, name, city }, pin);
      setTeams((prev) => [...prev, team]);
      setTeamMessage(`Team ${team.abbr} added.`);
      resetTeamForm();
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : "Failed to add team.");
    } finally {
      setSavingTeam(false);
    }
  };

  const handleDeleteTeam = async (abbr: string) => {
    setTeamError(null);
    setTeamMessage(null);
    try {
      setDeletingCode(abbr);
      await deleteTeam(abbr, pin);
      setTeams((prev) => prev.filter((t) => t.abbr !== abbr));
      setTeamMessage(`Team ${abbr} deleted.`);
      if (home === abbr) setHome("");
      if (away === abbr) setAway("");
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : "Failed to delete team.");
    } finally {
      setDeletingCode(null);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, shadow.s1]}>
          <Text style={styles.sectionTitle}>Manage teams</Text>
          <Text style={styles.label}>Abbreviation</Text>
          <TextInput
            value={newAbbr}
            onChangeText={(text) => setNewAbbr(text.toUpperCase())}
            placeholder="e.g. FAL"
            placeholderTextColor={colors.fg3}
            style={styles.input}
            autoCapitalize="characters"
          />
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="e.g. Falcons"
            placeholderTextColor={colors.fg3}
            style={styles.input}
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            value={newCity}
            onChangeText={setNewCity}
            placeholder="e.g. Riverside"
            placeholderTextColor={colors.fg3}
            style={styles.input}
          />
          {teamError ? <Text style={styles.errorText}>{teamError}</Text> : null}
          {teamMessage ? <Text style={styles.successText}>{teamMessage}</Text> : null}
          <Pressable
            onPress={submitTeam}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <Text style={styles.primaryBtnText}>{savingTeam ? "Saving..." : "Add Team"}</Text>
          </Pressable>
          <View style={styles.teamList}>
            {teams.map((t) => (
              <View key={t.abbr} style={styles.teamRow}>
                <View style={styles.teamRowText}>
                  <Text style={styles.teamRowPrimary}>{t.abbr} · {t.name}</Text>
                  <Text style={styles.teamRowSecondary}>{t.city}</Text>
                </View>
                <Pressable
                  onPress={() => handleDeleteTeam(t.abbr)}
                  style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.deleteBtnText}>
                    {deletingCode === t.abbr ? "Deleting..." : "Delete"}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, shadow.s1]}>
          <Text style={styles.sectionTitle}>Create game</Text>
          <Text style={styles.label}>Home Team</Text>
          <TeamPicker teams={teams} value={home} onChange={setHome} loading={loadingTeams} styles={styles} />

          <Text style={styles.label}>Away Team</Text>
          <TeamPicker teams={teams} value={away} onChange={setAway} loading={loadingTeams} styles={styles} />

          <Text style={styles.label}>Time</Text>
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="e.g. 7:30pm"
            placeholderTextColor={colors.fg3}
            style={styles.input}
          />

          <Text style={styles.label}>Court</Text>
          <TextInput
            value={court}
            onChangeText={setCourt}
            placeholder="e.g. Court A"
            placeholderTextColor={colors.fg3}
            style={styles.input}
          />

          <Text style={styles.label}>Round</Text>
          <TextInput
            value={round}
            onChangeText={setRound}
            placeholder="e.g. Pool play"
            placeholderTextColor={colors.fg3}
            style={styles.input}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {message ? <Text style={styles.successText}>{message}</Text> : null}

          <Pressable onPress={submit} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
            <Text style={styles.primaryBtnText}>{submitting ? "Creating..." : "Create Game"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function TeamPicker({
  teams,
  value,
  onChange,
  loading,
  styles,
}: {
  teams: Team[];
  value: string;
  onChange: (abbr: string) => void;
  loading: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  if (loading) {
    return (
      <View style={styles.loadingRow}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={styles.teamsWrap}>
      {teams.map((t) => {
        const active = value === t.abbr;
        return (
          <Pressable
            key={t.abbr}
            onPress={() => onChange(t.abbr)}
            style={({ pressed }) => [
              styles.teamChip,
              active && styles.teamChipActive,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.teamChipText, active && styles.teamChipTextActive]}>{t.abbr}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(c: ThemePalette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bgApp,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.border1,
      backgroundColor: c.bgSurface,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      color: c.fg1,
      fontSize: 26,
      fontWeight: "800",
      letterSpacing: -0.4,
    },
    backBtn: {
      height: 34,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.secondaryButtonBorder,
      backgroundColor: c.secondaryButtonBg,
      paddingHorizontal: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    backBtnText: {
      color: c.secondaryButtonFg,
      fontSize: 13,
      fontWeight: "700",
    },
    body: {
      padding: 16,
      paddingBottom: 30,
    },
    card: {
      borderWidth: 1,
      borderColor: c.border1,
      borderRadius: radius.lg,
      backgroundColor: c.bgSurface,
      padding: 14,
      gap: 10,
    },
    sectionTitle: {
      color: c.fg1,
      fontSize: 16,
      fontWeight: "800",
      marginBottom: 4,
    },
    label: {
      color: c.fg1,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 2,
    },
    loadingRow: {
      height: 36,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    teamsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    teamChip: {
      minWidth: 52,
      height: 34,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border2,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    teamChipActive: {
      backgroundColor: c.primaryButtonBg,
      borderColor: c.primaryButtonBg,
    },
    teamChipText: {
      color: c.fg1,
      fontSize: 12,
      fontWeight: "700",
    },
    teamChipTextActive: {
      color: c.primaryButtonFg,
    },
    input: {
      height: 42,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border2,
      backgroundColor: c.bgSurface,
      color: c.fg1,
      paddingHorizontal: 12,
      fontSize: 14,
      fontWeight: "500",
    },
    errorText: {
      color: c.fg1,
      fontSize: 12.5,
      fontWeight: "700",
      marginTop: 4,
    },
    successText: {
      color: c.fg2,
      fontSize: 12.5,
      fontWeight: "700",
      marginTop: 4,
    },
    primaryBtn: {
      marginTop: 6,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: c.primaryButtonBg,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryBtnText: {
      color: c.primaryButtonFg,
      fontSize: 14,
      fontWeight: "700",
    },
    teamList: {
      marginTop: 10,
      gap: 8,
    },
    teamRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    teamRowText: {
      flexShrink: 1,
      marginRight: 8,
    },
    teamRowPrimary: {
      color: c.fg1,
      fontSize: 13,
      fontWeight: "600",
    },
    teamRowSecondary: {
      color: c.fg3,
      fontSize: 11.5,
      fontWeight: "500",
      marginTop: 1,
    },
    deleteBtn: {
      height: 30,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border2,
      paddingHorizontal: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.bgSurface,
    },
    deleteBtnText: {
      color: c.fg1,
      fontSize: 11.5,
      fontWeight: "600",
    },
    pressed: { opacity: 0.92, transform: [{ scale: 0.985 }] },
  });
}
