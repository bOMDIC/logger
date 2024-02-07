'use strict'
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
const ramda_1 = __importDefault(require('ramda'))
const dotenv_1 = __importDefault(require('dotenv'))
const chalk_1 = __importDefault(require('chalk'))
const winston_1 = __importDefault(require('winston'))
let logger
function singletonInstance(options) {
    if (ramda_1.default.isNil(logger)) {
        if (ramda_1.default.isNil(options)) {
            dotenv_1.default.config()
            options = {
                service: process.env.LOGGER_SERVICE || 'logger',
                format: process.env.LOGGER_FORMAT || 'json',
                colorize:
                    ramda_1.default.isNotNil(process.env.LOGGER_COLORIZE) &&
                    ramda_1.default.toLower(process.env.LOGGER_COLORIZE) === 'true'
            }
        }
        const { service, format, colorize } = options
        logger = winston_1.default.createLogger({
            level: 'info',
            format: createCustomCombine(format, colorize),
            defaultMeta: { service },
            transports: [new winston_1.default.transports.Console()]
        })
    }
    return logger
}
function createCustomCombine(format, colorize) {
    if (format === 'json') {
        if (colorize) {
            return winston_1.default.format.combine(
                winston_1.default.format.errors({ stack: true }),
                winston_1.default.format.timestamp(),
                winston_1.default.format.json(),
                winston_1.default.format.printf(getJsonStringByError),
                winston_1.default.format.colorize({ all: true })
            )
        }
        return winston_1.default.format.combine(
            winston_1.default.format.errors({ stack: true }),
            winston_1.default.format.timestamp(),
            winston_1.default.format.json(),
            winston_1.default.format.printf(getJsonStringByError)
        )
    }
    if (colorize) {
        return winston_1.default.format.combine(
            winston_1.default.format.timestamp(),
            winston_1.default.format.printf(getTextStringWithColor)
        )
    }
    return winston_1.default.format.combine(
        winston_1.default.format.timestamp(),
        winston_1.default.format.printf(getTextString)
    )
}
function formatErrorToObject(message) {
    if (ramda_1.default.is(Object, message)) {
        ramda_1.default.forEach((el) => {
            if (ramda_1.default.is(String, el) && message[el] instanceof Error) {
                message[el] = {
                    message: message[el].message,
                    stack: ramda_1.default.pipe(
                        ramda_1.default.split('\n'),
                        ramda_1.default.slice(0, 4),
                        ramda_1.default.map(ramda_1.default.trim)
                    )(message[el].stack)
                }
            }
        })(ramda_1.default.keys(message))
    }
    return message
}
function getJsonStringByError(info) {
    info.message = formatErrorToObject(info.message)
    return JSON.stringify(info)
}
function p(info) {
    if (info instanceof Error) {
        info = Object.assign(Object.assign({}, info), {
            message: info.message,
            stack: ramda_1.default.pipe(
                ramda_1.default.split('\n'),
                ramda_1.default.slice(0, 4),
                ramda_1.default.map(ramda_1.default.trim)
            )(info.stack)
        })
    }
    const { service, level, message, timestamp } = info
    const meta = ramda_1.default.omit(['service', 'level', 'message', 'timestamp', 'error'])(info)
    const payload = meta ? ` ${JSON.stringify(meta)}` : ''
    let _message = formatErrorToObject(message)
    if (ramda_1.default.is(Object, _message)) {
        _message = JSON.stringify(_message)
    }
    return { timestamp, service, level, message: _message, payload }
}
function getTextString(info) {
    const { service, level, message, timestamp, payload } = p(info)
    return `${timestamp} [${service}] ${level}: ${message}` + payload
}
function getTextStringWithColor(info) {
    const { service, level, message, timestamp, payload } = p(info)
    return (
        `${chalk_1.default.gray(timestamp)} [${service}] ${level === 'error' ? chalk_1.default.red(level) : level === 'warn' ? chalk_1.default.yellow(level) : chalk_1.default.green(level)}: ${message}` +
        payload
    )
}
exports.default = singletonInstance()
//# sourceMappingURL=logger.js.map
