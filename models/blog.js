import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title:  { 
        type: String,
        minLength: [3, 'the minimum allowed length is (3)'],
        required: [true, 'is required']
    },
    author:  { 
        type: String,
        minLength: [3, 'the minimum allowed length is (3)'],
        required: [true, 'is required']
    },
    url: String,
    likes: Number
}).set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model('Blog', blogSchema);