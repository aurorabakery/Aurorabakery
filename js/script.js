/* ===========================
   CART STATE
=========================== */
let cart = [];

/* ===========================
   RENDER PRODUCTS
=========================== */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Leer configuración (Aurora V2)
  let currentConfig = CONFIG;
  const storedConfig = localStorage.getItem('aurora_config_v2');
  if (storedConfig) {
    try { currentConfig = JSON.parse(storedConfig); } catch(e) {}
  }

  // Leer productos (Aurora V2)
  let currentProducts = MENU;
  const storedProducts = localStorage.getItem('aurora_products_v2');
  if (storedProducts) {
    try {
      const parsed = JSON.parse(storedProducts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        currentProducts = parsed;
      }
    } catch(e) {}
  }

  const items = filter === 'all' ? currentProducts : currentProducts.filter(p => p.cat === filter);

  // Renderizar pestañas de filtro dinámicamente
  if (currentConfig.categories) {
    renderFilterTabs(currentConfig.categories, filter);
  }

  items.forEach((product, i) => {
    const card = document.createElement('div');
    card.className = `product-card ${product.size || 'medium'}`;
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((i % 4) * 80));

    // Precio dinámico
    let initialPrice = product.price;
    let hasVariants = product.variants && product.variants.length > 0;
    if (hasVariants) initialPrice = product.variants[0].price;

    const priceDisplay = `<span class="card-price" id="price-${product.id}">RD$ ${Number(initialPrice).toLocaleString()}</span>`;

    // Opciones (Pills)
    let variantsHTML = '';
    if (hasVariants) {
      variantsHTML = `
        <div class="product-options">
          <label>Tamaño:</label>
          <div class="pills-container" id="variants-${product.id}">
            ${product.variants.map((v, idx) => `
              <button class="pill-btn ${idx === 0 ? 'active' : ''}"
                      onclick="selectPill('${product.id}', 'variant', ${idx}, ${v.price}, this)">
                ${v.name}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    let flavorsHTML = '';
    if (product.options && product.options.length > 0) {
      flavorsHTML = `
        <div class="product-options">
          <label>Sabor:</label>
          <div class="pills-container" id="flavors-${product.id}">
            ${product.options.map((opt, idx) => {
              const optName = typeof opt === 'string' ? opt : opt.name;
              const optPrice = typeof opt === 'string' ? 0 : (opt.price || 0);
              return `
                <button class="pill-btn ${idx === 0 ? 'active' : ''}"
                        onclick="selectPill('${product.id}', 'flavor', '${optName}', ${optPrice}, this)">
                  ${optName}${optPrice > 0 ? ` (+${optPrice})` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Fondo degradado fallback
    const bgGradient = GRADIENTS[product.id] || GRADIENTS['default'] || 'linear-gradient(135deg,#c65b7c,#3d1e26)';

    card.innerHTML = `
      <div class="card-img-wrap">
        <div class="card-img-gradient" style="background:${bgGradient}"></div>
        ${product.image ? `<img src="${product.image}" alt="${product.name}" id="img-${product.id}">` : `<div class="card-img-emoji">${product.emoji || '✨'}</div>`}
        ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-name">${product.name}</div>
        <div class="card-desc">${product.desc}</div>
        ${variantsHTML}
        ${flavorsHTML}
        <div class="card-footer">
          ${priceDisplay}
          <button class="add-btn" id="btn-${product.id}" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  AOS.refresh();
}

/* ===========================
   PILL SELECTION LOGIC
=========================== */
function selectPill(productId, type, value, price, btn) {
  const container = btn.parentElement;
  container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateProductDisplayPrice(productId);
}

function updateProductDisplayPrice(productId) {
  let currentProducts = MENU;
  const storedProducts = localStorage.getItem('aurora_products_v2');
  if (storedProducts) {
    try { currentProducts = JSON.parse(storedProducts); } catch(e) {}
  }

  const product = currentProducts.find(p => String(p.id) === String(productId));
  if (!product) return;

  let basePrice = product.price;

  const variantContainer = document.getElementById(`variants-${productId}`);
  if (variantContainer) {
    const activeV = variantContainer.querySelector('.pill-btn.active');
    if (activeV) {
      const vName = activeV.innerText.split('\n')[0].trim();
      const variantObj = product.variants.find(v => v.name === vName);
      if (variantObj) basePrice = variantObj.price;
    }
  }

  let extraPrice = 0;
  const flavorContainer = document.getElementById(`flavors-${productId}`);
  if (flavorContainer) {
    const activeF = flavorContainer.querySelector('.pill-btn.active');
    if (activeF) {
      const fText = activeF.innerText.split('\n')[0].trim();
      const fName = fText.split(' (+')[0].trim();
      const flavorObj = product.options.find(o => (typeof o === 'string' ? o : o.name) === fName);
      if (flavorObj && typeof flavorObj === 'object') extraPrice = flavorObj.price || 0;
    }
  }

  const priceEl = document.getElementById(`price-${productId}`);
  if (priceEl) {
    priceEl.textContent = `RD$ ${Number(basePrice + extraPrice).toLocaleString()}`;
  }
}

/* ===========================
   ADD TO CART
=========================== */
function addToCart(id) {
  let currentProducts = MENU;
  const storedProducts = localStorage.getItem('aurora_products_v2');
  if (storedProducts) {
    try { currentProducts = JSON.parse(storedProducts); } catch(e) {}
  }

  const product = currentProducts.find(p => String(p.id) === String(id));
  if (!product) return;

  let finalPrice = product.price;
  let detail = "";

  const variantContainer = document.getElementById(`variants-${id}`);
  if (variantContainer) {
    const activeV = variantContainer.querySelector('.pill-btn.active');
    if (activeV) {
      const vName = activeV.textContent.trim();
      const variantObj = product.variants.find(v => v.name === vName);
      if (variantObj) {
        finalPrice = variantObj.price;
        detail += ` [${vName}]`;
      }
    }
  }

  const flavorContainer = document.getElementById(`flavors-${id}`);
  if (flavorContainer) {
    const activeF = flavorContainer.querySelector('.pill-btn.active');
    if (activeF) {
      const fText = activeF.innerText.split('\n')[0].trim();
      const fName = fText.split(' (+')[0].trim();
      detail += ` (${fName})`;
      const flavorObj = product.options.find(o => (typeof o === 'string' ? o : o.name) === fName);
      if (flavorObj && typeof flavorObj === 'object') finalPrice += (flavorObj.price || 0);
    }
  }

  const cartItemName = product.name + detail;
  const existing = cart.find(item => item.name === cartItemName);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: Date.now(),
      productId: product.id,
      name: cartItemName,
      price: finalPrice,
      qty: 1,
      emoji: product.emoji || '✨'
    });
  }

  const badge = document.getElementById('cart-count');
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 450);

  showToast(`¡${product.name} agregado!`);
  renderCart();
}

/* ===========================
   TOAST
=========================== */
function showToast(msg) {
  const toast = document.getElementById('add-toast');
  const text  = document.getElementById('toast-text');
  if (!toast || !text) return;
  text.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

/* ===========================
   RENDER CART
=========================== */
function renderCart() {
  const container = document.getElementById('cart-items');
  const summary   = document.getElementById('cart-summary');
  const badge     = document.getElementById('cart-count');
  const waBtn     = document.getElementById('wa-btn');

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  badge.textContent = totalItems;

  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><p>Tu carrito está vacío</p></div>`;
    summary.innerHTML = '';
    if (waBtn) waBtn.disabled = true;
    return;
  }

  if (waBtn) waBtn.disabled = false;
  container.innerHTML = '';

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-detail">RD$ ${item.price.toLocaleString()} x ${item.qty}</div>
      </div>
      <div class="ci-qty-wrap">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    container.appendChild(el);
  });

  summary.innerHTML = `<div class="summary-total">Total: RD$ ${totalPrice.toLocaleString()}</div>`;
}

function changeQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}

function renderFilterTabs(categories, activeCat) {
  const tabContainer = document.querySelector('.filter-tabs');
  if (!tabContainer) return;

  let html = `<button class="filter-tab ${activeCat === 'all' ? 'active' : ''}" onclick="renderProducts('all')">✨ Todo</button>`;
  categories.forEach(cat => {
    html += `<button class="filter-tab ${activeCat === cat ? 'active' : ''}" onclick="renderProducts('${cat}')">${cat}</button>`;
  });
  tabContainer.innerHTML = html;
}

/* ===========================
   WHATSAPP SEND
=========================== */
function sendWhatsApp() {
  if (cart.length === 0) return;

  let currentConfig = CONFIG;
  const storedConfig = localStorage.getItem('aurora_config_v2');
  if (storedConfig) {
    try { currentConfig = JSON.parse(storedConfig); } catch(e) {}
  }

  const cleanPhone = currentConfig.phone.replace(/\D/g, '') || '18295095974';
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // FORMATO RECUPERADO DE ELITE AROMAS
  let msg = "✨ *PEDIDO - AURORA BAKERY* ✨\n\n";

  cart.forEach(item => {
    msg += `✅ *${item.qty}x ${item.name}*\n`;
    msg += `   RD$ ${(item.price * item.qty).toLocaleString()}\n\n`;
  });

  msg += "==========================\n";
  msg += `💰 *TOTAL: RD$ ${totalPrice.toLocaleString()}*\n`;
  msg += "==========================\n\n";
  msg += "¡Hola! Me gustaría confirmar mi pedido. 😊🧁";

  const encoded = encodeURIComponent(msg);
  // Usamos api.whatsapp.com como en Elite Aromas para evitar errores de símbolos
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;

  const win = window.open(whatsappUrl, '_blank');
  if (!win) {
    location.href = whatsappUrl;
  }
}

function toggleCart() {
  document.getElementById('cart-panel').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hide');

  // Inicialización de decoración
  const decor = document.getElementById('bakery-decor');
  if (decor) {
    const emojis = ['🍰', '🧁', '🥐', '🍩'];
    for(let i=0; i<10; i++) {
       const span = document.createElement('span');
       span.textContent = emojis[Math.floor(Math.random()*emojis.length)];
       span.style.left = Math.random()*100 + '%';
       span.style.animationDelay = Math.random()*5 + 's';
       decor.appendChild(span);
    }
  }

  renderProducts();
  renderCart();

  if (typeof AOS !== 'undefined') AOS.init();
});
