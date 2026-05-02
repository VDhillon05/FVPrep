import { StyleSheet, Text, View } from "react-native";

import { Game } from "../services/gameService";

type GameCardProps = {
  game: Game;
};

export default function GameCard({ game }: GameCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.matchup}>
        {game.home_team} vs {game.away_team}
      </Text>
      <Text style={styles.meta}>Time: {game.time}</Text>
      <Text style={styles.meta}>Location: {game.location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  matchup: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  meta: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 2,
  },
});
