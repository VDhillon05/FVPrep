from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Team(SQLModel, table=True):
    abbr: str = Field(primary_key=True)
    name: str
    city: str
    seed: int
    color: str
    textColor: str


class Game(SQLModel, table=True):
    id: int = Field(primary_key=True)
    status: str
    home: str
    away: str
    h_score: int | None = None
    a_score: int | None = None
    period: str | None = None
    time: str
    when: str
    court: str
    round: str


engine = create_engine(
    "sqlite:///fvprep.db",
    connect_args={"check_same_thread": False},
)


def seed() -> None:
    teams_to_seed = [
        Team(
            abbr="FAL",
            name="Falcons",
            city="Riverside",
            seed=1,
            color="#1c2740",
            textColor="#f25c1a",
        ),
        Team(
            abbr="TIG",
            name="Tigers",
            city="Mapleton",
            seed=4,
            color="#a83407",
            textColor="#fbf7f0",
        ),
        Team(
            abbr="WAR",
            name="Warriors",
            city="Glenwood",
            seed=2,
            color="#0b3a8c",
            textColor="#fbe04a",
        ),
        Team(
            abbr="BUL",
            name="Bulls",
            city="Northfield",
            seed=5,
            color="#c41e3a",
            textColor="#0b1226",
        ),
        Team(
            abbr="RAP",
            name="Raptors",
            city="Eastvale",
            seed=3,
            color="#3a1f7a",
            textColor="#ff7d33",
        ),
        Team(
            abbr="SHK",
            name="Sharks",
            city="Bayshore",
            seed=6,
            color="#1f9d6b",
            textColor="#0b1226",
        ),
        Team(
            abbr="HAW",
            name="Hawks",
            city="Summit",
            seed=7,
            color="#1c2740",
            textColor="#7fc7ff",
        ),
        Team(
            abbr="SUN",
            name="Suns",
            city="Pinecrest",
            seed=8,
            color="#e3a008",
            textColor="#0b1226",
        ),
    ]

    games_to_seed = [
        Game(
            id=1,
            status="live",
            home="FAL",
            away="TIG",
            h_score=52,
            a_score=48,
            period="Q3 4:21",
            time="Today",
            when="Now",
            court="Court A",
            round="Pool play",
        ),
        Game(
            id=2,
            status="upcoming",
            home="WAR",
            away="BUL",
            h_score=None,
            a_score=None,
            period=None,
            time="Today",
            when="7:30pm",
            court="Court B",
            round="Pool play",
        ),
        Game(
            id=3,
            status="upcoming",
            home="RAP",
            away="SHK",
            h_score=None,
            a_score=None,
            period=None,
            time="Today",
            when="8:45pm",
            court="Main Arena",
            round="Pool play",
        ),
        Game(
            id=4,
            status="final",
            home="FAL",
            away="WAR",
            h_score=78,
            a_score=72,
            period="Final",
            time="Sat May 9",
            when="Final",
            court="Main Arena",
            round="Semifinal",
        ),
        Game(
            id=5,
            status="final",
            home="RAP",
            away="TIG",
            h_score=64,
            a_score=69,
            period="Final",
            time="Sat May 9",
            when="Final",
            court="Court A",
            round="Quarterfinal",
        ),
        Game(
            id=6,
            status="final",
            home="BUL",
            away="HAW",
            h_score=81,
            a_score=70,
            period="Final",
            time="Fri May 8",
            when="Final",
            court="Court B",
            round="Pool play",
        ),
        Game(
            id=7,
            status="upcoming",
            home="FAL",
            away="RAP",
            h_score=None,
            a_score=None,
            period=None,
            time="Sun May 10",
            when="2:00pm",
            court="Main Arena",
            round="Final",
        ),
    ]

    with Session(engine) as session:
        any_team = session.exec(select(Team).limit(1)).first()
        any_game = session.exec(select(Game).limit(1)).first()
        if any_team or any_game:
            return

        session.add_all(teams_to_seed)
        session.add_all(games_to_seed)
        session.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    SQLModel.metadata.create_all(engine)
    seed()
    yield


app = FastAPI(title="FVPrep API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/teams", response_model=list[Team])
def list_teams() -> list[Team]:
    with Session(engine) as session:
        return list(session.exec(select(Team)).all())


@app.get("/games", response_model=list[Game])
def list_games() -> list[Game]:
    with Session(engine) as session:
        return list(session.exec(select(Game)).all())


@app.get("/standings")
def get_standings() -> list[dict[str, Any]]:
    with Session(engine) as session:
        teams = list(session.exec(select(Team)).all())
        final_games = list(
            session.exec(
                select(Game).where(
                    Game.status == "final",
                    Game.h_score.is_not(None),
                    Game.a_score.is_not(None),
                )
            ).all()
        )

    stats: dict[str, dict[str, Any]] = {
        t.abbr: {"wins": 0, "losses": 0, "pf": 0, "pa": 0, "results": []}
        for t in teams
    }

    for g in final_games:
        if g.home not in stats or g.away not in stats:
            continue

        home_score = int(g.h_score)  # safe due to query filter
        away_score = int(g.a_score)

        stats[g.home]["pf"] += home_score
        stats[g.home]["pa"] += away_score
        stats[g.away]["pf"] += away_score
        stats[g.away]["pa"] += home_score

        if home_score > away_score:
            stats[g.home]["wins"] += 1
            stats[g.away]["losses"] += 1
            stats[g.home]["results"].append((g.id, "W"))
            stats[g.away]["results"].append((g.id, "L"))
        else:
            stats[g.home]["losses"] += 1
            stats[g.away]["wins"] += 1
            stats[g.home]["results"].append((g.id, "L"))
            stats[g.away]["results"].append((g.id, "W"))

    standings_rows: list[dict[str, Any]] = []
    for t in teams:
        results = sorted(stats[t.abbr]["results"], key=lambda x: x[0], reverse=True)
        last5 = [r for _, r in results[:5]]

        trend = "same"
        if len(last5) >= 2:
            if last5[0] == "W" and last5[1] == "L":
                trend = "up"
            elif last5[0] == "L" and last5[1] == "W":
                trend = "down"

        standings_rows.append(
            {
                **t.model_dump(),
                "w": stats[t.abbr]["wins"],
                "l": stats[t.abbr]["losses"],
                "pf": stats[t.abbr]["pf"],
                "pa": stats[t.abbr]["pa"],
                "last5": last5,
                "trend": trend,
            }
        )

    standings_rows.sort(key=lambda r: (-r["w"], r["l"], -r["pf"]))
    return standings_rows
