# Hotel Booking Marketplace With Multiple Brokers And Shared Room Booking

## Document Purpose

This document is the single source of truth for the project concept.

It defines the core business model, hotel inventory structure, broker relationships, room ownership rules, shared room booking logic, customer experience, payment flow, and system behavior.

The platform is intended primarily for Hajj and Umrah pilgrims visiting Makkah and Madinah, while remaining flexible enough to expand later into other cities and countries.

Date: October 5, 2026

Client: Abdul Salam

Project Type: Hotel Booking Marketplace

Primary Markets: Makkah and Madinah

Future Expansion: Other cities and countries

## 1. Project Vision

Build a hotel booking marketplace similar in general user experience to Booking.com, Agoda, Airbnb, and similar hotel reservation platforms.

The platform must support normal hotel browsing and reservation features, but its main difference is that specific physical hotel rooms can be assigned to multiple brokers for the same period.

Each broker may set his own selling price and his own booking conditions.

The broker who makes the first successful sale from a physical room gains exclusive selling control of that physical room for the affected booking period.

The platform must also support room sharing, where a physical room containing multiple beds may be sold by individual bed rather than only as an entire room.

## 2. Core Business Model

Hotels contain physical rooms.

Physical rooms contain physical beds.

Brokers purchase the right to sell specific physical rooms for defined date periods.

A room may be assigned to multiple brokers for overlapping periods.

Each broker may independently set rates and commercial terms for his own offer.

However, the first broker who successfully sells either the entire room or any individual bed from that room gains exclusive selling control of that room for the relevant occupied period.

After this first confirmed sale, all competing offers from other brokers for the same room and overlapping dates must immediately become unavailable.

The winning broker may continue selling the remaining beds from that room if room sharing is enabled.

## 3. Hotel Master Data

Hotel information is stored centrally and commonly.

Brokers do not create separate copies of the same hotel, floor, room, or bed.

The common hotel record should contain information such as:

1. Hotel name

2. Official address

3. Geographic coordinates

4. City

5. Country

6. Hotel classification

7. Hotel description

8. Check in time

9. Check out time

10. Reception information

11. Amenities

12. Accessibility information

13. Parking information

14. Lift information

15. Restaurants and food facilities

16. WiFi

17. Laundry

18. Prayer facilities

19. Nearby landmarks

20. Nearby food outlets

21. Nearby shops

22. Nearby pharmacies

23. Nearby transport facilities

24. Distance from important locations

25. Walking time from important locations

26. Driving time from important locations

27. Hotel exterior pictures

28. Hotel interior pictures

29. Lobby pictures

30. Food court or restaurant pictures

31. Floor information

32. Room type information

33. Room pictures

34. Bed pictures where required

35. Any other factual hotel information approved by the platform administrator

## 4. Important Location Information

Because the initial target market is Hajj and Umrah travel, location data is especially important.

For Makkah, the system should support distances and travel times to places such as Masjid al Haram and other major pilgrimage or transport locations.

For Madinah, the system should support distances and travel times to places such as Al Masjid an Nabawi and other important pilgrimage or transport locations.

The system should distinguish between straight line distance, walking distance, walking time, and driving time whenever this information is available.

The project must not be permanently limited to pilgrimage locations. Important locations should be configurable so that future cities may use different landmarks.

## 5. Hotel Inventory Hierarchy

The preferred physical hierarchy is:

Hotel

Building, when applicable

Floor

Physical Room

Physical Bed

A room type or room category must exist separately from the physical room.

Examples of room categories may include:

Single Room

Double Room

Triple Room

Quad Room

Duplex

Suite

Family Room

Shared Room

The exact names and types must remain configurable.

A room category describes the type of accommodation.

A physical room represents the actual room inside the hotel.

Example:

Hotel ABC

Floor 3

Room 301

Category: Triple Room

Bed A

Bed B

Bed C

## 6. Physical Room Identity

The system must track exact physical rooms.

Examples:

Room 301

