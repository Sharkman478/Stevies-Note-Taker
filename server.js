const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  const filePath = './db/db.json';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Failed to read notes from the file.' });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
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
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => 
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated reviews!')
        )
      }
    })
    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});