# Sakina — End-User Website Prototype

Interactive **mockup prototype** for the client (Abdul Salam) of the hotel booking marketplace
described in `docs/hotel_booking_multi_broker_shared_room_source_of_truth.md`.

Pure HTML + Tailwind (CDN) + vanilla JS. No frameworks, no build step, no real
login / payment / booking — every action is simulated with mock data.

## Run

Any static server works:

```bash
python3 -m http.server 8766
```

Then open <http://localhost:8766>. (Opening `index.html` directly also works in most
cases, but a server keeps URL params and sessions consistent.)

## Pages

| Page | File | Demonstrates |
| --- | --- | --- |
| Landing | `index.html` | Hero search (destination, dates, guests, private/shared), featured hotels, shared-room explainer with bed map, broker model explainer |
| Search results | `search.html` | Filters (price, distance to Haram/Nabawi, class, amenities, shared-room gender), sorting, staggered cards, map sheet |
| Hotel detail | `hotel.html` | Gallery + lightbox, amenities, distances, **broker offer comparison** — cheapest offer first, "Other booking options", and offers **closed by the first-sale rule** |
| Booking flow | `booking.html` | 3-step stepper, **interactive bed map** (available / selected / booked / held), 15-minute hold timer, multi-bed guest details, review & submit |
| Confirmation | `confirmation.html` | Pending-broker-confirmation status, pay-the-broker instructions, next steps, sample voucher modal, room number revealed after confirmation |

## Business rules baked into the demo

- Room 703 at Safwah Royale Orchid: Bed A already sold by **Al-Noor Travels**, so the two
  competing broker offers show as *Closed — first-sale rule*.
- Bed prices differ per bed (window-side costs more); whole-room vs per-bed pricing.
- Physical room numbers are hidden until confirmation (revealed on the confirmation page).
- Platform takes no payment — broker payment instructions, invoice & voucher by broker.

## Structure

```
.
├── index.html / search.html / hotel.html / booking.html / confirmation.html
├── docs/
│   └── hotel_booking_multi_broker_shared_room_source_of_truth.md
├── css/styles.css      # motion & material design layer (easings, bed map, modals)
└── js/
    ├── data.js         # mock hotels, brokers, rooms, bed states
    ├── app.js          # shared runtime (header, footer, toasts, modals, image fallback)
    ├── search.js       # filtering / sorting / map pins
    ├── hotel.js        # gallery, offers, lightbox
    └── booking.js      # stepper, bed selection, hold timer, submit
```

Photos are hot-linked from Unsplash and fall back gracefully if a photo is unavailable.
