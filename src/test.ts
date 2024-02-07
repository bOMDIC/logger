import logger from './index'

logger.error({ test: 1, error: new Error('example1') })
logger.error('example2', 'meta')
logger.error('example3', { meta: 'mmmmmeta', eee: 111 })
logger.error(new Error('example4'))
