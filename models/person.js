import mongoose from "mongoose";

mongoose.set("strictQuery", false);

try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.info("Conectado a MongoDB");
} catch (error) {
    console.error("No se pudo conectar a la base de datos: ", error);
    process.exit(1);
}

const personSchema = new mongoose.Schema({
    name:  { 
        type: String, 
        minLength: [3, 'the minimum allowed length is (3)'] 
    },
    number: String,
}).set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model("Person", personSchema);
