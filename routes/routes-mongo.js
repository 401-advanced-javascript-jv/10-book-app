'use strict';

const express = require('express');
const router = express.Router();

const mongo = require('../middleware/mongo.js');

// API Routes
router.get('/', mongo.getBooks);
router.post('/searches', mongo.createSearch);
router.get('/searches/new', mongo.newSearch);
router.get('/books/:id', mongo.getBook);
router.post('/books', mongo.createBook);
router.put('/books/:id', mongo.updateBook);
router.delete('/books/:id', mongo.deleteBook);

router.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

module.exports = router;
