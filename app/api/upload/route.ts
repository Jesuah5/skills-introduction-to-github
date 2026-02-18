import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(req: Request) {
  const supabase = await createSupabaseRouteClient();
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const { data: auth } = await supabase.auth.getUser();
  const arrayBuffer = await file.arrayBuffer();
  const fileName = `${auth.user?.id}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(fileName, Buffer.from(arrayBuffer), { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { error: metaError } = await supabase.from("file_uploads").insert({
    owner_id: auth.user?.id,
    file_name: file.name,
    storage_path: data.path,
    mime_type: file.type,
    size_bytes: file.size
  });

  if (metaError) return NextResponse.json({ error: metaError.message }, { status: 400 });

  return NextResponse.json(data);
}
