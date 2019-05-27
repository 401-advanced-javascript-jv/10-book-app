'use strict';

require('dotenv').config();

const superagent = require('superagent');
const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

// Mongoose models
const books = require('../models/books.js');
const bookshelves = require('../models/bookshelves.js');

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

function getBooks(req, res) {
  return books
    .get()
    .then((results) => {
      if (results.length === 0) {
        res.render('pages/searches/new');
      } else {
        res.render('pages/index', { books: results });
      }
    })
    .catch((err) => {
      handleError(err, res);
    });
}

function createSearch(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (req.body.search[1] === 'title') {
    url += `+intitle:${req.body.search[0]}`;
  }
  if (req.body.search[1] === 'author') {
    url += `+intitle:${req.body.search[0]}`;
  }

  superagent
    .get(url)
    .then((apiResponse) => {
      return apiResponse.body.items.map((bookResult) => {
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

function getBook(req, res) {
  getBookshelves().then((shelves) => {
    console.log(shelves);
  });
  // books
  //   .get(req.params.id)
  //   .then((result) => {
  //     console.log(result);
  //     // res.render('pages/books/show', {
  //     //   book: result[0]
  //     //   bookshelves:
  //     // })
  //     return result;
  //   })
  //   .populate('bookshelf_id')
  //   .catch((err) => {
  //     handleError(err, res);
  //   });
}

function getBookshelves() {
  bookshelves
    .get()
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((err) => {
      return err;
    });
}

function createShelf(shelf) {
  let normalizedShelf = shelf.toLowerCase();
  return bookshelves.Schema.find({ name: normalizedShelf }).then((results) => {
    if (results.length) {
      return results[0].id;
    } else {
      return bookshelves.post({name:shelf}).then((results) => {
        return results[0].id;
      })
    }
  });
}

function createBook(req, res) {
  createShelf(req.body.bookshelf)
    .then((bookshelf_id) => {
      let {title, author, isbn, image_url, description}=req.body;
      console.log(title,author,isbn,image_url,description,bookshelf_id);
      books.post({title, author, isbn, image_url, description, bookshelf_id})
        .then((results) => {console.log(results)});
    })
    .catch((err) => {
      handleError(err, res);
    });
}

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
