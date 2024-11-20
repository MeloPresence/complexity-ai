import pino from "pino"
import type { LokiOptions } from "pino-loki"

const transport = pino.transport<LokiOptions>({
  target: "pino-loki",
  options: {
    labels: { service_name: "complexity-ai-server" },
    batching: true,
    interval: 5,
    host: "http://loki:3100",
  },
})

const pinoLogger = pino(transport)
export interface LogFormat {
  type:
    | "firebase-auth"
    | "cloud-firestore"
    | "gemini-ai"
    | "gemini-files"
    | "backend"
  action: "read" | "write"
  success: boolean
  responseTime: number
  message?: string
  initiatorUserId: string | null
  endpoint: string
}

class Logger {
  debug(data: LogFormat) {
    pinoLogger.debug(data)
  }
  info(data: LogFormat) {
    pinoLogger.info(data)
  }
  warn(data: LogFormat) {
    pinoLogger.warn(data)
  }
  error(data: LogFormat) {
    pinoLogger.error(data)
  }
  fatal(data: LogFormat) {
    pinoLogger.fatal(data)
  }
}

export const logger = new Logger()
