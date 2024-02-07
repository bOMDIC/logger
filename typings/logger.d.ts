declare module 'logger' {
    // export class ILogger {
    //     constructor(options?: ILoggerConfig | null)
    //     error: LeveledLogMethod
    //     warn: LeveledLogMethod
    //     info: LeveledLogMethod
    //     debug: LeveledLogMethod
    // }

    import winston from 'winston'

    export interface ILoggerConfig {
        service: string
        format: FormatType
    }

    export type FormatType = 'json' | 'text'
    // export interface LeveledLogMethod {
    //     (message: string, callback: LogCallback): ILogger
    //     (message: string, meta: any, callback: LogCallback): ILogger
    //     (message: string, ...meta: any[]): ILogger
    //     (message: any): ILogger
    //     (infoObject: object): ILogger
    // }
    //
    // type LogCallback = (error?: any, level?: string, message?: string, meta?: any) => void

    export const logger: winston.Logger

    export default logger
}
