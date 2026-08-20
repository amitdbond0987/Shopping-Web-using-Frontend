/* ===================================================================
   FERNWEH TRAIL CO. — storefront logic
   Product catalog, filter/search, cart drawer, checkout flow.
   Cart state lives in memory only (resets on page reload by design).
=================================================================== */

const PRODUCTS = [
  { id:'p01', name:'Ridgeline 42L Pack',      category:'packs',    price:189, oldPrice:null, glyph:'🎒', tag:'PACKS / 42L / TOPO-1',    desc:'Aluminum-stayed carry system built for multi-day traverses.', badge:null },
  { id:'p02', name:'Switchback Daypack',      category:'packs',    price:79,  oldPrice:95,    glyph:'🎒', tag:'PACKS / 22L / TOPO-2',    desc:'Trim day pack with a hip belt that actually stays put.', badge:'SALE' },
  { id:'p03', name:'Basecamp Duffel 90L',     category:'packs',    price:135, oldPrice:null, glyph:'🧳', tag:'PACKS / 90L / TOPO-3',    desc:'Weatherproof haul bag for gear drops and long expeditions.', badge:null },
  { id:'p04', name:'Talus Hiking Boot',       category:'footwear', price:159, oldPrice:null, glyph:'🥾', tag:'FOOTWEAR / MID / T-4',    desc:'Full-grain leather boot with a resoleable Vibram outsole.', badge:null },
  { id:'p05', name:'Scree Trail Runner',      category:'footwear', price:129, oldPrice:null, glyph:'👟', tag:'FOOTWEAR / LOW / T-5',    desc:'Lightweight mesh runner for fast, dry-trail miles.', badge:'NEW' },
  { id:'p06', name:'Alpine Camp Sandal',      category:'footwear', price:54,  oldPrice:68,    glyph:'👡', tag:'FOOTWEAR / CAMP / T-6',   desc:'River-crossing sandal that doubles as a camp shoe.', badge:'SALE' },
  { id:'p07', name:'Windward Shell Jacket',   category:'apparel',  price:214, oldPrice:null, glyph:'🧥', tag:'APPAREL / SHELL / L-7',   desc:'Three-layer hardshell that shrugs off ridge-top weather.', badge:null },
  { id:'p08', name:'Contour Fleece Quarter-Zip', category:'apparel', price:88, oldPrice:null, glyph:'🧶', tag:'APPAREL / MID / L-8',  desc:'Grid fleece layer with just enough stretch to move in.', badge:'NEW' },
  { id:'p09', name:'Basecamp Wool Beanie',    category:'apparel',  price:29,  oldPrice:null, glyph:'🧢', tag:'APPAREL / HEAD / L-9',    desc:'Merino beanie that packs flat and never itches.', badge:null },
  { id:'p10', name:'Ember 2P Tent',           category:'camp',     price:329, oldPrice:389,   glyph:'⛺', tag:'CAMP / 2-PERSON / C-10',  desc:'Freestanding double-wall tent at a 3lb 4oz trail weight.', badge:'SALE' },
  { id:'p11', name:'Driftwood Camp Quilt',    category:'camp',     price:149, oldPrice:null, glyph:'🛏️', tag:'CAMP / 20°F / C-11',      desc:'Down-fill quilt rated for shoulder-season nights.', badge:null },
  { id:'p12', name:'Cairn Titanium Cookset',  category:'camp',     price:64,  oldPrice:null, glyph:'🍳', tag:'CAMP / COOK / C-12',      desc:'Nesting titanium pot and cup that boil fast and pack tiny.', badge:null },
];

// cart: { productId: quantity }  — held in memory for the session only
let cart = {};
let activeFilter = 'all';
let searchTerm = '';

const grid          = document.getElementById('productGrid');
const resultCount    = document.getElementById('resultCount');
const emptyState     = document.getElementById('emptyState');
const cartItemsEl    = document.getElementById('cartItems');
const cartEmptyMsg   = document.getElementById('cartEmptyMsg');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartCountEl    = document.getElementById('cartCount');
const cartDrawer     = document.getElementById('cartDrawer');
const cartOverlay    = document.getElementById('cartOverlay');
const toastEl        = document.getElementById('toast');
const modalOverlay   = document.getElementById('modalOverlay');

