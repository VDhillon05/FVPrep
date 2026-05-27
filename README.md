# FVPrep

Basketball tournament scheduling app: **Expo React Native (TypeScript)** frontend and **FastAPI + SQLite (SQLModel)** backend.

## Repository layout

- [`backend/`](backend/) — API, models, seed, SQLite file `fvprep.db` (created when you run uvicorn from this directory).
- [`frontend/`](frontend/) — Expo app: screens, shared types, API client, theme.

**Physical devices:** set `EXPO_PUBLIC_API_URL` to your machine’s LAN IP so the app can reach the backend (see [Run Frontend](#run-frontend)).

---

## Current status

### Done

**Backend**

- SQLite persistence (`fvprep.db`) via SQLModel; tables and one-time seed if the DB is empty.
- Models in [`backend/main.py`](backend/main.py): `Team` (`abbr`, `name`, `city`, `seed`, `color`, `textColor`), `Game` (`id`, `status`, `home`, `away`, scores, `period`, `time`, `when`, `court`, `round`).
- Endpoints: `GET /teams`, `GET /games`, `GET /standings` (standings computed from final games: W/L, PF/PA, `last5`, `trend`).
- Admin-protected write endpoints:
  - `POST /admin/auth` validates `X-Admin-PIN`.
  - `POST /games` inserts a new game (requires `X-Admin-PIN`; PIN read from `FVPREP_ADMIN_PIN`, defaults to `1234`).
- Root [`.gitignore`](.gitignore) ignores `backend/fvprep.db` and `backend/__pycache__/`.

**Frontend**

- [`frontend/api.ts`](frontend/api.ts) — `EXPO_PUBLIC_API_URL` (default `http://localhost:8000`), typed fetch helpers for teams, games, and standings.
- Schedule, standings, team detail, and game detail screens load from the API (no mock `FV_TEAMS` / `FV_GAMES`); shared types live in [`frontend/data.ts`](frontend/data.ts).
- Loading and error states on schedule, standings, team, and game screens; pull-to-refresh on schedule and standings.
- Custom monochrome splash: centered **FV** on black, fade + scale over 1.5s via React Native `Animated`; [`frontend/App.tsx`](frontend/App.tsx) waits for both that animation and an initial prefetch (`teams`, `games`, `standings`) before showing the tab UI (prefetch failures do not block the transition—screens still show errors).
- Strict black-and-white theming is fully wired: [`frontend/theme.ts`](frontend/theme.ts) defines grayscale light/dark palettes, [`frontend/context/ThemeContext.tsx`](frontend/context/ThemeContext.tsx) provides global theme state, and the existing settings toggle now switches the entire app between modes.
- Admin flow is wired end-to-end: Settings `Admin` opens [`frontend/screens/AdminLoginScreen.tsx`](frontend/screens/AdminLoginScreen.tsx), successful PIN auth opens [`frontend/screens/AdminDashboardScreen.tsx`](frontend/screens/AdminDashboardScreen.tsx), and game creation calls `createGame(...)` in [`frontend/api.ts`](frontend/api.ts) with `X-Admin-PIN`.

### To-do (next steps)

1. **Notifications** — settings toggle is UI-only (no OS permissions, local schedule, or push).
2. **Calendar actions** — e.g. add-to-calendar or deep links from game rows (product-dependent).
3. **Polish / QA** — device testing with `EXPO_PUBLIC_API_URL`, reduce duplicate fetches after splash if desired (context or cache).

---

## Run backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Run frontend

```bash
cd frontend
npm install
npx expo start
```

On a **physical device**, point the app at your computer’s API (same Wi‑Fi):

```bash
EXPO_PUBLIC_API_URL=http://<your-LAN-ip>:8000 npx expo start
```

## API quick check

- `http://localhost:8000/teams`
- `http://localhost:8000/games`
- `http://localhost:8000/standings`
