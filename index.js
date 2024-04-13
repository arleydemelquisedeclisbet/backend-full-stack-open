import express from 'express'
import datos from './datos.js'

const app = express()

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

app.get('/info', (_req, res) => {
    const numberOfRegisters = datos.length
    const message = `Phonebook has info for ${numberOfRegisters} people`
    const dateRequest = new Date()
    res.send(`${message} <br/><br/> ${dateRequest}`)
})

const PORT = 3001

app.listen(PORT, () => {
    console.info(`Servidor escuchando en el puerto: ${PORT}`)
})
