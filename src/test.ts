import logger from './index'

logger.error({ test: 1, error: new Error('example1') })
logger.error({ test: 1, message: 'test message', error: new Error('example2') })
logger.error(new Error('example3'))
logger.error('example4', 'meta')
logger.error('example5', { meta: 'mmmmmeta', eee: 111 })
