import { test as bunTest, expect, describe } from 'bun:test'
import { totalLikes, favoriteBlog, mostBlogs, mostLikes } from '../../utils/list_helper.js'
import { initialBlogs as blogs } from '../test_helper.js'

describe('total likes', () => {

    bunTest('when list has only one blog, equals the likes of that', () => {
        const result = totalLikes([blogs[1]])
        expect(result).toBe(5)
    })
    
    bunTest('of empty list is zero', () => {
        const result = totalLikes([])
        expect(result).toBe(0)
    })
    
    bunTest('of a bigger list is calculated right', () => {
        const result = totalLikes(blogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {

    bunTest('get the blog with the most likes, only (title, author, likes)', () => {
        const result = favoriteBlog(blogs)
        const expectComplete = blogs[2]
        const { title, author, likes } = expectComplete
        expect(result).toStrictEqual({ title, author, likes })
    })
})

describe('most blogs', () => {

    bunTest('get the author with the most blogs', () => {
        const result = mostBlogs(blogs)
        const expected = { author: '66271ce6195dee3b2bb1aa6f', blogs: 3 }
        expect(result).toStrictEqual(expected)
    })
})

describe('most likes', () => {

    bunTest('get the author, whose blog posts have the largest amount of likes', () => {
        const result = mostLikes(blogs)
        const expected = { author: '66271cae63b347a706c26613', likes: 17 }
        expect(result).toStrictEqual(expected)
    })
})