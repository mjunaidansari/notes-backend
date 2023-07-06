const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')

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

// isolates the token from authorization header
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    console.log(authorization)
    if(authorization && authorization.startsWith('bearer ')) {
        return authorization.replace('bearer ', '')
    }
    return null
}

notesRouter.post('/', async (request, response, next) => {
    const body = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id)
        return response.status(401).json({
            error: 'invalid token!'
        })

    const user = await User.findById(decodedToken.id)
    console.log(user)

    const note = new Note({
        content: body.content,
        important: body.important,
        user: user.id
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
    user.notes = user.notes.concat(savedNote)
    await user.save()

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

    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {runValidators: true, new: true, context: 'query'})
    response.json(updatedNote)
})

module.exports = notesRouter