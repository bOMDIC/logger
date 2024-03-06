'use strict'
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
const index_1 = __importDefault(require('./index'))
class ExampleError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ExampleError'
    }
}
index_1.default.error({ test: 1, error: new Error('example1') })
index_1.default.error({ test: 1, message: 'test message', error: new Error('example2') })
index_1.default.error(new Error('example3'))
index_1.default.error('example4', 'meta')
index_1.default.error('example5', { meta: 'mmmmmeta', eee: 111 })
index_1.default.error({ error: new ExampleError('example6') })
//# sourceMappingURL=test.js.map
