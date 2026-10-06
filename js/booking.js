/* ============================================================
   Sakina — booking flow logic (beds / whole room)
   ============================================================ */

(() => {
  const trip = tripParams();
  const mode = qs.get('mode') || 'beds';
  const hotel = findHotel(qs.get('hotel'));
  const room = findRoom(hotel, qs.get('room'));
  const offer = room.offers.find(o => o.broker === qs.get('broker')) || room.offers.find(o => o.active);
  const b = BROKERS[offer.broker];
  const nights = nightsBetween(trip.in, trip.out);
  const hasBlocked = room.offers.some(o => !o.active && o.blockedBy === offer.broker);

  document.title = `Book ${room.name} · ${hotel.name} — Sakina`;
  $('#backLink').href = `hotel.html?id=${hotel.id}&in=${trip.in}&out=${trip.out}`;

  const state = { step: 1, selected: new Set(), hold: null, holdEnds: 0, guests: {} };

  /* ---------- Room header ---------- */
  $('#roomHead').innerHTML = `
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="eyebrow">${hotel.name} · ${hotel.city}</p>
        <h1 class="display text-3xl md:text-4xl font-semibold mt-2">${room.name}</h1>
        <p class="muted text-sm mt-2.5 flex items-center gap-2 flex-wrap">
          <span class="flex items-center gap-1.5"><i data-lucide="building-2" class="w-4 h-4"></i>${room.floor}</span>
          <span>·</span><span class="flex items-center gap-1.5"><i data-lucide="ruler" class="w-4 h-4"></i>${room.size}</span>
          <span>·</span><span class="flex items-center gap-1.5"><i data-lucide="bed-single" class="w-4 h-4"></i>${room.bedsTotal} ${room.sharing ? 'beds' : 'guests'}</span>
          ${room.gender && room.gender !== 'any' ? `<span>·</span><span class="badge badge-cheap">${room.gender === 'female' ? 'Female only' : 'Male only'}</span>` : ''}
        </p>
      </div>
      <div class="glass rounded-2xl border border-black/[0.06] px-5 py-3.5">
        <p class="text-[11px] font-semibold uppercase tracking-wider muted">Your dates</p>
        <p class="font-semibold text-[15px] tnum mt-1">${trip.in.slice(5)} → ${trip.out.slice(5)} · ${pluralize(nights, 'night')}</p>
      </div>
    </div>`;

  /* ---------- Broker sidebar ---------- */
  $('#brokerCard').innerHTML = `
    <div class="flex items-start gap-3.5">
      <span class="bav bav-${b.tone} w-11 h-11 text-[14px]">${b.initials}</span>
      <div>
        <p class="font-semibold text-[15px]">${b.name}</p>
        <p class="text-[12px] muted mt-1"><span class="star-gold">★</span> ${b.rating} · ${b.reviews.toLocaleString()} bookings</p>
      </div>
    </div>
    <p class="text-[13px] muted leading-relaxed mt-4">${b.note}</p>
    <div class="flex flex-wrap gap-1.5 mt-4">
      ${b.services.map(s => `<span class="badge badge-gray">${s}</span>`).join('')}
    </div>
    <div class="mt-5 pt-4 border-t border-black/[0.06] space-y-2.5 text-[13px]">
      <p class="flex justify-between"><span class="muted">Cancellation</span><span class="font-semibold">${offer.cancel}</span></p>
      <p class="flex justify-between"><span class="muted">Meals</span><span class="font-semibold">${offer.breakfast ? 'Breakfast included' : 'Room only'}</span></p>
      <p class="flex justify-between"><span class="muted">Payment</span><span class="font-semibold">To broker directly</span></p>
    </div>`;

  /* ---------- Exclusivity badge ---------- */
  if (hasBlocked) {
    const badge = $('#exclBadge');
    badge.style.display = '';
    badge.innerHTML = `<i data-lucide="crown" class="w-3 h-3"></i>Exclusive broker for your dates`;
    badge.tabIndex = 0;
    badge.dataset.popText = `A bed in this room was sold first by <b>${b.name}</b>. Under the first-sale rule, competing broker offers for these dates closed automatically — every remaining bed now comes from ${b.name} alone.`;
    badge.setAttribute('data-pop-above', '');
  }

  /* ---------- Bed map ---------- */
  const BEDS = offer.beds ? Object.entries(offer.beds) : [];
  function renderBedMap() {
    if (mode === 'whole') {
      $('#bedMap').innerHTML = `
        <div class="text-center py-8">
          <span class="inline-flex w-16 h-16 rounded-3xl bg-pine-50 border border-pine-100 items-center justify-center"><i data-lucide="door-open" class="w-7 h-7 text-pine-700"></i></span>
          <p class="font-semibold text-lg mt-4">Entire ${room.name.toLowerCase()}</p>
          <p class="text-sm muted mt-1.5">All ${room.bedsTotal} beds · private for your group of up to ${room.bedsTotal} guests</p>
        </div>`;
      $('#step1Title').textContent = 'Your room';
      $('#step1Sub').textContent = 'One private room, all beds included. Continue to add guest details.';
      return;
    }
    $('#bedMap').innerHTML = `
      <div class="room-window pb-2.5 mb-5"><i data-lucide="sun" class="w-3.5 h-3.5"></i>Window</div>
      <div class="grid gap-3.5 ${BEDS.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} max-w-lg mx-auto">
        ${BEDS.map(([id, bed]) => bedCell(id, bed)).join('')}
      </div>
      <div class="room-door"></div>`;
    $$('#bedMap .bed-available').forEach(el => el.addEventListener('click', () => toggleBed(el.dataset.bed)));
    refreshIcons();
  }

  function bedCell(id, bed) {
    const sel = state.selected.has(id);
    const st = sel ? 'selected' : bed.status;
    const base = `bed bed-${st === 'selected' ? 'selected' : bed.status}`;
    let inner;
    if (st === 'selected') {
      inner = `
        <div class="bed-pillow"></div>
        <i data-lucide="check" class="w-5 h-5 mx-auto mt-1"></i>
        <p class="text-[12.5px] font-semibold mt-1.5">Bed ${id}</p>
        <p class="text-[11px] muted mt-0.5">SAR ${bed.price} · selected</p>`;
    } else if (bed.status === 'available') {
      inner = `
        <div class="bed-pillow"></div>
        <i data-lucide="bed-single" class="w-5 h-5 mx-auto mt-1 text-pine-700"></i>
        <p class="text-[12.5px] font-semibold mt-1.5">Bed ${id}</p>
        <p class="text-[11px] muted mt-0.5">SAR ${bed.price}${bed.pos ? ' · ' + bed.pos : ''}</p>`;
    } else if (bed.status === 'booked') {
      const rm = bed.roommate || {};
      inner = `
        <div class="bed-pillow !bg-[#dedbd2]"></div>
        <i data-lucide="user-round" class="w-5 h-5 mx-auto mt-1 text-[#a39e90]"></i>
        <p class="text-[12.5px] font-semibold mt-1.5 text-[#6e6e73]">Bed ${id}</p>
        <p class="text-[10.5px] muted mt-0.5">${rm.gender || 'Booked'} · ${rm.type || ''}</p>`;
    } else if (bed.status === 'held') {
      inner = `
        <div class="bed-pillow !bg-[#ecd9a0]"></div>
        <i data-lucide="clock" class="w-5 h-5 mx-auto mt-1 text-[#a8871f]"></i>
        <p class="text-[12.5px] font-semibold mt-1.5 text-[#86691a]">Bed ${id}</p>
        <p class="text-[10.5px] muted mt-0.5">On hold · 09:41</p>`;
    } else {
      inner = `
        <div class="bed-pillow !bg-[#dedbd2]"></div>
        <i data-lucide="ban" class="w-5 h-5 mx-auto mt-1 text-[#a39e90]"></i>
        <p class="text-[12.5px] font-semibold mt-1.5 text-[#6e6e73]">Bed ${id}</p>
        <p class="text-[10.5px] muted mt-0.5">Out of service</p>`;
    }
    return `<button type="button" class="${base} px-2 pt-3 pb-3 text-center ${sel ? 'bed-just-picked' : ''}" data-bed="${id}" ${bed.status !== 'available' ? 'disabled aria-disabled="true"' : ''} aria-label="Bed ${id}, ${bed.status}, SAR ${bed.price} per night">${inner}</button>`;
  }

  function toggleBed(id) {
    if (state.selected.has(id)) state.selected.delete(id);
    else {
      state.selected.add(id);
      if (!state.hold) startHold();
    }
    renderBedMap();
    renderSummary();
    updateNext();
  }

  /* ---------- Hold timer ---------- */
  function startHold() {
    state.holdEnds = Date.now() + 15 * 60 * 1000;
    state.hold = setInterval(() => {
      const left = Math.max(0, state.holdEnds - Date.now());
      const m = String(Math.floor(left / 60000)).padStart(2, '0');
      const s = String(Math.floor(left % 60000 / 1000)).padStart(2, '0');
      const el = $('#holdTime');
      if (el) el.textContent = `${m}:${s}`;
      if (left === 0) {
        clearInterval(state.hold); state.hold = null;
        toast('Demo: hold expired — timer restarted', 'timer-reset');
        startHold();
      }
    }, 1000);
  }

  /* ---------- Summary sidebar ---------- */
  function renderSummary() {
    let lines, perNight, title;
    if (mode === 'whole') {
      perNight = offer.whole; title = `Entire room · ${pluralize(nights, 'night')}`;
      lines = [`<p class="flex justify-between text-[13.5px]"><span>${room.name} × ${nights}</span><span class="tnum">${fmtSAR(offer.whole)} × ${nights}</span></p>`];
    } else {
      perNight = [...state.selected].reduce((s, id) => s + offer.beds[id].price, 0);
      title = `${pluralize(state.selected.size, 'bed')} · ${pluralize(nights, 'night')}`;
      lines = [...state.selected].map(id => `
        <p class="flex justify-between text-[13.5px] items-center">
          <span class="flex items-center gap-2">Bed ${id} × ${nights} nights
            <button class="w-5 h-5 rounded-full bg-sand border border-black/[0.08] flex items-center justify-center hover:bg-black/5" data-rm="${id}" aria-label="Remove bed ${id}"><i data-lucide="x" class="w-3 h-3"></i></button>
          </span><span class="tnum">SAR ${offer.beds[id].price * nights}</span>
        </p>`).join('');
      if (!state.selected.size) lines = `<p class="text-[13px] muted">Select a bed to see your price.</p>`;
    }
    const total = perNight * nights;
    $('#sumCard').innerHTML = `
      <div class="flex items-center justify-between">
        <p class="font-semibold">Price summary</p>
        ${state.hold ? `<span class="flex items-center gap-1.5 text-[12px] font-semibold text-[#86691a] bg-gold-100 rounded-full px-3 py-1.5"><i data-lucide="timer" class="w-3.5 h-3.5"></i>Held <span id="holdTime" class="tnum">15:00</span></span>` : ''}
      </div>
      <p class="text-[12px] muted mt-1">${title}</p>
      <div class="mt-4 space-y-2.5">${lines}</div>
      ${state.selected.size || mode === 'whole' ? `
        <div class="mt-4 pt-4 border-t border-black/[0.08] space-y-2 text-[13px]">
          <p class="flex justify-between muted"><span>Taxes &amp; fees</span><span>Included</span></p>
          <p class="flex justify-between font-semibold text-[15px]"><span>Total (${nights} nights)</span><span class="tnum">${fmtSAR(total)}</span></p>
        </div>
        <p class="text-[11.5px] muted mt-3.5 leading-relaxed">Nothing is charged now. You pay <b>${b.name}</b> directly after they confirm.</p>` : ''}
    `;
    $$('#sumCard [data-rm]').forEach(btn => btn.addEventListener('click', () => toggleBed(btn.dataset.rm)));
    refreshIcons();
  }

  /* ---------- Stepper ---------- */
  function setStep(n) {
    state.step = n;
    $$('.flow-step').forEach(s => s.classList.toggle('active', +s.dataset.step === n));
    $$('[data-step-item]').forEach(el => {
      const sn = +el.dataset.stepItem;
      el.classList.toggle('step-current', sn === n);
      el.classList.toggle('step-done', sn < n);
    });
    $$('[data-line]').forEach(l => l.classList.toggle('line-done', +l.dataset.line < n));
    $('#prevBtn').style.visibility = n === 1 ? 'hidden' : 'visible';
    updateNext();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateNext() {
    const btn = $('#nextBtn');
    if (state.step === 1) {
      const ok = mode === 'whole' || state.selected.size > 0;
      btn.disabled = !ok;
      btn.innerHTML = 'Continue<i data-lucide="arrow-right" class="w-4 h-4"></i>';
    } else if (state.step === 2) {
      btn.disabled = false;
      btn.innerHTML = 'Continue<i data-lucide="arrow-right" class="w-4 h-4"></i>';
    } else {
      btn.disabled = !$('#agree').checked;
      btn.innerHTML = `<span class="spinner hidden" id="submitSpin"></span><span id="submitLabel">Request to book</span>`;
      const agree = $('#agree');
      if (agree) agree.addEventListener('change', updateNext);
    }
    refreshIcons();
  }

  $('#prevBtn').addEventListener('click', () => setStep(state.step - 1));
  $('#nextBtn').addEventListener('click', () => {
    if (state.step === 2 && !validateGuests()) return;
    if (state.step === 3) return submit();
    if (state.step === 1) renderGuestForms();
    if (state.step === 2) renderReview();
    setStep(state.step + 1);
  });

  /* ---------- Guest forms ---------- */
  function renderGuestForms() {
    const count = mode === 'whole' ? room.bedsTotal : state.selected.size;
    const ids = mode === 'whole'
      ? Array.from({ length: room.bedsTotal }, (_, i) => String(i + 1))
      : [...state.selected];
    $('#guestForms').innerHTML = ids.map((id, i) => {
      const g = state.guests[id] || {};
      const roomGender = room.gender === 'female' ? 'female' : room.gender === 'male' ? 'male' : null;
      return `
      <div class="rounded-2xl border border-black/[0.08] p-5 bg-white">
        <p class="flex items-center gap-2.5 font-semibold text-[14.5px]">
          <span class="w-7 h-7 rounded-lg bg-pine-100 text-pine-800 flex items-center justify-center text-[12px] font-bold">${i + 1}</span>
          ${mode === 'whole' ? `Guest ${i + 1}` : `Bed ${id} guest`}
        </p>
        <div class="grid sm:grid-cols-2 gap-3.5 mt-4">
          <label class="block"><span class="text-[12.5px] font-semibold muted">Full name</span>
            <input class="field mt-1.5 guest-name" data-g="${id}" value="${g.name || ''}" placeholder="Guest name"></label>
          <label class="block"><span class="text-[12.5px] font-semibold muted">Gender</span>
            <select class="field mt-1.5 guest-gender" data-g="${id}">
              <option value="male" ${roomGender === 'female' ? '' : 'selected'}>Male</option>
              <option value="female" ${roomGender === 'female' ? 'selected' : ''}>Female</option>
            </select></label>
        </div>
      </div>`;
    }).join('');
    $$('.guest-name').forEach(inp => inp.addEventListener('input', () => {
      state.guests[inp.dataset.g] = { ...(state.guests[inp.dataset.g] || {}), name: inp.value };
    }));
    $$('.guest-gender').forEach(sel => sel.addEventListener('change', () => {
      state.guests[sel.dataset.g] = { ...(state.guests[sel.dataset.g] || {}), gender: sel.value };
    }));
  }

  function validateGuests() {
    let ok = true;
    const lead = ['#leadName', '#leadPhone', '#leadEmail'];
    lead.forEach(s => { const el = $(s); el.classList.toggle('field-invalid', !el.value.trim()); if (!el.value.trim()) ok = false; });
    $$('.guest-name').forEach(el => { el.classList.toggle('field-invalid', !el.value.trim()); if (!el.value.trim()) ok = false; });
    if (!ok) toast('Please fill the highlighted fields', 'alert-circle');
    return ok;
  }

  /* ---------- Review ---------- */
  function renderReview() {
    const ids = mode === 'whole' ? [] : [...state.selected];
    const total = (mode === 'whole' ? offer.whole : ids.reduce((s, id) => s + offer.beds[id].price, 0)) * nights;
    const guests = mode === 'whole'
      ? Array.from({ length: room.bedsTotal }, (_, i) => state.guests[String(i + 1)] || { name: `Guest ${i + 1}` })
      : ids.map(id => ({ name: (state.guests[id] || {}).name || `Bed ${id} guest`, bed: id }));
    $('#reviewCard').innerHTML = `
      <h2 class="h3 text-xl font-semibold">Review &amp; submit</h2>
      <p class="text-sm muted mt-2">One last look. Nothing is charged — your broker confirms first.</p>

      <div class="grid sm:grid-cols-2 gap-3.5 mt-6">
        <div class="rounded-2xl bg-sand border border-black/[0.06] p-5">
          <p class="eyebrow">Stay</p>
          <p class="font-semibold text-[14.5px] mt-2">${hotel.name}</p>
          <p class="text-[13px] muted mt-1">${room.name} · ${room.floor}${mode === 'beds' ? '' : ' · entire room'}</p>
          <p class="text-[13px] muted tnum mt-1">${trip.in.slice(5)} → ${trip.out.slice(5)} · ${pluralize(nights, 'night')}</p>
        </div>
        <div class="rounded-2xl bg-sand border border-black/[0.06] p-5">
          <p class="eyebrow">Guests</p>
          <p class="font-semibold text-[14.5px] mt-2">${$('#leadName').value}</p>
          <p class="text-[13px] muted mt-1">${$('#leadPhone').value} · ${$('#leadEmail').value}</p>
          ${mode === 'beds' ? `<div class="flex flex-wrap gap-1.5 mt-2.5">${guests.map(g => `<span class="badge badge-gray">Bed ${g.bed} · ${g.name}</span>`).join('')}</div>` : `<p class="text-[13px] muted mt-1">${room.bedsTotal} guests · private room</p>`}
        </div>
      </div>

      <div class="rounded-2xl border border-black/[0.08] p-5 mt-3.5">
        <p class="eyebrow">Broker &amp; terms</p>
        <div class="flex items-center gap-3 mt-3">
          <span class="bav bav-${b.tone} w-9 h-9 text-[12px]">${b.initials}</span>
          <div>
            <p class="font-semibold text-[14px]">${b.name}</p>
            <p class="text-[12px] muted"><span class="star-gold">★</span> ${b.rating} · ${b.reviews.toLocaleString()} bookings</p>
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-[13px]">
          <p class="flex justify-between"><span class="muted">Cancellation</span><span class="font-semibold">${offer.cancel}</span></p>
          <p class="flex justify-between"><span class="muted">Meals</span><span class="font-semibold">${offer.breakfast ? 'Breakfast included' : 'Room only'}</span></p>
          <p class="flex justify-between"><span class="muted">Payment</span><span class="font-semibold">Cash or transfer to broker</span></p>
          <p class="flex justify-between"><span class="muted">Documents</span><span class="font-semibold">Invoice &amp; voucher from broker</span></p>
        </div>
      </div>

      <div class="flex items-center justify-between mt-6">
        <p class="text-[13px] muted">Total for ${pluralize(nights, 'night')}</p>
        <p class="text-[24px] font-semibold tnum">${fmtSAR(total)}</p>
      </div>

      <label class="flex items-start gap-3 mt-5 cursor-pointer select-none">
        <input type="checkbox" id="agree" class="w-[18px] h-[18px] mt-0.5 rounded accent-[#0d6e53]">
        <span class="text-[13px] muted leading-relaxed">I agree to the broker's terms above, including the <b class="text-[#1d1d1f]">${offer.cancel.toLowerCase()}</b> policy, and understand I'll pay ${b.name} directly after confirmation.</span>
      </label>`;
    updateNext();
  }

  /* ---------- Submit ---------- */
  function submit() {
    const btn = $('#nextBtn');
    btn.disabled = true;
    const spin = $('#submitSpin'), label = $('#submitLabel');
    if (spin) { spin.classList.remove('hidden'); label.textContent = 'Submitting…'; }
    const ids = mode === 'whole' ? [] : [...state.selected];
    const total = (mode === 'whole' ? offer.whole : ids.reduce((s, id) => s + offer.beds[id].price, 0)) * nights;
    setTimeout(() => {
      clearInterval(state.hold);
      store.set('lastBooking', {
        ref: 'SKN-2026-' + String(Math.floor(1000 + Math.random() * 9000)),
        hotel: hotel.name, hotelId: hotel.id, city: hotel.city, room: room.name, floor: room.floor,
        physicalRoom: 'Room ' + room.id.replace(/^[a-z]+/, '').padStart(3, '0'),
        mode, beds: ids, nights, in: trip.in, out: trip.out,
        lead: { name: $('#leadName').value, phone: $('#leadPhone').value, email: $('#leadEmail').value },
        guests: state.guests, total, broker: b.name, brokerId: offer.broker, cancel: offer.cancel, breakfast: !!offer.breakfast,
      });
      location.href = 'confirmation.html';
    }, 900);
  }

  /* ---------- Init ---------- */
  renderBedMap();
  renderSummary();
  if (mode === 'whole') { state.selected = new Set(); }
  setStep(1);
  initPopovers();
})();
