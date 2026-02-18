"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Note } from "@/lib/types";
import { getYouTubeEmbedUrl } from "@/lib/utils";

export function NoteBoard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [visibility, setVisibility] = useState<"private" | "shared">("private");

  const loadNotes = async () => {
    const res = await fetch("/api/notes");
    if (res.ok) setNotes(await res.json());
  };

  useEffect(() => {
    void loadNotes();
  }, []);

  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <form
        className="card space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch("/api/notes", {
            method: "POST",
            body: JSON.stringify({ title, markdown, embed_url: embedUrl || null, visibility })
          });
          setTitle("");
          setMarkdown("");
          setEmbedUrl("");
          await loadNotes();
        }}
      >
        <h2 className="text-xl font-semibold">Create note</h2>
        <input className="input" placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input min-h-40" placeholder="Markdown content" value={markdown} onChange={(e) => setMarkdown(e.target.value)} required />
        <input className="input" placeholder="YouTube or URL embed" value={embedUrl} onChange={(e) => setEmbedUrl(e.target.value)} />
        <select className="input" value={visibility} onChange={(e) => setVisibility(e.target.value as "private" | "shared") }>
          <option value="private">Private</option>
          <option value="shared">Shared</option>
        </select>
        <button className="btn-primary">Save note</button>
      </form>

      <div className="space-y-4">
        {notes.map((note) => {
          const youtube = note.embed_url ? getYouTubeEmbedUrl(note.embed_url) : null;
          return (
            <article key={note.id} className="card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <button
                  className="btn-secondary"
                  onClick={async () => {
                    await fetch(`/api/notes?id=${note.id}`, { method: "DELETE" });
                    await loadNotes();
                  }}
                >
                  Delete
                </button>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.markdown}</ReactMarkdown>
              </div>
              {youtube ? <iframe src={youtube} className="aspect-video w-full rounded-lg" allowFullScreen /> : null}
              {!youtube && note.embed_url ? (
                <a href={note.embed_url} target="_blank" className="text-brand-500" rel="noreferrer">{note.embed_url}</a>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
