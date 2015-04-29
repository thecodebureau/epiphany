var mongoose = require('mongoose');

module.exports = function(schemas) {
	return new mongoose.Schema({
		_id: String,
		"@context": { type: String, default: "http://schema.org" },
		"@type": { type: String, default: "Person" },
		//>>Person
		//additionalName: String,//An additional name for a Person, can be used for a middle name.
		address: schemas.PostalAddress.objectify(),
		//affiliation	Organization	An organization that this person is affiliated with. For example, a school/university, a club, or a team.
		//alumniOf	EducationalOrganization		An educational organizations that the person is an alumni of.  Inverse property: alumni.
		//award	String	An award won by this person or for this creative work. Supersedes awards.
		//birthDate	Date	Date of birth.
		//birthPlace	Place		The place where the person was born.
		//brand: Organization  or Brand,//	The brand(s) associated with a product or service, or the brand(s) maintained by an organization or business person.
		//children: Person,//A child of the person.
		//colleague: Person,//A colleague of the person. Supersedes colleagues.
		//contactPoint: ContactPoint,//A contact point for a person or organization. Supersedes contactPoints.
		//deathDate: Date,//Date of death.
		//deathPlace: Place,//	The place where the person died.
		//duns: String,//The Dun & Bradstreet DUNS number for identifying an organization or business person.
		email: String,//Email address.
		familyName: String,//Family name. In the U.S., the last name of an Person. This can be used along with givenName instead of the name property.
		faxNumber: String,//The fax number.
		//follows: Person,//The most generic uni-directional social relation.
		gender: String,//Gender of the person.
		givenName: String,//Given name. In the U.S., the first name of a Person. This can be used along with familyName instead of the name property.
		//globalLocationNumber: String,//The Global Location Number (GLN, sometimes also referred to as International Location Number or ILN) of the respective organization, person, or place. The GLN is a 13-digit number used to identify parties and physical locations.
		//hasPOS: Place,//	Points-of-Sales operated by the organization or person.
		//height: Distance  or QuantitativeValue,//	The height of the item.
		//homeLocation: ContactPoint  or Place,//	A contact location for a person's residence.
		//honorificPrefix: String,//An honorific prefix preceding a Person's name such as Dr/Mrs/Mr.
		//honorificSuffix: String,//An honorific suffix preceding a Person's name such as M.D. /PhD/MSCSW.
		//interactionCount: String,//A count of a specific user interactions with this item—for example, 20 UserLikes, 5 UserComments, or 300 UserDownloads. The user interaction type should be one of the sub types of UserInteraction.
		//isicV4: String,//The International Standard of Industrial Classification of All Economic Activities (ISIC), Revision 4 code for a particular organization, business person, or place.
		jobTitle: String,//The job title of the person (for example, Financial Manager).
		//knows: Person,//The most generic bi-directional social/work relation.
		//makesOffer: Offer,//	A pointer to products or services offered by the organization or person.
		//memberOf: Organization  or ProgramMembership,//	An Organization (or ProgramMembership) to which this Person or Organization belongs.  Inverse property: member.
		//naics: String,//The North American Industry Classification System (NAICS) code for a particular organization or business person.
		//nationality: Country,//	Nationality of the person.
		//netWorth: PriceSpecification,//The total financial value of the organization or person as calculated by subtracting assets from liabilities.
		//owns: OwnershipInfo  or Product,//	Products owned by the organization or person.
		//parent: Person,//A parent of this person. Supersedes parents.
		//performerIn: Event,//	Event that this person is a performer or participant in.
		//relatedTo: Person,//The most generic familial relation.
		//seeks: Demand,//A pointer to products or services sought by the organization or person (demand).
		//sibling: Person,//A sibling of the person. Supersedes siblings.
		//spouse: Person,//The person's spouse.
		//taxID: String,//The Tax / Fiscal ID of the organization or person, e.g. the TIN in the US or the CIF/NIF in Spain.
		telephone: String,//The telephone number.
		//vatID: String,//The Value-added Tax ID of the organization or person.
		//weight: QuantitativeValue,//	The weight of the product or person.
		//workLocation: ContactPoint  or Place,//	A contact location for a person's place of work.
		//worksFor: Organization,//Organizations that the person works for.
		//>>Thing
		//additionalType: URL,//	An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types. Schema.org tools may have only weaker understanding of extra types, in particular those defined externally.
		//alternateName: String,//An alias for the item.
		description: String,//A short description of the item.
		image: schemas.ImageObject.objectify(),//	An image of the item. This can be a URL or a fully described ImageObject.
		//name: String,//The name of the item.
		//potentialAction: Action,//Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
		//sameAs: URL,//	URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.
		//url: URL,//	URL of the item.
	});
};
