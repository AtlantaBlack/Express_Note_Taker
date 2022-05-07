const express = require("express");

const app = express();

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => res.send("set up"));

app.listen(PORT, () => console.log(`Server listening on port ${3001}`));