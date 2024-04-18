
export const dummy = blogs => {
    return 1
}

export const totalLikes = blogs => blogs.reduce((acc, blog) => acc + blog.likes, 0)