
export const dummy = _blogs => {
    return 1
}

export const totalLikes = blogs => blogs.reduce((acc, blog) => acc + blog.likes, 0)

export const favoriteBlog = blogs => {
    return blogs.reduce((previous, current) => {
        const { title, author, likes } = previous.likes > current.likes ? previous : current
        return { title, author, likes }
    })
}

export const mostBlogs = blogs => {

    // Stores entries of the form: { 'authorname': numberOfBlogs }
    const authoresObject = {}

    blogs.forEach(blog => {
        // The number of blogs is updated if the author already exists or starts at 1 if it does not exist within authoresObject..
        authoresObject[blog.author] = authoresObject[blog.author] ? authoresObject[blog.author] + 1 : 1
    })

    // return the author with the most entries or blogs.
    return Object.entries(authoresObject).reduce((prev, current) => {
        return prev[1] > current[1]
            ? { author: prev[0], blogs: prev[1] }
            : { author: current[0], blogs: current[1] }
    })    
}