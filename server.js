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
 var noteText  = req.body.text;
 var noteTitle = req.body.title;
  console.log(noteTitle, noteText, "stsuefvusef");
  if (!noteTitle || !noteText) {
    return res.status(400).json({ error: 'Note title and text are required.' });
  }
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    note_id: uuidv4(),
  };
  const filePath = './db/db.json';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the file.' });
    }
    const parsedNotes = JSON.parse(data);
    parsedNotes.push(newNote);
    fs.writeFile(filePath, JSON.stringify(parsedNotes, null, 4), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update notes in the file.' });
      }
      const response = {
        status: 'success',
        body: newNote,
      };
      console.log(response);
      res.status(201).json(response);
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});