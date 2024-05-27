import { createLogger, format, transports } from 'winston'

const timestampFormat = new Date().toLocaleDateString()

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: timestampFormat }),
    format.json(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
})

export default logger
