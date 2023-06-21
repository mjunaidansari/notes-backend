const notesRouter = require('express').Router()
const Note = require('../models/note')

// getting all the notes
notesRouter.get('/', (request, response) => {
    Note
        .find({})
        .then(notes => {
            response.json(notes)
        })
})

// getting single note
notesRouter.get('/:id', (request, response, next) => {
    Note
        .findById(request.params.id)
        .then(note => {
            if(note)
                response.json(note)
            else 
                response.status(404).end()
        })
        .catch(error => next(error))
})

// creating a note
notesRouter.post('/', (request, response, next) => {
    const {content, important} = request.body

    const note = new Note({
        content: content,
        important: important,
    })

    note
        .save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
})

// deleting a note
notesRouter.delete('/:id', (request, response, next) => {
    Note
        .findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// updating a note
notesRouter.put('/:id', (request, response, next) => {
    const {content, important} = request.body

    const note = {
        content: content,
        important: important,
    }

    Note
        .findByIdAndUpdate(request.params.id, note, {runValidators: true, new: true, context: 'query'})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

module.exports = notesRouter