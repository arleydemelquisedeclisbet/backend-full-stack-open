import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Blog from '../../models/blog.js'

const api = supertest(app)

const initialBlogs = [{ title: 'First blog', author: 'Wilmar', url: 'www.first.com', likes: 5 }, { title: 'Second blog', author: 'Isaac', url: 'www.second.com', likes: 10 }]

describe('Testing blogs api', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('there are two blogs', async () => {
        const { body: blogs } = await api.get('/api/blogs')
        assert.strictEqual(blogs.length, 2)
    })
    
    test('the unique identifier property of the blog posts is named id', async () => {
        const { body: blogs } = await api.get('/api/blogs')
        const [ blog ] = blogs
        assert.ok(blog.hasOwnProperty('id'))
        assert.ok(!blog.hasOwnProperty('_id'))
    })
    
    beforeEach(async () => {
        await Blog.deleteMany({})
        let blogObject = new Blog(initialBlogs[0])
        await blogObject.save()
        blogObject = new Blog(initialBlogs[1])
        await blogObject.save()
    })
    
    after(async () => {
        await mongoose.connection.close()
    })
})
