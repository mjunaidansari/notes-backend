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
    
    const noteObjects = helper.initialNotes.map(
        note => new Note(note)
    )
    
    // array of promisses that will be executed as a single promise
    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)

}, 100000)

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('test all the notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
}, 100000)

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
        'Browser can execute only JavaScript'
    )
}, 100000)

test('a valid note can be added', async () => {
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
}, 100000)

test('note wihtout content is not added', async () => {
    const newNote = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
}, 100000)

test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(resultNote).toEqual(noteToView)
}, 100000)

test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api 
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const notesAtEnd = await helper.notesInDb()
    
    expect(notesAtEnd).toHaveLength(notesAtStart.length - 1)

    const contents = notesAtEnd.map(note => note.content)

    expect(contents).not.toContain(noteToDelete.content)
}, 100000)

afterAll(async () => {
    await mongoose.connection.close()
})