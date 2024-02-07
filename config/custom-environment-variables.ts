export default {
    app: {
        name: 'APP_NAME',
        env: 'APP_ENV',
        debug: { __name: 'APP_DEBUG', __format: 'boolean' }
    },
    logger: {
        service: 'LOGGER_SERVICE',
        format: 'LOGGER_FORMAT',
        colorize: { __name: 'LOGGER_COLORIZE', __format: 'boolean' }
    }
}
