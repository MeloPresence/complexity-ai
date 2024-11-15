import { createContext } from "react"

export interface UserInfo {
  readonly email: string | null
  readonly uid: string
}

export const UserInfoContext = createContext<UserInfo | null>(null)
