import User from '../../models/user.js'
import { test as nodeTest, describe, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import { getUsersInDb, initialAuthores } from '../test_helper.js'
import app from '../../app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const api = supertest(app)

describe('when there is initially one user in db', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(initialAuthores.map(u => {
            u.passwordHash = bcrypt.hashSync(u.password, 10)
            return u
        }))
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
    
    nodeTest('fails with status code 400 if data is invalid', async () => {

        const userWithOutUsername = {
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
        
        const userWithOutPassword = {
            username: 'Edsger W. Dijkstra',
            name: 'Matti Luukkainen',
        }

        await api
            .post('/api/users')
            .send(userWithOutUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        await api
            .post('/api/users')
            .send(userWithOutPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

    })
    
    nodeTest('fails with status code 400 if length is invalid', async () => {

        const userWithUsernameInvalid = {
            username: 'Ed',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
        
        const userWithPasswordInvalid = {
            username: 'Edsger',
            name: 'Matti Luukkainen',
            password: 'sa',
        }

        await api
            .post('/api/users')
            .send(userWithUsernameInvalid)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        await api
            .post('/api/users')
            .send(userWithPasswordInvalid)
            .expect(400)
            .expect('Content-Type', /application\/json/)

    })
    
    nodeTest('fails with status code 400 if username already exists', async () => {
        const usersAtStart = await getUsersInDb()

        const newUser = {
            username: 'Edsger W. Dijkstra',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
})

after(async () => {
    await mongoose.connection.close()
})