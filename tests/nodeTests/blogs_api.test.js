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

    test('creates a new blog post', async () => {

        const { body: blogs } = await api.get('/api/blogs')
        const blogsBefore = blogs.length
    
        const newBlog = { title: 'Last blog', author: 'Lili', url: 'www.last.com', likes: 0 }
        
        await api
            .post('/api/blogs').send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const { body: blogsAfter } = await api.get('/api/blogs')

        assert.equal(blogsAfter.length, blogsBefore + 1)
    })
    
    test('default value to likes is zero', async () => {
    
        const newBlog = { title: 'Other blog', author: 'NNN', url: 'www.nnn.com' }

        assert.ok(!newBlog.hasOwnProperty('likes'))
        
        const { body: blogAdded } = await api
            .post('/api/blogs').send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        assert.ok(blogAdded.hasOwnProperty('likes'))
        assert.equal(blogAdded.likes, 0)
    })
    
    test('title and url are required', async () => {
    
        const blogWithoutTitle = { author: 'NNN', url: 'www.nnn.com' }
        const blogWithoutUrl = { title: 'NNN', author: 'NNN' }
        
        await api
            .post('/api/blogs').send(blogWithoutTitle)
            .expect(400)
            .expect('Content-Type', /application\/json/)        
        
        await api
            .post('/api/blogs').send(blogWithoutUrl)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
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
