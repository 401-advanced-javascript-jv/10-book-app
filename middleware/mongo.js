'use strict';

require('dotenv').config();

const superagent = require('superagent');
const mongoose = require('mongoose');

// Mongoose models
const Books = require('../models/books.js');
const Bookshelves = require('../models/bookshelves.js');

function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVEHL.jpg';

  this.title = info.title ? info.title : 'No title available';
  this.author = info.authors ? info.authors[0] : 'No author available';
  this.isbn = info.industryIdentifiers
    ? `ISBN_13 ${info.industryIdentifiers[0].identifier}`
    : 'No ISBN available';
  this.image_url = info.imageLinks
    ? info.imageLinks.smallThumbnail
    : placeholderImage;
  this.description = info.description
    ? info.description
    : 'No description available';
  // this.id = info.industryIdentifiers
  //   ? `${info.industryIdentifiers[0].identifier}`
  //   : '';
}

function getBooks(req, res) {}

function createSearch(req, res) {
  let url = `https://www.googleapis.com/books/v1/volume?q=`;

  if (req.body.search[1] === 'title') {
    url += `+intitle:${req.body.search[0]}`;
  }
  if (req.body.search[1] === 'author') {
    url += `+intitle:${req.body.search[0]}`;
  }

  superagent
    .get(url)
    .then((apiResponse) => {
      apiResponse.body.items.map((bookResult) => {
        return new Book(bookResult.volumeInfo);
      });
    })
    .then((results) => {
      res.render('pages/searches/show', { results: results });
    })
    .catch((err) => {
      handleError(err, res);
    });
}

function newSearch(req, res) {
  res.render('pages/searches/new');
}

function getBook(req, res) {}

function getBookshelves() {}

function createShelf(shelf) {}

function createBook(req, res) {}

function updateBook(req, res) {}

function deleteBook(req, res) {
  let id = req.params.id;

  console.log(id);
  // return Books.delete(id)
  //   .then(() => {
  //     res.redirect('/');
  //   })
  //   .catch((err) => {
  //     handleError(err, res);
  //   });
}

function handleError(err, res) {
  res.render('pages/error', { error: err });
}

module.exports = exports = {
  getBooks,
  createSearch,
  newSearch,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
