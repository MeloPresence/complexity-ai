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
  constructor(
    private startTimestamp: number | null = null,
    private initialData: Partial<LogFormat> = {},
  ) {}

  startTime(initialData?: Partial<LogFormat>): Logger {
    return new Logger(Date.now(), initialData)
  }

  private processData(newData: Partial<LogFormat>): LogFormat {
    let data = { ...this.initialData }
    if (this.startTimestamp !== null) {
      data = {
        ...data,
        responseTime: this.startTimestamp - Date.now(),
      }
    } else if (!newData.responseTime) {
      throw new Error(
        "Provide a responseTime field or use the returned instance from startTime to do it",
      )
    }
    return { ...data, ...newData } as LogFormat
  }

  debug(data: Partial<LogFormat>) {
    const newData = this.processData(data)
    pinoLogger.debug(newData)
  }

  info(data: Partial<LogFormat>) {
    const newData = this.processData(data)
    pinoLogger.info(newData)
  }

  warn(data: Partial<LogFormat>) {
    const newData = this.processData(data)
    pinoLogger.warn(newData)
  }

  error(data: Partial<LogFormat>) {
    const newData = this.processData(data)
    pinoLogger.error(newData)
  }

  fatal(data: Partial<LogFormat>) {
    const newData = this.processData(data)
    pinoLogger.fatal(newData)
  }
}

export const logger = new Logger()
