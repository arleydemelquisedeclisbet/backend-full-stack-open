import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import express from 'express'
import User from '../models/user.js'
import { SECRET } from '../utils/config.js'

const loginRouter = express.Router()

loginRouter.post('/', async (req, res) => {

    const { username, password } = req.body

    const user = await User.findOne({ username })
    const passwordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            message: 'invalid username or password',
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60*60 })

    res.status(200).send({ token, username: user.username, name: user.name })
})

export default loginRouter
