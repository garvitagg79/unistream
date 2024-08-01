import { supabase } from "@/lib/server";

export default async function Notes() {
  let { data: viewers, error } = await supabase.from("viewers").select("*");

  return <pre>{JSON.stringify(viewers, null, 2)}</pre>;
}
