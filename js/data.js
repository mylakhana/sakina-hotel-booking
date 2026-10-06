/* ============================================================
   Sakina — prototype mock data
   End-user (customer) view only. No real bookings/payments.
   ============================================================ */

const U = {
  makkah: '1565019001609-0e34a6a22189',
  madinah: '1551041777-575d3855ca71',
  nabawi: '1571909552531-1601eaec8f79',
  roomLux: '1582719508461-905c673771fd',
  roomWarm: '1611892440504-42a792e24d32',
  roomBed: '1590490360182-c33d57733427',
  roomModern: '1631049307264-da0ec9d70304',
  roomWhite: '1618773928121-c32242e63f39',
  roomDark: '1578683010236-d716f9a3f461',
  pool: '1566073771259-6a8506099945',
  lobby: '1542314831-068cd1dbfeeb',
  bath: '1584622650111-993a426fbf0a',
  ext: '1520250497591-112f2f40a3f4',
  roomA: '1560185127-6ed189bf02f4',
  roomC: '1560185007-cde436f6a4d0',
  bedroom: '1505693416388-ac5ce068fe85',
};
const img = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const BROKERS = {
  an: {
    name: 'Al-Noor Travels', initials: 'AN', rating: 4.8, reviews: 512, tone: 'pine',
    services: ['Urdu & English support', 'Reception meet & greet', '24/7 helpline'],
    note: 'Our representative will meet you at reception. Urdu speaking customer support is available around the clock.',
  },
  mg: {
    name: 'Makkah Gate Hotels', initials: 'MG', rating: 4.6, reviews: 1024, tone: 'indigo',
    services: ['Breakfast voucher', 'Airport transfer on request'],
    note: 'Breakfast voucher included. Airport transfer available on request.',
  },
  zt: {
    name: 'Zarqam Tours', initials: 'ZT', rating: 4.7, reviews: 388, tone: 'bronze',
    services: ['Ziyarat transport', 'Group leader support'],
    note: 'Ziyarat transport included. Dedicated group leader support for pilgrim groups.',
  },
  at: {
    name: 'Al Taibah Services', initials: 'AT', rating: 4.9, reviews: 741, tone: 'pine',
    services: ['Female staff on floors', 'Breakfast included'],
    note: 'Female-only floors with female staff. Breakfast included for all guests.',
  },
  nh: {
    name: 'Nabawi Hospitality', initials: 'NH', rating: 4.5, reviews: 265, tone: 'indigo',
    services: ['Luggage assistance', 'Late check-out on request'],
    note: 'Luggage assistance from the Northern Gates. Late check-out on request.',
  },
};

