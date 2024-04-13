import express from 'express'
import datos from './datos.js'

const app = express()

app.get('/api/persons', (_req, res) => {
    res.send(datos)
})

const PORT = 3001

app.listen(PORT, () => {
    console.info(`Servidor escuchando en el puerto: ${PORT}`)
})
