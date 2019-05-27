'use strict';

const mongoose = require('mongoose');

const books = mongoose.Schema({
  author: {type: String, required: true},
  title: {type: String, required: true},
  isbn: {type: String, required: false},
  image_url: {type: String, required: false},
  description: {type: String, required: false},
  bookshelf: {type: String, required: true},
});

module.exports = mongoose.model('books', books);
