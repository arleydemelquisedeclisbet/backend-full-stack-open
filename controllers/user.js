import { Router } from 'express'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import { info } from '../utils/logger.js'
import { isValidLength } from '../utils/validations.js'

const usersRouter = Router()

usersRouter.get('/', async (_req, res) => {
    const users = await User.find().populate('blogs', { url: 1, title: 1, likes: 1 })
    res.send(users)
})

usersRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const userFound = await User.findById(id)

        return userFound
            ? res.send(userFound)
            : res.status(404).send('Not found')
    } catch (error) {
        next(error)
    }
})

usersRouter.delete('/:id', async (req, res, next) => {

    const { id } = req.params

    try {
        return await User.findByIdAndDelete(id)
            ? res.status(204).end()
            : res.status(404).send('Not found')
    } catch (error) {
        next(error)
    }
})

usersRouter.post('/', async (req, res, next) => {

    const { username, name, password } = req.body
    
    if (!username || !password) {
        return res.status(400).send({ message: 'username and password are required' })
    }

    if (!isValidLength(password, 3)) {
        return res.status(400)
            .send({ message: 'User validation failed: password: the minimum allowed length is (3)' })
    }
    
    try {
        const saltRounds = 10
        const user = new User({
            username,
            name,
            passwordHash: await bcrypt.hash(password, saltRounds),
        })
    
        const savedUser = await user.save()
        
        info(`User ${savedUser.name} successfully added`)
        return res.status(201).send(savedUser)        
    } catch (error) {
        next(error)
    }
})

export default usersRouter
