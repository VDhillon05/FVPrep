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