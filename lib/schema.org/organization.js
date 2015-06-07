module.exports = {
	"@context": { type: String, default: "http://schema.org" },
	"@type": { type: String, default: "Organization" },
	//>>Organization
	address: require('./postal-address'),//	Physical address of the item.
	//aggregateRating: AggregateRating,//	The overall rating, based on a collection of reviews or ratings, of the item.
	//brand: Organization or Brand,//	The brand(s) associated with a product or service, or the brand(s) maintained by an organization or business person.
	//contactPoint: ContactPoint,//A contact point for a person or organization. Supersedes contactPoints.
	//department: Organization,//A relationship between an organization and a department of that organization, also described as an organization (allowing different urls, logos, opening hours). For example: a store with a pharmacy, or a bakery with a cafe.
	//dissolutionDate: Date,//The date that this organization was dissolved.
	//duns: String,//The Dun & Bradstreet DUNS number for identifying an organization or business person.
	email: String,//Email address.
	//employee: Person,//Someone working for this organization. Supersedes employees.
	//event: Event,//	Upcoming or past event associated with this place, organization, or action. Supersedes events.
	faxNumber: String,//The fax number.
	//founder: require('./person'),//A person who founded this organization. Supersedes founders.
	//foundingDate: Date,//The date that this organization was founded.
	//foundingLocation: Place,//	The place where the Organization was founded.
	//globalLocationNumber: String,//The Global Location Number (GLN, sometimes also referred to as International Location Number or ILN) of the respective organization, person, or place. The GLN is a 13-digit number used to identify parties and physical locations.
	//hasPOS: Place,//	Points-of-Sales operated by the organization or person.
	//interactionCount: String,//A count of a specific user interactions with this item—for example, 20 UserLikes, 5 UserComments, or 300 UserDownloads. The user interaction type should be one of the sub types of UserInteraction.
	//isicV4: String,//The International Standard of Industrial Classification of All Economic Activities (ISIC), Revision 4 code for a particular organization, business person, or place.
	legalName: String,//The official name of the organization, e.g. the registered company name.
	//location: PostalAddress or Place,//	The location of the event, organization or action.
	//logo: ImageObject or URL,//	An associated logo.
	//makesOffer: Offer,//	A pointer to products or services offered by the organization or person.
	//member: Organization or Person,//A member of an Organization or a ProgramMembership. Organizations can be members of organizations; ProgramMembership is typically for individuals. Supersedes members, musicGroupMember.  Inverse property: memberOf.
	//memberOf: Organization or ProgramMembership,//	An Organization (or ProgramMembership) to which this Person or Organization belongs.  Inverse property: member.
	//naics: String,//The North American Industry Classification System (NAICS) code for a particular organization or business person.
	//owns: OwnershipInfo or Product,//	Products owned by the organization or person.
	//review: Review,// A review of the item. Supersedes reviews.
	//seeks:	Demand,// A pointer to products or services sought by the organization or person (demand).
	//subOrganization: Organization,//A relationship between two organizations where the first includes the second, e.g., as a subsidiary. See also: the more specific 'department' property.
	taxID: String,//The Tax / Fiscal ID of the organization or person, e.g. the TIN in the US or the CIF/NIF in Spain.
	telephone: String,//The telephone number.
	vatID: String,//The Value-added Tax ID of the organization or person.
	//>>Thing
	//additionalType: URL,//	An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types. Schema.org tools may have only weaker understanding of extra types, in particular those defined externally.
	alternateName: String,//An alias for the item.
	description: String,//A short description of the item.
	image: require('./image-object'),//	An image of the item. This can be a URL or a fully described ImageObject.
	name: String,//The name of the item.
	//potentialAction: Action,//Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
	//sameAs: URL,//	URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.
	url: String//	URL of the item.
};
