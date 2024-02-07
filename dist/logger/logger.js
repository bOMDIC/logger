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
                format: process.env.LOGGER_FORMAT || 'json'
            }
        }
        const { service, format: _format } = options
        let format
        if (_format === 'json') {
            format = winston_1.default.format.combine(
                winston_1.default.format.timestamp(),
                winston_1.default.format.errors({ stack: true }),
                winston_1.default.format.json()
            )
        } else {
            format = winston_1.default.format.combine(
                winston_1.default.format.timestamp(),
                winston_1.default.format.errors({ stack: true }),
                winston_1.default.format.printf((info) => {
                    const { timestamp, level, message } = info
                    return `${chalk_1.default.gray(timestamp)} ${level === 'error' ? chalk_1.default.red(level) : level === 'warn' ? chalk_1.default.yellow(level) : chalk_1.default.green(level)} ${message}`
                })
            )
        }
        logger = winston_1.default.createLogger({
            level: 'info',
            format,
            defaultMeta: { service },
            transports: [new winston_1.default.transports.Console()]
        })
    }
    return logger
}
exports.default = singletonInstance()
//# sourceMappingURL=logger.js.map
