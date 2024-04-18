import { Router } from "express"
import Person from "../models/person.js"
import { info } from "../utils/logger.js"

const personsRouter = Router()

personsRouter.get('/', async (_req, res) => {
    const persons = await Person.find()
    res.send(persons)
})

personsRouter.get('/info', async (_req, res) => {
    const numberOfRegisters = await Person.countDocuments()
    const message = `Phonebook has info for ${numberOfRegisters} people`
    const dateRequest = new Date()
    res.send({ message, numberOfRegisters, dateRequest })
})

personsRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const personFound = await Person.findById(id)

        return personFound
            ? res.send(personFound)
            : res.status(404).send('Not found')
    } catch (error) {
        next(error)
    }
})

personsRouter.delete('/:id', async (req, res, next) => {

    const { id } = req.params

    try {
        return await Person.findByIdAndDelete(id)
            ? res.status(204).end()
            : res.status(404).send('Not found')
    } catch (error) {
        next(error)
    }
})

personsRouter.post('', async (req, res, next) => {

    const { body: { name, number } } = req

    if ((await Person.find({ name })).length) {
        return res.status(400).send({ error: 'The name already exists in the phonebook' })
    }

    const newPerson = new Person({ name, number })

    try {
        await newPerson.save()
        info(`Added ${name} number ${number} to phonebook`)
        res.status(201).send(newPerson)
    } catch (error) {
        next(error)
    }

})

personsRouter.put('/:id', async (req, res, next) => {

    const { id } = req.params
    const { body: { name, number } } = req

    try {
        const newPerson =  await Person.findByIdAndUpdate(
            id, { name, number }, { new: true, runValidators: true, context: 'query' }
        )
        return newPerson
            ? res.send(newPerson)
            : res.status(404).send('Not found')
    } catch (error) {
        next(error)
    }
})

export default personsRouter
