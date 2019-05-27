'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');
const methodOverride = require('method-override');

// Application Setup
const app = express();

const router = {
  mongo: require('../routes/routes-mongo.js'),
  pg: require('../routes/routes-pg.js'),
};

// Application Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(methodOverride((request) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

module.exports = exports = {
  server: app,
  start: (port, db) => {
    let PORT = port || process.env.PORT || 3000;
    // Routes
    app.use('/', router[db]);
    app.listen(PORT, () => {console.log(`Listening on port: ${PORT} with ${db}`);});
  },
}
