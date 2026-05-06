# FVPrep

Basketball tournament scheduling app foundation with:
- `backend`: FastAPI API
- `frontend`: Expo React Native (TypeScript)

## Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API endpoints:
- `GET /games` - returns the in-memory games list
- `POST /games` - dummy admin add-game route (in-memory only)

## Frontend (Expo)

```bash
cd frontend
npm install
npx expo start
```

Optional API override (recommended on physical devices):

```bash
EXPO_PUBLIC_API_URL=http://<your-local-ip>:8000 npx expo start
```

## UI overview

App is a **schedule + standings shell** with **sample data** (`frontend/data.ts`), not wired to the backend yet.

- **Tabs (bottom):** **Schedule** (calendar) and **Standings** (trophy). Tabs hide when you open a **game** or **team** detail; use **back** to return.
- **Schedule:** **Top bar** title + **settings** (gear). **Segmented filters:** All, Live, Upcoming, Final. **Games** grouped by **date/time**; each row is a **card** with status, court, round, teams/scores (or time for upcoming); **tap** opens **game detail**.
- **Standings:** **Table** with **seed** badges, **logos**, team name/city, record, points for, and **last five** with **up/down** arrows. **Tap a team** for **team detail**.
- **Settings (modal):** **Notifications** toggle, **Dark / light** toggle, and an **Admin** button (placeholder hook).
- **Game detail:** Gradient-style **hero** with **back**, round title, **status chip**, court, both teams and **score**, quarter **box score**, and **Notify me** / **Add to calendar** buttons (UI only).
- **Team detail:** **Colored hero** with logo, name, city/seed, mini **record/W–L** stats, then a **list of that team’s games** (same cards as schedule); **tap** goes to game detail.

## To-do list

### Backend (`backend/`)

- Add `sqlmodel` to `requirements.txt` and pip install it inside the venv
- Add `backend/fvprep.db` and `backend/__pycache__/` to `.gitignore`
- In `main.py`, define two SQLModel tables:
  - `Team` (abbr PK, name, city, seed, color, text_color)
  - `Game` (id PK, status, home, away, h_score, a_score, period, time, when, court, round)
- Create the SQLite engine (`sqlite:///fvprep.db`) and call `SQLModel.metadata.create_all(engine)` in a FastAPI lifespan
- Write a one-time `seed()` that inserts the same teams/games currently hardcoded in `frontend/data.ts` — only seed if the DB is empty
- Implement three GET routes:
  - `GET /teams` — return all teams
  - `GET /games` — return all games
  - `GET /standings` — compute W–L, PF, PA, last5, trend from final games and join onto teams
- Decide: rename `text_color` → `textColor` on the response (or map it on the frontend) — pick one, document it
- Sanity-check each endpoint in a browser at `localhost:8000/...` before touching the frontend
- Remove the in-memory games list and the old Game Pydantic model

### Frontend (`frontend/`)

- Create `frontend/api.ts` with `fetchTeams`, `fetchGames`, `fetchStandings` — read base URL from `process.env.EXPO_PUBLIC_API_URL`, default to `http://localhost:8000`
- Keep `data.ts` for type exports only; delete `FV_TEAMS` / `FV_GAMES` / `FV_STANDINGS` constants once nothing imports them
- Convert `ScheduleScreen.tsx` from `FV_GAMES` to `useEffect` + `fetchGames`
- Convert `StandingsScreen.tsx` from `FV_STANDINGS` to `fetchStandings`
- Convert `TeamScreen.tsx` to fetch both teams and games (needs a `teamsByAbbr` map for lookups)
- Convert `GameScreen.tsx` to fetch teams + the single game (or pass the game object down)
- Add loading spinner + simple error text to each screen (no fancy lib needed)
- Add pull-to-refresh on Schedule and Standings (`RefreshControl`)
- Test on a physical device — set `EXPO_PUBLIC_API_URL=http://<your-LAN-ip>:8000`

### Smoke test before calling it done

- Delete `fvprep.db`, restart backend, confirm seed runs
- App loads with backend running → schedule, standings, team detail, game detail all populated
- App with backend off → screens show error state, not a white screen
- Pull-to-refresh on Schedule actually re-fetches

### do later

- Admin screen + auth
- Dark mode wiring, notifications, calendar buttons
