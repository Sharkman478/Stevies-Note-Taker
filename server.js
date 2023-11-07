const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for note`);
    readFromFile('../db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to submit note`);
  
    const { noteTitle, noteText } = req.body;
  
    if (noteTitle && noteText) {
      const newNote = {
        noteTitle,
        noteText,
        note_id: uuidv4(),
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