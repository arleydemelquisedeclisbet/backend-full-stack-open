import Blog from "../models/blog.js"
import Person from "../models/person.js"
import User from "../models/user.js"
import jwt from 'jsonwebtoken'
import { SECRET } from "../utils/config.js"

export const initialAuthores = [
    {
        _id: "66271cc145592ffb7e99d41b",
        username: "Michael Chan",
        name: "Michael Chan",
        password: "password1"
    },
    {
        _id: "66271cae63b347a706c26613",
        username: "Edsger W. Dijkstra",
        name: "Edsger W. Dijkstra",
        password: "password2"
    },
    {
        _id: "66271ce6195dee3b2bb1aa6f",
        username: "Robert C. Martin",
        name: "Robert C. Martin",
        password: "password3"
    }

]

export const initialBlogs = [
    {
        id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "66271cc145592ffb7e99d41b",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "66271cae63b347a706c26613",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
    },
    {
        id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "66271cae63b347a706c26613",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    },
    {
        id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "66271ce6195dee3b2bb1aa6f",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
    },
    {
        id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "66271ce6195dee3b2bb1aa6f",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
    },
    {
        id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "66271ce6195dee3b2bb1aa6f",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }
]

export const initialPersons = [
    {
        id: "5a422a851b54a676234d17f7",
        name: "Michael",
        number: "222-22222222"
    },
    {
        id: "5a422aa71b54a676234d17f8",
        name: "Chan",
        number: "333-22222222"
    },
    {
        id: "5a422b3a1b54a676234d17f9",
        name: "Edsger",
        number: "44-22222222"
    },
    {
        id: "5a422b891b54a676234d17fa",
        name: "W. Dijkstra",
        number: "55-22222222"
    },
    {
        id: "5a422ba71b54a676234d17fb",
        name: "Martin",
        number: "666-22222222"
    },
    {
        id: "5a422bc61b54a676234d17fc",
        name: "Robert C.",
        number: "77-22222222"
    }
]

export const nonExistingId = async () => {
    const blog = new Blog({ title: "willremovethissoon", author: "661ee91dbbec40f1d5042a40", url: "test", likes: 0 })
    await blog.save()
    const id = blog._id
    await Blog.findByIdAndDelete(id)

    return id.toString()
}

export const getBlogsInDb = async () => {
    const blogs = await Blog.find()
    return blogs.map(blog => blog.toJSON())
}

export const getBlogByIdInDb = async id => {
    const blog = await Blog.findById(id).populate('author', { username: 1, name: 1 })
    return blog.toJSON()
}

export const getPersonsInDb = async () => {
    const persons = await Person.find()
    return persons.map(person => person.toJSON())
}

export const getPersonByIdInDb = async id => {
    const person = await Person.findById(id)
    return person.toJSON()
}

export const getUsersInDb = async () => {
    const users = await User.find()
    return users.map(user => user.toJSON())
}

export const getUserByIdInDb = async id => {
    const user = await User.findById(id)
    return user.toJSON()
}

export const getTokenValid = () => {
    const { _id: id, username } = initialAuthores[0]
    return jwt.sign({ id, username }, SECRET, { expiresIn: 60 * 60 })
}