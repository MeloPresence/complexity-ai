import { createConversation } from "@/actions/conversations"
import type { ConversationDataModel } from "@/lib/conversation"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // Get all conversations without message tree
  // https://stackoverflow.com/questions/37548567/how-to-validate-an-authentication-token-against-firebase
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<{ conversationId: string }>> {
  const { conversation }: { conversation: ConversationDataModel } =
    await req.json()
  const conversationId = await createConversation(conversation)
  return NextResponse.json({
    conversationId,
  })
}
