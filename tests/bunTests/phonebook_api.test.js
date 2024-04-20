import { test as bunTest, afterAll, expect, beforeEach, describe } from 'bun:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Person from '../../models/person.js'

const api = supertest(app)

const initialPersons = [{ name: 'Isaac', number: '43-8939393993', }, { name: 'Wilmar', number: '231-534545353', }]

describe('Testing nothebook api', () => {

    bunTest('persons are returned as json', async () => {
        await api
            .get('/api/persons')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    bunTest('there are two persons', async () => {
        const { body } = await api.get('/api/persons')
        expect(body.length).toEqual(2)
    })
    
    beforeEach(async () => {
        await Person.deleteMany({})
        let personObject = new Person(initialPersons[0])
        await personObject.save()
        personObject = new Person(initialPersons[1])
        await personObject.save()
    })
    
    afterAll(async () => {
        await mongoose.connection.close()
    })
})
