import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

import GameCard from "./components/GameCard";
import { fetchGames, Game } from "./services/gameService";

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames();
        setGames(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Basketball Tournament Games</Text>

        {loading ? <Text style={styles.info}>Loading games...</Text> : null}
        {error ? <Text style={styles.error}>Error: {error}</Text> : null}

        {!loading && !error ? (
          <FlatList
            data={games}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <GameCard game={item} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.info}>No games scheduled yet.</Text>
            }
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  info: {
    fontSize: 16,
    color: "#374151",
  },
  error: {
    fontSize: 16,
    color: "#dc2626",
  },
});
