import { Store, defaultProducts, defaultSettings } from '../model/store.js';
export class AdminController {
  getProducts(){return Store.getProducts()}
  getOrders(){return Store.getOrders()}
  getSettings(){return Store.getSettings()}
  saveSettings(settings){Store.saveSettings(settings)}
  saveProduct(data){
    const products=Store.getProducts();const id=Number(data.id);
    if(id){const index=products.findIndex(p=>p.id===id);if(index>=0)products[index]={...products[index],...data,id,price:Number(data.price)};}
    else {const newId=Math.max(0,...products.map(p=>p.id))+1;products.push({...data,id:newId,price:Number(data.price),active:true});}
    Store.saveProducts(products);
  }
  toggleProduct(id,active){const p=Store.getProducts();const item=p.find(x=>x.id===id);if(item)item.active=active;Store.saveProducts(p)}
  deleteProduct(id){Store.saveProducts(Store.getProducts().filter(p=>p.id!==id))}
  updateOrder(id,status){const o=Store.getOrders();const item=o.find(x=>x.id===id);if(item)item.status=status;Store.saveOrders(o)}
  seedOrder(){
    const products=Store.getProducts().filter(p=>p.active); if(products.length<2)return;
    const orders=Store.getOrders(); const a=products[0],b=products[Math.min(5,products.length-1)];
    orders.unshift({id:Date.now(),number:String(orders.length+1).padStart(3,'0'),table:Math.floor(Math.random()*6)+1,customerName:'Cliente demo',items:[{id:a.id,name:a.name,qty:2,price:a.price},{id:b.id,name:b.name,qty:1,price:b.price}],total:a.price*2+b.price,paymentType:'mesero',paymentStatus:'pendiente',status:'Pendiente',createdAt:new Date().toISOString()});Store.saveOrders(orders);
  }
  getStats(){
    const o=Store.getOrders(); const open=o.filter(x=>x.status!=='Cerrado'); const total=o.filter(x=>x.paymentType==='online'||x.status==='Cerrado').reduce((s,x)=>s+x.total,0);
    return {orders:o.length,sales:total,openTables:new Set(open.filter(x=>Number.isInteger(Number(x.table))).map(x=>x.table)).size,pending:o.filter(x=>x.status==='Pendiente').length};
  }
  reset(){Store.reset();Store.saveProducts(defaultProducts);Store.saveSettings(defaultSettings)}
}
