const KEYS = {
  products: 'shelby_demo_products',
  cart: 'shelby_demo_cart',
  orders: 'shelby_demo_orders',
  settings: 'shelby_demo_settings'
};

export const defaultProducts = [
  {id:1,name:'Espresso Shelby',category:'Café',description:'Shot intenso de café de especialidad, corto y con carácter.',price:2200,icon:'☕',active:true},
  {id:2,name:'Cappuccino',category:'Café',description:'Espresso, leche texturizada y una capa cremosa de espuma.',price:3500,icon:'☕',active:true},
  {id:3,name:'Flat White',category:'Café',description:'Doble espresso y leche microespumada para un sabor más intenso.',price:3800,icon:'🥛',active:true},
  {id:4,name:'Latte Doble Vainilla',category:'Café',description:'Latte suave con doble toque de vainilla. Inspirado en el café de la semana de Shelby.',price:4200,icon:'🤎',active:true},
  {id:5,name:'Freddo Cappuccino',category:'Fríos',description:'Café frío, cremoso y refrescante para recorrer Valparaíso.',price:4500,icon:'🧊',active:true},
  {id:6,name:'Americano + Queque',category:'Desayunos',description:'Un clásico para comenzar la mañana: americano y porción de queque.',price:3100,icon:'🍰',active:true},
  {id:7,name:'Latte + Rollito',category:'Desayunos',description:'Latte acompañado de rollito de canela. Producto de muestra editable.',price:5000,icon:'🥐',active:true},
  {id:8,name:'Dona Shelby',category:'Dulce',description:'Dona suave para acompañar tu café favorito.',price:1900,icon:'🍩',active:true},
  {id:9,name:'Rollito de Canela',category:'Dulce',description:'Masa suave, canela y glaseado para una pausa dulce.',price:2800,icon:'🥮',active:true}
];

export const defaultSettings = {
  name:'Shelby Coffee',
  address:'Errázuriz 629, Valparaíso',
  hours:'Lun–Vie 7:15–15:30 · Sáb 8:00–12:00',
  instagram:'@shelbycoffee.chile'
};

function read(key, fallback){
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function write(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

export const Store = {
  getProducts(){
    const products = read(KEYS.products, null);
    if (!products) { write(KEYS.products, defaultProducts); return structuredClone(defaultProducts); }
    return products;
  },
  saveProducts(products){ write(KEYS.products, products); },
  getCart(){ return read(KEYS.cart, []); },
  saveCart(cart){ write(KEYS.cart, cart); },
  clearCart(){ write(KEYS.cart, []); },
  getOrders(){ return read(KEYS.orders, []); },
  saveOrders(orders){ write(KEYS.orders, orders); },
  getSettings(){
    const settings = read(KEYS.settings, null);
    if (!settings) { write(KEYS.settings, defaultSettings); return {...defaultSettings}; }
    return settings;
  },
  saveSettings(settings){ write(KEYS.settings, settings); },
  reset(){ Object.values(KEYS).forEach(key => localStorage.removeItem(key)); }
};
