import { test as nodeTest, describe } from 'node:test'
import assert from 'node:assert'
import { totalLikes } from '../../utils/list_helper.js'
import blogs from '../blogsList.js'

describe('total likes', () => {

    nodeTest('when list has only one blog, equals the likes of that', () => {
        const result = totalLikes([blogs[1]])
        assert.strictEqual(result, 5)
    })
    
    nodeTest('of empty list is zero', () => {
        const result = totalLikes([])
        assert.strictEqual(result, 0)
    })
    
    nodeTest('of a bigger list is calculated right', () => {
        const result = totalLikes(blogs)
        assert.strictEqual(result, 36)
    })
})