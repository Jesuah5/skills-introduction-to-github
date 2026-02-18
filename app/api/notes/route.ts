import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET() {
  const supabase = await createSupabaseRouteClient();
  const { data } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = await createSupabaseRouteClient();
  const payload = await req.json();
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("notes").insert({ ...payload, owner_id: auth.user?.id }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseRouteClient();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing note id" }, { status: 400 });
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
