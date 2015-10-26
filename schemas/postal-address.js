module.exports = {
	//"@context": { type: String, default: "http://schema.org" },
	//"@type": { type: String, default: "PostalAddress" },

	//>>PostalAddress
	addressCountry: String,//	The country. For example, USA. You can also provide the two-letter ISO 3166-1 alpha-2 country code.
	addressLocality: String,//The locality. For example, Mountain View.
	addressRegion: String,//The region. For example, CA.
	postOfficeBoxNumber: String,//The post office box number for PO box addresses.
	postalCode: String,//The postal code. For example, 94043.
	streetAddress: String,//The street address. For example, 1600 Amphitheatre Pkwy.
	//>>ContactPoint
	//areaServed: AdministrativeArea,//The location served by this contact point (e.g., a phone number intended for Europeans vs. North Americans or only within the United States).
	//availableLanguage: Language,//A language someone may use with the item.
	//contactOption: ContactPointOption,//An option available on this contact point (e.g. a toll-free number or support for hearing-impaired callers).
	//contactType: String,//A person or organization can have different contact points, for different purposes. For example, a sales contact point, a PR contact point and so on. This property is used to specify the kind of contact point.
	//email: String,//Email address.
	//faxNumber: String,//The fax number.
	//hoursAvailable: OpeningHoursSpecification,//	The hours during which this contact point is available.
	//productSupported: String or Product,//	The product or service this support contact point is related to (such as product support for a particular product line). This can be a specific product or product line (e.g. "iPhone") or a general category of products or services (e.g. "smartphones").
	//telephone: String,//The telephone number.
	//>>Thing
	//additionalType: URL,//	An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types. Schema.org tools may have only weaker understanding of extra types, in particular those defined externally.
	//alternateName: String,//An alias for the item.
	//description: String,//A short description of the item.
	//image: URL or ImageObject,//	An image of the item. This can be a URL or a fully described ImageObject.
	//name: String,//The name of the item.
	//potentialAction: Action,//Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
	//sameAs: URL,//	URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.
	//url: URL,//	URL of the item.
};
