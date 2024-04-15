import express from 'express'
import { isEmptyOrWhitespace } from './utils.js'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'

const app = express()

app.use(express.static('dist'))

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

//----------Init Rutes----------------//

app.get('/api/persons', async (_req, res) => {
    const persons = await Person.find();
    res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const personFound = datos.find(p => p.id === +id)

    return personFound
        ? res.send(personFound)
        : res.status(404).send('Not found')
})

app.delete('/api/persons/:id', async (req, res, next) => {

    const { id } = req.params
    
    try {    
        return await Person.findByIdAndDelete(id)
            ? res.status(204).end()
            : res.status(404).send('Not found')        
    } catch (error) {
        next(error)
    }
})

app.get('/info', (_req, res) => {
    const numberOfRegisters = datos.length
    const message = `Phonebook has info for ${numberOfRegisters} people`
    const dateRequest = new Date()
    res.send(`${message} <br/><br/> ${dateRequest}`)
})

app.post('/api/persons', async (req, res) => {

    const { body: { name, number } } = req

    if (isEmptyOrWhitespace(name) || isEmptyOrWhitespace(number)) {
        return res.status(400).send({ error: 'The name or number is missing' })
    }

    if ((await Person.find({ name })).length) {
        return res.status(400).send({ error: 'The name already exists in the phonebook' })       
    }

    const newPerson = new Person({ name, number });

    try {
        await newPerson.save();
        console.info(`Added ${name} number ${number} to phonebook`);
        res.status(201).send(newPerson)
    } catch (error) {
        const message = `Error to save in notebook: ${error.message}`
        console.error(message);
        res.status(500).send(message)
    }

})

app.put('/api/persons/:id', async (req, res, next) => {

    const { id } = req.params
    const { body: { name, number } } = req

    try {    
        const newPerson =  await Person.findByIdAndUpdate(id, { name, number }, { new: true })
        return newPerson
            ? res.send(newPerson)
            : res.status(404).send('Not found')        
    } catch (error) {
        next(error)
    }
})

//----------End Rutes----------------//

// Handle unknownEndpoint
app.use((_req, res) => {
    return res.status(404).send({ error: "unknown endpoint" })
})

// Handle errors
app.use((error, _idreq, res, next) => {
    console.error('Error: ', error.name)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id'})
    }
    next(error)
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.info(`Servidor escuchando en el puerto: ${PORT}`)
})
