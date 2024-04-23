import { test as nodeTest, describe } from 'node:test'
import assert from 'node:assert'
import { totalLikes, favoriteBlog, mostBlogs, mostLikes } from '../../utils/list_helper.js'
import { initialBlogs as blogs } from '../test_helper.js'

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

describe('favorite blog', () => {

    nodeTest('get the blog with the most likes, only (title, author, likes)', () => {
        const result = favoriteBlog(blogs)
        const expectComplete = blogs[2]
        const { title, author, likes } = expectComplete
        assert.deepStrictEqual(result, { title, author, likes })
    })
})

describe('most blogs', () => {

    nodeTest('get the author with the most blogs', () => {
        const result = mostBlogs(blogs)
        const expect = { author: '66271ce6195dee3b2bb1aa6f', blogs: 3 }
        assert.deepStrictEqual(result, expect)
    })
})

describe('most likes', () => {

    nodeTest('get the author, whose blog posts have the largest amount of likes', () => {
        const result = mostLikes(blogs)
        const expect = { author: '66271cae63b347a706c26613', likes: 17 }
        assert.deepStrictEqual(result, expect)
    })
})