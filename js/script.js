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

  // Leer configuración (Limpieza de memoria Aurora V2)
  const storedConfig = localStorage.getItem('aurora_config_v2');
  const currentConfig = storedConfig ? JSON.parse(storedConfig) : CONFIG;

  // Leer productos (Limpieza de memoria Aurora V2)
  const storedProducts = localStorage.getItem('aurora_products_v2');
  const currentProducts = storedProducts ? JSON.parse(storedProducts) : MENU;

  const items = filter === 'all' ? currentProducts : currentProducts.filter(p => p.cat === filter);

  // Renderizar pestañas de filtro dinámicamente si es necesario
  renderFilterTabs(currentConfig.categories, filter);

  items.forEach((product, i) => {
    const card = document.createElement('div');
    card.className = `product-card ${product.size || 'medium'}`;
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((i % 4) * 80));

    // Determinar precio inicial (el base o el de la primera variante)
    let initialPrice = product.price;
    let hasVariants = product.variants && product.variants.length > 0;
    if (hasVariants) initialPrice = product.variants[0].price;

    const priceDisplay = `<span class="card-price" id="price-${product.id}">RD$ ${Number(initialPrice).toLocaleString()}</span>`;

    // Generar selectores de pastillas (Pills) si hay variantes u opciones
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

    card.innerHTML = `
      <div class="card-img-wrap">
        <div class="card-img-gradient" style="background:${GRADIENTS[product.id] || 'linear-gradient(135deg,#c65b7c,#3d1e26)'}"></div>
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
          <button class="add-btn" id="btn-${product.id}" onclick="addToCart('${product.id}')" title="Agregar al carrito">
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
  // Desactivar otros botones en el mismo contenedor
  const container = btn.parentElement;
  container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));

  // Activar este botón
  btn.classList.add('active');

  // Calcular precio total dinámico (Base/Variante + Sabor Extra)
  updateProductDisplayPrice(productId);
}

function updateProductDisplayPrice(productId) {
  const storedProducts = localStorage.getItem('aurora_products_v2');
  const currentProducts = storedProducts ? JSON.parse(storedProducts) : MENU;
  const product = currentProducts.find(p => String(p.id) === String(productId));
  if (!product) return;

  let basePrice = product.price;

  // Precio de Variante
  const variantContainer = document.getElementById(`variants-${productId}`);
  if (variantContainer) {
    const activeV = variantContainer.querySelector('.pill-btn.active');
    if (activeV) {
      const vName = activeV.innerText.split('\n')[0].trim();
      const variantObj = product.variants.find(v => v.name === vName);
      if (variantObj) basePrice = variantObj.price;
    }
  }

  // Precio de Sabor
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
    priceEl.style.opacity = '0.3';
    setTimeout(() => {
      priceEl.textContent = `RD$ ${Number(basePrice + extraPrice).toLocaleString()}`;
      priceEl.style.opacity = '1';
    }, 150);
  }
}

/* ===========================
   ADD TO CART
=========================== */
function addToCart(id) {
  const storedProducts = localStorage.getItem('aurora_products_v2');
  const currentProducts = storedProducts ? JSON.parse(storedProducts) : MENU;
  const product = currentProducts.find(p => String(p.id) === String(id));

  if (!product) return;

  let finalPrice = product.price;
  let detail = "";

  // Obtener variante seleccionada desde las pastillas (pills)
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

  // Obtener sabor seleccionado desde las pastillas (pills)
  const flavorContainer = document.getElementById(`flavors-${id}`);
  if (flavorContainer) {
    const activeF = flavorContainer.querySelector('.pill-btn.active');
    if (activeF) {
      const fText = activeF.innerText.split('\n')[0].trim();
      const fName = fText.split(' (+')[0].trim();
      detail += ` (${fName})`;

      const flavorObj = product.options.find(o => (typeof o === 'string' ? o : o.name) === fName);
      if (flavorObj && typeof flavorObj === 'object') {
        finalPrice += (flavorObj.price || 0);
      }
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

  const btn = document.getElementById(`btn-${id}`);
  if (btn) {
    btn.classList.add('added');
    setTimeout(() => btn.classList.remove('added'), 400);
  }

  const badge = document.getElementById('cart-count');
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 450);

  showToast(`${product.emoji} ${product.name} agregado`);
  renderCart();
}

/* ===========================
   TOAST
=========================== */
let toastTimer;
function showToast(msg, bg = '#D4AF37') {
  const toast = document.getElementById('add-toast');
  const text  = document.getElementById('toast-text');
  toast.style.background = bg;
  toast.style.color = '#000';
  text.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
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
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <p>Tu carrito está vacío.<br>¡Descubre una delicia!</p>
      </div>`;
    summary.innerHTML = '';
    waBtn.disabled = true;
    return;
  }

  waBtn.disabled = false;
  container.innerHTML = '';

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.id = `ci-${item.id}`;
    el.innerHTML = `
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-detail">RD$ ${item.price.toLocaleString()} c/u</div>
      </div>
      <div class="ci-qty-wrap">
        <button class="qty-btn minus" onclick="changeQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
      </div>
      <div class="ci-price">RD$ ${(item.price * item.qty).toLocaleString()}</div>
    `;
    container.appendChild(el);
  });

  summary.innerHTML = `
    <div class="summary-row">
      <span>Subtotal (${totalItems} items)</span>
      <span>RD$ ${totalPrice.toLocaleString()}</span>
    </div>
    <div class="summary-row total">
      <span>TOTAL</span>
      <span class="total-val">RD$ ${totalPrice.toLocaleString()}</span>
    </div>
  `;
}

