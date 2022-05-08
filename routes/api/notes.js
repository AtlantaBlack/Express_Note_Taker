const express = require("express");
const router = express.Router();

// import for notes
const { v4: uuid } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile
} = require('../../helpers/fsUtils');

// NOTES API SECTION

// get all notes
router.get('', (req, res) => {
    console.info(`${req.method} request received to get notes`);
    readFromFile('./db/db.json').then(data => res.json(JSON.parse(data)));
});

// post a note
router.post('', (req, res) => {
    console.log(`${req.method} request received for new note`);
    console.log(req.body);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            "id": uuid(),
            title,
            text
        }

        console.log(newNote);

        readAndAppend(newNote, './db/db.json');
        res.status(201).json(`New note added!`);
    } else {
        res.status(400).json(`Make sure the note includes both a title and body of text.`);
    }
})

// delete a note
router.delete('/:id', (req, res) => {
    const noteId = req.params.id;

    readFromFile('./db/db.json')
        .then(data => JSON.parse(data))
        .then(json => {
            const updatedNotes = json.filter(note => note.id !== noteId);
            writeToFile('./db/db.json', updatedNotes);
            res.json(`Note ID ${noteId} successfully deleted`);
        })
})

module.exports = router;