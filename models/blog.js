import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    title:  { 
        type: String,
        minLength: [3, 'the minimum allowed length is (3)'],
        required: [true, 'is required'],
        validate: {
            validator: async title => {
                // Validar la unicidad del campo 'title' en la colección
                const count = await mongoose.model('Blog').countDocuments({ title });
                return count === 0; // Debe devolver true si el campo es único
            },
            message: ({ value }) => `expected title '${value}' to be unique`
        }
    },
    author:  { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'is required']
    },
    url: {
        type: String,
        required: [true, 'is required']
    },
    likes: {
        type: Number,
        default: 0
    }
}).set('toJSON', {
    transform: (_document, returnedObject) => {
        const newId = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

        return { id: newId, ...returnedObject }
    },
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog
