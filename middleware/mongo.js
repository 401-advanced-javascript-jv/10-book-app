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
const book = require('../models/book.js');
const bookshelf = require('../models/bookshelf.js');

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

/**
 * Queries database for books. If there are books, it renders the results
 * to the front end. If there are no books, it displays a new search.
 * @param {*} res HTTP Response object
 */
function getBooks(_, res) {
  book
    .get()
    .then((results) => {
      if (results.length === 0) {
        newSearch(_, res);
      } else {
        // Add each book's bookshelf name to the book for the front end
        let display = results.map((result) => {
          result.bookshelf = result.name[0].name;
          return result;
        });
        res.render('pages/index', { books: display });
      }
    })
    .catch((err) => {
      handleError(err, res);
    });
}

/**
 * Route handler for searches. Uses req.body.search for query data.
 * Renders the search results to the front end
 * @param {String} req.body.search[0] Query to search
 * @param {String} req.body.search[1] 'title' or 'author' - selects which
 * field to search on
 * @param {*} req HTTP Request object
 * @param {*} res HTTP Response object
 */
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

/**
 * Renders 'pages/searches/new' to the front end
 * @param {*} res HTTP Response object
 */
function newSearch(_, res) {
  res.render('pages/searches/new');
}

/**
 * Gets a single book from the databse an renders it to the front end
 * @param {*} req HTTP Request object
 * @param {*} res HTTP Response object
 */
function getBook(req, res) {
  let bookId = req.params.id;
  getBookshelves()
    .then((shelves) => {
      return book.get(bookId).then((result) => {
        // Front end uses the .bookshelf property of the result
        // to print current book's bookshelf
        result[0].bookshelf = result[0].name[0].name;
        res.render('pages/books/show', {
          book: result[0],
          bookshelves: shelves,
        });
      });
    })
    .catch((err) => {
      handleError(err, res);
    });
}

/**
 * Gets a list of bookshelves available
 */
function getBookshelves() {
  return bookshelf
    .get()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}

/**
 * Takes a string for a shelf name. If that name exists, this returns the
 * existing shelf's id. Otherwise, creates a new shelf in the database and
 * returns its id.
 * @param {String} shelf Name of the shelf to create
 * @returns {String} id of the shelf created or found
 */
function createShelf(shelf) {
  return bookshelf.Schema.find({ name: shelf })
    .then((results) => {
      if (results.length) {
        return results[0].id;
      } else {
        return bookshelf.post({ name: shelf }).then((result) => {
          return result.id;
        });
      }
    })
    .catch((err) => {
      return err;
    });
}

/**
 * Route handler for posting a new book to the database.
 * @param {*} req Request object
 * @param {*} res Response object
 */
function createBook(req, res) {
  // Should sanitize the input here, user can input any string.
  createShelf(req.body.bookshelf)
    .then((bookshelf_id) => {
      let { title, author, isbn, image_url, description } = req.body;
      book
        .post({ title, author, isbn, image_url, description, bookshelf_id })
        .then((result) => {
          res.redirect(`/books/${result.id}`);
        });
    })
    .catch((err) => {
      handleError(err, res);
    });
}

/**
 * Route handler for updating a book in the database.
 * @param {String} req.params.id Database ID of the book to update
 * @param {String} req.body.title New book title
 * @param {String} req.body.author New book author
 * @param {String} req.body.isbn New ISBN
 * @param {String} req.body.image_url New image URL
 * @param {String} req.body.description New description
 * @param {String} req.body.bookshelf_id New database ID of the bookshelf this
 * book should sit on
 * @param {*} req HTTP Request object
 * @param {*} res HTTP Response object
 */
function updateBook(req, res) {
  let { title, author, isbn, image_url, description, bookshelf_id } = req.body;
  let id = req.params.id;
  book
    .put(id, { title, author, isbn, image_url, description, bookshelf_id })
    .then(res.redirect(`/books/${id}`))
    .catch((err) => {
      handleError(err, res);
    });
}

/**
 * Takes a book id from the request object's .params property, and deletes
 * that book from the database, then sends the user back to the index.
 * @param {*} req HTTP Request object
 * @param {*} res HTTP Response Object
 */
function deleteBook(req, res) {
  let id = req.params.id;

  return book
    .delete(id)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      handleError(err, res);
    });
}

/**
 * Renders the error to the front end in a semi-friendly way. Contains the
 * error message inside our UI instead of letting the browser handle it.
 * @param {*} err Error object
 * @param {*} res HTTP Response object
 */
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