Room 302

Room 303

Brokers are assigned specific physical rooms rather than only a quantity of room types.

This is important because room sharing depends on knowing which exact guests or beds are inside which exact physical room.

Physical room numbers may be hidden from customers before confirmation if required by business policy.

The customer facing interface may instead show information such as:

Triple Shared Room

Third Floor

Three beds

Two beds available

## 7. Broker Model

A broker is a company or business that has purchased the right to sell one or more specific physical hotel rooms for defined date ranges.

Brokers may receive inventory from:

1. The hotel directly

2. A master broker

All room inventory assignments are verified and entered into the platform by the platform administrator.

Customers should be able to see the broker company name.

A broker may resell inventory to another broker.

This means broker inventory may originate from the hotel or through another broker.

The system should therefore support an inventory chain.

Example:

Hotel

Master Broker A

Broker B

Customer

The system must always preserve the source and chain of the room allocation for audit purposes.

## 8. Broker Room Allocation

A broker purchases a specific physical room for a specific period.

Example:

Broker A

Room 301

October 10, 2026 to October 20, 2026

Broker A has already paid for this room for that period.

The broker is financially responsible for the room whether he later sells it to customers or leaves it unsold.

The platform does not treat this as simple permission to advertise.

It represents purchased inventory rights for the specified period.

A physical room may have several broker allocations covering the same or overlapping dates.

## 9. Multiple Brokers On The Same Physical Room

A single physical room may be offered by multiple brokers for overlapping dates.

Each broker may publish his own offer.

Example:

Room 301

Broker A: Entire room 300 SAR per night

Broker B: Entire room 285 SAR per night

Broker C: Entire room 320 SAR per night

Before any confirmed sale, all valid broker offers may be shown to the customer.

The cheapest available broker offer should normally be shown as the default option.

Other valid broker offers should remain visible in a section similar to an other buying options experience.

The platform should clearly show the broker company name and the commercial differences between offers.

## 10. First Sale Wins Rule

This is one of the most important rules in the platform.

For any physical room and overlapping date period:

The first broker who successfully sells the room or any individual bed inside that room gains exclusive selling control of that physical room for the affected dates.

No other broker may interfere with or sell that room for the same affected dates after the first confirmed sale.

Example:

Room 301 contains three beds.

Broker A and Broker B both have active offers.

Broker A sells Bed A first.

Result:

Broker A becomes the exclusive selling broker for Room 301 for the affected booking period.

Broker B must immediately lose the ability to sell the whole room.

Broker B must immediately lose the ability to sell Bed A.

Broker B must immediately lose the ability to sell Bed B.

Broker B must immediately lose the ability to sell Bed C.

Only Broker A may continue selling the remaining available beds for that occupied period.

## 11. Date Sensitive Exclusivity

Broker exclusivity must apply only to the relevant overlapping booking dates.

Example:

Broker A sells Bed A from October 10 to October 15.

Broker B may still be allowed to sell Room 301 for dates after October 15 if his allocation remains valid and no other booking blocks those dates.

The system must evaluate availability by date and not permanently assign the room to one broker forever after one sale.

## 12. Whole Room Booking

A broker may offer the entire physical room as one booking.

Example:

Room 301

Three beds

Entire room price: 300 SAR per night

When a customer books the whole room:

All beds inside the room become unavailable to every other customer for the confirmed dates.

All competing broker offers for the same physical room and overlapping dates become unavailable.

The broker who sold the whole room becomes the exclusive selling broker for those dates.

## 13. Shared Room Booking

A broker may choose whether room sharing is allowed.

If room sharing is enabled, the broker may sell individual beds inside the room.

Example:

Room 301

Three beds

Entire room rate: 300 SAR per night

Bed A rate: 100 SAR per night

Bed B rate: 100 SAR per night

Bed C rate: 100 SAR per night

The bed rates do not have to be equal.

The broker may set different prices for different beds.

## 14. Shared Room Exclusivity

