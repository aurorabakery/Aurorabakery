/* ===========================
   AURORA BAKERY - CATÁLOGO OFICIAL V2
=========================== */
const CONFIG = {
  phone: "18295095974",
  categories: ["Pastelería", "Dulces", "Salados", "Bebidas"]
};

const GRADIENTS = {
  'default': 'linear-gradient(135deg, #c65b7c 0%, #3d1e26 100%)',
  'gold': 'linear-gradient(135deg, #d4af37 0%, #c65b7c 100%)'
};

const MENU = [
  {
    id: 'bizcocho-vainilla',
    name: 'Bizcocho de Vainilla',
    desc: 'Esponjoso bizcocho artesanal con el toque secreto de Aurora.',
    price: 850,
    cat: 'Pastelería',
    emoji: '🍰',
    badge: '⭐ El Favorito',
    variants: [
      { name: 'Pequeño', price: 850 },
      { name: 'Mediano', price: 1200 },
      { name: 'Grande', price: 1800 }
    ],
    options: ['Suspiro Clásico', 'Dulce de Leche', 'Crema Pastelera']
  },
  {
    id: 'mini-donas-6',
    name: 'Caja de Mini Donas',
    desc: '6 unidades decoradas con glaseado premium y toppings.',
    price: 450,
    cat: 'Dulces',
    emoji: '🍩',
    badge: '🆕 Nuevo',
    variants: [],
    options: ['Chocolate', 'Fresa', 'Vainilla', 'Veteadas']
  },
  {
    id: 'brownie-premium',
    name: 'Brownie Melcochoso',
    desc: 'Doble chocolate con nueces y un centro suave irresistible.',
    price: 150,
    cat: 'Dulces',
    emoji: '🍫',
    variants: [],
    options: []
  },
  {
    id: 'cupcake-decorado',
    name: 'Cupcakes Temáticos',
    desc: 'Deliciosos cupcakes personalizados para cualquier ocasión.',
    price: 125,
    cat: 'Pastelería',
    emoji: '🧁',
    variants: [],
    options: ['Red Velvet', 'Vainilla', 'Oreo']
  }
];
