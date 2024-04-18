import { test as nodeTest } from 'node:test'
import assert from 'node:assert'
import { dummy } from '../../utils/list_helper.js'


nodeTest('dummy returns one', () => {
    const blogs = []

    const result = dummy(blogs)
    assert.strictEqual(result, 1)
})