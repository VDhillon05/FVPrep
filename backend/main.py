from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Game(BaseModel):
    id: int
    home_team: str
    away_team: str
    time: str
    location: str


app = FastAPI(title="Basketball Tournament API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

games: List[Game] = [
    Game(
        id=1,
        home_team="Falcons",
        away_team="Tigers",
        time="2026-05-05T18:00:00",
        location="Court A",
    ),
    Game(
        id=2,
        home_team="Warriors",
        away_team="Bulls",
        time="2026-05-05T20:00:00",
        location="Court B",
    ),
    Game(
        id=3,
        home_team="Raptors",
        away_team="Sharks",
        time="2026-05-06T17:30:00",
        location="Main Arena",
    ),
]


@app.get("/games", response_model=List[Game])
def list_games() -> List[Game]:
    return games


@app.post("/games", response_model=Game)
def create_game(game: Game) -> Game:
    # Dummy admin route for now: append to in-memory list only.
    games.append(game)
    return game
