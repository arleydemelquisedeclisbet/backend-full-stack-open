import { Router } from "express"
import Blog from "../models/blog.js"
import { info } from "../utils/logger.js"
import User from "../models/user.js"
import { userExtractor } from "../utils/middleware.js"

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
            : res.status(404).send({ message: 'Not found' })
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {

    const { params: { id }, user: { _id: author } } = req

    try {

        const blogFound = await Blog.findById(id)

        if (!blogFound) {
            return res.status(404).send({ message: 'Blog not found' })
        }

        if (blogFound.author.toString() !== author.toString()) {
            return res.status(401).send({ message: 'Not authorized' })
        }

        await Blog.deleteOne({ _id: id })
        
        res.status(204).end()

    } catch (error) {
        next(error)
    }
})

blogsRouter.post('', userExtractor, async (req, res, next) => {

    const { body: { title, url, likes }, user: authorInDb } = req

    const { _id: author } = authorInDb
    
    const newBlog = new Blog({ title, author, url, likes })
    
    try {

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
