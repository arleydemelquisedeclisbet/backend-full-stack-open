import User from '../../models/user.js'
import { test as nodeTest, describe, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import { getUsersInDb, initialAuthores } from '../test_helper.js'
import app from '../../app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'

const api = supertest(app)

describe('when there is initially one user in db', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(initialAuthores)
    })

    nodeTest('creation succeeds with a fresh username', async () => {
        const usersAtStart = await getUsersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
})

after(async () => {
    await mongoose.connection.close()
})