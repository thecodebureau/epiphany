module.exports = {
	//"@context": { type: String, default: "http://schema.org" },
	//"@type": { type: String, default: "Article" },

	//>>Properties from NewsArticle
	//dateline: String,//The location where the NewsArticle was produced.
	//printColumn: String,//The number of the column in which the NewsArticle appears in the print edition.
	//printEdition: String,//The edition of the print product in which the NewsArticle appears.
	//printPage: String,//If this NewsArticle appears in print, this field indicates the name of the page on which the article is found. Please note that this field is intended for the exact page name (e.g. A5, B18).
	//printSection: String,//If this NewsArticle appears in print, this field indicates the print section in which the article appeared.

	//>>Properties from Article
	articleBody: String ,//The actual body of the article.
	//articleSection: String ,//Articles may belong to one or more 'sections' in a magazine or newspaper, such as Sports, Lifestyle, etc.
	//pageEnd: String  or Number ,//The page on which the work ends; for example "138" or "xvi".
	//pageStart: String  or Number ,//The page on which the work starts; for example "135" or "xiii".
	//pagination: String ,//Any description of pages that is not separated into pageStart and pageEnd; for example, "1-6, 9, 55" or "10-12, 46-49".
	wordCount: Number ,//The number of words in the text of the Article.

	//>>Properties from CreativeWork
	//about: Thing ,//The subject matter of the content.
	//accessibilityAPI: String ,//Indicates that the resource is compatible with the referenced accessibility API (WebSchemas wiki lists possible values).
	//accessibilityControl: String ,//Identifies input methods that are sufficient to fully control the described resource (WebSchemas wiki lists possible values).
	//accessibilityFeature: String ,//Content features of the resource, such as accessible media, alternatives and supported enhancements for accessibility (WebSchemas wiki lists possible values).
	//accessibilityHazard: String ,//A characteristic of the described resource that is physiologically dangerous to some users. Related to WCAG 2.0 guideline 2.3 (WebSchemas wiki lists possible values).
	//accountablePerson: Person ,//Specifies the Person that is legally accountable for the CreativeWork.
	//aggregateRating: AggregateRating ,//The overall rating, based on a collection of reviews or ratings, of the item.
	//alternativeHeadline: String ,//A secondary title of the CreativeWork.
	//associatedMedia: MediaObject ,//A media object that encodes this CreativeWork. This property is a synonym for encoding.
	//audience: Audience ,//The intended audience of the item, i.e. the group for whom the item was created.
	//audio: AudioObject ,//An embedded audio object.
	//author: Organization  or Person ,//The author of this content. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably.
	//award: String ,//An award won by this person or for this creative work. Supersedes awards.
	//character: Person ,//Fictional person connected with a creative work.
	//citation: String  or CreativeWork ,//A citation or reference to another creative work, such as another publication, web page, scholarly article, etc.
	//comment: UserComments  or Comment ,//Comments, typically from users, on this CreativeWork.
	//commentCount: Number ,//The number of comments this CreativeWork (e.g. Article, Question or Answer) has received. This is most applicable to works published in Web sites with commenting system; additional comments may exist elsewhere.
	//contentLocation: Place ,//The location of the content.
	//contentRating: String ,//Official rating of a piece of content—for example,'MPAA PG-13'.
	//contributor: Organization  or Person ,//A secondary contributor to the CreativeWork.
	//copyrightHolder: Organization  or Person ,//The party holding the legal copyright to the CreativeWork.
	copyrightYear: Number ,//The year during which the claimed copyright for the CreativeWork was first asserted.
	//creator: Organization  or Person ,//The creator/author of this CreativeWork or UserComments. This is the same as the Author property for CreativeWork.
	dateCreated: {
		type: Date,//The date on which the CreativeWork was created.
		default: Date.now
	},
	dateModified: Date ,//The date on which the CreativeWork was most recently modified.
	datePublished: Date ,//Date of first broadcast/publication.
	//discussionUrl: URL ,//A link to the page containing the comments of the CreativeWork.
	//editor: Person ,//Specifies the Person who edited the CreativeWork.
	//educationalAlignment: AlignmentObject ,//An alignment to an established educational framework.
	//educationalUse: String ,//The purpose of a work in the context of education; for example, 'assignment', 'group work'.
	//encoding: MediaObject ,//A media object that encodes this CreativeWork. This property is a synonym for associatedMedia. Supersedes encodings.
	//exampleOfWork: CreativeWork ,//A creative work that this work is an example/instance/realization/derivation of.  Inverse property: workExample.
	//genre: String ,//Genre of the creative work or group.
	//hasPart: CreativeWork ,//Indicates a CreativeWork that is (in some sense) a part of this CreativeWork.  Inverse property: isPartOf.
	headline: String ,//Headline of the article.
	//inLanguage: String ,//The language of the content. please use one of the language codes from the IETF BCP 47 standard.
	//interactionCount: String ,//A count of a specific user interactions with this item—for example, 20 UserLikes, 5 UserComments, or 300 UserDownloads. The user interaction type should be one of the sub types of UserInteraction.
	//interactivityType: String ,//The predominant mode of learning supported by the learning resource. Acceptable values are 'active', 'expositive', or 'mixed'.
	//isBasedOnUrl: URL ,//A resource that was used in the creation of this resource. This term can be repeated for multiple sources. For example, http://example.com/great-multiplication-intro.html.
	//isFamilyFriendly: Boolean ,//Indicates whether this content is family friendly.
	//isPartOf: CreativeWork ,//Indicates a CreativeWork that this CreativeWork is (in some sense) part of.  Inverse property: hasPart.
	//keywords: String ,//Keywords or tags used to describe this content. Multiple entries in a keywords list are typically delimited by commas.
	//learningResourceType: String ,//The predominant type or kind characterizing the learning resource. For example, 'presentation', 'handout'.
	//license: URL  or CreativeWork ,//A license document that applies to this content, typically indicated by URL.
	//mentions: Thing ,//Indicates that the CreativeWork contains a reference to, but is not necessarily about a concept.
	//offers: Offer ,//An offer to provide this item—for example, an offer to sell a product, rent the DVD of a movie, or give away tickets to an event.
	//position: String  or Number ,//The position of an item in a series or sequence of items.
	//producer: Organization  or Person ,//The person or organization who produced the work (e.g. music album, movie, tv/radio series etc.).
	//provider: Organization  or Person ,//The service provider, service operator, or service performer; the goods producer. Another party (a seller) may offer those services or goods on behalf of the provider. A provider may also serve as the seller. Supersedes carrier.
	//publisher: Organization ,//The publisher of the creative work.
	//publishingPrinciples: URL ,//Link to page describing the editorial principles of the organization primarily responsible for the creation of the CreativeWork.
	//recordedAt: Event ,//The Event where the CreativeWork was recorded. The CreativeWork may capture all or part of the event.  Inverse property: recordedIn.
	//releasedEvent: PublicationEvent ,//The place and time the release was issued, expressed as a PublicationEvent.
	//review: Review ,//A review of the item. Supersedes reviews.
	//sourceOrganization: Organization ,//The Organization on whose behalf the creator was working.
	//text: String ,//The textual content of this CreativeWork.
	//thumbnailUrl: URL ,//A thumbnail image relevant to the Thing.
	//timeRequired: Duration ,//Approximate or typical time it takes to work with or through this learning resource for the typical intended target audience, e.g. 'P30M', 'P1H25M'.
	//translator: Organization  or Person ,//Organization or person who adapts a creative work to different languages, regional differences and technical requirements of a target market.
	//typicalAgeRange: String ,//The typical expected age range, e.g. '7-9', '11-'.
	//version: Number ,//The version of the CreativeWork embodied by a specified resource.
	//video: VideoObject ,//An embedded video object.
	//workExample: CreativeWork ,//Example/instance/realization/derivation of the concept of this creative work. eg. The paperback edition, first edition, or eBook.  Inverse property: exampleOfWork.
	//>>Properties from Thing
	//additionalType: URL ,//An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types. Schema.org tools may have only weaker understanding of extra types, in particular those defined externally.
	//alternateName: String ,//An alias for the item.
	//description: String ,//A short description of the item.
	image: require('./image-object'),//An image of the item. This can be a URL or a fully described ImageObject.
	//name: String ,//The name of the item.
	//potentialAction: Action ,//Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
	//sameAs: URL ,//URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.
	//url: URL,//URL of the item.
};
