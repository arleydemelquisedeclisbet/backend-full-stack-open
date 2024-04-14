import express from 'express'
import { idGenerator, isEmptyOrWhitespace } from './utils.js'
import morgan from 'morgan'
import cors from 'cors'
let datos = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const app = express()

app.use(cors())

app.use(express.json())

morgan.token('body', (req) => {
    if (Object.entries(req.body).length) {
        return JSON.stringify(req.body)
    }
    return ' '
})

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', (_req, res) => {
    res.send(datos)
})

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const personFound = datos.find(p => p.id === +id)

    return personFound
        ? res.send(personFound)
        : res.status(404).send('Not found')
})

app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params
    datos = datos.filter(p => p.id !== +id)

    res.status(204).end()
})

app.get('/info', (_req, res) => {
    const numberOfRegisters = datos.length
    const message = `Phonebook has info for ${numberOfRegisters} people`
    const dateRequest = new Date()
    res.send(`${message} <br/><br/> ${dateRequest}`)
})

app.post('/api/persons', (req, res) => {

    const { body: person } = req

    if (isEmptyOrWhitespace(person.name) || isEmptyOrWhitespace(person.number)) {
        return res.status(400).send({ error: 'The name or number is missing' })
    }

    if (datos.find(p => p.name === person.name)) {
        return res.status(400).send({ error: 'The name already exists in the phonebook' })       
    }

    const newPerson = { id: idGenerator(), ...person }
    datos = datos.concat(newPerson)
    res.status(201).send(newPerson)
})

app.use((_req, res) => {
    return res.status(404).send({ error: "unknown endpoint" })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.info(`Servidor escuchando en el puerto: ${PORT}`)
})
