import { useState, useEffect } from 'react'

const API = 'http://localhost:8000'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')

  // On app load, fetch tasks from the backend
  useEffect(() => {
    fetch(`${API}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  async function addTask() {
    if (!input.trim()) return
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input }),
    })
    const newTask = await res.json()
    setTasks([...tasks, newTask])
    setInput('')
  }

  async function toggleTask(id) {
    const res = await fetch(`${API}/tasks/${id}`, { method: 'PATCH' })
    const updated = await res.json()
    setTasks(tasks.map(t => (t.id === id ? updated : t)))
  }

  async function deleteTask(id) {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1>To-Do App</h1>

      {/* Input for new task */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="New task..."
          style={{ flex: 1, padding: 8, fontSize: 16 }}
        />
        <button onClick={addTask} style={{ padding: '8px 16px' }}>
          Add
        </button>
      </div>

      {/* Task list */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li
            key={task.id}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />
            <span style={{ flex: 1, textDecoration: task.done ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
