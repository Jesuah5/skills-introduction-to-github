"use client";

import { useState } from "react";

export function FileUpload() {
  const [message, setMessage] = useState("");

  return (
    <div className="card space-y-3">
      <h2 className="text-xl font-semibold">Upload image</h2>
      <input
        className="input"
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          setMessage(res.ok ? `Uploaded: ${data.path}` : data.error ?? "Upload failed");
        }}
      />
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
    </div>
  );
}
