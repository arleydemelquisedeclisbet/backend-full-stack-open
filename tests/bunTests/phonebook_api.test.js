import { test as bunTest, afterAll, expect, beforeEach, describe } from 'bun:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Person from '../../models/person.js'
import { initialPersons, nonExistingId } from '../test_helper.js'

const api = supertest(app)

describe('Testing nothebook api', () => {

    beforeEach(async () => {
        await Person.deleteMany({})
        Person.insertMany(initialPersons)
    })

    describe('when there is initially some blogs saved', () => {
        bunTest('persons are returned as json', async () => {
            await api
                .get('/api/persons')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        bunTest('all persons are returned', async () => {
            const { body: persons } = await api.get('/api/persons')
            expect(persons.length).toEqual(initialPersons.length)
        })

        bunTest('a specific person is within the returned phonebook', async () => {
            const { body: blogs } = await api.get('/api/persons')

            const titles = blogs.map(blog => blog.name)
            expect(titles.includes('W. Dijkstra')).toBe(true)
        })
    })

    describe('viewing a specific person', async () => {
        bunTest('succeeds with a valid id', async () => {

            const { body: personsAsStart } = await api.get('/api/persons')

            const personExpected = personsAsStart[0]

            const { body: personResult } = await api
                .get(`/api/persons/${personExpected.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(personResult).toStrictEqual(personExpected)
        })

        bunTest('fails with statuscode 404 if blog does not exist', async () => {
            const validNonexistingId = await nonExistingId()

            await api
                .get(`/api/persons/${validNonexistingId}`)
                .expect(404)
        })

        bunTest('fails with statuscode 400 id is invalid', async () => {

            await api
                .get(`/api/persons/invalidId`)
                .expect(400)
        })
    })

    describe('addition of a new person in the phonebook', () => {
        
        bunTest('succeeds with valid data', async () => {

            const personToAdd = { name: 'Lili', number: '444-5667777' }

            await api
                .post('/api/persons').send(personToAdd)
                .expect(201)
                .expect('Content-Type', /application\/json/)
    
            const { body: personsAfter } = await api.get('/api/persons')
    
            expect(personsAfter.length).toEqual(initialPersons.length + 1)
        })

        bunTest('when the person name is repeated fails with status code 400', async () => {
            const { body: persons } = await api.get('/api/persons')
    
            const [, withRepeatedName] = persons
            await api
                .post('/api/persons').send(withRepeatedName)
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const { body: personsAfter } = await api.get('/api/persons')
    
            expect(personsAfter.length).toEqual(initialPersons.length)
        })

        bunTest('when the name is less than 3 characters fails with status code 400', async () => {

            const withIncompleteName = { name: 'Is', number: '444-5667777' }
    
            await api
                .post('/api/persons').send(withIncompleteName)
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const { body: personsAfter } = await api.get('/api/persons')
    
            expect(personsAfter.length).toEqual(initialPersons.length)
    
        })
    
        bunTest('when the number has invalid format fails with status code 400', async () => {
    
            const withMalformedNumber = { name: 'NameOk', number: '75849393883' }
    
            await api
                .post('/api/persons').send(withMalformedNumber)
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const { body: personsAfter } = await api.get('/api/persons')
    
            expect(personsAfter.length).toEqual(initialPersons.length)
        })
    
        bunTest('the unique identifier property of the person is named id', async () => {
            const { body: persons } = await api.get('/api/persons')
            const [person] = persons
            expect(person._id).toBeUndefined()
            expect(person).toHaveProperty('id')
        });
    })

    describe('deletion of a person', () => {
        bunTest('succeeds with status code 204 if id is valid', async () => {
            const { body: persons } = await api.get('/api/persons')
            const personToDelete = persons[0]

            await api
                .delete(`/api/persons/${personToDelete.id}`)
                .expect(204)

            const { body: personsAtEnd } = await api.get('/api/persons')

            expect(personsAtEnd.length).toBe(persons.length - 1)

            const names = personsAtEnd.map(r => r.name)
            expect(names.includes(personToDelete.name)).toBe(false)
        })

        bunTest('fails with statuscode 404 if person does not exist', async () => {
            const validNonexistingId = await nonExistingId()

            await api
                .delete(`/api/persons/${validNonexistingId}`)
                .expect(404)
        })
    })

    describe('update of a person in the phonebook', () => {
        
        bunTest('succeeds with valid data', async () => {

            const { body: persons } = await api.get('/api/persons')
            const [, personToUpdate ] = persons

            const newPerson = { name: personToUpdate.name, number: '444-5667777' }
            
            const { body: personUpdated } = await api
                .put(`/api/persons/${personToUpdate.id}`).send(newPerson)
                .expect(200)
                .expect('Content-Type', /application\/json/)
    
            const { body: personAfter } = await api.get(`/api/persons/${personToUpdate.id}`)
    
            expect(personAfter.number).toEqual(newPerson.number)
            expect(personAfter).toStrictEqual(personUpdated)
        })
    
        bunTest('when the number has invalid format fails with status code 400', async () => {
        
            const { body: persons } = await api.get('/api/persons')
            const [ personToUpdate ] = persons

            const newPerson = { name: personToUpdate.name, number: '75849393883' }
            
            await api
                .put(`/api/persons/${personToUpdate.id}`).send(newPerson)
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const { body: personsAfter } = await api.get('/api/persons')
    
            expect(personsAfter.length).toEqual(initialPersons.length)
        })
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
    
})
