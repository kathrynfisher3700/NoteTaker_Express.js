const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils");
const notes = require('express').Router();

//GET route for retrieving all current notes
notes.get('/api/notes', (req, res) => {
  console.log('please work');
    readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
  });

// GET Route for a specific note
notes.get('/notes/:notes_id', (req, res) => {
    const notesId = req.params.notes_id;
    readFromFile('./db/notes.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((notes) => notes.notes_id === notesId);
        return result.length > 0
          ? res.json(result)
          : res.json('something is wrong');
      });
  });
  
  // POST 
notes.post('/api/notes', (req, res) => {
    console.log(req.body);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        notes_id: uuidv4(),
      };
  
      readAndAppend(newNote, './db/notes.json');
      res.json(`Note added successfully`);
    } else {
      res.error('Error in adding note');
    }
  });

// DELETE Route for a specific tip
notes.delete('/api/notes/:notes_id', (req, res) => {
  const notesId = req.params.notes_id;
  console.log(notesId);
    readFromFile('./db/notes.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all tips except the one with the ID provided in the URL
        const result = json.filter((notes) => notes.notes_id !== notesId);
  
        // Save that array to the filesystem
        writeToFile('./db/notes.json', result);
  
        // Respond to the DELETE request
        res.json(`Item ${notesId} has been deleted 🗑️`);
      });
  });

module.exports = notes;