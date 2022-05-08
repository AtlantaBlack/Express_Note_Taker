// import modules, etc
const express = require('express');
const path = require('path');

const db = require('./db/db.json');

// import for notes
const { v4: uuid } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile
} = require('./helpers/fsUtils');
const { fstat } = require('fs');

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

    const newNote = {
        id: uuid(),
        title: req.body.title,
        text: req.body.text
    };

    console.log(newNote);

    const { id, title, text } = newNote;

    if (id && title && text) {


        // const writeToFile = (destination, content) =>
        // fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        //     err ? console.error(err) : console.info(`\nData written to ${destination}`)
        // );


        readAndAppend(newNote, './db/db.json');
        res.json(`Note added!`);
    }

    

})


// activate the server
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));