When the first individual bed is sold by a broker, that broker becomes the exclusive selling broker for the whole physical room for the affected dates.

Only that broker may sell the remaining beds.

Competing brokers must be blocked from further sales of that room for overlapping dates.

This avoids mixed broker control inside the same physical room.

## 15. Whole Room Offer After A Bed Is Sold

Once any bed in a room is confirmed as individually booked for a particular date period, the entire room can no longer be sold as a whole for overlapping dates.

Example:

Room 301 contains Bed A, Bed B, and Bed C.

Bed A is confirmed.

Result:

Bed B may remain available.

Bed C may remain available.

The entire room offer must become unavailable for the overlapping dates.

## 16. Bed Booking After Whole Room Sale

If the whole room has already been sold for a date period, all beds must automatically become unavailable for those dates.

No broker or customer may sell or reserve an individual bed inside the room during the whole room booking period.

## 17. Room Sharing Rules

A broker may configure whether his room offer supports:

Private room only

Shared room only

Both private room and shared room booking before the first sale

Shared room rules may also include room level restrictions such as:

Male only

Female only

Family only

Group only

Private only

Other configurable occupancy categories

Once a confirmed booking exists, later configuration changes must not invalidate that booking.

## 18. Bed Level Customer Experience

The customer should be able to visually view individual bed occupancy before booking.

The interface should feel similar to airline seat selection or cinema seat selection.

Each bed should visually show its status.

Possible statuses include:

Available

Selected by current customer

Temporarily held

Booked

Blocked

Unavailable

Out of service

For occupied beds, the platform may show limited roommate information allowed by policy.

Examples may include:

Gender

Nationality, only if legally and commercially approved

Adult or child category where relevant

Individual traveller or group traveller

Preferred language, if introduced later

The system must never expose sensitive personal information such as phone number, identity number, passport number, full guest profile, or private contact details to other customers.

## 19. Privacy And Guest Information

Room sharing information must be designed around privacy.

The platform should show only the minimum information necessary to help a customer understand who may share the room.

Gender can be useful for occupancy compatibility.

Nationality should be treated carefully because it is personal information and could create discrimination or privacy concerns.

If nationality is displayed, the platform should do so only after legal review, appropriate consent rules, and privacy policy approval.

## 20. Multiple Bed Booking

A customer may book more than one bed in the same room.

Example:

A father and adult son may book Bed A and Bed B.

Bed C remains available.

The system must support entering guest details for each occupied bed.

One customer account may therefore create a booking containing multiple guests and multiple beds.

## 21. Group Booking Support

Because the project targets Hajj and Umrah travel, the system should eventually support group accommodation.

Examples:

Family of five

Group of twelve pilgrims

Forty person Umrah group

Large tour operator group

The system should be designed so that future features can automatically allocate groups across suitable rooms while respecting occupancy rules.

## 22. Broker Pricing

Each broker controls his own commercial offer.

A broker may set:

Entire room rate

Individual bed rates

Sharing allowed or disabled

Minimum stay

Maximum stay

Cancellation rules

Refund rules

Check in instructions

Check out instructions

Meal inclusion

Breakfast inclusion

Transport inclusion

Shuttle inclusion

Pilgrimage related service inclusion

Additional service information

Broker specific notes

Taxes or fees where applicable

Other configurable commercial terms

## 23. Broker Description

Each broker may add information that relates only to his own service.

Examples:

Our representative will meet you at reception.

Airport transfer is available.

Urdu speaking customer support is available.

Breakfast voucher included.

Transport service included.

The broker must not be able to overwrite factual hotel information unless the platform administrator approves the change.

## 24. Source Of Truth Hierarchy

Hotel and physical property information is managed centrally.

Broker information relates only to the broker's commercial offer.

The source of truth should follow this principle:

Physical truth belongs to the central hotel record and platform administration.

Commercial truth belongs to the broker offer.

Examples of centrally controlled factual data:

Hotel name

Address

Hotel classification

Floor

Physical room

