import { useState, useEffect } from 'react'

const API = 'http://localhost:8000'

//1. The state
export default function App() {
  const [tasks, setTasks] = useState([]) //tasks = the list that is shown
  const [input, setInput] = useState('') //what you enter on the field.
  //Everytime these change, React re-draws the screen

  //2. Load data at the beginning
  // When the app loads, it brings backend tasks
  useEffect(() => {
    fetch(`${API}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])
  //useEffect with [] runs once when the app loads. It asks BE "give me all the tasks"

  //3. Add task
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
    //^^ Sends the task to the backend - gets the task created (with their id) -> it adds it to the local state
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

      {/* Input para nueva tarea */}
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

      {/* List of tasks */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => ( //4. The render
          <li
            key={task.id} // For every task in the array, React draws a <li>. The key is required for React to know which one is one
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
