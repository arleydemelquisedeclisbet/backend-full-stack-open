import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Blog from '../../models/blog.js'
import { initialBlogs, nonExistingId, getBlogsInDb, getBlogByIdInDb } from '../test_helper.js'

const api = supertest(app)

describe('Testing blogs api', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(initialBlogs)
    })
    
    describe('when there is initially some blogs saved', () => {

        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('all blogs are returned', async () => {
            const { body: blogs } = await api.get('/api/blogs')
            assert.strictEqual(blogs.length, initialBlogs.length)
        })

        test('a specific note is within the returned blogs', async () => {
            const { body: blogs } = await api.get('/api/blogs')

            const titles = blogs.map(blog => blog.title)
            assert.ok(titles.includes('First class tests'))
        })

    })

    describe('viewing a specific blog', async () => {

        test('succeeds with a valid id', async () => {
            const blogsAsStart = await getBlogsInDb()

            const blogExpected = blogsAsStart[0]

            const { body: blogResult } = await api
                .get(`/api/blogs/${blogExpected.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(blogResult.author.id, blogExpected.author.toString())
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            const validNonexistingId = await nonExistingId()

            await api
                .get(`/api/blogs/${validNonexistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 id is invalid', async () => {

            await api
                .get(`/api/blogs/invalidId`)
                .expect(400)
        })
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {

            const newBlog = { title: 'Last blog', authorId: '66271ce6195dee3b2bb1aa6f', url: 'www.last.com', likes: 2 }

            await api
                .post('/api/blogs').send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await getBlogsInDb()

            assert.equal(blogsAfter.length, initialBlogs.length + 1)
        })

        test('fails with status code 400 if data invalid', async () => {

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

        test('default value to likes is zero', async () => {

            const newBlog = { title: 'Other blog', authorId: '66271ce6195dee3b2bb1aa6f', url: 'www.nnn.com' }

            assert.ok(!newBlog.hasOwnProperty('likes'))

            const { body: blogAdded } = await api
                .post('/api/blogs').send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.ok(blogAdded.hasOwnProperty('likes'))
            assert.equal(blogAdded.likes, 0)
        })

        test('the unique identifier property of the blog posts is named id', async () => {
            const blogs = await getBlogsInDb()
            const [blog] = blogs
            assert.ok(blog.hasOwnProperty('id'))
            assert.ok(!blog.hasOwnProperty('_id'))
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {

            const blogs = await getBlogsInDb()
            const blogToDelete = blogs[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await getBlogsInDb()

            assert.strictEqual(blogsAtEnd.length, blogs.length - 1)

            const titles = blogsAtEnd.map(r => r.title)
            assert(!titles.includes(blogToDelete.title))
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            const validNonexistingId = await nonExistingId()

            await api
                .delete(`/api/blogs/${validNonexistingId}`)
                .expect(404)
        })
    })

    describe('update of a blog ', () => {

        test('succeeds with valid data', async () => {

            const blogs = await getBlogsInDb()
            const [, blogToUpdate] = blogs

            const newBlog = { title: 'Last blog', authorId: '66271cae63b347a706c26613', url: 'www.last.com', likes: 5 }

            const { body: blogUpdated } = await api
                .put(`/api/blogs/${blogToUpdate.id}`).send(newBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogAfter = await getBlogByIdInDb(blogToUpdate.id)

            assert.strictEqual(blogAfter.likes, newBlog.likes)
            assert.deepStrictEqual(blogAfter, blogUpdated)
        })
    })

    after(async () => {
        await mongoose.connection.close()
    })
})
