# epiphany

I just got one.

## Introduction

This is a library that aims to greatly simplify the creation
of web site serving node applications using Express.



## Non-agnostic

You have to use

1. Node & NPM
2. Express
3. MongoDB & Mongoose
4. DustJS templates (from LinkedIn)

## Components && Loaders

We essentially define the components of an Epiphany server to be.

1. The config
2. Mongoose models
3. Express Middleware
4. Express Routes

This is it. But you also get control over your preware (before routes)
and postware (after).

All these files are automatically loaded for you using the loaders.

### Middleware

`init.middleware(directory, config)` requires all .js files in the
`directories`. It returns an object with all middleware functions. 

All middleware files should return a function that takes one optional
parameter, `config`. That function should in turn return an object with
middleware functions, or a single middleware function.  Will return a mw object
that can be passed to escort.routes().

Single middleware in one file:

```
module.exports = function(config) {
  return function(req, res, next) {
    res.send('secret/pron/stash');
  };
};
```

Multiple middlewares in one file:

```
module.exports = function(config) {
  return {
    index: function(req, res, next) {
      res.send('secret/pron/stash');
    },
    ballsack1: function(req, res, next) {
      res.send('secret/pron/stash');
    },
    anotherBallsack: function(req, res, next) {
      res.send('secret/pron/stash');
    }
  };
};
```

## Routes

All route files should return an Express Router object.

Sample route file:

```
var express = require('express').Router();

module.exports = function(mw, config){
  router.get('/', mw.pages.index);
  router.get('/page', mw.models.news.getAll, mw.pages.page);
  router.get('/ballsack', mw.pages.ballsack);

  return router;
};
```

## Models

The model files only need to register the models on the mongoose instance.
They will later be reached through the mongoose instance.

```
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  prop1: { type: String },
  prop2: { type: String }
});

mongoose.model('ModelName', Schema);
```

These can now be accessed through mongoose anywhere else in your app.

```
var ModelName = require('mongoose').model('ModelName');
```

## Templates

The template system in express has been overriden to use dust native functions for cache things.
