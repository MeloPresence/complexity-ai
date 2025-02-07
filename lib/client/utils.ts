import type { ConversationInfo } from "@/lib/conversation"
import { createContext } from "react"

export const ConversationInfoListStateContext = createContext<
  [ConversationInfo[], (value: ConversationInfo[]) => void]
>([[], () => {}])

export function addCookie(key: string, value: string) {
  const regex = new RegExp(`${key}\\s*=\\s*\\S+?\\s*(?=;|$)`)
  const newCookieText = `${key}=${value}`
  if (document.cookie.match(regex)) {
    document.cookie = document.cookie.replace(regex, newCookieText)
  } else if (document.cookie) {
    document.cookie = `${document.cookie}; ${newCookieText}`
  } else {
    document.cookie = newCookieText
  }
}

export function removeCookie(key: string) {
  const regex = new RegExp(`${key}\\s*=\\s*\\S+?\\s*(?:;|$)`)
  if (document.cookie.match(regex))
    document.cookie = document.cookie.replace(regex, "")
}
