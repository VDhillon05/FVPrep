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
