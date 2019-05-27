'use strict';

const express = require('express');
const router = express.Router();
const pg = require('./pg.js');

// API Routes
router.get('/', pg.getBooks);
router.post('/searches', pg.createSearch);
router.get('/searches/new', pg.newSearch);
router.get('/books/:id', pg.getBook);
router.post('/books', pg.createBook);
router.put('/books/:id', pg.updateBook);
router.delete('/books/:id', pg.deleteBook);

router.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

module.exports = router;
