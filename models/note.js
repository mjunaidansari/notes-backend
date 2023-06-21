const mongoose = require('mongoose')

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