Room capacity

Physical bed count

Bathroom count

Amenities

Room dimensions

Official pictures

Hotel policies

Examples of broker controlled commercial data:

Selling price

Bed price

Sharing choice

Services

Cancellation terms

Refund rules

Broker description

Broker specific instructions

## 25. Platform Administrator Role

The platform administrator is responsible for verifying and entering broker inventory assignments.

The administrator should be able to:

Create and manage hotels

Create and manage floors

Create and manage physical rooms

Create and manage physical beds

Manage hotel pictures

Manage room pictures

Manage bed pictures

Manage amenities

Manage important nearby places

Verify brokers

Create or approve broker inventory assignments

Record the inventory source

Record master broker relationships

Record broker resale relationships

Approve inventory date ranges

Block invalid or conflicting allocations

Audit room ownership history

Audit broker allocation history

Audit booking history

Correct factual hotel information

Suspend brokers when required

## 26. Inventory Chain

Because one broker may resell inventory to another broker, the system must preserve the inventory chain.

Example:

Hotel ABC

Room 301

Hotel assigns room to Master Broker A.

Master Broker A assigns room to Broker B.

Broker B sells room to Customer C.

The system should be able to trace the entire chain.

This is important for disputes, settlement, verification, and auditing.

## 27. Customer Payment Model

The platform does not collect customer payment in the initial business model.

Customers pay the broker outside the platform.

Payment may be cash or another method handled directly between customer and broker.

The platform records the booking and reservation details but is not responsible for receiving the customer payment.

The system should clearly show the responsible broker and payment instructions.

## 28. Invoice And Voucher

The broker is responsible for issuing:

Customer invoice

Booking voucher

Any payment receipt

Any other commercial document required between broker and customer

The platform may store copies or references to these documents in the future if required.

## 29. Cancellation And Refund Responsibility

The individual broker handles cancellation and refund matters.

The platform should display each broker's cancellation and refund conditions clearly before booking.

The platform is not the primary party responsible for refunding customer money in the initial business model.

## 30. Booking Status

The system should support clear booking states.

Examples:

Available

Temporarily held

Pending broker confirmation

Confirmed

Cancelled

Expired

Checked in

Checked out

No show

Blocked

Out of service

Exact status names may be refined during detailed requirements design.

## 31. Temporary Booking Hold

The system should support temporary inventory holds.

When a customer begins a booking, the selected room or bed may be temporarily held for a limited period.

During this hold, another customer should not be able to confirm the same inventory.

If the booking is not completed within the allowed hold period, the inventory becomes available again.

This rule is important during high traffic pilgrimage periods.

## 32. Customer Search Experience

The website should provide a standard modern hotel marketplace search experience.

Core search features should include:

Destination

Check in date

Check out date

Number of guests

Number of rooms where relevant

Private or shared accommodation preference

Gender compatible shared room preference where applicable

Price range

Hotel category

Amenities

Distance from important locations

Walking distance

Room type

Availability

Other future filters

## 33. Hotel Result Views

The customer should be able to browse hotels using:

List view

Map view

Search results view

Filtered results

Sorted results

The map and list should remain connected so a customer can understand hotel location and nearby points of interest.

## 34. Hotel Detail Page

A hotel page should include:

Hotel name

Hotel pictures

Location

Map

Description

Amenities

Hotel policies

Room categories

Available physical room offers

Broker offers

Prices

Nearby food locations

Nearby shops

Nearby pharmacies

Nearby transport

Distances to important landmarks

Walking time

Room pictures

Bed pictures where applicable

Cancellation terms

Broker information

## 35. Broker Offer Comparison

When several brokers have valid offers for the same physical room before the first sale, the platform should compare them.

The cheapest eligible offer should normally appear as the default.

The interface should also provide other booking options.

Example:

Triple Room

Cheapest Offer

Broker A

270 SAR

Other Booking Options

Broker B

285 SAR

Broker C

310 SAR

Customers must be able to see the broker company name.

