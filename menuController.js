import { Store } from '../model/store.js';

export class MenuController {
  constructor(){
    this.products = Store.getProducts();
    this.cart = Store.getCart();
    this.table = this.resolveTable();
  }
  resolveTable(){
    const params = new URLSearchParams(location.search);
    const fromUrl = Number(params.get('mesa'));
    return Number.isInteger(fromUrl) && fromUrl > 0 && fromUrl <= 99 ? fromUrl : null;
  }
  getActiveProducts(category='Todos'){
    return this.products.filter(p => p.active && (category === 'Todos' || p.category === category));
  }
  getCategories(){ return ['Todos', ...new Set(this.products.filter(p=>p.active).map(p=>p.category))]; }
  addToCart(id){
    const existing = this.cart.find(i => i.id === id);
    if(existing) existing.qty += 1; else this.cart.push({id, qty:1});
    Store.saveCart(this.cart); return this.cart;
  }
  changeQty(id, delta){
    const item = this.cart.find(i=>i.id===id); if(!item) return this.cart;
    item.qty += delta;
    this.cart = this.cart.filter(i=>i.qty>0); Store.saveCart(this.cart); return this.cart;
  }
  getCartDetailed(){
    return this.cart.map(item=>{
      const product=this.products.find(p=>p.id===item.id); return product?{...product,qty:item.qty,subtotal:product.price*item.qty}:null;
    }).filter(Boolean);
  }
  getTotal(){ return this.getCartDetailed().reduce((sum,i)=>sum+i.subtotal,0); }
  setTable(table){ this.table=Number(table)||null; }
  createOrder(paymentType, customerName=''){
    if(!this.cart.length) return null;
    const orders=Store.getOrders();
    const now=new Date();
    const order={
      id: Date.now(),
      number: String(orders.length+1).padStart(3,'0'),
      table:this.table || 'Retiro',
      customerName:customerName.trim(),
      items:this.getCartDetailed().map(i=>({id:i.id,name:i.name,qty:i.qty,price:i.price})),
      total:this.getTotal(),
      paymentType,
      paymentStatus:paymentType==='online'?'simulado':'pendiente',
      status:paymentType==='online'?'Preparando':'Pendiente',
      createdAt:now.toISOString()
    };
    orders.unshift(order); Store.saveOrders(orders); this.cart=[]; Store.clearCart(); return order;
  }
}
