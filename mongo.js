import mongoose from 'mongoose'

if (process.argv.length < 3) {
    console.error('Give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fervercar9:${password}@cluster0.hms5hkw.mongodb.net/helsinky`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

try {
    await mongoose.connect(url)
} catch (error) {
    console.error('No se pudo conectar a la base de datos: ', error)
    process.exit(1)
}

// Desde consola ejecutar bun mongo.js <password>
// Desde consola ejecutar node mongo.js <password>
if (process.argv.length === 3) {

    const persons = await Person.find()

    if (persons.length) {
        console.info('Phonebook:')
        persons.forEach(p => {
            console.info(`${p.name} ${p.number}`)
        })
    }
    mongoose.connection.close()
}

// Desde consola ejecutar bun mongo.js <password> <name> <number>
// Desde consola ejecutar node mongo.js <password> <name> <number>
if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({ name, number })

    try {
        await person.save()
        console.info(`Added ${name} number ${number} to phonebook`)
    } catch (error) {
        console.error('Error to save in notebook: ', error)
    } finally {
        mongoose.connection.close()
    }
}
