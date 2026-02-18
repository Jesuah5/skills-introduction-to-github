export type AccessRole = "view" | "edit";
export type TodoStatus = "pending" | "in_progress" | "done";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Todo {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  assigned_to: string | null;
  due_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  owner_id: string;
  title: string;
  markdown: string;
  visibility: "private" | "shared";
  cover_image_url: string | null;
  embed_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SharedRecord {
  id: string;
  resource_type: "todo" | "note";
  resource_id: string;
  owner_id: string;
  shared_with: string;
  role: AccessRole;
  created_at: string;
}
