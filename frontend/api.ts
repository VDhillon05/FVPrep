import type { Game, StandingsRow, Team } from "./data";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

type ApiTeam = {
  abbr: string;
  name: string;
  city: string;
  seed: number;
  color: string;
  textColor: string;
};

type ApiGame = {
  id: number;
  status: "live" | "upcoming" | "final";
  home: string;
  away: string;
  h_score: number | null;
  a_score: number | null;
  period: string | null;
  time: string;
  when: string;
  court: string;
  round: string;
};

type ApiStandingsRow = ApiTeam & {
  w: number;
  l: number;
  pf: number;
  pa: number;
  last5: Array<"W" | "L">;
  trend: "up" | "down" | "same";
};

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return (await res.json()) as T;
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Network request failed. Is the backend running?";
    throw new Error(message);
  }
}

function recordFromWL(w: number, l: number) {
  return `${w}\u2013${l}`;
}

export async function fetchStandings(): Promise<StandingsRow[]> {
  const rows = await fetchJson<ApiStandingsRow[]>("/standings");
  return rows.map((r) => ({
    abbr: r.abbr,
    name: r.name,
    city: r.city,
    seed: r.seed,
    color: r.color,
    textColor: r.textColor,
    record: recordFromWL(r.w, r.l),
    pf: r.pf,
    pa: r.pa,
    last5: r.last5.join(""),
    trend: r.trend === "same" ? "flat" : r.trend,
  }));
}

export async function fetchTeams(): Promise<Team[]> {
  const [teams, standings] = await Promise.all([
    fetchJson<ApiTeam[]>("/teams"),
    fetchStandings().catch(() => null),
  ]);

  const recordByAbbr =
    standings == null
      ? {}
      : Object.fromEntries(standings.map((s) => [s.abbr, s.record]));

  return teams.map((t) => ({
    abbr: t.abbr,
    name: t.name,
    city: t.city,
    seed: t.seed,
    color: t.color,
    textColor: t.textColor,
    record: recordByAbbr[t.abbr] ?? "\u2013",
  }));
}

export async function fetchGames(): Promise<Game[]> {
  const games = await fetchJson<ApiGame[]>("/games");
  return games.map((g) => ({
    id: g.id,
    status: g.status,
    home: g.home,
    away: g.away,
    hScore: g.h_score,
    aScore: g.a_score,
    period: g.period,
    time: g.time,
    when: g.when,
    court: g.court,
    round: g.round,
  }));
}

