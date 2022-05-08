// import modules, etc
const express = require('express');
const path = require('path');

// const db = require('./db/db.json');

// import for notes
const { v4: uuid } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile
} = require('./helpers/fsUtils');
const { fstat, read } = require('fs');
const e = require('express');
const nodemon = require('nodemon');

// ----------------------------------

// set the port
const PORT = process.env.PORT || 3001;

// make variable app for express
const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// serve static pages
app.use(express.static(path.join(__dirname, 'public')));

// homepage route - note taker splash screen
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// notes page route - send to the note taker app
app.get('/notes', (req, res) =>              
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// NOTES API SECTION

// get all notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`);
    readFromFile('./db/db.json').then(data => res.json(JSON.parse(data)));
});

// post a note
app.post('/api/notes', (req, res) => {
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
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    readFromFile('./db/db.json')
        .then(data => JSON.parse(data))
        .then(json => {
                const updatedNotes = json.filter(note => note.id !== noteId);
                writeToFile('./db/db.json', updatedNotes);
                res.json(`Note ID ${noteId} successfully deleted`);
        })
})

// activate the server
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));