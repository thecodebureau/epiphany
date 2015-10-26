module.exports = {
	//"@context": { type: String, default: "http://schema.org" },
	//"@type": { type: String, default: "Product" },

	//>Properties from Product
	//additionalProperty: PropertyValue,//	A property-value pair representing an additional characteristics of the entitity, e.g. a product feature or another characteristic for which there is no matching property in schema.org.  Note: Publishers should be aware that applications designed to use specific schema.org properties (e.g. http://schema.org/width, http://schema.org/color, http://schema.org/gtin13, ...) will typically expect such data to be provided using those properties, rather than using the generic property/value mechanism.
	//aggregateRating: AggregateRating,//	The overall rating, based on a collection of reviews or ratings, of the item.
	//audience: Audience,//An intended audience, i.e. a group for whom something was created. Supersedes serviceAudience.
	award: String,//An award won by or for this item. Supersedes awards.
	//brand: Organization  or Brand,//	The brand(s) associated with a product or service, or the brand(s) maintained by an organization or business person.
	//category: String  or Thing  or PhysicalActivityCategory,//A category for the item. Greater signs or slashes can be used to informally indicate a category hierarchy.
	//color: String,//The color of the product.
	//depth: Distance  or QuantitativeValue,//	The depth of the item.
	//gtin12: String,//The GTIN-12 code of the product, or the product to which the offer refers. The GTIN-12 is the 12-digit GS1 Identification Key composed of a U.P.C. Company Prefix, Item Reference, and Check Digit used to identify trade items. See GS1 GTIN Summary for more details.
	//gtin13: String,//The GTIN-13 code of the product, or the product to which the offer refers. This is equivalent to 13-digit ISBN codes and EAN UCC-13. Former 12-digit UPC codes can be converted into a GTIN-13 code by simply adding a preceeding zero. See GS1 GTIN Summary for more details.
	//gtin14: String,//The GTIN-14 code of the product, or the product to which the offer refers. See GS1 GTIN Summary for more details.
	//gtin8: String,//The GTIN-8 code of the product, or the product to which the offer refers. This code is also known as EAN/UCC-8 or 8-digit EAN. See GS1 GTIN Summary for more details.
	//height: Distance  or QuantitativeValue,//	The height of the item.
	//isAccessoryOrSparePartFor: Product,//	A pointer to another product (or multiple products) for which this product is an accessory or spare part.
	//isConsumableFor: Product,//	A pointer to another product (or multiple products) for which this product is a consumable.
	//isRelatedTo: Product,//	A pointer to another, somehow related product (or multiple products).
	//isSimilarTo: Product,//	A pointer to another, functionally similar product (or multiple products).
	//itemCondition: OfferItemCondition,//A predefined value from OfferItemCondition or a Stringual description of the condition of the product or service, or the products or services included in the offer.
	//logo: URL  or ImageObject,//	An associated logo.
	//manufacturer: Organization,//The manufacturer of the product.
	//model: String  or ProductModel,//The model of the product. Use with the URL of a ProductModel or a Stringual representation of the model identifier. The URL of the ProductModel can be from an external source. It is recommended to additionally provide strong product identifiers via the gtin8/gtin13/gtin14 and mpn properties.
	mpn: String,//The Manufacturer Part Number (MPN) of the product, or the product to which the offer refers.
	//offers: Offer,//	An offer to provide this item—for example, an offer to sell a product, rent the DVD of a movie, or give away tickets to an event.
	productID: { type: String, unique: true },//The product identifier, such as ISBN. For example: <meta itemprop='productID' content='isbn:123-456-789'/>.
	productionDate: Date,//The date of production of the item, e.g. vehicle.
	purchaseDate: Date,//The date the item e.g. vehicle was purchased by the current owner.
	releaseDate: Date,//The release date of a product or product model. This can be used to distinguish the exact variant of a product.
	//review: Review,//A review of the item. Supersedes reviews.
	sku: { type: String, unique: true },//The Stock Keeping Unit (SKU), i.e. a merchant-specific identifier for a product or service, or the product to which the offer refers.
	//weight: QuantitativeValue,//	The weight of the product or person.
	//width: Distance  or QuantitativeValue,//	The width of the item.
	//>Properties from Thing
	//additionalType: URL,//	An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types. Schema.org tools may have only weaker understanding of extra types, in particular those defined externally.
	alternateName: String,//An alias for the item.
	description: String,//A short description of the item.
	//image: URL  or ImageObject,//	An image of the item. This can be a URL or a fully described ImageObject.
	//mainEntityOfPage: URL  or CreativeWork,//Indicates a page (or other CreativeWork) for which this thing is the main entity being described.  Many (but not all) pages have a fairly clear primary topic, some entity or thing that the page describes. For example a restaurant's home page might be primarily about that Restaurant, or an event listing page might represent a single event. The mainEntity and mainEntityOfPage properties allow you to explicitly express the relationship between the page and the primary entity.  Related properties include sameAs, about, and url.  The sameAs and url properties are both similar to mainEntityOfPage. The url property should be reserved to refer to more official or authoritative web pages, such as the item’s official website. The sameAs property also relates a thing to a page that indirectly identifies it. Whereas sameAs emphasises well known pages, the mainEntityOfPage property serves more to clarify which of several entities is the main one for that page.  mainEntityOfPage can be used for any page, including those not recognized as authoritative for that entity. For example, for a product, sameAs might refer to a page on the manufacturer’s official site with specs for the product, while mainEntityOfPage might be used on pages within various retailers’ sites giving details for the same product.  about is similar to mainEntity, with two key differences. First, about can refer to multiple entities/topics, while mainEntity should be used for only the primary one. Second, some pages have a primary entity that itself describes some other entity. For example, one web page may display a news article about a particular person. Another page may display a product review for a particular product. In these cases, mainEntity for the pages should refer to the news article or review, respectively, while about would more properly refer to the person or product.  Inverse property: mainEntity.
	name: String,//The name of the item.
	//potentialAction: Action,//Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
	sameAs: String,//	URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.
	url: String,//	URL of the item.
};
