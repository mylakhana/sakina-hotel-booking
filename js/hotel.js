/* ============================================================
   Sakina — hotel detail page logic
   ============================================================ */

(() => {
  const trip = tripParams();
  const hotel = findHotel(qs.get('id'));
  const nights = nightsBetween(trip.in, trip.out);
  document.title = `${hotel.name} — Sakina`;
  $('#backLabel').textContent = `All stays in ${hotel.city}`;

  /* ---------- Head ---------- */
  $('#hotelHead').innerHTML = `
    <div class="flex flex-wrap items-start justify-between gap-5">
      <div>
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="display text-3xl md:text-[2.6rem] font-semibold">${hotel.name}</h1>
          <span class="badge badge-gold"><span class="star-gold">${'★'.repeat(hotel.stars)}</span>${hotel.stars}-star</span>
        </div>
        <p class="muted text-sm mt-2.5 flex items-center gap-1.5"><i data-lucide="map-pin" class="w-4 h-4"></i>${hotel.address}</p>
        <div class="flex items-center gap-2.5 mt-3 flex-wrap">
          <span class="rating-chip tnum">${hotel.rating}<span class="font-normal text-[11.5px] text-white/80">/10</span></span>
          <span class="text-[13.5px] font-semibold">${hotel.label}</span>
          <a href="#" onclick="return false" class="text-[13px] muted underline decoration-[#c9c5ba]">${hotel.reviews.toLocaleString()} reviews</a>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-md" onclick="toast('Link copied to clipboard','clipboard-check')"><i data-lucide="share-2" class="w-4 h-4"></i>Share</button>
        <button class="btn btn-outline btn-md" onclick="toast('${hotel.name} saved to your list','heart')"><i data-lucide="heart" class="w-4 h-4"></i>Save</button>
      </div>
    </div>`;

  /* ---------- Gallery ---------- */
  const g = hotel.gallery;
  $('#gallery').innerHTML = g.slice(0, 5).map((id, i) => `
    <button class="relative overflow-hidden group ${i === 0 ? 'col-span-2 row-span-2 rounded-3xl' : 'rounded-2xl'}" data-lb="${i}" aria-label="Open photo ${i + 1}">
      <img src="${img(id, i === 0 ? 1100 : 600)}" alt="${hotel.name} photo ${i + 1}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy">
      ${i === 4 ? `<span class="absolute inset-0 bg-black/45 flex items-center justify-center text-white font-semibold text-sm"><span class="glass !bg-white/20 rounded-full px-4 py-2">View all ${g.length}</span></span>` : ''}
    </button>`).join('');

  let lbIndex = 0;
  window.lbClose = () => { const lb = $('#lightbox'); lb.classList.add('hidden'); lb.classList.remove('flex'); $('#lbImg').classList.remove('open'); document.body.style.overflow = ''; };
  window.lbNav = d => { lbIndex = (lbIndex + d + g.length) % g.length; lbShow(); };
  function lbShow() {
    $('#lbImg').src = img(g[lbIndex], 1600);
    $('#lbImg').classList.remove('open'); void $('#lbImg').offsetWidth; $('#lbImg').classList.add('open');
    $('#lbCount').textContent = `${lbIndex + 1} / ${g.length}`;
  }
  $$('#gallery [data-lb]').forEach(b => b.addEventListener('click', () => {
    lbIndex = +b.dataset.lb;
    const lb = $('#lightbox'); lb.classList.remove('hidden'); lb.classList.add('flex');
    lbShow(); document.body.style.overflow = 'hidden';
  }));

  /* ---------- Overview & facts ---------- */
  $('#hotelDesc').textContent = hotel.desc;
  $('#hotelFacts').innerHTML = [
    ['clock', 'Check in', '16:00'], ['clock', 'Check out', '12:00'],
    ['users-round', 'Sleeps', 'up to 4 per room'], ['footprints', hotel.landmark, `${hotel.dist.m} m · ${hotel.dist.walk} min walk`],
  ].map(([ic, k, v]) => `
    <div class="flex items-center gap-3">
      <span class="w-9 h-9 rounded-xl bg-pine-50 border border-pine-100 flex items-center justify-center shrink-0"><i data-lucide="${ic}" class="w-4 h-4 text-pine-700"></i></span>
      <div><p class="text-[11.5px] muted">${k}</p><p class="font-semibold text-[13.5px] mt-0.5">${v}</p></div>
    </div>`).join('');

  /* ---------- Amenities ---------- */
  $('#amenities').innerHTML = hotel.amenities.map(a => `
    <span class="flex items-center gap-2.5"><i data-lucide="${AMENITY_ICONS[a] || 'check'}" class="w-4 h-4 text-pine-700 shrink-0"></i>${a}</span>`).join('');

  /* ---------- Rooms & offers ---------- */
  const bk = id => BROKERS[id];
  const bkAvatar = (id, size = 'w-10 h-10 text-[13px]') => {
    const b = bk(id);
    return `<span class="bav bav-${b.tone} ${size}">${b.initials}</span>`;
  };
  const termChip = (on, iconOn, iconOff, label) => `
    <span class="flex items-center gap-1.5 text-[12px] ${on ? 'text-pine-800 font-semibold' : 'muted'}">
      <i data-lucide="${on ? iconOn : iconOff}" class="w-3.5 h-3.5 ${on ? '' : 'opacity-40'}"></i>${label}
    </span>`;

  function offerCard(room, offer, opts = {}) {
    const b = bk(offer.broker);
    const isShared = !!offer.beds;
    const bedFrom = isShared ? Math.min(...Object.values(offer.beds).filter(x => x.status === 'available').map(x => x.price)) : null;
    const price = isShared ? bedFrom : offer.whole;
    const href = `booking.html?hotel=${hotel.id}&room=${room.id}&broker=${offer.broker}&mode=${isShared ? 'beds' : 'whole'}&in=${trip.in}&out=${trip.out}`;
    return `
    <div class="rounded-2xl border ${opts.highlight ? 'border-pine-200 bg-pine-50/60 shadow-soft' : 'border-black/[0.08] bg-white'} p-5 relative overflow-hidden">
      ${offer.badge === 'Cheapest' && !opts.muted ? `<span class="absolute top-0 right-5 badge badge-cheap !rounded-b-lg !rounded-t-none">Cheapest offer</span>` : ''}
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-start gap-3.5 min-w-0">
          ${bkAvatar(offer.broker)}
          <div class="min-w-0">
            <p class="font-semibold text-[15px] leading-tight ${opts.muted ? 'line-through decoration-[#b9b5aa]' : ''}">${b.name}</p>
            <p class="text-[12px] muted mt-1 flex items-center gap-1.5">
              <span class="star-gold">★</span> ${b.rating} · ${b.reviews.toLocaleString()} bookings
              ${offer.minStay > 1 ? `· min ${offer.minStay} nights` : ''}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-[22px] font-semibold tnum leading-none ${opts.muted ? 'muted line-through decoration-[#b9b5aa]' : ''}">${fmtSAR(price)}</p>
          <p class="text-[11.5px] muted mt-1.5">per night${isShared ? ' · per bed' : ''} · ${fmtSAR(price * nights)} total</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
        ${termChip(offer.refundable, 'circle-check', 'circle-x', offer.refundable ? 'Refundable' : 'Non-refundable')}
        ${termChip(offer.breakfast, 'coffee', 'coffee', offer.breakfast ? 'Breakfast included' : 'Room only')}
        ${offer.transport ? termChip(true, 'bus', 'bus', 'Transport included') : ''}
      </div>
      <div class="mt-4 flex items-center justify-between gap-4 flex-wrap">
        <p class="text-[12px] muted flex items-start gap-1.5 max-w-[380px]"><i data-lucide="quote" class="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50"></i>${b.note}</p>
        ${opts.blocked
          ? `<span class="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#86691a] bg-gold-100 rounded-full px-3.5 py-2" tabindex="0"
               data-pop-text="The first bed in this room was sold by <b>${bk(offer.blockedBy).name}</b>. Under the first-sale rule, only that broker may sell this room for these dates.">
               <i data-lucide="lock" class="w-3.5 h-3.5"></i>Closed — first-sale rule</span>`
          : `<a href="${href}" class="btn ${opts.highlight ? 'btn-primary' : 'btn-outline'} btn-md">${isShared ? 'Choose beds' : 'Book room'}<i data-lucide="arrow-right" class="w-4 h-4"></i></a>`}
      </div>
    </div>`;
  }

  function bedPreview(room) {
    const info = roomAvailableBeds(room);
    if (!info) return '';
    return `
    <div class="mt-4 flex flex-wrap items-center gap-2">
      ${Object.entries(info.offer.beds).map(([id, b]) => {
        const st = b.status;
        const cls = st === 'booked' ? 'bed-booked' : 'bed-available';
        const ico = st === 'booked' ? 'user-round' : 'bed-single';
        return `<span class="badge ${st === 'booked' ? 'badge-gray' : 'badge-cheap'} !py-1.5 !px-3"><i data-lucide="${ico}" class="w-3.5 h-3.5"></i>Bed ${id} · ${st === 'booked' ? 'Booked' : 'SAR ' + b.price}</span>`;
      }).join('')}
      <span class="text-[12px] muted">${info.free} of ${info.total} beds available</span>
    </div>`;
  }

  $('#roomList').innerHTML = hotel.rooms.map(room => {
    const active = room.offers.filter(o => o.active).sort((a, b) => (a.beds ? Math.min(...Object.values(a.beds).filter(x => x.status === 'available').map(x => x.price)) : a.whole) - (b.beds ? Math.min(...Object.values(b.beds).filter(x => x.status === 'available').map(x => x.price)) : b.whole));
    const blocked = room.offers.filter(o => !o.active);
    const main = active[0], rest = active.slice(1);
    const roomImg = hotel.gallery[active.indexOf(main) % hotel.gallery.length];
    return `
    <article class="card overflow-hidden">
      <div class="grid md:grid-cols-[190px_1fr] gap-0">
        <div class="relative min-h-[150px] border-b md:border-b-0 md:border-r border-black/[0.06]">
          <img src="${img(roomImg, 500)}" alt="${room.name}" class="absolute inset-0 w-full h-full object-cover">
          ${room.sharing ? `<span class="absolute top-3 left-3 badge badge-cheap !bg-white/90 backdrop-blur"><i data-lucide="bed-single" class="w-3 h-3"></i>Shared</span>` : ''}
        </div>
        <div class="p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 class="h3 text-lg font-semibold">${room.name}</h3>
              <p class="text-[12.5px] muted mt-1">${room.floor} · ${room.size} · ${room.bedsTotal} ${room.sharing ? 'beds' : 'guests max'}
                ${room.gender && room.gender !== 'any' ? ` · <span class="font-semibold text-pine-800">${room.gender === 'female' ? 'Female only' : 'Male only'}</span>` : ''}
                <span tabindex="0" class="inline-flex items-center gap-1 underline decoration-dotted cursor-help" data-pop-text="For your privacy, the exact room number is shared only after the broker confirms your booking.">${'Room no. hidden'}<i data-lucide="lock" class="w-3 h-3"></i></span>
              </p>
            </div>
            <p class="text-[13px] font-semibold">${pluralize(nights, 'night')}: <span class="tnum">${trip.in.slice(5)} → ${trip.out.slice(5)}</span></p>
          </div>
          ${room.sharing ? bedPreview(room) : ''}

          <div class="mt-5 space-y-3">
            ${offerCard(room, main, { highlight: true })}
            ${rest.length || blocked.length ? `
            <div class="rounded-2xl border border-black/[0.08]">
              <button class="otherBtn w-full flex items-center justify-between px-5 py-4 text-left" aria-expanded="false">
                <span class="text-[13.5px] font-semibold">Other booking options (${rest.length + blocked.length})</span>
                <i data-lucide="chevron-down" class="w-4 h-4 text-[#6e6e73] transition-transform duration-200 otherChev"></i>
              </button>
              <div class="acc-body otherBody"><div class="acc-inner"><div class="px-5 pb-5 space-y-3">
                ${rest.map(o => offerCard(room, o)).join('')}
                ${blocked.map(o => offerCard(room, o, { muted: true, blocked: true })).join('')}
              </div></div></div>
            </div>` : ''}
          </div>
        </div>
      </div>
    </article>`;
  }).join('');

  // Wire "other options" accordions
  $$('.otherBtn').forEach(btn => btn.addEventListener('click', () => {
    const body = btn.parentElement.querySelector('.otherBody');
    const chev = btn.querySelector('.otherChev');
    const open = body.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    chev.style.transform = open ? 'rotate(180deg)' : '';
  }));

  // Broker FAQ accordion
  const faq = $('#brokerFaq'), faqBtn = $('#brokerFaqBtn'), faqChev = $('#brokerFaqChev');
  faqBtn.addEventListener('click', () => {
    const open = faq.classList.toggle('open');
    faqChev.style.transform = open ? 'rotate(180deg)' : '';
  });

  /* ---------- Location ---------- */
  $('#mapHotelName').textContent = hotel.name.split(' ')[0];
  $('#mapLandmark2').textContent = hotel.landmark;
  $('#landmarkDist').innerHTML = `
    <span class="w-11 h-11 rounded-2xl bg-white border border-pine-200 flex items-center justify-center shrink-0"><i data-lucide="moon-star" class="w-5 h-5 text-pine-700"></i></span>
    <div>
      <p class="font-semibold text-[14.5px]">${hotel.landmark}</p>
      <p class="text-[12.5px] muted mt-0.5">${hotel.dist.m} m straight line · ${hotel.dist.walk} min walk · 2 min drive</p>
    </div>
    <span class="ml-auto badge badge-cheap">Closest landmark</span>`;
  $('#nearbyList').innerHTML = hotel.nearby.map(n => `
    <div class="flex items-center gap-3">
      <span class="w-8 h-8 rounded-xl bg-sand border border-black/[0.06] flex items-center justify-center shrink-0"><i data-lucide="${n.icon}" class="w-4 h-4 text-[#6e6e73]"></i></span>
      <span class="font-medium">${n.name}</span>
      <span class="ml-auto muted text-[12px]">${n.walk} min walk</span>
    </div>`).join('');

  /* ---------- Sidebar ---------- */
  const cheapest = Math.min(...hotel.rooms.flatMap(r => r.offers.filter(o => o.active).map(o =>
    o.beds ? Math.min(...Object.values(o.beds).filter(b => b.status === 'available').map(b => b.price), Infinity) : o.whole
  )));
  $('#sidePrice').innerHTML = `
    <p class="text-[12.5px] muted">Beds &amp; rooms from</p>
    <p class="text-[28px] font-semibold tnum leading-tight mt-1">${fmtSAR(cheapest)}<span class="text-[13px] font-normal muted"> / night</span></p>
    <p class="text-[12px] muted mt-2 tnum">${pluralize(nights, 'night')}, ${trip.in.slice(5)} → ${trip.out.slice(5)}</p>
    <a href="#rooms" class="btn btn-primary btn-lg w-full mt-5">See rooms &amp; offers</a>
    <p class="text-[11.5px] muted text-center mt-3.5">Free to request — you pay the broker directly</p>`;

  initPopovers();
  refreshIcons();
})();
