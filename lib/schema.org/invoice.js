module.exports = {
	//"@context": { type: String, default: "http://schema.org" },
	//"@type": { type: String, default: "Invoice" },
	
	//>Properties from Invoice
	accountId: String,//The identifier for the account the payment will be applied to.
	//billingPeriod: Duration,//The time interval used to compute the invoice.
	//broker: Person  or Organization,//An entity that arranges for an exchange between a buyer and a seller. In most cases a broker never acquires or releases ownership of a product or service involved in an exchange. If it is not clear whether an entity is a broker, seller, or buyer, the latter two terms are preferred. Supersedes bookingAgent.
	//category: PhysicalActivityCategory  or String  or Thing,//	A category for the item. Greater signs or slashes can be used to informally indicate a category hierarchy.
	confirmationNumber: String,//A number that confirms the given order or payment has been received.
	//customer: Person  or Organization,//Party placing the order or paying the invoice.
	//minimumPaymentDue: PriceSpecification,//The minimum payment required at this time.
	//paymentDue: DateTime,//The date that payment is due.
	//paymentMethod: PaymentMethod,//	The name of the credit card or other method of payment for the order.
	paymentMethodId: String,//An identifier for the method of payment used (e.g. the last 4 digits of the credit card).
	paymentStatus: String,//The status of payment; whether the invoice has been paid or not.
	//provider: Person  or Organization,//The service provider, service operator, or service performer; the goods producer. Another party (a seller) may offer those services or goods on behalf of the provider. A provider may also serve as the seller. Supersedes carrier.
	//referencesOrder: Order,//	The Order(s) related to this Invoice. One or more Orders may be combined into a single Invoice.
	scheduledPaymentDate: Date,//The date the invoice is scheduled to be paid.
	//totalPaymentDue: PriceSpecification,//The total amount due.
	//>Properties from Thing
	additionalType: String,//	An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types. Schema.org tools may have only weaker understanding of extra types, in particular those defined externally.
	alternateName: String,//An alias for the item.
	description: String,//A short description of the item.
	//image: URL  or ImageObject,//	An image of the item. This can be a URL or a fully described ImageObject.  mainEntityOfPage	CreativeWork  or URL		Indicates a page (or other CreativeWork) for which this thing is the main entity being described.  Many (but not all) pages have a fairly clear primary topic, some entity or thing that the page describes. For example a restaurant's home page might be primarily about that Restaurant, or an event listing page might represent a single event. The mainEntity and mainEntityOfPage properties allow you to explicitly express the relationship between the page and the primary entity.  Related properties include sameAs, about, and url.  The sameAs and url properties are both similar to mainEntityOfPage. The url property should be reserved to refer to more official or authoritative web pages, such as the item’s official website. The sameAs property also relates a thing to a page that indirectly identifies it. Whereas sameAs emphasises well known pages, the mainEntityOfPage property serves more to clarify which of several entities is the main one for that page.  mainEntityOfPage can be used for any page, including those not recognized as authoritative for that entity. For example, for a product, sameAs might refer to a page on the manufacturer’s official site with specs for the product, while mainEntityOfPage might be used on pages within various retailers’ sites giving details for the same product.  about is similar to mainEntity, with two key differences. First, about can refer to multiple entities/topics, while mainEntity should be used for only the primary one. Second, some pages have a primary entity that itself describes some other entity. For example, one web page may display a news article about a particular person. Another page may display a product review for a particular product. In these cases, mainEntity for the pages should refer to the news article or review, respectively, while about would more properly refer to the person or product.  Inverse property: mainEntity.
	name: String,//The name of the item.
	//potentialAction: Action,//Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
	sameAs: String,//	URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.
	url: String,//	URL of the item.
};