const HOTELS = [
  {
    id: 'safwah',
    name: 'Safwah Royale Orchid',
    city: 'Makkah', stars: 5,
    address: 'Ibrahim Al Khalil St, Ajyad, Makkah',
    rating: 9.2, label: 'Wonderful', reviews: 1284,
    dist: { m: 250, walk: 4 },
    landmark: 'Masjid al-Haram',
    img: U.roomLux,
    gallery: [U.roomLux, U.pool, U.roomWarm, U.lobby, U.bath, U.ext],
    amenities: ['Free WiFi', 'Restaurant', 'Prayer hall', 'Laundry', 'Elevator', '24-hour front desk', 'Airport shuttle', 'Daily housekeeping', 'Air conditioning'],
    desc: 'A refined stay steps from the Haram. Bright triple and family rooms, a 24-hour restaurant, and a dedicated prayer hall. Elevators serve all floors and the front desk arranges airport transfers.',
    nearby: [
      { icon: 'utensils', name: 'Al Baik — Ajyad', walk: 3 },
      { icon: 'cross', name: 'Nahdi Pharmacy', walk: 2 },
      { icon: 'bus', name: 'Haram Metro Station', walk: 6 },
      { icon: 'shopping-bag', name: 'Abraj Souq', walk: 5 },
    ],
    shared: { available: true, genders: ['male'] },
    privateAvailable: true,
    mapX: 38, mapY: 30,
    rooms: [
      {
        id: 'r703', name: 'Triple Shared Room', floor: 'Floor 7', size: '28 m²',
        sharing: true, gender: 'male', bedsTotal: 3,
        offers: [
          {
            broker: 'an', active: true, badge: 'Cheapest',
            whole: 270,
            beds: {
              A: { price: 95, status: 'booked', roommate: { gender: 'Male', type: 'Solo traveller' } },
              B: { price: 100, status: 'available', pos: 'Window side' },
              C: { price: 105, status: 'available', pos: 'Aisle side' },
            },
            refundable: false, breakfast: false, cancel: 'Non-refundable', minStay: 2,
          },
          { broker: 'mg', active: false, blockedBy: 'an', whole: 285, bedFrom: 105, refundable: true, breakfast: true, cancel: 'Free until Oct 9' },
          { broker: 'zt', active: false, blockedBy: 'an', whole: 310, bedFrom: 115, refundable: true, breakfast: true, transport: true, cancel: 'Free until Oct 8' },
        ],
      },
      {
        id: 'r905', name: 'Double Room', floor: 'Floor 9', size: '24 m²',
        sharing: false, bedsTotal: 2,
        offers: [
          { broker: 'mg', active: true, badge: 'Cheapest', whole: 240, refundable: false, breakfast: false, cancel: 'Non-refundable', minStay: 1 },
          { broker: 'an', active: true, whole: 255, refundable: true, breakfast: true, cancel: 'Free until Oct 9', minStay: 1 },
        ],
      },
      {
        id: 'r711', name: 'Family Suite (4)', floor: 'Floor 12', size: '40 m²',
        sharing: false, bedsTotal: 4,
        offers: [
          { broker: 'zt', active: true, badge: 'Cheapest', whole: 420, refundable: true, breakfast: true, transport: true, cancel: 'Free until Oct 8', minStay: 1 },
        ],
      },
    ],
  },
  {
    id: 'marwa',
    name: 'Al Marwa Rayyan Hotel',
    city: 'Makkah', stars: 5,
    address: 'King Abdul Aziz Rd, Makkah',
    rating: 8.8, label: 'Excellent', reviews: 2041,
    dist: { m: 450, walk: 8 },
    landmark: 'Masjid al-Haram',
    img: U.roomWarm,
    gallery: [U.roomWarm, U.lobby, U.bath, U.ext],
    amenities: ['Free WiFi', 'Restaurant', 'Prayer hall', 'Laundry', 'Elevator', '24-hour front desk', 'Air conditioning'],
    desc: 'Elegant rooms with Haram-side views on upper floors. Popular with families and female pilgrim groups, with female-staffed floors and a quiet study lounge.',
    nearby: [
      { icon: 'utensils', name: 'Herfy Restaurant', walk: 2 },
      { icon: 'cross', name: 'Aldawi Pharmacy', walk: 3 },
    ],
    shared: { available: true, genders: ['female'] },
    privateAvailable: true,
    mapX: 62, mapY: 24,
    rooms: [
      {
        id: 'q201', name: 'Quad Shared Room', floor: 'Floor 2', size: '32 m²',
        sharing: true, gender: 'female', bedsTotal: 4,
        offers: [
          {
            broker: 'at', active: true, badge: 'Cheapest', whole: 440,
            beds: {
              A: { price: 110, status: 'available', pos: 'Window side' },
              B: { price: 110, status: 'available' },
              C: { price: 110, status: 'available' },
              D: { price: 110, status: 'available', pos: 'Door side' },
            },
            refundable: true, breakfast: true, cancel: 'Free until Oct 9', minStay: 2,
          },
        ],
      },
      {
        id: 'd305', name: 'Double Room', floor: 'Floor 3', size: '25 m²',
        sharing: false, bedsTotal: 2,
        offers: [
          { broker: 'mg', active: true, badge: 'Cheapest', whole: 340, refundable: true, breakfast: true, cancel: 'Free until Oct 9', minStay: 1 },
        ],
      },
    ],
  },
  {
    id: 'clock',
    name: 'Makkah Clock Inn',
    city: 'Makkah', stars: 3,
    address: 'Ajyad St, Makkah',
    rating: 8.2, label: 'Very good', reviews: 3562,
    dist: { m: 700, walk: 11 },
    landmark: 'Masjid al-Haram',
    img: U.roomBed,
    gallery: [U.roomBed, U.roomModern, U.lobby],
    amenities: ['Free WiFi', 'Elevator', '24-hour front desk', 'Laundry'],
    desc: 'Simple, spotless rooms for pilgrims on a budget. Shared triple rooms with individual beds and lockers, five minutes from the Ajyad escalators.',
    nearby: [
      { icon: 'utensils', name: 'Shawarma House', walk: 1 },
      { icon: 'bus', name: 'Ajyad Bus Stop', walk: 2 },
    ],
    shared: { available: true, genders: ['male', 'female'] },
    privateAvailable: true,
    mapX: 24, mapY: 58,
    rooms: [
      {
        id: 't302', name: 'Triple Shared Room', floor: 'Floor 3', size: '24 m²',
        sharing: true, gender: 'any', bedsTotal: 3,
        offers: [
          {
            broker: 'an', active: true, badge: 'Cheapest', whole: 180,
            beds: {
              A: { price: 65, status: 'available', pos: 'Window side' },
              B: { price: 65, status: 'available' },
              C: { price: 70, status: 'available', pos: 'Aisle side' },
            },
            refundable: false, breakfast: false, cancel: 'Non-refundable', minStay: 1,
          },
        ],
      },
      {
        id: 's118', name: 'Single Room', floor: 'Floor 1', size: '14 m²',
        sharing: false, bedsTotal: 1,
        offers: [
          { broker: 'an', active: true, badge: 'Cheapest', whole: 120, refundable: false, breakfast: false, cancel: 'Non-refundable', minStay: 1 },
        ],
      },
    ],
  },
  {
    id: 'dar',
    name: 'Dar Al Eiman Royal',
    city: 'Makkah', stars: 4,
    address: 'Ibrahim Al Khalil St, Makkah',
    rating: 8.9, label: 'Excellent', reviews: 1876,
    dist: { m: 300, walk: 5 },
    landmark: 'Masjid al-Haram',
    img: U.roomModern,
    gallery: [U.roomModern, U.bath, U.lobby],
    amenities: ['Free WiFi', 'Restaurant', 'Prayer hall', 'Laundry', 'Elevator', '24-hour front desk', 'Air conditioning'],
    desc: 'Family-focused hotel with connecting rooms and a warm dining room serving pre-dawn Suhoor during pilgrimage seasons.',
    nearby: [
      { icon: 'utensils', name: 'Al Tazaj', walk: 2 },
      { icon: 'cross', name: 'Nahdi Pharmacy', walk: 2 },
    ],
    shared: { available: false, genders: [] },
    privateAvailable: true,
    mapX: 46, mapY: 52,
    rooms: [
      {
        id: 'f501', name: 'Family Room (4)', floor: 'Floor 5', size: '34 m²',
        sharing: false, bedsTotal: 4,
        offers: [
          { broker: 'mg', active: true, badge: 'Cheapest', whole: 320, refundable: true, breakfast: true, cancel: 'Free until Oct 9', minStay: 1 },
        ],
      },
      {
        id: 'd502', name: 'Double Room', floor: 'Floor 5', size: '24 m²',
        sharing: false, bedsTotal: 2,
        offers: [
          { broker: 'mg', active: true, badge: 'Cheapest', whole: 260, refundable: false, breakfast: false, cancel: 'Non-refundable', minStay: 1 },
        ],
      },
    ],
  },
  {
    id: 'elaf',
    name: 'Elaf Kinda Hotel',
    city: 'Makkah', stars: 4,
    address: 'Al Masjid Al Haram Rd, Makkah',
    rating: 8.1, label: 'Very good', reviews: 2410,
    dist: { m: 350, walk: 6 },
    landmark: 'Masjid al-Haram',
    img: U.roomWhite,
    gallery: [U.roomWhite, U.lobby, U.pool],
    amenities: ['Free WiFi', 'Restaurant', 'Elevator', '24-hour front desk', 'Laundry'],
    desc: 'Modern rooms a six-minute walk from the King Fahd Gate. Mixed and male-only shared doubles with privacy curtains on every bed.',
    nearby: [
      { icon: 'utensils', name: 'Kudu', walk: 2 },
      { icon: 'shopping-bag', name: 'Kinda Plaza', walk: 4 },
    ],
    shared: { available: true, genders: ['male'] },
    privateAvailable: true,
    mapX: 55, mapY: 62,
    rooms: [
      {
        id: 'd217', name: 'Shared Double', floor: 'Floor 2', size: '20 m²',
        sharing: true, gender: 'male', bedsTotal: 2,
        offers: [
          {
            broker: 'an', active: true, badge: 'Cheapest', whole: 160,
            beds: {
              A: { price: 85, status: 'available', pos: 'Window side' },
              B: { price: 90, status: 'available', pos: 'Door side' },
            },
            refundable: false, breakfast: false, cancel: 'Non-refundable', minStay: 1,
          },
        ],
      },
      {
        id: 't219', name: 'Triple Room', floor: 'Floor 2', size: '26 m²',
        sharing: false, bedsTotal: 3,
        offers: [
          { broker: 'an', active: true, badge: 'Cheapest', whole: 250, refundable: true, breakfast: false, cancel: 'Free until Oct 8', minStay: 1 },
        ],
      },
    ],
  },
  {
    id: 'taibah',
    name: 'Al Eiman Taibah',
    city: 'Madinah', stars: 4,
    address: 'Central Area, Madinah',
    rating: 9.0, label: 'Wonderful', reviews: 2210,
    dist: { m: 200, walk: 3 },
    landmark: 'Al Masjid an Nabawi',
    img: U.roomDark,
    gallery: [U.roomDark, U.lobby, U.bath],
    amenities: ['Free WiFi', 'Restaurant', 'Prayer hall', 'Laundry', 'Elevator', '24-hour front desk'],
    desc: 'A calm stay in the Central Area, three minutes on foot from the Prophet\u2019s Mosque. Shared quads and quiet doubles.',
    nearby: [
      { icon: 'utensils', name: 'Marmara Restaurant', walk: 2 },
      { icon: 'cross', name: 'Al Nahdi Pharmacy', walk: 2 },
    ],
    shared: { available: true, genders: ['male'] },
    privateAvailable: true,
    mapX: 44, mapY: 34,
    rooms: [
      {
        id: 'q102', name: 'Quad Shared Room', floor: 'Floor 1', size: '30 m²',
        sharing: true, gender: 'male', bedsTotal: 4,
        offers: [
          {
            broker: 'at', active: true, badge: 'Cheapest', whole: 380,
            beds: {
              A: { price: 90, status: 'available', pos: 'Window side' },
              B: { price: 90, status: 'available' },
              C: { price: 95, status: 'available' },
              D: { price: 95, status: 'available', pos: 'Door side' },
            },
            refundable: true, breakfast: true, cancel: 'Free until Oct 9', minStay: 2,
          },
        ],
      },
      {
        id: 'd204', name: 'Double Room', floor: 'Floor 2', size: '24 m²',
        sharing: false, bedsTotal: 2,
        offers: [
          { broker: 'at', active: true, badge: 'Cheapest', whole: 300, refundable: true, breakfast: true, cancel: 'Free until Oct 9', minStay: 1 },
        ],
      },
    ],
  },
  {
    id: 'nabawiview',
    name: 'Nabawi View Suites',
    city: 'Madinah', stars: 5,
    address: 'Al Manakhah, Madinah',
    rating: 8.7, label: 'Excellent', reviews: 940,
    dist: { m: 350, walk: 6 },
    landmark: 'Al Masjid an Nabawi',
    img: U.roomA,
    gallery: [U.roomA, U.lobby, U.ext],
    amenities: ['Free WiFi', 'Restaurant', 'Prayer hall', 'Elevator', '24-hour front desk', 'Air conditioning'],
    desc: 'Suites with mosque-facing balconies — the green dome in view from upper floors. Ideal for families visiting the Rawdah.',
    nearby: [
      { icon: 'utensils', name: 'Al Rawda Cafe', walk: 2 },
      { icon: 'bus', name: 'Central Bus Hub', walk: 5 },
    ],
    shared: { available: false, genders: [] },
    privateAvailable: true,
    mapX: 60, mapY: 50,
    rooms: [
      {
        id: 's801', name: 'Nabawi View Suite', floor: 'Floor 8', size: '42 m²',
        sharing: false, bedsTotal: 4,
        offers: [
          { broker: 'nh', active: true, badge: 'Cheapest', whole: 380, refundable: true, breakfast: true, cancel: 'Free until Oct 9', minStay: 1 },
        ],
      },
    ],
  },
  {
    id: 'taibafront',
    name: 'Taiba Front Hotel',
    city: 'Madinah', stars: 4,
    address: 'Sayyid Al Shuhada St, Madinah',
    rating: 8.5, label: 'Very good', reviews: 1330,
    dist: { m: 500, walk: 8 },
    landmark: 'Al Masjid an Nabawi',
    img: U.roomC,
    gallery: [U.roomC, U.bedroom, U.lobby],
    amenities: ['Free WiFi', 'Elevator', '24-hour front desk', 'Laundry'],
    desc: 'Friendly hotel on the western side of the Central Area, with bright shared triples and a rooftop prayer space.',
    nearby: [
      { icon: 'utensils', name: 'Broasted House', walk: 3 },
      { icon: 'cross', name: 'City Pharmacy', walk: 2 },
    ],
    shared: { available: true, genders: ['male', 'female'] },
    privateAvailable: true,
    mapX: 30, mapY: 66,
    rooms: [
      {
        id: 't402', name: 'Triple Shared Room', floor: 'Floor 4', size: '26 m²',
        sharing: true, gender: 'any', bedsTotal: 3,
        offers: [
          {
            broker: 'an', active: true, badge: 'Cheapest', whole: 210,
            beds: {
              A: { price: 75, status: 'available', pos: 'Window side' },
              B: { price: 75, status: 'available' },
              C: { price: 80, status: 'available', pos: 'Aisle side' },
            },
            refundable: false, breakfast: false, cancel: 'Non-refundable', minStay: 1,
          },
        ],
      },
      {
        id: 'd404', name: 'Double Room', floor: 'Floor 4', size: '22 m²',
        sharing: false, bedsTotal: 2,
        offers: [
          { broker: 'mg', active: true, badge: 'Cheapest', whole: 280, refundable: true, breakfast: false, cancel: 'Free until Oct 8', minStay: 1 },
        ],
      },
    ],
  },
];

