import winston from "winston"
import LokiTransport from "winston-loki"

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new LokiTransport({
      host: "http://localhost:3100",
      labels: { app: "nextjs-api" },
    }),
  ],
})
