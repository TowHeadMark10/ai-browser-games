from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allows React (localhost:5173) to talk to this server
# CORS tells the server to "accept requests coming from localhost:5173" (React). Without this, the browser blocks communication.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# data model
# Define how the incoming data should look. If someone sends something without a title, FastAPI automatically returns an error.
class Task(BaseModel):
    title: str

# "DB" in memory
# For now, it's just a list in memory. If you restart the server, the data will be lost.
tasks = []
next_id = 1

# the endpoints
@app.get("/tasks") #READ
def get_tasks():
    return tasks


@app.post("/tasks") #CREATE
def create_task(task: Task):
    global next_id
    new_task = {"id": next_id, "title": task.title, "done": False}
    tasks.append(new_task)
    next_id += 1
    return new_task


@app.patch("/tasks/{task_id}") #MODIFY
def toggle_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            task["done"] = not task["done"]
            return task
    raise HTTPException(status_code=404, detail="TASK NOT FOUND")


@app.delete("/tasks/{task_id}") #DELETE
def delete_task(task_id: int):
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            tasks.pop(i)
            return {"ok": True}
    raise HTTPException(status_code=404, detail="TASK NOT FOUND")

# All of the above is CRUD - The 4 basic operations of any app
