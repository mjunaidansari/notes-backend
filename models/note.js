const mongoose = require('mongoose')

// setting strict query to false will save the fields in db even if not mentioned in schema 
mongoose.set('strictQuery', false)

// url will be accesssed from env variables, dotenv library is used with .env file at root directory to delacre env variables
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
    .connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to the MongoDB:', error.message)
    })

// creating a schema for note docs
const noteSchema = new mongoose.Schema({
    content: { // schema definition with validation
        type: String, 
        minLength: 5,
        required: true
    }, 
    important: Boolean,
})

// transforming the incoming document into JSON having _id changed to id and removing the __v versioning field
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => { // document = incoming doc, returnedObject = transformed object that is returned
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
// creating and exporting a contructor for note docs with reference to above schema
module.exports = mongoose.model('Note', noteSchema)
