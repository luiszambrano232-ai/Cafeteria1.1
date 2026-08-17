const money=v=>new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(v);
export class AdminView{
  constructor(c){this.c=c}
  init(){this.renderAll();this.bind()}
  renderAll(){this.renderStats();this.renderOrders();this.renderProducts();this.renderSettings();this.renderTableLinks()}
  renderStats(){const s=this.c.getStats();document.querySelector('#statsGrid').innerHTML=`
    <div class="stat-card"><small>Pedidos demo</small><strong>${s.orders}</strong><span>registrados en este navegador</span></div>
    <div class="stat-card"><small>Venta simulada</small><strong>${money(s.sales)}</strong><span>pagos online o mesas cerradas</span></div>
    <div class="stat-card"><small>Mesas abiertas</small><strong>${s.openTables}</strong><span>con pedidos activos</span></div>
    <div class="stat-card"><small>Pendientes</small><strong>${s.pending}</strong><span>esperando atención</span></div>`}
  renderOrders(){
    const orders=this.c.getOrders();const body=document.querySelector('#ordersBody'),empty=document.querySelector('#ordersEmpty');
    if(!orders.length){body.innerHTML='';empty.classList.remove('hidden');return}empty.classList.add('hidden');
    body.innerHTML=orders.map(o=>`<tr><td><span class="order-id">#${o.number}</span><br><small>${new Date(o.createdAt).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})}</small></td>
      <td><strong>${o.table==='Retiro'?'Retiro':'Mesa '+o.table}</strong>${o.customerName?`<br><small>${o.customerName}</small>`:''}</td>
      <td>${o.items.map(i=>`${i.qty}× ${i.name}`).join('<br>')}</td><td><span class="pill ${o.paymentType==='online'?'online':'waiter'}">${o.paymentType==='online'?'Online demo':'Mesero'}</span></td>
      <td><strong>${money(o.total)}</strong></td><td><span class="pill ${this.statusClass(o.status)}">${o.status}</span></td>
      <td><select class="status-select" data-order-status="${o.id}"><option ${o.status==='Pendiente'?'selected':''}>Pendiente</option><option ${o.status==='Preparando'?'selected':''}>Preparando</option><option ${o.status==='Listo'?'selected':''}>Listo</option><option ${o.status==='Cerrado'?'selected':''}>Cerrado</option></select></td></tr>`).join('')
  }
  statusClass(s){return s==='Pendiente'?'pending':s==='Preparando'?'preparing':s==='Listo'?'ready':'closed'}
  renderProducts(){
    const root=document.querySelector('#productAdminGrid');root.innerHTML=this.c.getProducts().map(p=>`<article class="admin-product"><div class="admin-product-top"><div class="admin-product-icon">${p.icon||'☕'}</div><label class="toggle"><input type="checkbox" data-toggle-product="${p.id}" ${p.active?'checked':''}> visible</label></div>
      <h3>${p.name}</h3><span class="product-category">${p.category}</span><p>${p.description}</p><div class="admin-product-price">${money(p.price)}</div><div class="admin-product-actions"><button class="mini-btn" data-edit-product="${p.id}">Editar</button><button class="mini-btn" data-delete-product="${p.id}">Eliminar</button></div></article>`).join('')
  }
  renderSettings(){const s=this.c.getSettings();const f=document.querySelector('#settingsForm');Object.entries(s).forEach(([k,v])=>{if(f.elements[k])f.elements[k].value=v})}
  renderTableLinks(){const root=document.querySelector('#tableLinks');root.innerHTML=Array.from({length:8},(_,i)=>`<a class="table-link" href="index.html?mesa=${i+1}" target="_blank">Abrir Mesa ${i+1} ↗</a>`).join('')}
  openProduct(product=null){
    const modal=document.querySelector('#productModal'),f=document.querySelector('#productForm');f.reset();f.elements.id.value=product?.id||'';f.elements.name.value=product?.name||'';f.elements.category.value=product?.category||'Café';f.elements.description.value=product?.description||'';f.elements.price.value=product?.price||'';f.elements.icon.value=product?.icon||'☕';document.querySelector('#productModalTitle').textContent=product?'Editar producto':'Agregar producto';modal.classList.remove('hidden')
  }
  closeProduct(){document.querySelector('#productModal').classList.add('hidden')}
  bind(){
    document.querySelector('#seedOrderBtn').addEventListener('click',()=>{this.c.seedOrder();this.renderAll()});
    document.querySelector('#resetDemoBtn').addEventListener('click',()=>{if(confirm('¿Reiniciar todos los datos de la demo?')){this.c.reset();this.renderAll()}});
    document.querySelector('#settingsForm').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));this.c.saveSettings(data);alert('Datos guardados en la demo.')});
    document.querySelector('#ordersBody').addEventListener('change',e=>{if(!e.target.matches('[data-order-status]'))return;this.c.updateOrder(Number(e.target.dataset.orderStatus),e.target.value);this.renderStats();this.renderOrders()});
    document.querySelector('#addProductBtn').addEventListener('click',()=>this.openProduct());document.querySelector('#productModalClose').addEventListener('click',()=>this.closeProduct());
    document.querySelector('#productAdminGrid').addEventListener('click',e=>{const edit=e.target.closest('[data-edit-product]'),del=e.target.closest('[data-delete-product]');if(edit){const p=this.c.getProducts().find(x=>x.id===Number(edit.dataset.editProduct));this.openProduct(p)}if(del&&confirm('¿Eliminar este producto de la demo?')){this.c.deleteProduct(Number(del.dataset.deleteProduct));this.renderProducts()}});
    document.querySelector('#productAdminGrid').addEventListener('change',e=>{if(e.target.matches('[data-toggle-product]'))this.c.toggleProduct(Number(e.target.dataset.toggleProduct),e.target.checked)});
    document.querySelector('#productForm').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));this.c.saveProduct(data);this.closeProduct();this.renderProducts()});
  }
}
