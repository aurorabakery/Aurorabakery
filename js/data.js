const CONFIG = {
  "phone": "18292912577",
  "categories": [
    "Pastelería",
    "Dulces",
    "Salados",
    "Bebidas"
  ]
};

const MENU = [
  {
    "id": "bizcocho-vainilla",
    "name": "MINI CAKE ",
    "desc": "Esponjoso bizcocho artesanal con el toque secreto de Aurora.",
    "price": "650",
    "cat": "Pastelería",
    "emoji": "🍰",
    "badge": "⭐ El Favorito",
    "variants": [
      {
        "name": "Básico ",
        "price": "650"
      },
      {
        "name": "Decorado ",
        "price": "800"
      },
      {
        "name": "Personalizas ",
        "price": "950"
      }
    ],
    "options": [
      "Suspiro Clásico",
      "Dulce de Leche",
      "Crema Pastelera"
    ],
    "image": "fotos-productos/prod-bizcocho-vainilla.jpg"
  },
  {
    "id": "mini-donas-6",
    "name": "Caja de Mini Donas",
    "desc": "6 unidades decoradas con glaseado premium y toppings.",
    "price": 450,
    "cat": "Dulces",
    "emoji": "🍩",
    "badge": "🆕 Nuevo",
    "variants": [],
    "options": [
      "Chocolate",
      "Fresa",
      "Vainilla",
      "Veteadas"
    ],
    "image": "fotos-productos/prod-mini-donas-6.jpg"
  },
  {
    "id": "brownie-premium",
    "name": "Brownie Melcochoso",
    "desc": "Doble chocolate con nueces y un centro suave irresistible.",
    "price": 150,
    "cat": "Dulces",
    "emoji": "🍫",
    "variants": [],
    "options": [],
    "image": "fotos-productos/prod-brownie-premium.jpg"
  },
  {
    "id": "cupcake-decorado",
    "name": "Cupcakes Temáticos",
    "desc": "Deliciosos cupcakes personalizados para cualquier ocasión.",
    "price": "150",
    "cat": "Pastelería",
    "emoji": "🧁",
    "variants": [],
    "options": [
      "Red Velvet",
      "Vainilla",
      "Oreo"
    ],
    "image": "fotos-productos/prod-cupcake-decorado.jpg"
  },
  {
    "id": 1777833151775,
    "name": "CAKE JARS",
    "desc": "Capas de bizcocho y crema en cada cucharada.",
    "price": "250",
    "cat": "Pastelería",
    "image": "fotos-productos/prod-1777833151775.jpg",
    "variants": [
      {
        "name": "8oz",
        "price": ""
      }
    ],
    "options": [
      {
        "name": "Vainilla ",
        "price": ""
      },
      {
        "name": "Chocolate ",
        "price": ""
      },
      {
        "name": "Red velvet ",
        "price": ""
      }
    ]
  },
  {
    "id": 1777833171643,
    "name": "CAKE POPS",
    "desc": "Dulces bocados cubiertos de chocolate. ",
    "price": "100",
    "cat": "Pastelería",
    "image": "fotos-productos/prod-1777833171643.jpg",
    "variants": [
      {
        "name": "",
        "price": ""
      }
    ],
    "options": [
      {
        "name": "Vainilla ",
        "price": ""
      },
      {
        "name": "Red velvet ",
        "price": ""
      },
      {
        "name": "Chocola blanco ",
        "price": ""
      },
      {
        "name": "Chocolate ",
        "price": ""
      },
      {
        "name": "Fresa ",
        "price": ""
      },
      {
        "name": "Sprinkles ",
        "price": ""
      }
    ]
  },
  {
    "id": 1777833189658,
    "name": "CARLOTA",
    "desc": "Refrescante, ácida y dulce a la vez.",
    "price": "180",
    "cat": "Pastelería",
    "image": "fotos-productos/prod-1777833189658.jpg",
    "variants": [
      {
        "name": "8oz",
        "price": ""
      }
    ],
    "options": [
      {
        "name": "Limón ",
        "price": ""
      },
      {
        "name": "Maracuya",
        "price": ""
      },
      {
        "name": "Mango ",
        "price": ""
      }
    ]
  },
  {
    "id": 1777833202934,
    "name": "CHEESECAKE",
    "desc": "Cremoso y delicado, el equilibrio perfecto de dulzura ",
    "price": "220",
    "cat": "Pastelería",
    "image": "fotos-productos/prod-1777833202934.jpg",
    "variants": [],
    "options": [
      {
        "name": "Oreo",
        "price": ""
      },
      {
        "name": "Chocolate vainilla ",
        "price": ""
      },
      {
        "name": "Dulce de leche ",
        "price": ""
      }
    ]
  },
  {
    "id": 1777833228967,
    "name": "MINI CHEESECAKE (4 porciones)",
    "desc": "Cremoso y delicado ",
    "price": "850",
    "cat": "Pastelería",
    "image": "fotos-productos/prod-1777833228967.jpg",
    "variants": [
      {
        "name": "",
        "price": ""
      }
    ],
    "options": [
      {
        "name": "Oreo",
        "price": ""
      },
      {
        "name": "Fresa",
        "price": ""
      },
      {
        "name": "Chocolate ",
        "price": ""
      }
    ]
  },
  {
    "id": 1777833246089,
    "name": "MOUSSE",
    "desc": "Ligero, aireado y con un toque tropical.",
    "price": "120",
    "cat": "Pastelería",
    "image": "fotos-productos/prod-1777833246089.jpg",
    "variants": [
      {
        "name": "5oz",
        "price": ""
      }
    ],
    "options": [
      {
        "name": "Maracuya ",
        "price": ""
      },
      {
        "name": "Limón ",
        "price": ""
      },
      {
        "name": "Chocolate ",
        "price": "30"
      },
      {
        "name": "Mango ",
        "price": "30"
      }
    ]
  },
  {
    "id": 1777833257369,
    "name": "TRES LECHES",
    "desc": "Suave, húmedo y clásico… ¡un antojo irresistible! 😋💕",
    "price": "189",
    "cat": "Pastelería",
    "image": "fotos-productos/prod-1777833257369.jpg",
    "variants": [
      {
        "name": "8oz",
        "price": "180"
      }
    ],
    "options": []
  }
];

const GRADIENTS = { 'default': 'linear-gradient(135deg, #c65b7c 0%, #3d1e26 100%)' };