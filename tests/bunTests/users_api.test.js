import User from '../../models/user.js'
import { test as bunTest, afterAll, expect, beforeEach, describe } from 'bun:test'
import { getUsersInDb, initialAuthores } from '../test_helper.js'
import app from '../../app.js'
import supertest from 'supertest'
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

    bunTest('creation succeeds with a fresh username', async () => {
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
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames.includes(newUser.username)).toStrictEqual(true)
    })
})

// La desconexión de la base de datos está en el último archivo que se ejecuta en el script
