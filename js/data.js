/* ===========================
   AURORA BAKERY - CONFIGURACIÓN V2
=========================== */
const CONFIG = {
  phone: "18295095974",
  categories: ["Pastelería", "Dulces", "Salados", "Bebidas"]
};

const GRADIENTS = {
  'default': 'linear-gradient(135deg, #c65b7c 0%, #3d1e26 100%)'
};

const MENU = [
  {
    id: 1710000000000,
    name: "Bizcocho de Vainilla",
    desc: "Suave y esponjoso con crema pastelera.",
    price: 850,
    cat: "Pastelería",
    emoji: "🍰",
    image: "",
    variants: [{name: "Pequeño", price: 850}, {name: "Grande", price: 1500}],
    options: ["Suspiro", "Dulce de Leche"]
  },
  {
    id: 1710000000001,
    name: "Mini Donas",
    desc: "Caja de 6 unidades decoradas.",
    price: 450,
    cat: "Dulces",
    emoji: "🍩",
    image: "",
    variants: [],
    options: ["Chocolate", "Fresa", "Vainilla"]
  }
];
