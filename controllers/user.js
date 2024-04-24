import { Router } from 'express'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import { info } from '../utils/logger.js'

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

    const saltRounds = 10

    try {
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