/* ---------- Helpers ---------- */

function findHotel(id) { return HOTELS.find(h => h.id === id) || HOTELS[0]; }
function findRoom(hotel, roomId) { return hotel.rooms.find(r => r.id === roomId) || hotel.rooms[0]; }
function broker(id) { return BROKERS[id]; }

function hotelFromPrice(hotel) {
  let min = Infinity;
  hotel.rooms.forEach(r => r.offers.forEach(o => {
    if (!o.active && !o.broker) return;
    if (o.active) {
      if (o.beds) Object.values(o.beds).forEach(b => { if (b.status === 'available') min = Math.min(min, b.price); });
      if (o.whole) min = Math.min(min, o.whole / (r.bedsTotal || 1));
    }
  }));
  return min === Infinity ? 0 : Math.round(min);
}

function roomAvailableBeds(room) {
  const offer = room.offers.find(o => o.active && o.beds);
  if (!offer) return null;
  return { total: room.bedsTotal, free: Object.values(offer.beds).filter(b => b.status === 'available').length, offer };
}

function sharedLabel(genders) {
  if (genders.length === 0) return null;
  if (genders.length > 1) return 'Mixed shared rooms';
  return genders[0] === 'female' ? 'Female-only shared rooms' : 'Male-only shared rooms';
}

const AMENITY_ICONS = {
  'Free WiFi': 'wifi', 'Restaurant': 'utensils', 'Prayer hall': 'moon-star', 'Laundry': 'shirt',
  'Elevator': 'arrow-up-down', '24-hour front desk': 'clock', 'Airport shuttle': 'plane',
  'Daily housekeeping': 'sparkles', 'Air conditioning': 'wind',
};

const DEFAULT_DATES = { in: '2026-10-12', out: '2026-10-16' };
