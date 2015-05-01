module.exports = function(mongoose, schemas) {
	return new mongoose.Schema({
		"@context": { type: String, default: "http://schema.org" },
		"@type": { type: String, default: "ImageObject" },

		//>>TCB Properties
		filename: String,// local directory of file
		path: String,// local directory of file
		ext: String,// extension of file, eg .png or .jpg
		mime: String,
		sizes: [],

		//>>Properties from ImageObject
		caption: String,//The caption for this object.
		exifData: String,//exif data for this object.
		//representativeOfPage: Boolean,//	Indicates whether this image is representative of the content of the page.
		thumbnail: {
			"@context": { type: String, default: "http://schema.org" },
			"@type": { type: String, default: "ImageObject" },
			//>>Properties from ImageObject
			//exifData: String,//exif data for this object.
			contentSize: String,//File size in (mega/kilo) bytes.
			contentUrl: String,//	Actual bytes of the media object, for example the image file or video file.
			//expires	Date	Date the content expires and is no longer useful or available. Useful for videos.
			height: Number,//	The height of the item. TCB: always in pixels
			//productionCompany	Organization	The production company or studio responsible for the item e.g. series, video game, episode etc.
			width: Number,//width of the item.//TCB: always in pixels
			//>>Properties from Thing
			url: String,
		},
		//>>Properties from MediaObject
		//associatedArticle: NewsArticle,//	A NewsArticle associated with the Media Object.
		//bitrate: String,//The bitrate of the media object.
		contentSize: String,//File size in (mega/kilo) bytes.
		contentUrl: String,//	Actual bytes of the media object, for example the image file or video file.
		//expires	Date	Date the content expires and is no longer useful or available. Useful for videos.
		height: Number,//	The height of the item. TCB: always in pixels
		//productionCompany	Organization	The production company or studio responsible for the item e.g. series, video game, episode etc.
		uploadDate: Date,//Date when this media object was uploaded to this site.
		width: Number,//width of the item.//TCB: always in pixels
		//>>Properties from CreativeWork
		keywords: String,
		copyrightHolder: String,
		copyrightYear: Number,
		//>>Properties from Thing
		url: String,
		name: String,
		description: String
	});
};
