import mongoose from 'mongoose'
import { error as loggerError, info } from './utils/logger.js'
import Person from './models/person.js'

await connectToMongo()

// Desde consola ejecutar bun mongo.js <password>
// Desde consola ejecutar node mongo.js <password>
if (process.argv.length === 3) await findPersons()

// Desde consola ejecutar bun mongo.js <password> <name> <number>
// Desde consola ejecutar node mongo.js <password> <name> <number>
if (process.argv.length === 5) await addPerson()


async function addPerson() {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({ name, number })

    try {
        await person.save()
        info(`Added ${name} number ${number} to phonebook`)
    } catch (error) {
        loggerError('Error to save in notebook: ', error)
        process.exit(1)
    } finally {
        mongoose.connection.close()
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
    mongoose.connection.close()
}

async function connectToMongo() {
    
    if (process.argv.length < 3) {
        loggerError('Give password as argument')
        process.exit(1)
    }
    
    const password = process.argv[2]
    
    const url = `mongodb+srv://fervercar9:${password}@cluster0.hms5hkw.mongodb.net/helsinky`
    
    mongoose.set('strictQuery', false)

    try {
        await mongoose.connect(url)
    } catch (error) {
        loggerError('No se pudo conectar a la base de datos: ', error)
        process.exit(1)
    }
}
