import { generateTitle } from "@/actions/title"
import type { ModdedCoreMessage } from "@/lib/server/message"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
): Promise<NextResponse<{ title: string }>> {
  const { messages }: { messages: ModdedCoreMessage[] } = await req.json()
  const title = await generateTitle(messages)
  return NextResponse.json({ title })
}
