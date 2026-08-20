## 📸 Website Preview

### Homepage

![Website Homepage](images/website-1.png)

### Website Preview

![Website Preview](images/website-2.png)

# 🏔️ Fikarrfree Trail Co.

**A fully front-end e-commerce demo site built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies.**

A fictional outdoor-gear storefront themed around a trailhead depot: topographic contour motifs, a condensed trail-sign type system, and product cards styled like torn trail permits. Built to demonstrate a complete front-end shopping flow — browsing, filtering, search, and cart — using nothing but the browser.

---

## ✨ Features

- **Product catalog** — 12 items across 4 categories (Packs, Footwear, Apparel, Camp)
- **Category filtering** — instant client-side filtering via the nav bar
- **Live search** — filters by product name, description, and category as you type
- **Shopping cart drawer** — slide-out panel with add/remove, quantity +/−, and a running subtotal
- **Toast notifications** — confirms when an item is added to the cart
- **Checkout modal** — a simple confirmation flow (no real payment processing — see [Roadmap](#-roadmap))
- **Fully responsive** — down to mobile, with visible keyboard focus states and `prefers-reduced-motion` support
- **Zero dependencies** — just static files; open and go

---

## 🛠️ Tech stack

- **HTML5** — semantic markup, no templating engine
- **CSS3** — custom properties (design tokens), Grid/Flexbox layout, no preprocessor
- **JavaScript (ES6+)** — vanilla DOM manipulation, no frameworks or bundler
- **Fonts** — [Oswald](https://fonts.google.com/specimen/Oswald), [Inter](https://fonts.google.com/specimen/Inter), and [Space Mono](https://fonts.google.com/specimen/Space+Mono) via Google Fonts

---

## 📁 Project structure

```
Fikarfree-shop/
├── index.html      # Page structure — header, hero, catalog, cart drawer, modal
├── style.css        # Design tokens + all styling
├── script.js         # Product data, rendering, filtering/search, cart logic
└── README.md
```

---

## 🚀 Getting started

No installation or build step required.

**Option 1 — just open it:**
1. Clone or download this repo
2. Open `index.html` directly in your browser

**Option 2 — serve it locally** (recommended, avoids any local file-loading quirks):
```bash
# using Node
npx serve .

# or using Python
python3 -m http.server 8000
```
Then visit `http://localhost:8000` (or whichever port is shown).

**Option 3 — GitHub Pages:**
Enable Pages in your repo settings (root of `main` branch) and the site will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 🛒 How the cart works

Cart state (`cart = { productId: quantity }`) is held **in memory only**, in `script.js`. It resets on page reload by design, since this is a front-end-only demo with no backend or storage layer. See the [Roadmap](#-roadmap) below for how to add persistence.

---

## ✏️ Customizing the catalog

All product data lives in a single array at the top of `script.js`:

```js
const PRODUCTS = [
  { id:'p01', name:'Ridgeline 42L Pack', category:'packs', price:189, oldPrice:null, glyph:'🎒', tag:'PACKS / 42L / TOPO-1', desc:'...', badge:null },
  // ...
];
```

To add a product, add an object to this array — the grid, search, and category filters all read from it automatically. To add a new category, use a new `category` value here and add a matching `data-filter` button in the nav in `index.html`.

---

## 🎨 Design notes

- **Palette:** deep forest green, warm paper/sage background, mustard-yellow accent, slate blue and clay used sparingly for secondary accents and sale tags
- **Type system:** Oswald (condensed display, trail-sign feel) for headings, Inter for body copy, Space Mono for prices, tags, and coordinate-style labels
- **Signature motif:** topographic contour lines in the hero background, and product cards styled like a perforated trail permit (dashed divider with punch-hole notches)

Keep new UI additions consistent with this system — reuse the CSS custom properties in `style.css` rather than introducing new colors/fonts ad hoc.

---

## 🗺️ Roadmap

Ideas for extending this demo:

- [ ] Wishlist / save-for-later
- [ ] Individual product detail pages
- [ ] Persist cart with `localStorage` or a backend
- [ ] Real payment integration (e.g. Stripe Checkout)
- [ ] User accounts and order history
- [ ] Product reviews and ratings
- [ ] Backend/API-driven product catalog instead of the static array

---

## 📄 License

This is a demo project built for learning/portfolio purposes. Feel free to fork, adapt, and reuse — attribution appreciated but not required.

---

## 🙏 Credits

- Fonts: [Google Fonts](https://fonts.google.com/) — Oswald, Inter, Space Mono
- Product imagery: emoji glyphs (placeholder — swap in real photography for production use)

