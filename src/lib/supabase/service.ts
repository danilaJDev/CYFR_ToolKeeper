import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import type { Database } from "@/lib/types";

export function createServiceSupabaseClient() {
  return createClient<Database>(env.supabaseUrl, env.supabaseServiceKey);
}