const money = n => `$${n.toFixed(2)}`;

/* ---------------- rendering: product grid ---------------- */
function renderGrid(){
  const term = searchTerm.trim().toLowerCase();

  const items = PRODUCTS.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.category === activeFilter;
    const matchesSearch = !term ||
      p.name.toLowerCase().includes(term) ||
      p.desc.toLowerCase().includes(term) ||
      p.category.includes(term);
    return matchesFilter && matchesSearch;
  });

  resultCount.textContent = items.length;
  emptyState.hidden = items.length !== 0;
  grid.innerHTML = items.map(cardHTML).join('');
}

function cardHTML(p){
  const priceHTML = p.oldPrice
    ? `<span class="strike">${money(p.oldPrice)}</span>${money(p.price)}`
    : money(p.price);
  const badge = p.badge ? `<span class="card-badge">${p.badge}</span>` : '';
  return `
    <article class="card">
      <div class="card-media">
        ${badge}
        <span class="glyph">${p.glyph}</span>
      </div>
      <div class="card-perf"></div>
      <div class="card-body">
        <span class="card-tag">${p.tag}</span>
        <h3>${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-foot">
          <span class="card-price">${priceHTML}</span>
          <button class="add-btn" data-id="${p.id}">Add to pack</button>
        </div>
      </div>
    </article>`;
}

/* ---------------- rendering: cart ---------------- */
function renderCart(){
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  const totalQty = ids.reduce((sum, id) => sum + cart[id], 0);
  cartCountEl.textContent = totalQty;

  cartEmptyMsg.style.display = ids.length ? 'none' : 'block';

  cartItemsEl.innerHTML = ids.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    const qty = cart[id];
    return `
      <div class="cart-item" data-id="${id}">
        <div class="cart-item-icon">${p.glyph}</div>
        <div>
          <p class="cart-item-name">${p.name}</p>
          <p class="cart-item-price">${money(p.price)}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-id="${id}" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-action="remove" data-id="${id}">Remove</button>
      </div>`;
  }).join('');

  const subtotal = ids.reduce((sum, id) => sum + cart[id] * PRODUCTS.find(x => x.id === id).price, 0);
  cartSubtotalEl.textContent = money(subtotal);
}

/* ---------------- cart operations ---------------- */
function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  const p = PRODUCTS.find(x => x.id === id);
  showToast(`${p.name} added to your pack`);
}

function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  renderCart();
}

function removeFromCart(id){
  delete cart[id];
  renderCart();
}

/* ---------------- toast ---------------- */
let toastTimer = null;
function showToast(msg){
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

/* ---------------- cart drawer open/close ---------------- */
function openCart(){
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}
function closeCart(){
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

/* ---------------- checkout modal ---------------- */
function openModal(){ modalOverlay.classList.add('open'); }
function closeModal(){ modalOverlay.classList.remove('open'); }

/* ---------------- event wiring ---------------- */
document.querySelectorAll('.nav-link').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderGrid();
  });
});

document.getElementById('searchInput').addEventListener('input', e => {
  searchTerm = e.target.value;
  renderGrid();
});

grid.addEventListener('click', e => {
  const btn = e.target.closest('.add-btn');
  if(btn) addToCart(btn.dataset.id);
});

cartItemsEl.addEventListener('click', e => {
  const btn = e.target.closest('button[data-action]');
  if(!btn) return;
  const { action, id } = btn.dataset;
  if(action === 'inc') changeQty(id, 1);
  if(action === 'dec') changeQty(id, -1);
  if(action === 'remove') removeFromCart(id);
});

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if(Object.keys(cart).length === 0){
    showToast('Your pack is empty — add some gear first');
    return;
  }
  closeCart();
  openModal();
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalDone').addEventListener('click', () => {
  cart = {};
  renderCart();
  closeModal();
});
modalOverlay.addEventListener('click', e => {
  if(e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){ closeCart(); closeModal(); }
});

/* ---------------- init ---------------- */
renderGrid();
renderCart();
