import { test as bunTest, expect, describe } from 'bun:test'
import { totalLikes } from '../../utils/list_helper.js'
import blogs from '../blogsList.js'

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