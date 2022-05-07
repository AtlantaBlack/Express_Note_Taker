// import modules, etc
const express = require("express");
const path = require("path");

// make variable app for express
const app = express();

// set the port
const PORT = process.env.PORT || 3001;

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


// activate the server
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));