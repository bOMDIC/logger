import R from 'ramda'
import dotenv from 'dotenv'
import chalk from 'chalk'
import winston from 'winston'
import { ILoggerConfig, FormatType } from 'logger'

let logger: winston.Logger | null

function singletonInstance(options?: ILoggerConfig | null): winston.Logger {
    if (R.isNil(logger)) {
        if (R.isNil(options)) {
            dotenv.config()

            options = {
                service: process.env.LOGGER_SERVICE || 'logger',
                format: (process.env.LOGGER_FORMAT as FormatType) || 'json'
            }
        }
        const { service, format: _format } = options

        let format

        if (_format === 'json') {
            format = winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            )
        } else {
            format = winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.printf((info) => {
                    const { timestamp, level, message } = info
                    return `${chalk.gray(timestamp)} ${level === 'error' ? chalk.red(level) : level === 'warn' ? chalk.yellow(level) : chalk.green(level)} ${message}`
                })
            )
        }

        logger = winston.createLogger({
            level: 'info',
            format,
            defaultMeta: { service },
            transports: [
                new winston.transports.Console()
                // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                // new winston.transports.File({ filename: 'logs/combined.log' })
            ]
        })
    }

    return logger
}

export default singletonInstance()
