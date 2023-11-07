const express = require('express');
const path = require('path');
const api = require('./routes/index.js');
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);
app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '../public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '../public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for note`);
    readFromFile('../db/db.json').then((data) => res.json(JSON.parse(data)));
});

// include file path for the db.json and need to read the file and write the file

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to submit note`);
  
    // Destructuring assignment for the items in req.body
    const { noteTitle, noteText } = req.body;
  
    // If all the required properties are present
    if (noteTitle && noteText) {
      // Variable for the object we will save
      const newNote = {
        noteTitle,
        noteText,
        note_id: uuid(),
      };
  
      readAndAppend(newNote, '../db/db.json');
  
      const noteResponse = {
        status: 'success',
        body: newNote,
      };
  
      res.json(noteResponse);
    } else {
      res.json('Error in posting note');
    }
  });


app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);