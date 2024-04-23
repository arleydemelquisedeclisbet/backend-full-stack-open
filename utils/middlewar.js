import { error as loggerError } from "./logger.js"

export const unknownEndpoint = (_req, res) => {
    return res.status(404).send({ error: 'unknown endpoint' })
}

export const errorHandler = (error, _idreq, res, next) => {
    loggerError('Error: ', error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ message: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ message: error.message })
    } else {
        return res.status(500).send({ message: error.message ?? 'internal server error' })
    }
}

export const recoverBody = (req) => {
    if (Object.entries(req.body).length) {
        return JSON.stringify(req.body)
    }
    return ' '
}