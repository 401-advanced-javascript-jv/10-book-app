'use strict';

require('dotenv').config();

// Second arg of start must 'pg' to start the postgres back-end
// Otherwise, uses mongo
let db = process.argv[2] === 'pg' ? 'pg' : 'mongo';

require('./lib/server.js').start(process.env.PORT, db);
