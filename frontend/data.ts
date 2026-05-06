// Stubbed FVPrep data — mirrors project/ui_kits/mobile/data.jsx.
// The backend's GET /games doesn't yet expose record/seed/period/round/last5.
// Once it does, swap this for a fetch in services/gameService.ts.

export type Team = {
  abbr: string;
  name: string;
  city: string;
  record: string;
  seed: number;
  color: string;
  textColor: string;
};

export type Game = {
  id: number;
  status: "live" | "upcoming" | "final";
  home: string;
  away: string;
  hScore: number | null;
  aScore: number | null;
  period: string | null;
  time: string;
  when: string;
  court: string;
  round: string;
};

export type StandingsRow = Team & {
  pf: number;
  pa: number;
  last5: string;
  trend: "up" | "down" | "flat";
};

export const FV_TEAMS: Record<string, Team> = {
  FAL: { abbr: "FAL", name: "Falcons",  city: "Riverside",  record: "13–3", seed: 1, color: "#1c2740", textColor: "#f25c1a" },
  TIG: { abbr: "TIG", name: "Tigers",   city: "Mapleton",   record: "9–7",  seed: 4, color: "#a83407", textColor: "#fbf7f0" },
  WAR: { abbr: "WAR", name: "Warriors", city: "Glenwood",   record: "12–4", seed: 2, color: "#0b3a8c", textColor: "#fbe04a" },
  BUL: { abbr: "BUL", name: "Bulls",    city: "Northfield", record: "8–8",  seed: 5, color: "#c41e3a", textColor: "#0b1226" },
  RAP: { abbr: "RAP", name: "Raptors",  city: "Eastvale",   record: "10–6", seed: 3, color: "#3a1f7a", textColor: "#ff7d33" },
  SHK: { abbr: "SHK", name: "Sharks",   city: "Bayshore",   record: "7–9",  seed: 6, color: "#1f9d6b", textColor: "#0b1226" },
  HAW: { abbr: "HAW", name: "Hawks",    city: "Summit",     record: "6–10", seed: 7, color: "#1c2740", textColor: "#7fc7ff" },
  SUN: { abbr: "SUN", name: "Suns",     city: "Pinecrest",  record: "5–11", seed: 8, color: "#e3a008", textColor: "#0b1226" },
};

export const FV_GAMES: Game[] = [
  { id: 1, status: "live",     home: "FAL", away: "TIG", hScore: 52,   aScore: 48,   period: "Q3 4:21", time: "Today",      when: "Now",    court: "Court A",    round: "Pool play" },
  { id: 2, status: "upcoming", home: "WAR", away: "BUL", hScore: null, aScore: null, period: null,      time: "Today",      when: "7:30pm", court: "Court B",    round: "Pool play" },
  { id: 3, status: "upcoming", home: "RAP", away: "SHK", hScore: null, aScore: null, period: null,      time: "Today",      when: "8:45pm", court: "Main Arena", round: "Pool play" },
  { id: 4, status: "final",    home: "FAL", away: "WAR", hScore: 78,   aScore: 72,   period: "Final",   time: "Sat May 9",  when: "Final",  court: "Main Arena", round: "Semifinal" },
  { id: 5, status: "final",    home: "RAP", away: "TIG", hScore: 64,   aScore: 69,   period: "Final",   time: "Sat May 9",  when: "Final",  court: "Court A",    round: "Quarterfinal" },
  { id: 6, status: "final",    home: "BUL", away: "HAW", hScore: 81,   aScore: 70,   period: "Final",   time: "Fri May 8",  when: "Final",  court: "Court B",    round: "Pool play" },
  { id: 7, status: "upcoming", home: "FAL", away: "RAP", hScore: null, aScore: null, period: null,      time: "Sun May 10", when: "2:00pm", court: "Main Arena", round: "Final" },
];

const STANDINGS_ORDER = ["FAL", "WAR", "RAP", "TIG", "BUL", "SHK", "HAW", "SUN"];
const PF =    [1184, 1121, 1066, 1012,  988,  940,  902,  878];
const PA =    [ 992, 1008, 1041, 1055, 1010,  996, 1023, 1066];
const LAST5 = ["WWWLW", "WWLWW", "LWWLW", "LWLWW", "WLLWL", "LLWLW", "WLLLW", "LLWLL"];

export const FV_STANDINGS: StandingsRow[] = STANDINGS_ORDER.map((abbr, i) => ({
  ...FV_TEAMS[abbr],
  pf: PF[i],
  pa: PA[i],
  last5: LAST5[i],
  trend: i < 2 ? "up" : i < 4 ? "flat" : "down",
}));
