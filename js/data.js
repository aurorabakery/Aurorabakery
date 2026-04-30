/* ===========================
   CONFIG — GLOBAL SETTINGS (Aurora Bakery)
=========================== */
const CONFIG = {
  phone: "18295095974",
  categories: ["Pastelería", "Dulces", "Salados", "Bebidas"]
};

/* ===========================
   DATA — GRADIENTS (Colores de fondo para productos)
=========================== */
const GRADIENTS = {
  'default': 'linear-gradient(135deg, #c65b7c 0%, #3d1e26 100%)',
  'pastel': 'linear-gradient(135deg, #f7e1d7 0%, #c65b7c 100%)',
  'chocolate': 'linear-gradient(135deg, #4e342e 0%, #c65b7c 100%)',
  'fresa': 'linear-gradient(135deg, #ff80ab 0%, #c65b7c 100%)',
  'limon': 'linear-gradient(135deg, #c8e6c9 0%, #c65b7c 100%)',
  'naranja': 'linear-gradient(135deg, #fff176 0%, #c65b7c 100%)'
};

/* ===========================
   DATA — MENU (Carga inicial si el Admin está vacío)
=========================== */
const MENU = [
  {
    id: 'welcome-1',
    name: '¡Bienvenidos a Aurora!',
    desc: 'Tu catálogo está listo. Agrega tus productos desde el Panel Admin.',
    price: 0,
    cat: 'Pastelería',
    emoji: '✨',
    image: '',
    size: 'medium',
    variants: [],
    options: []
  }
];
