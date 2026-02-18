"use client";

import { useState } from "react";

export function SharePanel() {
  const [resourceType, setResourceType] = useState<"todo" | "note">("todo");
  const [resourceId, setResourceId] = useState("");
  const [sharedWith, setSharedWith] = useState("");
  const [role, setRole] = useState<"view" | "edit">("view");

  return (
    <form
      className="card space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/api/share", {
          method: "POST",
          body: JSON.stringify({ resource_type: resourceType, resource_id: resourceId, shared_with: sharedWith, role })
        });
        setResourceId("");
        setSharedWith("");
      }}
    >
      <h2 className="text-xl font-semibold">Share resources</h2>
      <select className="input" value={resourceType} onChange={(e) => setResourceType(e.target.value as "todo" | "note") }>
        <option value="todo">Todo</option>
        <option value="note">Note</option>
      </select>
      <input className="input" placeholder="Resource ID" value={resourceId} onChange={(e) => setResourceId(e.target.value)} required />
      <input className="input" placeholder="User UUID to share with" value={sharedWith} onChange={(e) => setSharedWith(e.target.value)} required />
      <select className="input" value={role} onChange={(e) => setRole(e.target.value as "view" | "edit") }>
        <option value="view">View</option>
        <option value="edit">Edit</option>
      </select>
      <button className="btn-primary">Share</button>
    </form>
  );
}
