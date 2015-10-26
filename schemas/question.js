module.exports = {
	//>Properties from Question
	acceptedAnswer: require('./answer'),//The answer that has been accepted as best, typically on a Question/Answer site. Sites vary in their selection mechanisms, e.g. drawing on community opinion and/or the view of the Question author.
	//answerCount: Integer,//	The number of answers this question has received.
	//downvoteCount: Integer,//	The number of downvotes this question, answer or comment has received from the community.
	//suggestedAnswer: Answer,//An answer (possibly one of several, possibly incorrect) to a Question, e.g. on a Question/Answer site.
	//upvoteCount: Integer,//	The number of upvotes this question, answer or comment has received from the community.
	//>Properties from CreativeWork
	//about: Thing,//	The subject matter of the content.
	//accessibilityAPI: String,//Indicates that the resource is compatible with the referenced accessibility API (WebSchemas wiki lists possible values).
	//accessibilityControl: String,//Identifies input methods that are sufficient to fully control the described resource (WebSchemas wiki lists possible values).
	//accessibilityFeature: String,//Content features of the resource, such as accessible media, alternatives and supported enhancements for accessibility (WebSchemas wiki lists possible values).
	//accessibilityHazard: String,//A characteristic of the described resource that is physiologically dangerous to some users. Related to WCAG 2.0 guideline 2.3 (WebSchemas wiki lists possible values).
	//accountablePerson: Person,//Specifies the Person that is legally accountable for the CreativeWork.
	//aggregateRating: AggregateRating,//	The overall rating, based on a collection of reviews or ratings, of the item.
	//alternativeHeadline: String,//A secondary title of the CreativeWork.
	//associatedMedia: MediaObject,//	A media object that encodes this CreativeWork. This property is a synonym for encoding.
	//audience: Audience,//An intended audience, i.e. a group for whom something was created. Supersedes serviceAudience.
	//audio: AudioObject,//	An embedded audio object.
	//author: Person  or Organization,//The author of this content. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably.
	//award: String,//An award won by or for this item. Supersedes awards.
	//character: Person,//Fictional person connected with a creative work.
	//citation: CreativeWork  or String,//A citation or reference to another creative work, such as another publication, web page, scholarly article, etc.
	//comment: Comment,//	Comments, typically from users.
	//commentCount: Integer,//	The number of comments this CreativeWork (e.g. Article, Question or Answer) has received. This is most applicable to works published in Web sites with commenting system; additional comments may exist elsewhere.
	//contentLocation: Place,//	The location depicted or described in the content. For example, the location in a photograph or painting.
	//contentRating: String,//Official rating of a piece of content—for example,'MPAA PG-13'.
	//contributor: Person  or Organization,//A secondary contributor to the CreativeWork.
	//copyrightHolder: Person  or Organization,//The party holding the legal copyright to the CreativeWork.
	//copyrightYear: Number,//The year during which the claimed copyright for the CreativeWork was first asserted.
	//creator: Person  or Organization,//The creator/author of this CreativeWork. This is the same as the Author property for CreativeWork.
	//dateCreated: Date,//The date on which the CreativeWork was created.
	//dateModified: Date,//The date on which the CreativeWork was most recently modified.
	//datePublished: Date,//Date of first broadcast/publication.
	//discussionUrl: URL,//	A link to the page containing the comments of the CreativeWork.
	//editor: Person,//Specifies the Person who edited the CreativeWork.
	//educationalAlignment: AlignmentObject,//	An alignment to an established educational framework.
	//educationalUse: String,//The purpose of a work in the context of education; for example, 'assignment', 'group work'.
	//encoding: MediaObject,//	A media object that encodes this CreativeWork. This property is a synonym for associatedMedia. Supersedes encodings.
	//exampleOfWork: CreativeWork,//A creative work that this work is an example/instance/realization/derivation of.  Inverse property: workExample.
	//genre: String,//Genre of the creative work or group.
	//hasPart: CreativeWork,//Indicates a CreativeWork that is (in some sense) a part of this CreativeWork.  Inverse property: isPartOf.
	//headline: String,//Headline of the article.
	//inLanguage: Language  or String,//The language of the content or performance or used in an action. Please use one of the language codes from the IETF BCP 47 standard. Supersedes language.
	//interactivityType: String,//The predominant mode of learning supported by the learning resource. Acceptable values are 'active', 'expositive', or 'mixed'.
	//isBasedOnUrl: URL,//	A resource that was used in the creation of this resource. This term can be repeated for multiple sources. For example, http://example.com/great-multiplication-intro.html.
	//isFamilyFriendly: Boolean,//	Indicates whether this content is family friendly.
	//isPartOf: CreativeWork,//Indicates a CreativeWork that this CreativeWork is (in some sense) part of.  Inverse property: hasPart.
	//keywords: String,//Keywords or tags used to describe this content. Multiple entries in a keywords list are typically delimited by commas.
	//learningResourceType: String,//The predominant type or kind characterizing the learning resource. For example, 'presentation', 'handout'.
	//license: CreativeWork  or URL,//	A license document that applies to this content, typically indicated by URL.
	//mainEntity: Thing,//	Indicates the primary entity described in some page or other CreativeWork.  Inverse property: mainEntityOfPage.
	//mentions: Thing,//	Indicates that the CreativeWork contains a reference to, but is not necessarily about a concept.
	//offers: Offer,//	An offer to provide this item—for example, an offer to sell a product, rent the DVD of a movie, or give away tickets to an event.
	//position: Integer  or String,//The position of an item in a series or sequence of items.
	//producer: Person  or Organization,//The person or organization who produced the work (e.g. music album, movie, tv/radio series etc.).
	//provider: Person  or Organization,//The service provider, service operator, or service performer; the goods producer. Another party (a seller) may offer those services or goods on behalf of the provider. A provider may also serve as the seller. Supersedes carrier.
	//publication: PublicationEvent,//A publication event associated with the item.
	//publisher: Organization,//The publisher of the creative work.
	//publishingPrinciples: URL,//	Link to page describing the editorial principles of the organization primarily responsible for the creation of the CreativeWork.
	//recordedAt: Event,//	The Event where the CreativeWork was recorded. The CreativeWork may capture all or part of the event.  Inverse property: recordedIn.
	//releasedEvent: PublicationEvent,//The place and time the release was issued, expressed as a PublicationEvent.
	//review: Review,//A review of the item. Supersedes reviews.
	//schemaVersion: URL  or String,//Indicates (by URL or string) a particular version of a schema used in some CreativeWork. For example, a document could declare a schemaVersion using an URL such as http://schema.org/version/2.0/ if precise indication of schema version was required by some application.
	//sourceOrganization: Organization,//The Organization on whose behalf the creator was working.
	text: String,//The textual content of this CreativeWork.
	//thumbnailUrl: URL,//	A thumbnail image relevant to the Thing.
	//timeRequired: Duration,//Approximate or typical time it takes to work with or through this learning resource for the typical intended target audience, e.g. 'P30M', 'P1H25M'.
	//translator: Person  or Organization,//Organization or person who adapts a creative work to different languages, regional differences and technical requirements of a target market.
	//typicalAgeRange: String,//The typical expected age range, e.g. '7-9', '11-'.
	//version: Number,//The version of the CreativeWork embodied by a specified resource.
	//video: VideoObject,//	An embedded video object.
	//workExample: CreativeWork,//Example/instance/realization/derivation of the concept of this creative work. eg. The paperback edition, first edition, or eBook.  Inverse property: exampleOfWork.
	//>Properties from Thing
	//additionalType: URL,//	An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types. Schema.org tools may have only weaker understanding of extra types, in particular those defined externally.
	//alternateName: String,//An alias for the item.
	//description: String,//A short description of the item.
	//image: URL  or ImageObject,//	An image of the item. This can be a URL or a fully described ImageObject.
	//mainEntityOfPage: CreativeWork  or URL,//	Indicates a page (or other CreativeWork) for which this thing is the main entity being described.  Many (but not all) pages have a fairly clear primary topic, some entity or thing that the page describes. For example a restaurant's home page might be primarily about that Restaurant, or an event listing page might represent a single event. The mainEntity and mainEntityOfPage properties allow you to explicitly express the relationship between the page and the primary entity.  Related properties include sameAs, about, and url.  The sameAs and url properties are both similar to mainEntityOfPage. The url property should be reserved to refer to more official or authoritative web pages, such as the item’s official website. The sameAs property also relates a thing to a page that indirectly identifies it. Whereas sameAs emphasises well known pages, the mainEntityOfPage property serves more to clarify which of several entities is the main one for that page.  mainEntityOfPage can be used for any page, including those not recognized as authoritative for that entity. For example, for a product, sameAs might refer to a page on the manufacturer’s official site with specs for the product, while mainEntityOfPage might be used on pages within various retailers’ sites giving details for the same product.  about is similar to mainEntity, with two key differences. First, about can refer to multiple entities/topics, while mainEntity should be used for only the primary one. Second, some pages have a primary entity that itself describes some other entity. For example, one web page may display a news article about a particular person. Another page may display a product review for a particular product. In these cases, mainEntity for the pages should refer to the news article or review, respectively, while about would more properly refer to the person or product.  Inverse property: mainEntity.
	//name: String,//The name of the item.
	//potentialAction: Action,//Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
	//sameAs: String,//	URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.
	//url: String,//	URL of the item.
};
