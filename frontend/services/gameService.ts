import Constants from "expo-constants";

export type Game = {
  id: number;
  home_team: string;
  away_team: string;
  time: string;
  location: string;
};

const getApiBaseUrl = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
  if (configuredUrl) {
    return configuredUrl;
  }

  const hostUri = Constants.expoConfig?.hostUri ?? "";
  const host = hostUri.split(":")[0];
  if (host) {
    return `http://${host}:8000`;
  }

  return "http://localhost:8000";
};

export async function fetchGames(): Promise<Game[]> {
  const response = await fetch(`${getApiBaseUrl()}/games`);

  if (!response.ok) {
    throw new Error(`Failed to fetch games (${response.status})`);
  }

  return (await response.json()) as Game[];
}
