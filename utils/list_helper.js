
export const dummy = _blogs => {
    return 1
}

export const totalLikes = blogs => blogs.reduce((acc, blog) => acc + blog.likes, 0)

export const favoriteBlog = blogs => {
    return blogs.reduce((prev, current) => {
        const { title, author, likes } = prev.likes > current.likes ? prev : current
        return { title, author, likes }
    })
}

export const mostBlogs = inBlogs => {

    // Stores entries of the form: { 'authorname': numberOfBlogs }
    const authoresObject = {}

    inBlogs.forEach(blog => {
        // The number of blogs is updated if the author already exists or starts at 1 if it does not exist within authoresObject
        authoresObject[blog.author] = authoresObject[blog.author] ? authoresObject[blog.author] + 1 : 1
    })

    const [ author, blogs ] = Object.entries(authoresObject).reduce((prev, current) => prev[1] > current[1] ? prev : current)

    // return the author with the most entries or blogs.
    return { author, blogs }
}

export const mostLikes = blogs => {

    // Stores entries of the form: { 'authorname': numberOfLikes }
    const authoresObject = {}

    blogs.forEach(blog => {
        // The number of likes is updated if the author already exists or starts at blog.likes if it does not exist within authoresObject
        authoresObject[blog.author] = authoresObject[blog.author] ? authoresObject[blog.author] + blog.likes : blog.likes
    })

    const [ author, likes ] = Object.entries(authoresObject).reduce((prev, current) => prev[1] > current[1] ? prev : current)
    // return the author with the most entries or likes.
    return  { author, likes }
}