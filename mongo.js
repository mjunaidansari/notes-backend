const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://mjunaidansari:${password}@cluster0.ae72fqn.mongodb.net/noteApp?retryWrites=true&w=majority`

// setting strict query to false will save the fields in db even if not mentioned in schema 
mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String, 
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// saving a note object in db
// const note = new Note({
//     content: 'Junaid Ansari',
//     important: true,
// })

// note.save().then(result => {
//     console.log('result saved')
//     mongoose.connection.close()
// })

// fetching objects from db
Note.find({important: true}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})