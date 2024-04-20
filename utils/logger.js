
export const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') console.info(...params)
}

export const error = (...params) => {
    if (process.env.NODE_ENV !== 'test')console.error(...params)
}