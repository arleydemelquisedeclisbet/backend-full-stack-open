import { test as bunTest, expect } from 'bun:test'
import { dummy } from '../../utils/list_helper'

bunTest('dummy returns one', () => {
    const blogs = []

    const result = dummy(blogs)
    expect(result).toBe(1)
})