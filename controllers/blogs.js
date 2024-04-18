import { Router } from "express"
import Blog from "../models/blog.js"
import { info } from "../utils/logger.js"

const blogsRouter = Router()

blogsRouter.get('/', async (_req, res) => {
    const persons = await Blog.find()
    res.send(persons)
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
        const personFound = await Blog.findById(id)

        return personFound
            ? res.send(personFound)
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

    const { body: { title, author, url, likes } } = req

    if ((await Blog.find({ title })).length) {
        return res.status(400).send({ error: 'The title already exists in the blogs' })
    }

    const newBlog = new Blog({ title, author, url, likes })

    try {
        await newBlog.save()
        info(`Added ${title} author ${author} to phonebook`)
        res.status(201).send(newBlog)
    } catch (error) {
        next(error)
    }

})

blogsRouter.put('/:id', async (req, res, next) => {

    const { id } = req.params
    const { body: { title, author, url, likes } } = req

    try {
        const newBlog =  await Blog.findByIdAndUpdate(
            id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query' }
        )
        return newBlog
            ? res.send(newBlog)
            : res.status(404).send('Not found')
    } catch (error) {
        next(error)
    }
})

export default blogsRouter
