const notesRouter = require('express').Router()
const Note = require('../models/note')

// getting all the notes
notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

// getting single note
notesRouter.get('/:id', async (request, response, next) => {
    // Note
    //     .findById(request.params.id)
    //     .then(note => {
    //         if(note)
    //             response.json(note)
    //         else 
    //             response.status(404).end()
    //     })
    //     .catch(error => next(error))
    
    // try {
    //     const note = await Note.findById(request.params.id)
    //     if(note)
    //         response.json
    //     else
    //         response.status(404).end()
    // } catch(exception) {
    //     next(exception)
    // }

    // the try-catch block is eliminated with the help of 'express-async-errors' library
    const note = await Note.findById(request.params.id)
        if(note)
            response.json
        else
            response.status(404).end()
})

// creating a note
notesRouter.post('/', async (request, response, next) => {
    const {content, important} = request.body

    const note = new Note({
        content: content,
        important: important,
    })

    // note
    //     .save()
    //     .then(savedNote => {
    //         response.status(201).json(savedNote)
    //     })
    //     .catch(error => next(error))

    // try {
    //     const savedNote = await note.save()
    //     response.status(201).json(savedNote)
    // } catch(exception) {
    //     next(exception)
    // }

    const savedNote = await note.save()
    response.status(201).json(savedNote)
})

// deleting a note
notesRouter.delete('/:id', async (request, response, next) => {
    // Note
    //     .findByIdAndDelete(request.params.id)
    //     .then(() => {
    //         response.status(204).end()
    //     })
    //     .catch(error => next(error))

    // try {
    //     await Note.findByIdAndDelete(request.params.id)
    //     response.status(204).end()
    // } catch(exception) {
    //     next(exception)
    // }

    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

// updating a note
notesRouter.put('/:id', async (request, response, next) => {
    const {content, important} = request.body

    const note = {
        content: content,
        important: important,
    }

    // Note
    //     .findByIdAndUpdate(request.params.id, note, {runValidators: true, new: true, context: 'query'})
    //     .then(updatedNote => {
    //         response.json(updatedNote)
    //     })
    //     .catch(error => next(error))

    const updatedNote = await Note.findByIdAndDelete(request.params.id, note, {runValidators: true, new: true, context: query})
    response.json(updatedNote)
})

module.exports = notesRouter