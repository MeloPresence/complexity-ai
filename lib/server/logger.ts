import pino from "pino"
import type { LokiOptions } from "pino-loki"

const transport = pino.transport<LokiOptions>({
  target: "pino-loki",
  options: {
    batching: true,
    interval: 5,
    host: "http://localhost:3100",
  },
})

export const logger = pino(transport)