The interface should also make it easy to compare differences such as:

Refundability

Cancellation terms

Meals

Transport

Additional services

Room sharing availability

## 36. Cheapest Offer Logic

The system should distinguish between cheapest price and best value.

The default may be the lowest total comparable price.

However, the interface should not hide important differences in terms and services.

Example:

Broker A

300 SAR

Non refundable

Room only

Broker B

310 SAR

Free cancellation

Breakfast included

Broker A may be labelled cheapest.

Broker B may appear under another booking option.

Future recommendation labels may include:

Cheapest

Flexible

Breakfast included

Best value

These labels must be configurable.

## 37. Room Pictures And Bed Pictures

Pictures may exist at several levels.

Hotel exterior

Hotel interior

Lobby

Restaurant

Facilities

Room category

Physical room

Bathroom

Room view

Bed

Each room category may have its own pictures.

Individual beds may also have pictures where useful.

The system should not require a unique picture for every bed when several beds are identical.

A room layout illustration may sometimes be more useful.

## 38. Room Sharing Visual Interface

The room sharing interface should visually represent the physical layout of beds.

Example:

Room 301

Bed A: Booked

Bed B: Available

Bed C: Booked

The customer should be able to select an available bed directly from the room layout.

The interface should communicate:

Bed identifier

Price

Availability

Occupancy

Limited roommate information

Broker name

Relevant booking terms

The design should feel familiar to customers who have used airline seating or cinema seat selection.

## 39. Broker Exclusivity After First Sale

This rule must be enforced by the backend and not only by the user interface.

Once Broker A confirms the first booking in Room 301 for certain dates:

Broker A owns customer selling control of that room for those dates.

All competing broker offers must be blocked.

The rule applies even if Broker B offers a cheaper price after the booking.

The rule applies even if Broker B previously allowed whole room booking.

The rule applies to both room sales and bed sales.

## 40. Inventory Conflict Prevention

Availability must always be calculated from the physical room and bed occupancy first.

Broker offer availability alone must never be treated as proof that the physical room is available.

This rule prevents double booking.

Before every booking confirmation, the platform must verify:

Physical room availability

Physical bed availability when applicable

Date overlap

Existing confirmed bookings

Existing temporary holds

Existing broker exclusivity for the relevant dates

Broker allocation validity

Broker selling rights

## 41. Resale By Master Broker

A master broker may assign purchased inventory to another broker.

The receiving broker may then publish his own commercial offer if authorised.

The system should preserve:

Original hotel source

Master broker

Receiving broker

Physical room

Date range

Purchase or transfer reference

Allocation status

Current selling rights

Booking history

This chain must remain auditable.

## 42. Broker Ownership Of Unsold Inventory

Because the broker prepays for his room allocation, he remains financially responsible even if the room is not sold.

The platform does not automatically return unsold inventory to the hotel unless the parties create a separate business rule for this.

The broker may:

Sell the room

Sell beds if sharing is enabled

Resell the room inventory to another broker

Keep the room for his own use

Leave the room unused

Any later release or transfer rules should be defined separately.

## 43. Customer Booking Flow

A typical customer journey may be:

Search destination and dates.

View hotel list.

Open hotel.

Compare room options.

Compare broker offers.

Choose private room or shared room where allowed.

If shared room is chosen, view bed layout and occupancy.

Choose available bed or beds.

Review broker company name.

Review broker terms.

Review price.

Review cancellation terms.

Review roommate information where applicable.

Submit booking request or reservation.

Broker handles payment outside the platform.

Broker confirms booking.

Broker issues invoice and voucher.

The platform updates physical room and bed availability.

All competing broker offers are blocked according to the first sale wins rule.

## 44. Pilgrimage Specific Features

Because the first target market is Hajj and Umrah pilgrims, the system should be prepared for features such as:

Distance to Masjid al Haram

Distance to Al Masjid an Nabawi

Walking time

Transport availability

Shuttle information

Pilgrimage group booking

