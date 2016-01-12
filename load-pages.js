// modules > native
var fs = require('fs');
var p = require('path');
var url = require('url');

// modules > 3rd-party
var chalk = require('chalk');
var debug = require('debug')('epiphany:loaders');
var dust = require('dustjs-linkedin');

var pageMiddleware = require('./middleware/page');

module.exports = function(pageCollections) {
	var navigation = {};
	var routes = [];
	var paths = {};

	_.each(pageCollections, function(pages, key) {
		paths[key] = [];

		var root = _.compact(key.split('/'));
		var prewares = pages.pre || [];
		var postwares = pages.post || [];

		// `recurse` loops through all page objects from pages.js and fills in any blanks.
		function recurse(pages, tree, nav) {
			_.each(pages, function(page) {
				// set name from title if it does not exist
				if(!page.name)
					if(page.title)
						page.name = _.kebabCase(page.title).replace(/[åä]/g, 'a').replace(/ö/g, 'o');
					else if (!page.path)
						throw new Error('Page without name, title and path!');

				var pathArray;
				
				if(page.path) {
					pathArray = _.compact(page.path.split('/'));

					// do not add tree to path if path begins with a '/'
					if(!/^\//.test(page.path)) {
						pathArray = tree.concat(pathArray);
					}
				} else {
					pathArray = tree.concat(page.name);
				}

				page.path = '/' + root.concat(pathArray).join('/');

				// attempt to find a template from the path if it is not set
				if(!page.template)
					page.template = _.compact(root.concat('pages', pathArray)).join('/');

				if(!dust.cache[page.template]) {
					page.template = p.join(page.template, 'index');

					if(!dust.cache[page.template]) {
						throw new Error('No template found for page: ' + page.path);
					}
				}
				
				// save an array of all templates needed for page
				page.templates = [ page.template ].concat(dust.dependencies(page.template));

				var middleware = prewares.concat(pageMiddleware(page, navigation[key], nav), page.middleware || [], postwares);

				// delete page middlewares since it is only relevant for the routes
				delete page.middleware;

				// add a route for the page
				routes.push([ page.path, page.method || 'get', middleware ]);

				// add pages path to path array
				paths[key].push(page.path);

				var navItem;

				if(page.nav !== false && nav) {
					nav.push(navItem = _.pick(page, 'name', 'title', 'path', 'description'));

					if(page.navPath)
						navItem.path = page.navPath;
				}


				if(_.isArray(page.pages))
					recurse(page.pages, pathArray, navItem ? navItem.pages = [] : undefined);
			});
		}

		recurse(pages, [], navigation[key] = []);
	});
	
	return {
		navigation: navigation,
		pages: pageCollections,
		paths: paths,
		routes: routes
	};
};
