require('dotenv').config()

const express = require('express')
const cors = require('cors') // for Cross Origin Resouse Sharing

const Note = require('./models/note')

const app = express()

/* ---MIDDLEWARE PART--- */

// middleware for logging requests
const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    next() // yeilds control to the next middleware
}
  
// middleware for unknownrequests
const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

// middleware for error handling (are defined with four parameters)
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError')
        return response.status(400).send({error: 'malformatted id'})
    else if (error.name === 'ValidationError')
        return response.status(400).json({error: error.message})

    next(error)
}

//middleware are called in order they are taken into use
app.use(express.static('build'))
app.use(cors())
app.use(express.json()) // middleware for parsing json data and assigning it to request object as body parameter
app.use(requestLogger) //used after json-parser because body parameter is provided by json-parser

let notes = [
    {
        "id": 1,
        "content": "HTML is easy",
        "important": true
    },
    {
        "id": 2,
        "content": "Browser can execute only JavaScript",
        "important": false
    },
    {
        "id": 3,
        "content": "GET and POST are the most important methods of HTTP protocol",
        "important": true
    },
    {
        "content": "qqq",
        "important": true,
        "id": 4
    },
    {
        "content": "abc",
        "important": false,
        "id": 5
    },
    {
        "content": "abcf",
        "important": false,
        "id": 6
    },
    {
        "content": "this is a sample note",
        "important": false,
        "id": 7
    },
    {
        "content": "notes",
        "important": false,
        "id": 8
    },
    {
        "content": "hehe",
        "important": false,
        "id": 9
    },
    {
        "content": "hello ",
        "important": true,
        "id": 10
    },
    {
        "content": "hii",
        "important": true,
        "id": 11
    },
    {
        "content": "adsf",
        "important": false,
        "id": 12
    }
]

/* ---HANDLERS FOR VARIOUSE ENDPOINTS--- */

app.get('/', (request, response) => {
    response.send('<h1>Backend for Notes</h1>')
})

//to get all the notes
app.get('/api/notes', (request, response) => {
    // fetching all the notes from db
    Note
        .find({})
        .then(notes => {
            response.json(notes)
        })
})

//to get the specified note
app.get('/api/notes/:id', (request, response, next) => {
    //id is received in string and should be parsed for comparison
    const id = request.params.id
    Note
        .findById(id)
        .then(note => {
            if(note) 
                response.json(note)
            else 
                reponse.status(404).end()
        })
        .catch(error => next(error))
})

//to delete the specified note
app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note
        .findByIdAndRemove(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

//to create a note
app.post('/api/notes', (request, response, next) => {
    const body = request.body
    console.log(body)

    const note = new Note({
        content: body.content, 
        important: body.important || false,
    })

    note
        .save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
})

// to update a note
app.put('/api/notes/:id', (request, response, next) => {
    const {content, important} = request.body
    const id = request.params.id

    // notice the note is created without using Note constructor
    const note = {
        content: body.content,
        important: body.important,
    }

    Note
        .findByIdAndUpdate(id, note, {new: true, runValidators: true, context: 'query'}) // new: true is used to indicate that updatedNote is returned, runValidators is used for validating data against schema
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})