module.exports = {
	"@conString": { type: String, default: "http://schema.org" },
	"@type": { type: String, default: "OrderItem" },
	//>> Properties from Offer
	//acceptedPaymentMethod: PaymentMethod,//	The payment method(s) accepted by seller for this offer.
	//addOn: Offer,//	An additional offer that can only be obtained in combination with the first base offer (e.g. supplements and extensions that are available for a surcharge).
	//advanceBookingRequirement: QuantitativeValue,//	The amount of time that is required between accepting the offer and the actual usage of the resource or service.
	//aggregateRating: AggregateRating,//	The overall rating, based on a collection of reviews or ratings, of the item.
	//availability: ItemAvailability,//The availability of this item—for example In stock, Out of stock, Pre-order, etc.
	//availabilityEnds: DateTime,//The end of the availability of the product or service included in the offer.
	//availabilityStarts: DateTime,//The beginning of the availability of the product or service included in the offer.
	//availableAtOrFrom: Place,//	The place(s) from which the offer can be obtained (e.g. store locations).
	//availableDeliveryMethod: DeliveryMethod,//The delivery method(s) available for this offer.
	//businessFunction: BusinessFunction,//The business function (e.g. sell, lease, repair, dispose) of the offer or component of a bundle (TypeAndQuantityNode). The default is http://purl.org/goodrelations/v1#Sell.
	//category: String  or Thing  or PhysicalActivityCategory,//A category for the item. Greater signs or slashes can be used to informally indicate a category hierarchy.
	//deliveryLeadTime: QuantitativeValue,//	The typical delay between the receipt of the order and the goods leaving the warehouse.
	//eligibleCustomerType: BusinessEntityType,//The type(s) of customers for which the given offer is valid.
	//eligibleDuration: QuantitativeValue,//	The duration for which the given offer is valid.
	//eligibleQuantity: QuantitativeValue,//	The interval and unit of measurement of ordering quantities for which the offer or price specification is valid. This allows e.g. specifying that a certain freight charge is valid only for a certain quantity.
	//eligibleRegion: String  or Place  or GeoShape,//The ISO 3166-1 (ISO 3166-1 alpha-2) or ISO 3166-2 code, the place, or the GeoShape for the geo-political region(s) for which the offer or delivery charge specification is valid.
	//eligibleTransactionVolume: PriceSpecification,//The transaction volume, in a monetary unit, for which the offer or price specification is valid, e.g. for indicating a minimal purchasing volume, to express free shipping above a certain order volume, or to limit the acceptance of credit cards to purchases to a certain minimal amount.
	gtin12: String,//The GTIN-12 code of the product, or the product to which the offer refers. The GTIN-12 is the 12-digit GS1 Identification Key composed of a U.P.C. Company Prefix, Item Reference, and Check Digit used to identify trade items. See GS1 GTIN Summary for more details.
	gtin13: String,//The GTIN-13 code of the product, or the product to which the offer refers. This is equivalent to 13-digit ISBN codes and EAN UCC-13. Former 12-digit UPC codes can be converted into a GTIN-13 code by simply adding a preceeding zero. See GS1 GTIN Summary for more details.
	gtin14: String,//The GTIN-14 code of the product, or the product to which the offer refers. See GS1 GTIN Summary for more details.
	gtin8: String,//The GTIN-8 code of the product, or the product to which the offer refers. This code is also known as EAN/UCC-8 or 8-digit EAN. See GS1 GTIN Summary for more details.
	//includesObject: TypeAndQuantityNode,//	This links to a node or nodes indicating the exact quantity of the products included in the offer.
	//ineligibleRegion: String  or Place  or GeoShape,//The ISO 3166-1 (ISO 3166-1 alpha-2) or ISO 3166-2 code, the place, or the GeoShape for the geo-political region(s) for which the offer or delivery charge specification is not valid, e.g. a region where the transaction is not allowed.
	//inventoryLevel: QuantitativeValue,//	The current approximate inventory level for the item or items.
	//itemCondition: OfferItemCondition,//A predefined value from OfferItemCondition or a Stringual description of the condition of the product or service, or the products or services included in the offer.
	//itemOffered: Product,//	The item being offered.
	mpn: String,//The Manufacturer Part Number (MPN) of the product, or the product to which the offer refers.
	//price: String  or Number,//The offer price of a product, or of a price component when attached to PriceSpecification and its subtypes.  
	//Usage guidelines: 
	//Use the priceCurrency property (with ISO 4217 codes e.g. "USD") instead of including ambiguous symbols such as '$' in the value.
	//Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator.
	//Note that both RDFa and Microdata syntax allow the use of a "content=" attribute for publishing simple machine-readable values alongside more human-friendly formatting.
	//Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similiar Unicode symbols.
	priceCurrency: String,//The currency (in 3-letter ISO 4217 format) of the price or a price component, when attached to PriceSpecification and its subtypes.
	//priceSpecification: PriceSpecification,//One or more detailed price specifications, indicating the unit price and delivery or payment charges.
	priceValidUntil: Date,//The date after which the price is no longer available.
	//review: Review,//A review of the item. Supersedes reviews.
	//seller: Organization  or Person,//An entity which offers (sells / leases / lends / loans) the services / goods. A seller may also be a provider. Supersedes merchant, vendor.
	serialNumber: String,//The serial number or any alphanumeric identifier of a particular product. When attached to an offer, it is a shortcut for the serial number of the product included in the offer.
	sku: String,//The Stock Keeping Unit (SKU), i.e. a merchant-specific identifier for a product or service, or the product to which the offer refers.
	validFrom: Date,//The date when the item becomes valid.
	validThrough: Date,//The end of the validity of offer, price specification, or opening hours data.
	//warranty: WarrantyPromise,//	The warranty promise(s) included in the offer. Supersedes warrantyPromise.
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
