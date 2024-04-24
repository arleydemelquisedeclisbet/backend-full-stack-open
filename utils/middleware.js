import { error as loggerError } from "./logger.js"

export const unknownEndpoint = (_req, res) => {
    return res.status(404).send({ error: 'unknown endpoint' })
}

export const errorHandler = (error, _idreq, res, _next) => {
    let message ='internal server error'
    if (error.message) {
        message = error.message
    }
    loggerError('Error: ', error)
    if (error.name === 'CastError') {
        return res.status(400).send({ message: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ message })
    } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(400).send({ message })
    } else {
        return res.status(500).send({ message })
    }
}

export const recoverBody = (req) => {
    if (Object.entries(req.body).length) {
        return JSON.stringify(req.body)
    }
    return ' '
}

export const tokenExtractor = (req, _res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7)
    }
    next()
}