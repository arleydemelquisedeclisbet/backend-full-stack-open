import mongoose from 'mongoose'
import { error as loggerError, info } from './utils/logger.js'
import Person from './models/person.js'

await connectToMongo()

// Desde consola ejecutar bun mongoLocal.js
// Desde consola ejecutar node mongoLocal.js
if (process.argv.length === 2) await findPersons()

// Desde consola ejecutar bun mongoLocal.js <name> <number>
// Desde consola ejecutar node mongoLocal.js <name> <number>
if (process.argv.length === 4) await addPerson()


async function addPerson() {
    const name = process.argv[2]
    const number = process.argv[3]
    const person = new Person({ name, number })

    try {
        await person.save()
        info(`Added ${name} number ${number} to phonebook`)
    } catch (error) {
        loggerError('Error to save in notebook: ', error)
        process.exit(1)
    } finally {
        await mongoose.connection.close()
    }
}

async function findPersons() {    

    const persons = await Person.find()

    if (persons.length) {
        info('Phonebook:')
        persons.forEach(p => {
            info(`${p.name} ${p.number}`)
        })
    }
    await mongoose.connection.close()
}

async function connectToMongo() {

    const url = `mongodb://localhost:27017/helsinky`

    mongoose.set('strictQuery', false)

    try {
        await mongoose.connect(url)
    } catch (error) {
        loggerError('No se pudo conectar a la base de datos: ', error)
        process.exit(1)
    }
}

