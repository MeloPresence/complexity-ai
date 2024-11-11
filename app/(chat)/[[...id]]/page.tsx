import { Chat } from "@/components/chat"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idArray } = await params
  if (idArray && idArray.length > 1) throw new Error("Not found")
  const conversationId = idArray?.[0]

  return <Chat {...{ conversationId }} />
}
