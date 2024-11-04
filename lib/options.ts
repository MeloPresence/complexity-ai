import { AI_MODELS } from "@/lib/ai-models"
import { createContext } from "react"

export type Options = {
  model: keyof typeof AI_MODELS
}

const defaultOptions: Options = {
  model: "gemini-1.5-flash-latest",
}

export const OptionsContext = createContext<Options>(defaultOptions)