Family booking

Male and female room separation

Group leader information

Meal plans

Ziyarat transport

Airport transfer

Train station transfer

Pilgrimage package services

Large group room allocation

High traffic seasonal inventory

These features must be modular and should not prevent the system from later supporting normal hotels in other markets.

## 45. Geographic Expansion

The platform must not hardcode Makkah and Madinah into the basic data model.

Hotel location, important landmarks, nearby places, currencies, languages, policies, and local business rules should be configurable.

The core booking engine should remain usable in other cities and countries.

## 46. Regulatory And Verification Considerations

The platform should support broker verification and hotel inventory verification.

Before commercial launch, the business should obtain proper legal review regarding:

Hotel booking activity

Travel and tourism licensing

Broker licensing

Hajj and Umrah accommodation rules

Consumer rights

Privacy requirements

Guest data handling

Nationality data

Cancellation policy disclosure

Invoice requirements

Tax requirements

The software should remain flexible enough to store licence information and verification status.

## 47. Important Non Negotiable Rules

Rule 1

There is only one central physical hotel inventory record.

Rule 2

Brokers do not create duplicate physical rooms.

Rule 3

A broker receives specific physical room inventory for specific dates.

Rule 4

Several brokers may have valid offers for the same physical room before any sale.

Rule 5

The first broker who sells the whole room or any bed gains exclusive selling control of that physical room for the overlapping booking period.

Rule 6

After the first sale, no competing broker may sell any part of that room for the affected dates.

Rule 7

If a bed is sold individually, the whole room can no longer be sold for overlapping dates.

Rule 8

If the whole room is sold, all beds become unavailable for overlapping dates.

Rule 9

Only the winning broker may continue selling remaining beds after the first shared bed sale.

Rule 10

Broker exclusivity is date sensitive.

Rule 11

Physical room and bed availability always takes priority over broker offer availability.

Rule 12

Brokers may have different rates for the same room.

Rule 13

Brokers may have different rates for individual beds.

Rule 14

Brokers may independently choose whether sharing is allowed before the first sale.

Rule 15

The cheapest eligible broker offer is shown as the default before any broker gains exclusivity.

Rule 16

Other valid broker offers remain visible as other booking options before the first sale.

Rule 17

Customers can see the broker company name.

Rule 18

Customers pay brokers outside the platform in the initial business model.

Rule 19

Brokers issue invoices and booking vouchers.

Rule 20

Brokers handle their own cancellations and refunds.

Rule 21

Brokers prepay for their inventory and remain financially responsible for unsold rooms.

Rule 22

Brokers may resell inventory to other brokers.

Rule 23

The full inventory chain must remain auditable.

Rule 24

The platform administrator verifies and enters broker room allocations.

Rule 25

Factual hotel and physical inventory information is centrally controlled.

Rule 26

Broker descriptions may describe broker services but may not override central hotel facts.

Rule 27

Confirmed bookings must never be invalidated by later broker setting changes.

Rule 28

The system must prevent double booking through backend inventory locking and date overlap checks.

Rule 29

Shared room guest information must follow privacy rules.

Rule 30

The system should remain expandable beyond Makkah, Madinah, Hajj, and Umrah.

## 48. Product Identity

The project is not simply another hotel listing website.

Its defining combination is:

A hotel marketplace

Multiple brokers

Broker specific room pricing

Broker specific bed pricing

Exact physical room allocation

Exact physical bed inventory

First sale wins broker exclusivity

Shared room booking

Visual bed selection

Limited roommate visibility

Master broker resale

Pilgrimage focused accommodation

Future global expansion

## 49. Final Product Principle

The platform must treat physical accommodation inventory and commercial broker offers as separate but connected concepts.

Physical rooms and beds represent real inventory.

Broker allocations represent selling rights.

Broker offers represent price and commercial terms.

Bookings consume physical inventory.

The first confirmed booking determines broker exclusivity for the affected physical room and dates.

Every system feature should preserve this principle.
