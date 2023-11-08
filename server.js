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
  console.info(`${req.method} request received for note`);
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => {
      res.status(500).json({ error: 'Failed to read notes from the file.' });
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
    readAndAppend(newNote, './db/db.json')
      .then(() => {
        res.json(newNote);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to append the note to the file.' });
      });
  } else {
    res.status(400).json({ error: 'Missing noteTitle or noteText in the request body.' });
  }
});

// app.delete('/api/notes/:id', (req, res) => {
//   const noteId = req.params.id;
//   deleteNote(noteId, './db/db.json')
//     .then((message) => {
//       res.json({ message });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: 'Failed to delete the note from the file.' });
//     });
// });

const readFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, filePath), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const readAndAppend = (content, filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, filePath), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        fs.writeFile(path.join(__dirname, filePath), JSON.stringify(parsedData, null, 4), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
};

// const deleteNote = (noteId, filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path.join(__dirname, filePath), 'utf8', (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         let parsedData = JSON.parse(data);
//         parsedData = parsedData.filter((note) => note.note_id !== noteId);
//         fs.writeFile(path.join(__dirname, filePath), JSON.stringify(parsedData, null, 4), (err) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(`Note with id ${noteId} has been deleted.`);
//           }
//         });
//       }
//     });
//   });
// };

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});