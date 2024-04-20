import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import personsRouter from './controllers/persons.js'
import blogsRouter from './controllers/blogs.js'
import { unknownEndpoint, errorHandler, recoverBody } from './utils/middlewar.js'
import _mongoose from './models/index.js'

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
    morgan.token('body', recoverBody)
    app.use(
        morgan(':method :url :status :res[content-length] - :response-time ms :body')
    )
}
// Router persons
app.use('/api/persons', personsRouter)
// Router blogs
app.use('/api/blogs', blogsRouter)
// Handle unknownEndpoint
app.use(unknownEndpoint)
// Handle errors
app.use(errorHandler)

export default app
