'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const Schema = mongoose.Schema;

const bookshelf = new Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('Bookshelf', bookshelf);
