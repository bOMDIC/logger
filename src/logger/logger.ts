import R from 'ramda'
import config from 'config'
import chalk from 'chalk'
import winston from 'winston'
import { ILoggerConfig } from 'logger'

let logger: winston.Logger | null

function singletonInstance(options?: ILoggerConfig | null): winston.Logger {
    if (R.isNil(logger)) {
        if (R.isNil(options)) {
            options = config.get('logger') as ILoggerConfig
        }

        const { service } = options

        logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf((info) => {
                    const { timestamp, level, message } = info
                    return `${chalk.gray(timestamp)} ${level === 'error' ? chalk.red(level) : level === 'warn' ? chalk.yellow(level) : chalk.green(level)} ${message}`
                }),
                winston.format.errors({ stack: true }),
                winston.format.json() // 将日志格式化为 JSON
            ),
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
