import { updateConversation } from "@/actions/conversations"
import type { ConversationDataModel } from "@/lib/conversation"
import { type NextRequest, NextResponse } from "next/server"

// export async function GET(req: NextRequest) {
//   // Update existing conversation history
// }

export async function POST(
  req: NextRequest,
): Promise<NextResponse<{ success: boolean }>> {
  const {
    conversationId,
    conversation,
  }: { conversationId: string; conversation: ConversationDataModel } =
    await req.json()
  let success = true
  try {
    await updateConversation(conversationId, conversation)
  } catch (error) {
    success = false
    if (error instanceof Error) {
      console.error(error, error?.stack)
    } else {
      console.error(error)
    }
  }
  return NextResponse.json({
    success,
  })
}
