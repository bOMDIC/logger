'use strict'
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
const index_1 = __importDefault(require('./index'))
index_1.default.error({ test: 1, error: new Error('example1') })
index_1.default.error('example2', 'meta')
index_1.default.error('example3', { meta: 'mmmmmeta', eee: 111 })
index_1.default.error(new Error('example4'))
//# sourceMappingURL=test.js.map
