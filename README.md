# epiphany

I just got one.

## Introduction

This is a library that aims to greatly simplify the creation
of Node & Express servers. You have to use:

1. Node & NPM
2. Express
3. MongoDB & Mongoose
4. DustJS templates (from LinkedIn)

## Components

We essentially define the 4 components of an Epiphany server to be:

1. Configurations
2. Mongoose schemas & models
3. Express Middleware
4. Express Routes

This is it. You load all your components simply by telling Epiphany where
they are located. They can be located in different locations. Epiphany
has a property `directories` where it keeps arrays of locations
of all components. These directories are used by the loaders.

## The loaders

All components are loaded using Epiphany's loaders. The loaders are called
internally in Epiphany.prototype.init with the appropriate array from `directories`.
If you want to add more directories before initializing, call the constructor with
`{ init: false }`.

The loaders use the directory structure to namespace the routes and middleware.
Models are simply added to the mongoose instance, while Schemas are saved to an object
that is passed to all model modules.

## Configuration

Configuration is set up slightly differently from the other components. While
all other components are loaded during `init`, configuration is loaded in the
constructor. Therefore, if you want to add more configuration locations you
need to pass them to the constructor using `options.config`. This can be a
single path string, or an array of path strings.  If not config path is passed,
Epiphany will check for the existence of `PWD/server/config` and add it to the
configuration locations array.

Configuration with higher index in the array take precedence and overwrite
previous properties if they exist.

## Schemas & Models

Schemas are schema.org templates. They are passed to other schema files
and the model files.

Example schema file (Person):

```
module.exports = function(mongoose, schemas) {
	return new mongoose.Schema({
		_id: String,
		"@context": { type: String, default: "http://schema.org" },
		"@type": { type: String, default: "Person" },
		address: schemas.PostalAddress.objectify(),
		email: String,//Email address.
		familyName: String,//Family name. In the U.S., the last name of an Person. This can be used along with givenName instead of the name property.
		faxNumber: String,//The fax number.
		gender: String,//Gender of the person.
		givenName: String,//Given name. In the U.S., the first name of a Person. This can be used along with familyName instead of the name property.
		jobTitle: String,//The job title of the person (for example, Financial Manager).
		telephone: String,//The telephone number.
		description: String,//A short description of the item.
		image: schemas.ImageObject.objectify(),//	An image of the item. This can be a URL or a fully described ImageObject.
	});
};
```

Model files need to return a function that takes two parameters, `mongooose` and `schemas`.
They should register the model on the mongoose instance. Since middleware's have access
to mongoose, they can also fetch all models from that instance.

All mongoose models should be extended with the Base schema, and have a `save`
pre middleware that updates dateModified.

Example model file:

```
var _ = require('lodash');

module.exports = function(mongoose, schemas) {
	var PageSchema = new mongoose.Schema(_.defaults({
		_id: String,
		name: String,
		content: {},
		author: String,
	}, schemas.Base.objectify()));

	PageSchema.pre('save', function(next) {
		if(!this.isNew) {
			this.dateModified = Date.now();
		}
		next();
	});

	mongoose.model('Page', PageSchema);
};
```

## Middleware

All middleware files should return a function that takes two optional
parameters, `config` and `mongoose`. That function should in turn return an
object with middleware functions, or a single middleware function.

Single middleware in one file:

```
module.exports = function(config, mongoose) {
  return function(req, res, next) {
    res.send('secret/pron/stash');
  };
};
```

If this file was placed in `PWD/server/middleware/api/pron', it would namespace like this:

```
{
	api: {
		pron: [ Function ]
	}
}
```

Multiple middlewares in one file:

```
module.exports = function(config, mongoose) {
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

If this file was placed in `PWD/server/middleware/boo/far', it would namespace like this:

```
{
	boo: {
		far: {
			index: [ Function ],
			ballsack1: [ Function ],
			anotherBallsack: [ Function ]
		}
	}
}
```

## Routes

All route files should return an Array of routes, each route
being a an array on it's own. Each route array contains the following

1. The method (in lowercase)
2. The path
3. The middleware(s) (single or an Array)

'use' middlewares usually need to be placed before or after the
verb specific routes. Therefore, instead of saying 'use', you write
'before' or 'after'.

Sample route file:

```
module.exports = function(mw, config) {
	return [
		[ 'before', null, mw.authorization.isAuthenticated],
		[ 'get', '/', mw.api.events.findAll ],
		[ 'post', '/', mw.api.events.create ],
		[ 'get', '/:id', mw.api.events.findById ],
		[ 'put', '/:id', mw.api.events.update ],
		[ 'delete', '/:id', mw.api.events.remove ],
		[ 'after', null, mw.eventResponder ],
	];
};
```

## Templates

The template system in express has been overriden to use dust native functions for cache things.

All dust templates use their path to generate their name.

A template placed in `server/templates/partials/login-form` will be named `partials/login-form`.

Epiphany also sets up a route that enables the fetching of compiled templates at `/templates/`.
To fetch the previously mentioned template we would make a request to `/templates/partials/login-form`.
The route returns the name of the fetched template, and an array of compiled templates with the template
itself and all of its dependencies.

At the Code Bureau we have set up Dust in the browser to automatically load templates from this
route if it is not found in the cache. We do this with the following code:

```
dust.onLoad = function(name, callback) {
	// callback is a function provided by dust.
	// run console.log(callback.toString()) if you are interested in it's contents.
	function notFound() {
		callback(new Error('Template Not Found: ' + name));
	}
	// attempt to load the template using the templates route in Express.
	$.ajax({
		method: 'GET',
		url: '/templates/' + name,
		dataType: 'json',
		success: function(res) {
			// the templates route does not only return the specified temlate, but also
			// all templates it depends on. They are placed in the res.compiled array.
			if(res.compiled.length > -1) {
				_.each(res.compiled, dust.loadSource);
				// the specified template will always be the first item in the res.compiled array.
				callback(null, res.compiled[0]);
			} else {
				notFound();
			}
		},
		error: notFound
	});
};
```

## Preware & Postware

Preware is middleware loaded before the routes, and postware is loaded after the routes.
