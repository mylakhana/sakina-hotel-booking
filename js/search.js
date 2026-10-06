/* ============================================================
   Sakina — search page logic
   ============================================================ */

(() => {
  const trip = tripParams();
  const state = {
    city: trip.city,
    type: trip.type !== 'any' ? trip.type : 'any',
    gender: 'any',
    maxPrice: 500,
    maxDist: 1000,
    stars: new Set(),
    amenities: new Set(),
    sort: 'rec',
  };

  const FILTER_AMENITIES = ['Free WiFi', 'Restaurant', 'Airport shuttle', 'Laundry', 'Prayer hall'];

  /* ---------- Summary bar ---------- */
  $('#sumDates').textContent = `${trip.in.slice(5)} → ${trip.out.slice(5)}`;
  $('#sumGuests').textContent = pluralize(trip.guests, 'guest');
  $('#sumNights').textContent = `${pluralize(nightsBetween(trip.in, trip.out), 'night')}`;
  $('#distLabel').textContent = `To ${state.city === 'Madinah' ? 'Al Masjid an Nabawi' : 'Masjid al-Haram'}`;
  $('#mapCity').textContent = state.city;
  $('#mapLandmark').textContent = state.city === 'Madinah' ? 'Al Masjid an Nabawi' : 'Masjid al-Haram';

  // City tabs
  const tabs = ['Makkah', 'Madinah'];
  $('#cityTabs').innerHTML = tabs.map(c => {
    const on = c === state.city;
    return `<button data-city="${c}" class="btn btn-sm ${on ? 'btn-dark' : 'btn-outline'}">${c}</button>`;
  }).join('');
  $$('#cityTabs [data-city]').forEach(b => b.addEventListener('click', () => {
    location.href = searchHref({ city: b.dataset.city });
  }));

  /* ---------- Segmented controls ---------- */
  function wireSeg(container, onPick, initial) {
    const btns = $$(`#${container} [data-v]`);
    const paint = () => btns.forEach(b => {
      const on = b.dataset.v === (container === 'fType' ? state.type : state.gender) ||
        (container === 'fStars' && state.stars.has(b.dataset.v));
      b.classList.toggle('btn-primary', on);
      b.classList.toggle('btn-outline', !on);
    });
    btns.forEach(b => b.addEventListener('click', () => onPick(b.dataset.v)));
    if (initial !== undefined) { /* initial state applied in state */ }
    paint();
    return paint;
  }

  const paintType = wireSeg('fType', v => { state.type = v; paintType(); render(); }, state.type);
  const paintGender = wireSeg('fGender', v => { state.gender = v; paintGender(); render(); });
  const paintStars = wireSeg('fStars', v => {
    state.stars.has(v) ? state.stars.delete(v) : state.stars.add(v);
    paintStars(); render();
  });

  // Show gender filter only when a shared option could apply
  const hasShared = HOTELS.some(h => h.city === state.city && h.shared.available);
  if (hasShared) $('#genderFilterWrap').classList.remove('hidden');

  /* ---------- Sliders ---------- */
  const fmtM = m => m.toLocaleString('en-US') + ' m';
  $('#fPrice').addEventListener('input', e => {
    state.maxPrice = +e.target.value;
    $('#priceOut').textContent = 'SAR ' + state.maxPrice;
    renderDebounced();
  });
  $('#fDist').addEventListener('input', e => {
    state.maxDist = +e.target.value;
    $('#distOut').textContent = fmtM(state.maxDist);
    renderDebounced();
  });

  /* ---------- Amenities ---------- */
  $('#fAmen').innerHTML = FILTER_AMENITIES.map(a => `
    <label class="flex items-center gap-2.5 cursor-pointer group">
      <input type="checkbox" data-a="${a}" class="w-4 h-4 rounded accent-[#0d6e53]">
      <span class="group-hover:text-[#0b5843] transition-colors">${a}</span>
    </label>`).join('');
  $$('#fAmen input').forEach(cb => cb.addEventListener('change', () => {
    cb.checked ? state.amenities.add(cb.dataset.a) : state.amenities.delete(cb.dataset.a);
    render();
  }));

  $('#clearFilters').addEventListener('click', () => {
    Object.assign(state, { type: 'any', gender: 'any', maxPrice: 500, maxDist: 1000 });
    state.stars.clear(); state.amenities.clear();
    $('#fPrice').value = 500; $('#priceOut').textContent = 'SAR 500';
    $('#fDist').value = 1000; $('#distOut').textContent = fmtM(1000);
    $$('#fAmen input').forEach(cb => cb.checked = false);
    paintType(); paintGender(); paintStars();
    render();
  });

  $('#sortSel').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('#openMap').addEventListener('click', () => { renderPins(); openSheet('mapSheet'); });

  /* ---------- Filtering ---------- */
  function filtered() {
    let list = HOTELS.filter(h => h.city === state.city);
    if (state.type === 'shared') list = list.filter(h => h.shared.available);
    if (state.type === 'private') list = list.filter(h => h.privateAvailable);
    if (state.gender !== 'any') list = list.filter(h => h.shared.genders.includes(state.gender));
    list = list.filter(h => h.dist.m <= state.maxDist && hotelFromPrice(h) <= state.maxPrice);
    if (state.stars.size) list = list.filter(h => state.stars.has(String(h.stars)));
    if (state.amenities.size) list = list.filter(h => [...state.amenities].every(a => h.amenities.includes(a)));

    const price = h => hotelFromPrice(h);
    const sorters = {
      rec: (a, b) => b.rating - a.rating || a.dist.m - b.dist.m,
      price: (a, b) => price(a) - price(b),
      dist: (a, b) => a.dist.m - b.dist.m,
      rating: (a, b) => b.rating - a.rating,
    };
    return [...list].sort(sorters[state.sort]);
  }

  /* ---------- Card render ---------- */
  function cardHTML(h, i) {
    const from = hotelFromPrice(h);
    const shLabel = sharedLabel(h.shared.genders);
    const landmarks = { Makkah: 'Masjid al-Haram', Madinah: 'Al Masjid an Nabawi' };
    return `
    <a href="hotel.html?id=${h.id}&in=${trip.in}&out=${trip.out}" class="rise card card-hover overflow-hidden grid sm:grid-cols-[240px_1fr]" style="animation-delay:${Math.min(i * 55, 330)}ms">
      <div class="relative h-48 sm:h-full min-h-[180px]">
        <img src="${img(h.img, 700)}" alt="${h.name}" class="absolute inset-0 w-full h-full object-cover" loading="lazy">
        <button class="absolute top-3 right-3 btn btn-icon btn-sm glass !rounded-full save-btn" data-hotel="${h.id}" aria-label="Save ${h.name}" onclick="event.preventDefault();event.stopPropagation();toast('${h.name} saved to your list','heart')">
          <i data-lucide="heart" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="p-5 flex flex-col">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-semibold text-[16.5px] leading-snug">${h.name}</p>
            <p class="text-[13px] muted mt-1"><span class="star-gold">${'★'.repeat(h.stars)}</span><span class="text-[#e3dfce]">${'★'.repeat(5 - h.stars)}</span> · ${h.address.split(',').slice(-2).join(',').trim()}</p>
          </div>
          <div class="text-right shrink-0">
            <span class="rating-chip tnum">${h.rating}</span>
            <p class="text-[11px] muted mt-1.5">${h.label}<br>${h.reviews.toLocaleString()} reviews</p>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-3.5 text-[13px] font-medium text-pine-800">
          <i data-lucide="footprints" class="w-4 h-4"></i>
          ${h.dist.m} m · ${h.dist.walk} min walk to ${landmarks[h.city]}
        </div>
        <div class="flex flex-wrap gap-1.5 mt-3">
          ${shLabel ? `<span class="badge badge-cheap"><i data-lucide="bed-single" class="w-3 h-3"></i>${shLabel}</span>` : ''}
          ${h.rooms.some(r => r.offers.some(o => o.active && o.breakfast)) ? `<span class="badge badge-gray"><i data-lucide="coffee" class="w-3 h-3"></i>Breakfast available</span>` : ''}
          ${h.rooms.some(r => r.offers.some(o => o.active && o.refundable)) ? `<span class="badge badge-gray"><i data-lucide="circle-undo" class="w-3 h-3"></i>Refundable options</span>` : ''}
        </div>
        <div class="flex items-end justify-between gap-4 mt-auto pt-4">
          <p class="text-[12px] muted">from <span class="text-[19px] font-semibold text-[#1d1d1f] tnum">SAR ${from}</span> <span>/ night${h.shared.available ? ' · per bed' : ''}</span></p>
          <span class="btn btn-primary btn-sm">View rooms<i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
        </div>
      </div>
    </a>`;
  }

  function render() {
    const list = filtered();
    $('#results').innerHTML = list.map(cardHTML).join('');
    $('#emptyState').classList.toggle('hidden', list.length > 0);
    $('#countText').textContent = `${(list.length + 96).toLocaleString()} stays in ${state.city}`;
    refreshIcons();
  }

  function renderPins() {
    const list = filtered();
    $('#mapPins').innerHTML = list.map(h => `
      <a href="hotel.html?id=${h.id}" class="absolute -translate-x-1/2 -translate-y-full group" style="left:${h.mapX}%;top:${h.mapY}%">
        <span class="flex items-center gap-1.5 bg-white rounded-full shadow-lift px-2.5 py-1.5 text-[12px] font-semibold group-hover:bg-pine-700 group-hover:text-white transition-colors duration-150 whitespace-nowrap">
          <span class="w-1.5 h-1.5 rounded-full bg-pine-500"></span>SAR ${hotelFromPrice(h)}
        </span>
        <span class="block w-2.5 h-2.5 rounded-full bg-pine-700 ring-4 ring-white/70 mx-auto mt-0.5"></span>
      </a>`).join('');
    refreshIcons();
  }

  const renderDebounced = debounce(render, 200);
  render();
})();
