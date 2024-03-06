import logger from './index'

class ExampleError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ExampleError'
    }
}

logger.error({ test: 1, error: new Error('example1') })
logger.error({ test: 1, message: 'test message', error: new Error('example2') })
logger.error(new Error('example3'))
logger.error('example4', 'meta')
logger.error('example5', { meta: 'mmmmmeta', eee: 111 })
logger.error({ error: new ExampleError('example6') })
