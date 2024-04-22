import Blog from "../models/blog.js"
import Person from "../models/person.js"

export const initialBlogs = [
    {
        id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
    },
    {
        id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    },
    {
        id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
    },
    {
        id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
    },
    {
        id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
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
    const blog = new Blog({ title: "willremovethissoon", author: "test", url: "test", likes: 0 })
    await blog.save()
    const _id = blog._id
    await blog.deleteOne({ _id })

    return _id.toString()
}

export const getBlogsInDb = async () => {
    const blogs = await Blog.find()
    return blogs.map(blog => blog.toJSON())
}

export const getBlogByIdInDb = async id => {
    const blog = await Blog.findById(id)
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