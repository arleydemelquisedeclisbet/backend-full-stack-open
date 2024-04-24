import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'is required'],
        minLength: [3, 'the minimum allowed length is (3)'],
        validate: { // esto asegura la unicidad de username
            validator: async username => {
                // Validar la unicidad del campo 'username' en la colección
                const count = await mongoose.model('User').countDocuments({ username });
                return count === 0; // Debe devolver true si el campo es único
            },
            message: ({ value }) => `expected username '${value}' to be unique`
        }  
    },
    name: {
        type: String,
        minLength: [5, 'the minimum allowed length is (5)']
    },
    passwordHash: {
        type: String,
        required: [true, 'is required'],
        minLength: [3, 'the minimum allowed length is (3)']
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
}).set('toJSON', {
    transform: (_document, returnedObject) => {
        const newId = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // el passwordHash no debe mostrarse
        delete returnedObject.passwordHash
        return { id: newId, ...returnedObject }
    }
})

const User = mongoose.model('User', userSchema)

export default User
