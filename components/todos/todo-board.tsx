"use client";

import { useEffect, useState } from "react";
import type { Todo, TodoStatus } from "@/lib/types";

const statuses: TodoStatus[] = ["pending", "in_progress", "done"];

export function TodoBoard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const loadTodos = async () => {
    const res = await fetch("/api/todos");
    if (res.ok) setTodos(await res.json());
  };

  useEffect(() => {
    void loadTodos();
  }, []);

  return (
    <section className="space-y-6">
      <form
        className="card grid gap-3 md:grid-cols-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch("/api/todos", {
            method: "POST",
            body: JSON.stringify({ title, description, assigned_to: assignedTo || null })
          });
          setTitle("");
          setDescription("");
          setAssignedTo("");
          await loadTodos();
        }}
      >
        <input className="input" placeholder="Todo title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="input" placeholder="Assign user UUID" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
        <button className="btn-primary">Create todo</button>
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        {statuses.map((status) => (
          <div key={status} className="card space-y-3">
            <h3 className="text-lg font-semibold capitalize">{status.replace("_", " ")}</h3>
            {todos
              .filter((todo) => todo.status === status)
              .map((todo) => (
                <div key={todo.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <p className="font-medium">{todo.title}</p>
                  <p className="text-sm text-slate-500">{todo.description ?? "No description"}</p>
                  <div className="mt-3 flex gap-2">
                    <select
                      className="input"
                      value={todo.status}
                      onChange={async (e) => {
                        await fetch(`/api/todos?id=${todo.id}`, { method: "PATCH", body: JSON.stringify({ status: e.target.value }) });
                        await loadTodos();
                      }}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      className="btn-secondary"
                      onClick={async () => {
                        await fetch(`/api/todos?id=${todo.id}`, { method: "DELETE" });
                        await loadTodos();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
