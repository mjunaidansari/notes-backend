const express = require('express')
const cors = require('cors')

const app = express()


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

//middleware are called in order they are taken into use
app.use(cors())
app.use(express.json()) // middleware for parsing json data and assigning it to request object as body parameter
app.use(requestLogger) //used after json-parser because body parameter is provided by json-parser

app.use(express.json())

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

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

//to get all the notes
app.get('/api/notes', (request, response) => {
    response.json(notes)
})

//to get the specified note
app.get('/api/notes/:id', (request, response) => {
    //id is received in string and should be parsed for comparison
    const id = Number(request.params.id)
    const note = notes.find(note => {
        console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })
    console.log(note)
    if(note) response.json(note)
    else response.status(404).end()
    //here end() method is used to send the response without data
})

//to delete the specified note
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

//receive a note
const generateId = () => {
    const maxId = notes.length > 0
    // the spread operator ... is used to give the array as separate numbers
    ? Math.max(...notes.map(n => n.id))
    : 0
    return maxId + 1
}
app.post('/api/notes', (request, response) => {
    const body = request.body
    console.log(body)

    if(!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content, 
        important: body.important || false,
        id: generateId()
    }

    notes = notes.concat(note)

    response.json(note)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})