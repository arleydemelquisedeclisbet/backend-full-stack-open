import { test as bunTest, expect } from 'bun:test'
const listHelper = require('../../utils/list_helper')

bunTest('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})