/* ===========================
   QUANTITY CHANGE / REMOVE
=========================== */
function changeQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    const el = document.getElementById(`ci-${id}`);
    if (el) {
      el.classList.add('removing');
      setTimeout(() => {
        cart.splice(idx, 1);
        renderCart();
      }, 280);
    } else {
      cart.splice(idx, 1);
      renderCart();
    }
    return;
  }
  renderCart();
}

/* ===========================
   CLEAR CART
=========================== */
function clearCart() {
  if (cart.length === 0) return;
  if (!confirm('¿Vaciar el carrito?')) return;
  cart = [];
  renderCart();
}

function renderFilterTabs(categories, activeCat) {
  const tabContainer = document.querySelector('.filter-tabs');
  if (!tabContainer) return;

  let html = `<button class="filter-tab ${activeCat === 'all' ? 'active' : ''}" data-cat="all">✨ Todo</button>`;
  categories.forEach(cat => {
    html += `<button class="filter-tab ${activeCat === cat ? 'active' : ''}" data-cat="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>`;
  });
  tabContainer.innerHTML = html;

  // Re-vincular eventos
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderProducts(tab.dataset.cat);
    };
  });
}

/* ===========================
   WHATSAPP SEND
=========================== */
function sendWhatsApp() {
  if (cart.length === 0) return;

  const storedConfig = localStorage.getItem('aurora_config_v2');
  const currentConfig = storedConfig ? JSON.parse(storedConfig) : CONFIG;
  const phone = currentConfig.phone;

  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let msg = "✨ *PEDIDO - AURORA BAKERY* ✨\n\n";

  cart.forEach(item => {
    msg += `✅ *${item.qty}x ${item.name}*\n`;
    msg += `   RD$ ${(item.price * item.qty).toLocaleString()}\n\n`;
  });

  msg += "==========================\n";
  msg += `💰 *TOTAL: RD$ ${totalPrice.toLocaleString()}*\n`;
  msg += "==========================\n\n";
  msg += "¡Hola! Me gustaría encargar estos postres. 😊";

  const encoded = encodeURIComponent(msg);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;

  const win = window.open(whatsappUrl, '_blank');
  if (!win) {
    location.href = whatsappUrl;
  }
}

/* ===========================
   UI TOGGLES & LISTENERS
=========================== */
function toggleCart() {
  const panel   = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  const isOpen  = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===========================
   INIT
=========================== */
function initBakeryDecor() {
  const container = document.getElementById('bakery-decor');
  if (!container) return;
  const items = ['🍰', '🧁', '🥐', '🍞', '過', '🍪', '🥨'];
  for (let i = 0; i < 15; i++) {
    const span = document.createElement('span');
    span.textContent = items[Math.floor(Math.random() * items.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.animationDelay = Math.random() * 10 + 's';
    span.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
    container.appendChild(span);
  }
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');

    AOS.init({ once: true, duration: 600, offset: 60 });

    // Bakery Decoration Animation
    initBakeryDecor();

    // Global filter listeners
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderProducts(tab.dataset.cat);
      });
    });

    renderProducts();
    renderCart();

    // NUEVO: Actualizar el link de WhatsApp del footer dinámicamente
    const storedConfig = localStorage.getItem('aurora_config_v2');
    const currentConfig = storedConfig ? JSON.parse(storedConfig) : (typeof CONFIG !== 'undefined' ? CONFIG : {phone: '18295095974'});
    const footerWa = document.querySelector('footer a[href*="wa.me"]');
    if (footerWa) footerWa.href = `https://wa.me/${currentConfig.phone}`;
  }, 1600);
});
