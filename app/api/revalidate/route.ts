import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { tag?: unknown } | null
  const tag = body?.tag

  if (typeof tag !== "string" || tag.length === 0 || tag.length > 256) {
    return NextResponse.json({ error: "A valid cache tag is required" }, { status: 400 })
  }

  revalidateTag(tag, "max")
  return NextResponse.json({ revalidated: true, tag })
}
