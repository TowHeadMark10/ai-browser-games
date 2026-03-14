# To-Do App

Simple app to learn React + FastAPI. Allows you to create, complete, and delete tasks.

## Structure

```
todo-app/
├── backend/        # Python API with FastAPI
│   ├── main.py
│   └── requirements.txt
└── frontend/       # React UI with Vite
    └── src/
        └── App.jsx
```

## Requirements

- Python 3
- Node.js

## How to run

You need **two terminals** open at the same time.

### Terminal 1 — Backend

```bash
cd todo-app/backend
pip3 install -r requirements.txt
uvicorn main:app --reload
```

Runs at: http://localhost:8000
Interactive docs: http://localhost:8000/docs

### Terminal 2 — Frontend

```bash
cd todo-app/frontend
npm install
npm run dev
```

Runs at: http://localhost:5173

## How it works

```
React (localhost:5173)
        ↕  fetch / JSON
FastAPI (localhost:8000)
```

| Endpoint            | Description           |
|---------------------|-----------------------|
| GET /tasks          | Fetch all tasks       |
| POST /tasks         | Create a task         |
| PATCH /tasks/{id}   | Toggle task as done   |
| DELETE /tasks/{id}  | Delete a task         |

## Notes

- Data is stored in memory — if you restart the backend, it will be lost.
- The natural next step is to connect a real database (SQLite is the simplest).
