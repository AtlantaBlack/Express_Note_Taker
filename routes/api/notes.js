const express = require("express");
const router = express.Router();
const moment = require("moment");

// import for notes
const { v4: uuid } = require('uuid');
const { readFromFile, readAndAppend, writeToFile } = require('../../helpers/fsUtils');

// ----------------------------------

// get all notes
router.get('', (req, res) => {
    // log the get request in the console
    console.info(`\n••• ${moment().format('Do MMMM YYYY, h:mm:ss a')}\nReceived ${req.method} request to display notes.`);
    // read the notes using the helpful function
    readFromFile('./db/db.json').then(data => res.json(JSON.parse(data)));
});

// post a note
router.post('', (req, res) => {
    // log the post request in the console
    console.log(`\n••• ${moment().format('Do MMMM YYYY, h:mm:ss a')}\nReceived ${req.method} request for adding a new note.`);

    const { title, text } = req.body; // destructure the request body

    if (title && text) {
        // make a new note to include a unique idea
        const newNote = {
            "id": uuid(),
            title,
            text
        }
        // append the new note into the database
        readAndAppend(newNote, './db/db.json');
        // send a 201 OK! status and message
        res.status(201).json(`New note added!`);
    } else {
        // send 400 bad request status if something goes wrong
        res.status(400).json(`Make sure the note includes both a title and body of text.`);
    }
})

// delete a note
router.delete('/:id', (req, res) => {
    // log the delete request in the console
    console.log(`\n••• ${moment().format('Do MMMM YYYY, h:mm:ss a')}\nReceived ${req.method} request to delete a note.`);
    
    const noteId = req.params.id; // grab the id out of the request body

    // read the database
    readFromFile('./db/db.json')
        .then(data => JSON.parse(data))
        .then(json => {
            // make array for updated notes that has selected note filtered out
            const updatedNotes = json.filter(selectedNote => selectedNote.id !== noteId);
            // write the new array to the database
            writeToFile('./db/db.json', updatedNotes);
            // post a message saying selected note has been deleted
            res.json(`Note ID ${noteId} successfully deleted`);
        })
})

module.exports = router;