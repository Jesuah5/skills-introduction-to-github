"use client";

import { useState } from "react";

interface ProfileFormProps {
  initialName: string;
  initialAvatar: string;
}

export function ProfileForm({ initialName, initialAvatar }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="card max-w-xl space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/api/share?profile=1", {
          method: "PATCH",
          body: JSON.stringify({ full_name: fullName, avatar_url: avatarUrl })
        });
        setSaved(true);
      }}
    >
      <h2 className="text-xl font-semibold">Profile</h2>
      <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
      <input className="input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="Avatar URL" />
      <button className="btn-primary">Save profile</button>
      {saved ? <p className="text-sm text-emerald-600">Profile updated.</p> : null}
    </form>
  );
}
