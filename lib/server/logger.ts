import pino from "pino"
import type { LokiOptions } from "pino-loki"

const transport = pino.transport<LokiOptions>({
  target: "pino-loki",
  labels: { service_name: "complexity-ai-server" },
  options: {
    batching: true,
    interval: 5,
    host: "http://loki:3100",
  },
})

export const logger = pino(transport)
