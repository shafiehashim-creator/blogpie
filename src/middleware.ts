import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export function middleware(request: NextRequest) {
  return updateSession(request);
}

// Hanya jalankan untuk /admin: laman awam kekal statik dan cepat.
export const config = { matcher: ["/admin/:path*"] };
