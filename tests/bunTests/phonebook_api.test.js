import { test as bunTest, afterAll, expect, beforeEach, describe } from 'bun:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Person from '../../models/person.js'

const api = supertest(app)

const initialPersons = [{ name: 'Isaac', number: '43-8939393993', }, { name: 'Wilmar', number: '231-534545353', }]
const personToAdd = { name: 'Lili', number: '444-5667777' }
const withRepeatedName = { name: 'Isaac', number: '444-5667777' }
const withIncompleteName = { name: 'Is', number: '444-5667777' }
const withMalformedNumber = { name: 'NameOk', number: '75849393883' }
const { body: persons } = await api.get('/api/persons')
const personsBefore = persons.length

describe('Testing nothebook api', () => {

    beforeEach(async () => {
        await Person.deleteMany({})
        let personObject = new Person(initialPersons[0])
        await personObject.save()
        personObject = new Person(initialPersons[1])
        await personObject.save()
    })

    bunTest('persons are returned as json', async () => {
        await api
            .get('/api/persons')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    bunTest('there are two persons', async () => {
        expect(persons.length).toEqual(2)
    })

    bunTest('the unique identifier property of the person is named id', async () => {
        const [ person ] = persons
        expect(person._id).toBeUndefined()
        expect(person).toHaveProperty('id')
    });

    bunTest('creates a new person in phonebook', async () => {
            
        await api
            .post('/api/persons').send(personToAdd)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const { body: personsAfter } = await api.get('/api/persons')

        expect(personsAfter.length).toEqual(personsBefore + 1)
    })

    bunTest('doesn`t create a person whe the name is repeated', async () => {
            
        await api
            .post('/api/persons').send(withRepeatedName)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const { body: personsAfter } = await api.get('/api/persons')

        expect(personsAfter.length).toEqual(personsBefore)
    })

    bunTest('name must be at least 3 characters long', async () => {
            
        await api
            .post('/api/persons').send(withIncompleteName)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const { body: personsAfter } = await api.get('/api/persons')

        expect(personsAfter.length).toEqual(personsBefore)

    })
    
    bunTest('phone number must be a valid format', async () => {
            
        await api
            .post('/api/persons').send(withMalformedNumber)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const { body: personsAfter } = await api.get('/api/persons')

        expect(personsAfter.length).toEqual(personsBefore)
    })
    
    afterAll(async () => {
        await mongoose.connection.close()
    })
})
