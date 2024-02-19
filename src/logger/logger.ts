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
                format: (process.env.LOGGER_FORMAT as FormatType) || 'json',
                colorize: R.isNotNil(process.env.LOGGER_COLORIZE) && R.toLower(process.env.LOGGER_COLORIZE) === 'true'
            }
        }
        const { service, format, colorize } = options

        logger = winston.createLogger({
            level: 'info',
            format: createCustomCombine(format, colorize),
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

function createCustomCombine(format: FormatType, colorize: boolean) {
    if (format === 'json') {
        if (colorize) {
            return winston.format.combine(
                // winston.format.errors({ stack: true }),
                winston.format.timestamp(),
                winston.format.json(),
                winston.format.printf(getJsonStringByError),
                winston.format.colorize({ all: true })
            )
        }

        return winston.format.combine(
            // winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.printf(getJsonStringByError)
        )
    }

    if (colorize) {
        return winston.format.combine(
            // winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            // winston.format.colorize({ all: true })
            winston.format.printf(getTextStringWithColor)
        )
    }

    return winston.format.combine(
        // winston.format.errors({ stack: true }),
        winston.format.timestamp(),

        winston.format.printf(getTextString)
        // winston.format.align(),
        // winston.format.prettyPrint()
        // winston.format.splat(),
        // winston.format.simple()
        // winston.format.colorize({ all: true })
        // winston.format.label({ label: 'right meow!' }),
        // winston.format.printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`)
    )
}

function formatErrorToObject(value: any) {
    const errorToObject = (e: Error) => ({
        message: e.message,
        stack: R.pipe(R.defaultTo(''), R.split('\n'), R.slice(0, 4), R.map(R.trim))(e.stack)
    })

    if (value instanceof Error) {
        value = errorToObject(value)
    } else if (R.is(Object, value)) {
        R.forEach((el) => {
            if (R.is(String, el) && value[el] instanceof Error) {
                value[el] = errorToObject(value[el])
            }
        })(R.keys(value))
    }

    return value
}

function getJsonStringByError(info: any) {
    if (info.message) {
        info.message = formatErrorToObject(info.message)
    }

    info = formatErrorToObject(info)

    return JSON.stringify(info)
}

function p(info: any) {
    if (info.message) {
        info.message = formatErrorToObject(info.message)
    }

    info = formatErrorToObject(info)

    const { service, level, message, timestamp } = info

    const meta = R.omit(['service', 'level', 'message', 'timestamp'])(info)

    const payload = meta ? ` ${JSON.stringify(meta)}` : ''

    let _message = formatErrorToObject(message)

    if (R.is(Object, _message)) {
        _message = JSON.stringify(_message)
    }

    return { timestamp, service, level, message: _message, payload }
}

function getTextString(info: any) {
    const { service, level, message, timestamp, payload } = p(info)

    return `${timestamp} [${service}] ${level}: ${message}` + payload
}

function getTextStringWithColor(info: any) {
    const { service, level, message, timestamp, payload } = p(info)

    return (
        `${chalk.gray(timestamp)} [${service}] ${level === 'error' ? chalk.red(level) : level === 'warn' ? chalk.yellow(level) : chalk.green(level)}: ${message}` +
        payload
    )
}

export default singletonInstance()
