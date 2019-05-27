'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const Schema = mongoose.Schema;

const books = new Schema(
  {
    _id: {type: Schema.Types.ObjectId, alias: 'id'},
    author: { type: String, required: true },
    title: { type: String, required: true },
    isbn: { type: String, required: true },
    image_url: { type: String, required: true },
    description: { type: String, required: true },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
books.virtual('bookshelf_id', {
  ref: 'bookshelves',
  localField: 'bookshelf_id',
  foreignField: 'id',
  justOne: false,
});

books.pre('find', function() {
  this.populate('bookshelf_id');
});

module.exports = mongoose.model('books', books);
