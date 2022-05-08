// import modules, etc
const express = require('express');
const path = require('path');
const notesRouter = require('./routes/api/notes');

// ----------------------------------

// set the port
const PORT = process.env.PORT || 3001;

// make variable app for express
const app = express();

// ----------------------------------

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve static pages
app.use(express.static(path.join(__dirname, 'public')));

// use router to send to api/notes where all the api functions are
app.use('/api/notes', notesRouter);

// ----------------------------------

// homepage route - note taker splash screen
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// notes page route - send to the note taker app
app.get('/notes', (req, res) =>              
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// wildcard route - redirect wrong urls to 404.html error page
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/404.html'))
);

// ----------------------------------

// activate the server
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));