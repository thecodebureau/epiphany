var mongoose = require('mongoose');

module.exports = function() {
	return new mongoose.Schema({
		"@context": { type: String, default: "http://schema.org" },
		"@type": { type: String, default: "Event" },
		//>>Event
		//attendee	Person  or Organization	A person or organization attending the event. Supersedes attendees.
		//doorTime	DateTime	The time admission will commence.
		//duration	Duration	The duration of the item (movie, audio recording, event, etc.) in ISO 8601 date format.
		endDate: { type: Date, default: Date.now },//The end date and time of the item (in ISO 8601 date format).
		//eventStatus	EventStatusType		An eventStatus of an event represents its status; particularly useful when an event is cancelled or rescheduled.
		//location	PostalAddress  or Place		The location of the event, organization or action.
		//offers	Offer		An offer to provide this item—for example, an offer to sell a product, rent the DVD of a movie, or give away tickets to an event.
		//organizer	Person  or Organization	An organizer of an Event.
		//performer	Person  or Organization	A performer at the event—for example, a presenter, musician, musical group or actor. Supersedes performers.
		//previousStartDate	Date	Used in conjunction with eventStatus for rescheduled or cancelled events. This property contains the previously scheduled start date. For rescheduled events, the startDate property should be used for the newly scheduled start date. In the (rare) case of an event that has been postponed and rescheduled multiple times, this field may be repeated.
		//recordedIn	CreativeWork	The CreativeWork that captured all or part of this Event.  Inverse property: recordedAt.
		startDate: { type: Date, default: Date.now },//The start date and time of the item (in ISO 8601 date format).
		//subEvent	Event		An Event that is part of this event. For example, a conference event includes many presentations, each of which is a subEvent of the conference. Supersedes subEvents.
		//superEvent	Event		An event that this event is a part of. For example, a collection of individual music performances might each have a music festival as their superEvent.
		//typicalAgeRange: String,//The typical expected age range, e.g. '7-9', '11-'.
		//workPerformed	CreativeWork	A work performed in some event, for example a play performed in a TheaterEvent.
		//>>Thing
		//additionalType	URL		An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types. Schema.org tools may have only weaker understanding of extra types, in particular those defined externally.
		//alternateName	String	An alias for the item.
		description: String,//A short description of the item.
		//image	URL  or 
		//ImageObject		An image of the item. This can be a URL or a fully described ImageObject.
		name: String,//The name of the item.
		//potentialAction	Action	Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
		//sameAs	URL		URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.
		//url	URL		URL of the item.
	});
}
