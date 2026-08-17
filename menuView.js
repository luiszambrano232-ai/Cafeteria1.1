const money = value => new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(value);
export class MenuView {
  constructor(controller){ this.c=controller; this.selectedCategory='Todos'; }
  init(){
    this.filters=document.querySelector('#categoryFilters'); this.grid=document.querySelector('#productGrid');
    this.cartDrawer=document.querySelector('#cartDrawer'); this.cartItems=document.querySelector('#cartItems');
    this.cartCount=document.querySelector('#cartCount'); this.cartTotal=document.querySelector('#cartTotal');
    this.emptyCart=document.querySelector('#emptyCart'); this.cartFooter=document.querySelector('#cartFooter');
    this.renderFilters(); this.renderProducts(); this.renderCart(); this.renderTable(); this.bind();
  }
  renderFilters(){
    this.filters.innerHTML=this.c.getCategories().map(cat=>`<button class="filter-btn ${cat===this.selectedCategory?'active':''}" data-category="${cat}">${cat}</button>`).join('');
  }
  renderProducts(){
    const products=this.c.getActiveProducts(this.selectedCategory);
    this.grid.innerHTML=products.map(p=>`<article class="product-card">
      <div class="product-art"><span class="product-icon">${p.icon||'☕'}</span></div>
      <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><p>${p.description}</p>
      <div class="product-bottom"><strong class="product-price">${money(p.price)}</strong><button class="add-btn" data-add="${p.id}" aria-label="Agregar ${p.name}">+</button></div></div></article>`).join('');
  }
  renderTable(){
    const badge=document.querySelector('#tableBadge'); const num=document.querySelector('#tableNumber');
    if(this.c.table){ badge.classList.remove('hidden'); num.textContent=this.c.table; } else badge.classList.add('hidden');
  }
  renderCart(){
    const items=this.c.getCartDetailed(); const qty=items.reduce((s,i)=>s+i.qty,0); this.cartCount.textContent=qty;
    if(!items.length){this.cartItems.innerHTML='';this.emptyCart.classList.remove('hidden');this.cartFooter.classList.add('hidden');return;}
    this.emptyCart.classList.add('hidden');this.cartFooter.classList.remove('hidden');
    this.cartItems.innerHTML=items.map(i=>`<div class="cart-row"><div><h4>${i.name}</h4><small>${money(i.price)} c/u · ${money(i.subtotal)}</small></div>
      <div class="qty-controls"><button data-qty="${i.id}" data-delta="-1">−</button><strong>${i.qty}</strong><button data-qty="${i.id}" data-delta="1">+</button></div></div>`).join('');
    this.cartTotal.textContent=money(this.c.getTotal());
  }
  openCart(){this.cartDrawer.classList.add('open');this.cartDrawer.setAttribute('aria-hidden','false')}
  closeCart(){this.cartDrawer.classList.remove('open');this.cartDrawer.setAttribute('aria-hidden','true')}
  modal(title,text,actions=[],icon='✓'){
    const modal=document.querySelector('#modal'); document.querySelector('#modalTitle').textContent=title;document.querySelector('#modalText').innerHTML=text;
    document.querySelector('#modalIcon').textContent=icon; const root=document.querySelector('#modalActions'); root.innerHTML='';
    actions.forEach(a=>{const b=document.createElement('button');b.className=`btn ${a.className||'btn-primary'} full`;b.textContent=a.label;b.addEventListener('click',a.onClick);root.appendChild(b)});modal.classList.remove('hidden');
  }
  closeModal(){document.querySelector('#modal').classList.add('hidden')}
  completeOrder(type){
    if(!this.c.table){
      this.modal('¿En qué mesa estás?','Para esta demo selecciona una mesa. En el local real, el QR ya identificaría la mesa automáticamente.',[1,2,3,4,5,6].map(n=>({label:`Mesa ${n}`,className:'btn-secondary',onClick:()=>{this.c.setTable(n);this.renderTable();this.closeModal();this.completeOrder(type)}})),'#');return;
    }
    const name=document.querySelector('#customerName').value;
    if(type==='online'){
      this.modal('Pasarela de pago','En la versión final aquí se abriría <strong>Mercado Pago o Webpay</strong>. Esta maqueta no procesa dinero real.',[
        {label:'Simular pago aprobado',onClick:()=>{const order=this.c.createOrder('online',name);this.finish(order,'Pago online simulado ✓')}},
        {label:'Cancelar',className:'btn-secondary',onClick:()=>this.closeModal()}
      ],'$');
    } else { const order=this.c.createOrder('mesero',name); this.finish(order,'Pago pendiente con mesero'); }
  }
  finish(order,paymentLabel){
    this.renderCart(); this.closeCart();
    this.modal(`Pedido #${order.number} recibido`,`Mesa <strong>${order.table}</strong><br>${paymentLabel}<br><br>Total: <strong>${money(order.total)}</strong><br><small>El pedido ya aparece en el panel administrativo de la demo.</small>`,[
      {label:'Ver panel administrativo',onClick:()=>location.href='admin.html'},
      {label:'Seguir viendo el menú',className:'btn-secondary',onClick:()=>this.closeModal()}
    ]);
  }
  bind(){
    document.querySelector('#cartButton').addEventListener('click',()=>this.openCart());document.querySelectorAll('[data-close-cart]').forEach(el=>el.addEventListener('click',()=>this.closeCart()));
    this.filters.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;this.selectedCategory=b.dataset.category;this.renderFilters();this.renderProducts()});
    this.grid.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;this.c.addToCart(Number(b.dataset.add));this.renderCart();b.textContent='✓';setTimeout(()=>b.textContent='+',650)});
    this.cartItems.addEventListener('click',e=>{const b=e.target.closest('[data-qty]');if(!b)return;this.c.changeQty(Number(b.dataset.qty),Number(b.dataset.delta));this.renderCart()});
    document.querySelector('#waiterPayBtn').addEventListener('click',()=>this.completeOrder('mesero'));document.querySelector('#onlinePayBtn').addEventListener('click',()=>this.completeOrder('online'));
    document.querySelector('#simulateTableBtn').addEventListener('click',()=>{this.c.setTable(4);history.replaceState(null,'','?mesa=4');this.renderTable();document.querySelector('#menu').scrollIntoView()});
    document.querySelector('#modalClose').addEventListener('click',()=>this.closeModal());
  }
}
