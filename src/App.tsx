import React, { useEffect, useMemo, useState } from 'react'

type Todo = {
  id: number
  title: string
  completed: boolean
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = useMemo(() => API_URL.replace(/\/$/, ''), [])

  async function fetchTodos() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/todos`)
      if (!res.ok) throw new Error('Failed to load todos')
      const data: Todo[] = await res.json()
      setTodos(data)
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed })
      })
      if (!res.ok) throw new Error('Failed to add todo')
      const created: Todo = await res.json()
      setTodos(prev => [created, ...prev])
      setTitle('')
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    }
  }

async function toggleTodo(todo: Todo) {
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      })
      if (!res.ok) throw new Error('Failed to update todo')
      const updated: Todo = await res.json()

    } catch (e: any) {
      setError(e.message || 'Unknown error')
    }
  }

  async function deleteTodo(id: number) {
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/todos/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete todo')
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Todo List</h1>
        <form onSubmit={addTodo} className="form">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Add a task"
            className="input"
          />
          <button type="submit" className="btn-primary">Add</button>
        </form>
        {error && <div className="error">{error}</div>}
        {loading ? (
          <div style={{ marginTop: 16 }}>Loading…</div>
        ) : (
          <ul className="list">
            {todos.map(t => (
              <li key={t.id} className="item">
                <input type="checkbox" checked={t.completed} onChange={() => toggleTodo(t)} />
                <span className="todo-title" style={{ textDecoration: t.completed ? 'line-through' : 'none', opacity: t.completed ? 0.7 : 1 }}>{t.title}</span>
                <button onClick={() => deleteTodo(t.id)} className="btn-ghost">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


