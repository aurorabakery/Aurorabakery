/* ===========================
   CONFIG — GLOBAL SETTINGS
=========================== */
const CONFIG = {
  phone: "18295095974",
  categories: ["postres", "especiales"]
};

/* ===========================
   DATA — MENU (Simulated DB)
=========================== */
const GRADIENTS = {
  'brownie': 'linear-gradient(135deg, #4e342e 0%, #c65b7c 100%)',
  'cake-jar': 'linear-gradient(135deg, #f7e1d7 0%, #c65b7c 100%)',
  'cake-pop': 'linear-gradient(135deg, #ff80ab 0%, #c65b7c 100%)',
  'cio-caje': 'linear-gradient(135deg, #d7ccc8 0%, #c65b7c 100%)',
  'mini-cake': 'linear-gradient(135deg, #f48fb1 0%, #c65b7c 100%)',
  'chese-cake': 'linear-gradient(135deg, #fff9c4 0%, #c65b7c 100%)',
  'mini-donas': 'linear-gradient(135deg, #f8bbd0 0%, #c65b7c 100%)',
  'tres-leche': 'linear-gradient(135deg, #e3f2fd 0%, #c65b7c 100%)',
  'mini-chese-cake': 'linear-gradient(135deg, #fff59d 0%, #c65b7c 100%)',
  'carlota-de-limon': 'linear-gradient(135deg, #c8e6c9 0%, #c65b7c 100%)',
  'mousse-de-chinola': 'linear-gradient(135deg, #fff176 0%, #c65b7c 100%)'
};

const MENU = [
  {
    id: 'brownie',
    name: 'Brownie',
    desc: 'Intenso sabor a chocolate con una textura melosa y trozos de nueces.',
    price: 150,
    cat: 'postres',
    emoji: '🍫',
    badge: 'Popular',
    image: 'menu Elite Aromas/brownie.png',
    size: 'small'
  },
  {
    id: 'cake-jar',
    name: 'Cake Jar',
    desc: 'Capas de bizcocho y crema suave presentadas en un frasco elegante.',
    price: 350,
    cat: 'postres',
    emoji: '🏺',
    badge: 'Tendencia',
    image: 'menu Elite Aromas/Cake Jar.png',
    size: 'medium'
  },
  {
    id: 'cake-pop',
    name: 'Cake Pop',
    desc: 'Divertidas bolitas de bizcocho cubiertas de chocolate en palito.',
    price: 85,
    cat: 'postres',
    emoji: '🍭',
    badge: 'Para Niños',
    image: 'menu Elite Aromas/cake pop.png',
    size: 'small'
  },
  {
    id: 'cio-caje',
    name: 'Cio Caje',
    desc: 'Nuestra especialidad secreta con notas de café y chocolate premium.',
    price: 450,
    cat: 'especiales',
    emoji: '☕',
    badge: 'Premium',
    image: 'menu Elite Aromas/cio caje.png',
    size: 'large'
  },
  {
    id: 'mini-cake',
    name: 'Mini Cake',
    desc: 'Pequeños pasteles decorados con amor, ideales para un detalle especial.',
    price: 650,
    cat: 'postres',
    emoji: '🎂',
    badge: 'Boutique',
    image: 'menu Elite Aromas/mini cake.png',
    size: 'medium'
  },
  {
    id: 'chese-cake',
    name: 'Cheese Cake',
    desc: 'Clásico pastel de queso con base de galleta y cobertura de frutos rojos.',
    price: 950,
    cat: 'postres',
    emoji: '🍰',
    badge: 'Clásico',
    image: 'menu Elite Aromas/chese cake.png',
    size: 'large'
  },
  {
    id: 'mini-donas',
    name: 'Mini Donas',
    desc: 'Caja de donas miniatura con glaseados variados y toppings divertidos.',
    price: 400,
    cat: 'postres',
    emoji: '🍩',
    badge: 'Party Box',
    image: 'menu Elite Aromas/mini donas.png',
    size: 'medium'
  },
  {
    id: 'tres-leche',
    name: 'Tres Leche',
    desc: 'Bizcocho húmedo bañado en tres tipos de leche y canela.',
    price: 250,
    cat: 'postres',
    emoji: '🥛',
    badge: 'Húmedo',
    image: 'menu Elite Aromas/tres leche.png',
    size: 'medium'
  },
  {
    id: 'mini-chese-cake',
    name: 'Mini Cheese Cake',
    desc: 'Versión individual de nuestro famoso pastel de queso.',
    price: 180,
    cat: 'postres',
    emoji: '🧀',
    badge: 'Individual',
    image: 'menu Elite Aromas/mini chese cake.png',
    size: 'small'
  },
  {
    id: 'carlota-de-limon',
    name: 'Carlota de Limón',
    desc: 'Postre refrescante de capas de galleta María y crema de limón.',
    price: 220,
    cat: 'postres',
    emoji: '🍋',
    badge: 'Fresco',
    image: 'menu Elite Aromas/carlota de limon.png',
    size: 'medium'
  },
  {
    id: 'mousse-de-chinola',
    name: 'Mousse de Chinola',
    desc: 'Espuma suave y ácida de fruta de la pasión (maracuyá).',
    price: 280,
    cat: 'postres',
    emoji: '🟡',
    badge: 'Tropical',
    image: 'menu Elite Aromas/mousse de chinola.png',
    size: 'medium'
  }
];
