var express = require('express')
  , app = express()
  , MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
  , routes = require('./routes')
  , logger = require('morgan');

MongoClient.connect('mongodb://localhost:27017/chandelier', function(err, db) {
    "use strict";
    if(err) throw err;

    // Express middleware to populate 'req.cookies' so we can access cookies
    app.use(express.cookieParser());

    // Express middleware to populate 'req.body' so we can access POST variables
    app.use(express.bodyParser());

    // Application routes
    routes(app, db);

    app.listen(8082);
    console.log('Express server listening on port 8082');
});
