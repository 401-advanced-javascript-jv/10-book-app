'use strict';

const mongoose = require('mongoose');

const bookshelves = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('bookshelves', bookshelves);
