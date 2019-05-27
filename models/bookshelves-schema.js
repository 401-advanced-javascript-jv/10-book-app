'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const Schema = mongoose.Schema;

const bookshelves = new Schema({
  _id: { type: Schema.Types.ObjectId, alias: 'id' },
  name: { type: String, required: true },
});

module.exports = mongoose.model('bookshelves', bookshelves);
