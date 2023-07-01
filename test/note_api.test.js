const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')

// import the application
const app = require('../app')

// wrap it with supertest function to create a superagent object
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {

    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)

}, 100000)

describe('when there is initially some notes saved', () => {

    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('test all the notes are returned', async () => {
        const response = await api.get('/api/notes')
    
        expect(response.body).toHaveLength(helper.initialNotes.length)
    })
    
    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')
    
        const contents = response.body.map(r => r.content)
        expect(contents).toContain(
            'Browser can execute only JavaScript'
        )
    })

})

describe('viewing a specific note', () => {

    test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDb()
    
        const noteToView = notesAtStart[0]
    
        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(resultNote).toEqual(noteToView)
    })

    test('fails with the statuscode 404 of note does note exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = 'asdfe2334123jbhjbkja'

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    })

})

describe('addition of a new note', () => {
    
    test('succeeds with valid data', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        }
        
        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
    
        const contents = notesAtEnd.map(r => r.content)
        expect(contents).toContain(
            'async/await simplifies making async calls'
        )
    })

    test('fails with statuscode 400 if data is invalid', async () => {
        const newNote = {
            important: true
        }
    
        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)
    
        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })

})

describe('deletion of a note', () => {

    test('succeeds with a status code 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]
    
        await api 
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)
    
        const notesAtEnd = await helper.notesInDb()
        
        expect(notesAtEnd).toHaveLength(notesAtStart.length - 1)
    
        const contents = notesAtEnd.map(note => note.content)
    
        expect(contents).not.toContain(noteToDelete.content)
    })

})

afterAll(async () => {
    await mongoose.connection.close()
})