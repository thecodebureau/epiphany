// Load config
var config = require('../config');

// MODULES

// modules : native
var fs = require('fs');
var path = require('path');
var url = require('url');

// modules : 3rd-party
var _ = require('lodash');
var mongoose = require('mongoose');

// modules : express
var passport = require('passport');


// connect to mongodb
mongoose.connect(config.server.mongo.uri, config.server.mongo.options);



// set up passport, needs to be done after models are init
require('./passport')(config);

// load all middleware
var mw = init.middleware(config.dir.server.middleware, config);

// set up preware
//
// preware >  logging

//server.use(passport.initialize());
//server.use(passport.session());

// global preware
server.use(mw.tcb.pre);
server.use(mw.navigation);


// initialise routes
init.routes(config.dir.server.routes, server, mw, config);

