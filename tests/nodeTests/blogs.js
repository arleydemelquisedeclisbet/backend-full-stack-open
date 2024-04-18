import { test as nodeTest, describe } from 'node:test'
import assert from 'node:assert'
import { totalLikes, favoriteBlog, mostBlogs } from '../../utils/list_helper.js'
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

describe('favorite blog', () => {

    nodeTest('get the blog with the most likes, only (title, author, likes)', () => {
        const result = favoriteBlog(blogs)
        const expectComplete = blogs[2]
        const { title, author, likes } = expectComplete
        assert.deepStrictEqual(result, { title, author, likes })
    })
})


describe('most blogs', () => {

    nodeTest('get the author with the most blogs, get ({ author:string, blogs:number })', () => {
        const result = mostBlogs(blogs)
        const expect = { author: 'Robert C. Martin', blogs: 3 }
        assert.deepStrictEqual(result, expect)
    })
})