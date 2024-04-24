import { Router } from "express"
import Blog from "../models/blog.js"
import { info } from "../utils/logger.js"
import User from "../models/user.js"

const blogsRouter = Router()

blogsRouter.get('/', async (_req, res) => {
    const blogs = await Blog.find().populate('author', { username: 1, name: 1 })
    res.send(blogs)
})

blogsRouter.get('/info', async (_req, res) => {
    const numberOfRegisters = await Blog.countDocuments()
    const message = `Blogs has info for ${numberOfRegisters} blogs`
    const dateRequest = new Date()
    res.send({ message, numberOfRegisters, dateRequest: dateRequest.toLocaleString() })
})

blogsRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const blogFound = await Blog.findById(id).populate('author', { username: 1, name: 1 })

        return blogFound
            ? res.send(blogFound)
            : res.status(404).send('Not found')
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', async (req, res, next) => {

    const { id } = req.params

    try {
        return await Blog.findByIdAndDelete(id)
            ? res.status(204).end()
            : res.status(404).send('Not found')
    } catch (error) {
        next(error)
    }
})

blogsRouter.post('', async (req, res, next) => {

    const { body: { title, url, likes } } = req

    try {

        const authorInDb = await User.findOne()

        if (!authorInDb) {
            return res.status(400).send({ message: 'Author not exists' })
        }

        const { id: author } = authorInDb

        const newBlog = new Blog({ title, author, url, likes })        
        await newBlog.save()
        info(`New blog '${newBlog.title}' added`)

        authorInDb.blogs = [...authorInDb.blogs, newBlog.id ]
        const { name: authorName } = await User.findByIdAndUpdate(author, authorInDb, { new: true })
        info(`Added ${newBlog.id} to ${authorName}'s blogs`)

        res.status(201).send(newBlog)
    } catch (error) {
        next(error)        
    }
})

blogsRouter.put('/:id', async (req, res, next) => {

    const { id } = req.params
    const { body: { title, url, likes } } = req

    try {
        const newBlog =  await Blog.findByIdAndUpdate(
            id, { title, url, likes }, { new: true, runValidators: true, context: 'query' }
        ).populate('author', { username: 1, name: 1 })
        return newBlog
            ? res.send(newBlog)
            : res.status(404).send({ message: 'Not found' })
    } catch (error) {
        next(error)
    }
})

export default blogsRouter
