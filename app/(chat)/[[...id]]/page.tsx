import { Chat } from "@/components/chat"
import { notFound } from "next/navigation"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idArray } = await params
  if (idArray && idArray.length > 1) notFound()
  const conversationId = idArray?.[0]

  // TODO: Prefetch the conversation

  return <Chat {...{ conversationId }} />
}
