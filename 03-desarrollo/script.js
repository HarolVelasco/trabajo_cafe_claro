const chatPanel = document.querySelector('#chat-panel');
const chatMessages = document.querySelector('#chat-messages');
const chatInput = document.querySelector('#chat-text');
const toast = document.querySelector('#toast');
const privacyModal = document.querySelector('#privacy-modal');
const cartPanel = document.querySelector('#cart-panel');
const cartItems = document.querySelector('#cart-items');
const cartEmpty = document.querySelector('#cart-empty');
const cartSummary = document.querySelector('#cart-summary');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('#cart-total');
const cartPrices = { 'Café Origen Quindío': 32900, 'Café Reserva Huila': 36500, 'Kit de barista': 74900 };
let cart = JSON.parse(localStorage.getItem('cafe-claro-cart') || '{}');
let currentLanguage = localStorage.getItem('cafe-claro-language') || 'es';
const translations = {
  es: { navCafes: 'Cafés', navOrigin: 'Nuestro origen', reports: 'Reportes', cart: 'Carrito', support: 'Atención 24/7', direct: 'Directo de la finca · Colombia', hero: 'El café<br><em>en su punto.</em>', heroText: 'Café colombiano seleccionado, tostado con paciencia y enviado con cuidado. Aroma honesto para hogares, tiendas y cafeterías que saben elegir.', viewProducts: 'Ver productos <span>↘</span>', talk: 'Hablar con Clara <span>→</span>', roast: 'Tostado de hoy', ready: 'Listo para salir', choose: 'Elige tu café', aroma: 'Aroma para<br><em>cada momento.</em>', productIntro: 'Nuestros cafés llegan en diferentes perfiles de tueste para que prepares una taza memorable en casa o en tu negocio.', origin: 'Nuestro origen', storyTitle: 'Tostamos<br><em>lo que importa.</em>', storyText: 'En Café Claro creemos que una buena taza empieza mucho antes de llegar a tu mesa. Cuidamos el suelo, respetamos los tiempos de la naturaleza y trabajamos con caficultores que conocen cada parcela.', contactTitle: 'Tu próxima taza<br><em>empieza aquí.</em>', contactText: 'Déjanos tus datos y te ayudamos a encontrar el café perfecto.', empty: 'Tu carrito está esperando<br>algo rico.', seeProducts: 'Ver productos', subtotal: 'Subtotal', shipping: 'Envío calculado al confirmar el pedido', continue: 'Continuar pedido <span>↗</span>', clear: 'Vaciar carrito', metrics: ['de cultivo regenerativo','para recibir tu pedido','trazabilidad del origen','de intermediarios'], productTags: ['Más pedido','Tueste claro','Para regalar'], productTitles: ['Origen Quindío','Reserva Huila','Kit de barista'], productDescriptions: ['Notas de caramelo y chocolate. Suave, dulce y equilibrado.','Aromas florales y notas cítricas para métodos filtrados.','Café de origen, prensa francesa y cuchara medidora.'], reportEyebrow: 'Centro de atención', reportTitle: 'Lo que tus clientes<br><em>nos están diciendo.</em>', period: 'Periodo', download: 'Descargar', people: 'Personas atendidas', previous: 'vs. mes anterior', rating: 'Calificación promedio', ratingText: 'El 92% de clientes calificó la atención como excelente.', stars5: '5 estrellas', stars4: '4 estrellas', suggestion: 'Sugerencia para administración', recommendation: 'Ampliar entregas<br>los días sábado', recommendationText: 'El 34% de las recomendaciones menciona disponibilidad de fin de semana. Habilitar una ruta adicional podría recuperar hasta <b>120 pedidos</b> al mes.', detail: 'Ver detalle', talkUs: '¿Hablamos?', name: 'Nombre', email: 'Correo', need: '¿Qué necesitas?', order: 'Quiero hacer un pedido', information: 'Información de productos', distribution: 'Hablar sobre distribución', consent: 'Acepto el tratamiento de mis datos según la', privacy: 'política de privacidad', send: 'Enviar solicitud <span>↗</span>', footerText: 'Café con origen, atención con propósito.', botEs: 'Hola, soy Clara. Puedo ayudarte con pedidos, envíos y nuestros productos. ¿Qué necesitas hoy?', botEn: 'Hi, I am Clara. I can help with orders, shipping and our coffees. What do you need today?', chatOnline: 'En línea · responde al instante', chatConsent: 'Al continuar, aceptas nuestra', write: 'Escribe un mensaje...', privacyTitle: 'Transparencia primero', privacyHeading: 'Tus datos, bajo tu control.', privacyText: 'Recopilamos únicamente lo necesario para atenderte: datos públicos de contacto, datos semiprivados para gestionar pedidos y datos privados solo cuando son necesarios para la entrega. No solicitamos datos sensibles para operar este servicio.', understood: 'Entendido <span>→</span>', close: 'Cerrar carrito' },
  en: { navCafes: 'Coffee', navOrigin: 'Our origin', reports: 'Reports', cart: 'Cart', support: '24/7 Support', direct: 'Straight from the farm · Colombia', hero: 'Coffee<br><em>at its best.</em>', heroText: 'Selected Colombian coffee, patiently roasted and carefully shipped. Honest aroma for homes, shops and cafés that know what to choose.', viewProducts: 'View coffees <span>↘</span>', talk: 'Talk to Clara <span>→</span>', roast: 'Roasted today', ready: 'Ready to ship', choose: 'Choose your coffee', aroma: 'Aroma for<br><em>every moment.</em>', productIntro: 'Our coffees come in different roast profiles so you can brew a memorable cup at home or in your business.', origin: 'Our origin', storyTitle: 'We roast<br><em>what matters.</em>', storyText: 'At Café Claro, we believe a great cup starts long before it reaches your table. We care for the soil, respect nature’s timing and work with coffee growers who know every plot.', contactTitle: 'Your next cup<br><em>starts here.</em>', contactText: 'Leave your details and we will help you find the perfect coffee.', empty: 'Your cart is waiting<br>for something delicious.', seeProducts: 'View coffees', subtotal: 'Subtotal', shipping: 'Shipping calculated when the order is confirmed', continue: 'Continue order <span>↗</span>', clear: 'Empty cart', metrics: ['of regenerative farming','to receive your order','origin traceability','of intermediaries'], productTags: ['Best seller','Light roast','For gifting'], productTitles: ['Quindío Origin','Huila Reserve','Barista Kit'], productDescriptions: ['Notes of caramel and chocolate. Smooth, sweet and balanced.','Floral aromas and citrus notes for filter methods.','Origin coffee, French press and measuring spoon.'], reportEyebrow: 'Support center', reportTitle: 'What your customers<br><em>are telling us.</em>', period: 'Period', download: 'Download', people: 'Customers served', previous: 'vs. previous month', rating: 'Average rating', ratingText: '92% of customers rated the support as excellent.', stars5: '5 stars', stars4: '4 stars', suggestion: 'Suggestion for management', recommendation: 'Expand deliveries<br>on Saturdays', recommendationText: '34% of recommendations mention weekend availability. Adding one route could recover up to <b>120 orders</b> per month.', detail: 'View details', talkUs: 'Let’s talk', name: 'Name', email: 'Email', need: 'What do you need?', order: 'I want to place an order', information: 'Product information', distribution: 'Talk about distribution', consent: 'I agree to the processing of my data according to the', privacy: 'privacy policy', send: 'Send request <span>↗</span>', footerText: 'Coffee with origin, service with purpose.', botEs: 'Hola, soy Clara. Puedo ayudarte con pedidos, envíos y nuestros productos. ¿Qué necesitas hoy?', botEn: 'Hi, I am Clara. I can help with orders, shipping and our coffees. What do you need today?', chatOnline: 'Online · replies instantly', chatConsent: 'By continuing, you accept our', write: 'Write a message...', privacyTitle: 'Transparency first', privacyHeading: 'Your data, under your control.', privacyText: 'We collect only what is needed to help you: public contact data, semi-private data to manage orders and private data only when delivery requires it. We do not request sensitive data to operate this service.', understood: 'Got it <span>→</span>', close: 'Close cart' }
};
const productNames = { 'Café Origen Quindío': 'Quindío Origin Coffee', 'Café Reserva Huila': 'Huila Reserve Coffee', 'Kit de barista': 'Barista Kit' };
function text(key) { return translations[currentLanguage][key]; }
function setText(selector, key) { const element = document.querySelector(selector); if (element) element.innerHTML = text(key); }
function setMany(selector, values) { document.querySelectorAll(selector).forEach((element, index) => { if (values[index] !== undefined) element.textContent = values[index]; }); }
function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.querySelector('#language-select').value = currentLanguage;
  setText('.main-nav a:nth-child(1)', 'navCafes'); setText('.main-nav a:nth-child(2)', 'navOrigin'); setText('.main-nav a:nth-child(3)', 'reports');
  document.querySelector('.cart-button').childNodes[0].textContent = `${text('cart')} `;
  document.querySelector('.header-chat').childNodes[0].textContent = text('support');
  setText('.hero .eyebrow', 'direct'); setText('.hero h1', 'hero'); setText('.hero-text', 'heroText'); setText('.hero-actions .primary', 'viewProducts'); setText('.hero-actions .text-button', 'talk'); setText('.art-note b', 'roast'); setText('.art-note small', 'ready');
  setText('.section-heading .eyebrow', 'choose'); setText('.section-heading h2', 'aroma'); setText('.section-intro', 'productIntro'); setText('.story-copy .eyebrow', 'origin'); setText('.story-copy h2', 'storyTitle'); setText('.contact-section h2', 'contactTitle'); setText('.contact-form>p', 'contactText');
  setText('.cart-panel-header .eyebrow', 'choose'); setText('.cart-panel-header h2', 'cart'); setText('.cart-empty p', 'empty'); setText('#browse-products', 'seeProducts'); document.querySelector('.cart-summary span').textContent = currentLanguage === 'en' ? 'Total to pay' : 'Total a pagar'; setText('.cart-summary small', 'shipping'); setText('#checkout', 'continue'); setText('#clear-cart', 'clear');
  setMany('.metrics-strip div span', text('metrics')); setMany('.product-card .tag', text('productTags')); setMany('.product-card h3', text('productTitles')); setMany('.product-card .product-info p', text('productDescriptions'));
  setText('.story-copy>p:not(.eyebrow)', 'storyText'); setText('.story-label', currentLanguage === 'en' ? 'Hope Farm<br><b>Quimbaya, Quindío</b>' : 'Finca La Esperanza<br><b>Quimbaya, Quindío</b>'); setText('.report-top .eyebrow', 'reportEyebrow'); setText('.report-top h2', 'reportTitle'); setText('.report-controls label', 'period'); setText('#download-report span', 'download'); setText('.big-stat .stat-label', 'people'); setText('.trend small', 'previous'); setText('.rating-stat .stat-label', 'rating'); setText('.rating-stat p', 'ratingText'); setMany('.rating-line>span', currentLanguage === 'en' ? ['5 stars','4 stars','3 stars','2 stars','1 star'] : ['5 estrellas','4 estrellas','3 estrellas','2 estrellas','1 estrella']); setMany('.chart-days span', currentLanguage === 'en' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']); setText('.recommendation .stat-label', 'suggestion'); setText('.recommendation h3', 'recommendation'); setText('.recommendation p', 'recommendationText'); setText('#view-recommendation', 'detail'); setText('.contact-section .eyebrow', 'talkUs');
  document.querySelector('input[name="name"]').parentElement.childNodes[0].textContent = `${text('name')} `; document.querySelector('input[name="email"]').parentElement.childNodes[0].textContent = `${text('email')} `; document.querySelector('select[name="need"]').parentElement.childNodes[0].textContent = `${text('need')} `;
  setMany('#month option', currentLanguage === 'en' ? ['August 2026', 'July 2026', 'June 2026'] : ['Agosto 2026', 'Julio 2026', 'Junio 2026']);
  document.querySelector('input[name="name"]').placeholder = currentLanguage === 'en' ? 'Your name' : 'Tu nombre'; document.querySelector('input[name="email"]').placeholder = currentLanguage === 'en' ? 'your@email.com' : 'tu@correo.com'; setMany('select[name="need"] option', [text('order'), text('information'), text('distribution')]);
  const consent = document.querySelector('.check-label'); if (consent) { consent.childNodes[1].textContent = ` ${text('consent')} `; consent.childNodes[3].textContent = '.'; }
  setText('.form-submit', 'send'); setText('footer p', 'footerText'); setText('#privacy-link', 'privacy'); setText('.chat-header span', 'chatOnline'); document.querySelector('.chat-consent').childNodes[0].textContent = `${text('chatConsent')} `; setText('.chat-consent button', 'privacy'); setText('.privacy-modal .eyebrow', 'privacyTitle'); setText('.privacy-modal h2', 'privacyHeading'); setText('.privacy-modal>p:not(.eyebrow)', 'privacyText'); setMany('.privacy-list span', currentLanguage === 'en' ? ['✓ Use limited to support and orders','✓ Access, update or deletion requests','✓ We never sell your information'] : ['✓ Uso limitado a atención y pedidos','✓ Consulta, actualización o eliminación','✓ Nunca vendemos tu información']); setText('#accept-privacy', 'understood');
  const feedbackEditor = document.querySelector('.feedback-editor'); if (feedbackEditor) { feedbackEditor.querySelector('strong').textContent = currentLanguage === 'en' ? 'Customer feedback' : 'Opiniones de clientes'; feedbackEditor.querySelector('p').textContent = currentLanguage === 'en' ? 'Add a rating and recommendation together. You can edit or delete each record.' : 'Agrega una calificación y su recomendación en conjunto. Puedes editar o eliminar cada registro.'; feedbackEditor.querySelectorAll('label')[0].childNodes[0].textContent = currentLanguage === 'en' ? 'Rating ' : 'Calificación '; feedbackEditor.querySelectorAll('label')[1].childNodes[0].textContent = currentLanguage === 'en' ? 'Recommendation ' : 'Recomendación '; document.querySelector('#feedback-recommendation').placeholder = currentLanguage === 'en' ? 'Write the customer recommendation' : 'Escribe la recomendación del cliente'; document.querySelector('#feedback-submit').textContent = document.querySelector('#feedback-id').value ? (currentLanguage === 'en' ? 'Save edit' : 'Guardar edición') : (currentLanguage === 'en' ? 'Add feedback' : 'Agregar opinión'); document.querySelector('#feedback-cancel').textContent = currentLanguage === 'en' ? 'Cancel edit' : 'Cancelar edición'; }
  setText('.bot', currentLanguage === 'en' ? 'botEn' : 'botEs');
  document.querySelectorAll('.quick-replies button')[0].textContent = currentLanguage === 'en' ? 'I want to order' : 'Quiero hacer un pedido';
  document.querySelectorAll('.quick-replies button')[1].textContent = currentLanguage === 'en' ? 'How long is shipping?' : '¿Cuánto tarda el envío?';
  document.querySelectorAll('.quick-replies button')[2].textContent = currentLanguage === 'en' ? 'View coffees' : 'Ver productos';
  document.querySelector('#close-cart').setAttribute('aria-label', text('close'));
  document.querySelector('#chat-text').placeholder = currentLanguage === 'en' ? 'Write a message...' : 'Escribe un mensaje...';
  renderCart();
}

function openChat() {
  chatPanel.classList.add('open');
  chatPanel.setAttribute('aria-hidden', 'false');
  chatInput.focus();
}
function closeChat() {
  chatPanel.classList.remove('open');
  chatPanel.setAttribute('aria-hidden', 'true');
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3000);
}
function formatPrice(value) { return `$${value.toLocaleString('es-CO')}`; }
function openCart() { cartPanel.classList.add('open'); cartPanel.setAttribute('aria-hidden', 'false'); }
function closeCart() { cartPanel.classList.remove('open'); cartPanel.setAttribute('aria-hidden', 'true'); }
function renderCart() {
  const entries = Object.entries(cart);
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [name, quantity]) => sum + Number(productCatalog[name]?.precio ?? cartPrices[name] ?? 0) * quantity, 0);
  cartCount.textContent = itemCount;
  cartCount.classList.toggle('has-items', itemCount > 0);
  cartEmpty.hidden = itemCount > 0;
  cartSummary.hidden = itemCount === 0;
  cartItems.innerHTML = entries.map(([name, quantity]) => { const price = Number(productCatalog[name]?.precio ?? cartPrices[name] ?? 0); return `<div class="cart-item"><div class="cart-item-art ${name === 'Café Reserva Huila' ? 'green-art' : name === 'Kit de barista' ? 'box-item-art' : ''}">${name === 'Kit de barista' ? 'KIT' : '●'}</div><div class="cart-item-info"><strong>${currentLanguage === 'en' ? productNames[name] || name : name}</strong><span>${formatPrice(price)}</span><div class="quantity-control"><button data-cart-action="decrease" data-product-name="${name}" aria-label="${currentLanguage === 'en' ? 'Decrease quantity' : 'Disminuir cantidad'}">−</button><b>${quantity}</b><button data-cart-action="increase" data-product-name="${name}" aria-label="${currentLanguage === 'en' ? 'Increase quantity' : 'Aumentar cantidad'}">+</button></div></div><button class="remove-item" data-cart-action="remove" data-product-name="${name}" aria-label="${currentLanguage === 'en' ? 'Remove' : 'Eliminar'} ${name}">×</button></div>`; }).join('');
  cartTotal.textContent = formatPrice(total);
  localStorage.setItem('cafe-claro-cart', JSON.stringify(cart));
}
function renderMetrics(metrics) {
  const people = Number(metrics.personas_atendidas);
  const ratingCount = Number(metrics.cantidad_calificaciones);
  const rating = Number(metrics.rating);
  const ratingSum = Number(metrics.suma_calificaciones);
  const distribution = metrics.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  document.querySelector('#people-served').textContent = people.toLocaleString('es-CO');
  document.querySelector('#average-rating').firstChild.textContent = `${rating.toFixed(1)} `;
  document.querySelector('#rating-stars').textContent = ratingCount ? `${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}` : '☆☆☆☆☆';
  document.querySelector('#rating-description').textContent = ratingCount ? `${Math.round((rating / 5) * 100)}% de clientes calificó la atención como excelente.` : 'Aún no hay calificaciones registradas.';
  [5, 4, 3, 2, 1].forEach(stars => { const percent = ratingCount ? Math.round((distribution[stars] / ratingCount) * 100) : 0; document.querySelector(`#${['one','two','three','four','five'][stars - 1]}-star-bar`).style.width = `${percent}%`; document.querySelector(`#${['one','two','three','four','five'][stars - 1]}-star-percent`).textContent = `${percent}%`; });
  document.querySelectorAll('.bar-chart i').forEach((bar, index) => { bar.style.height = people ? `${Math.min(100, Math.max(8, Math.round((people / (index + 2)) / Math.max(people, 1) * 100)))}%` : '0%'; });
}
function loadMetrics() {
  fetch('api/metrics.php').then(response => response.json()).then(result => { if (result.ok) { renderMetrics(result.metrics); renderOpinions(result.opinions || []); } }).catch(() => {});
}
function renderOpinions(opinions) {
  const list = document.querySelector('#feedback-list');
  list.innerHTML = '';
  opinions.forEach(opinion => {
    const card = document.createElement('div');
    card.className = 'feedback-card';
    card.innerHTML = `<div><strong>${'★'.repeat(Number(opinion.calificacion))}${'☆'.repeat(5 - Number(opinion.calificacion))}</strong><p></p></div><div class="feedback-actions"><button data-feedback-action="edit" data-feedback-id="${opinion.id}">${currentLanguage === 'en' ? 'Edit' : 'Editar'}</button><button data-feedback-action="delete" data-feedback-id="${opinion.id}">${currentLanguage === 'en' ? 'Delete' : 'Eliminar'}</button></div>`;
    card.querySelector('p').textContent = opinion.recomendacion;
    list.appendChild(card);
  });
}
function saveFeedback(payload) {
  return fetch('api/metrics.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'opinion', ...payload }) }).then(response => response.json());
}
function addToCart(name) { cart[name] = (cart[name] || 0) + 1; renderCart(); openCart(); showToast(currentLanguage === 'en' ? `${productNames[name]} added to cart` : `${name} agregado al carrito`); }
function addMessage(text, type) {
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function answerFor(text) {
  const normalized = text.toLowerCase();
  if (currentLanguage === 'en') {
    if (normalized.includes('order') || normalized.includes('buy')) return 'Of course! Add products with the + button and leave your details in the form. I can register your request here too.';
    if (normalized.includes('shipping') || normalized.includes('long') || normalized.includes('delivery')) return 'We ship Monday through Saturday. Orders arrive within 24 hours in the coffee region. We can check routes to other cities with you.';
    if (normalized.includes('product') || normalized.includes('coffee')) return 'We have Quindío Origin, Huila Reserve and the Barista Kit. Which one would you like to know more about?';
    if (normalized.includes('data') || normalized.includes('privacy')) return 'We only use your data to provide support and manage orders. You can request access, updates or deletion through our privacy policy.';
    return 'I can help with orders, products, shipping or privacy. Tell me a little more and we will solve it.';
  }
  if (normalized.includes('pedido') || normalized.includes('compr')) return '¡Claro! Puedes sumar productos con el botón + y luego dejar tus datos en el formulario. También puedo registrar tu solicitud aquí.';
  if (normalized.includes('envío') || normalized.includes('tarda') || normalized.includes('entrega')) return 'Despachamos de lunes a sábado. Tu pedido llega en máximo 24 horas dentro del eje cafetero. Para otras ciudades, revisamos la ruta contigo.';
  if (normalized.includes('producto') || normalized.includes('café') || normalized.includes('cafe')) return 'Tenemos Origen Quindío, Reserva Huila y el Kit de barista. ¿Cuál te gustaría conocer mejor?';
  if (normalized.includes('dato') || normalized.includes('privacidad')) return 'Solo usamos tus datos para atenderte y gestionar pedidos. Puedes consultar, actualizar o pedir la eliminación de tu información desde nuestra política.';
  return 'Puedo ayudarte con pedidos, productos, envíos o privacidad. Cuéntame un poco más y lo resolvemos.';
}

document.querySelectorAll('[data-open-chat]').forEach(button => button.addEventListener('click', openChat));
document.querySelector('#language-select').addEventListener('change', event => { currentLanguage = event.target.value; localStorage.setItem('cafe-claro-language', currentLanguage); applyLanguage(); });
document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', openCart));
document.querySelector('#close-cart').addEventListener('click', closeCart);
document.querySelector('#close-chat').addEventListener('click', closeChat);
document.querySelectorAll('.quick-replies button').forEach(button => button.addEventListener('click', () => {
  addMessage(button.textContent, 'user');
  window.setTimeout(() => addMessage(answerFor(button.textContent), 'bot'), 450);
}));
document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  chatInput.value = '';
  window.setTimeout(() => addMessage(answerFor(text), 'bot'), 450);
});

document.querySelectorAll('.add-product').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.product)));
cartItems.addEventListener('click', event => {
  const button = event.target.closest('[data-cart-action]');
  if (!button) return;
  const name = button.dataset.productName;
  if (button.dataset.cartAction === 'increase') cart[name] += 1;
  if (button.dataset.cartAction === 'decrease') cart[name] -= 1;
  if (button.dataset.cartAction === 'remove' || cart[name] <= 0) delete cart[name];
  renderCart();
});
document.querySelector('#clear-cart').addEventListener('click', () => { cart = {}; renderCart(); showToast(currentLanguage === 'en' ? 'Cart emptied' : 'Carrito vaciado'); });
document.querySelector('#checkout').addEventListener('click', () => { closeCart(); document.querySelector('#contacto').scrollIntoView({ behavior: 'smooth' }); showToast(currentLanguage === 'en' ? 'Complete your details to confirm the order' : 'Completa tus datos para confirmar el pedido'); });
document.querySelector('#browse-products').addEventListener('click', closeCart);
renderCart();
loadMetrics();

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  const status = document.querySelector('#form-status');
  const submit = form.querySelector('.form-submit');
  const formData = new FormData(form);
  const items = Object.entries(cart).map(([product, quantity]) => ({ productId: cartProductIds[product] || productCatalog[product]?.id, quantity }));
  submit.disabled = true;
  status.textContent = currentLanguage === 'en' ? 'Saving your request...' : 'Guardando tu solicitud...';
  fetch('api/order.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: formData.get('name'), email: formData.get('email'), need: formData.get('need'), items })
  }).then(async response => {
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.message || 'No fue posible guardar la solicitud.');
    status.textContent = currentLanguage === 'en' ? `Order #${result.orderId} received. Clara will contact you shortly.` : `Pedido #${result.orderId} recibido. Clara te contactará muy pronto.`;
    cart = {};
    renderCart();
    loadMetrics();
    form.reset();
  }).catch(error => {
    status.textContent = error.message || 'No se pudo conectar con el servidor local.';
  }).finally(() => { submit.disabled = false; });
});

document.querySelector('#download-report').addEventListener('click', () => showToast(currentLanguage === 'en' ? 'August 2026 report ready to download' : 'Reporte de agosto 2026 listo para descargar'));
document.querySelector('#view-recommendation').addEventListener('click', () => showToast(currentLanguage === 'en' ? 'Detail: 34% request Saturday deliveries' : 'Detalle: 34% pide entregas el sábado'));
document.querySelector('#month').addEventListener('change', event => showToast(currentLanguage === 'en' ? `Showing data for ${event.target.value}` : `Mostrando datos de ${event.target.value}`));
document.querySelector('#feedback-form').addEventListener('submit', event => {
  event.preventDefault();
  const id = document.querySelector('#feedback-id').value;
  const status = document.querySelector('#feedback-status');
  status.textContent = 'Guardando opinión...';
  saveFeedback({ id: id || undefined, rating: Number(document.querySelector('#feedback-rating').value), recommendation: document.querySelector('#feedback-recommendation').value.trim() }).then(result => {
    if (!result.ok) throw new Error(result.message);
    renderMetrics(result.metrics); renderOpinions(result.opinions || []); event.target.reset(); document.querySelector('#feedback-id').value = ''; document.querySelector('#feedback-submit').textContent = 'Agregar opinión'; document.querySelector('#feedback-cancel').hidden = true; status.textContent = 'Opinión guardada.';
  }).catch(error => { status.textContent = error.message || 'No se pudo guardar la opinión.'; });
});
document.querySelector('#feedback-list').addEventListener('click', event => {
  const button = event.target.closest('[data-feedback-action]');
  if (!button) return;
  const id = Number(button.dataset.feedbackId);
  if (button.dataset.feedbackAction === 'delete') {
    if (!window.confirm('¿Eliminar esta opinión?')) return;
    saveFeedback({ action: 'delete-opinion', id }).then(result => { if (!result.ok) throw new Error(result.message); renderMetrics(result.metrics); renderOpinions(result.opinions || []); }).catch(error => showToast(error.message));
    return;
  }
  fetch('api/metrics.php').then(response => response.json()).then(result => {
    const opinion = (result.opinions || []).find(item => Number(item.id) === id);
    if (!opinion) return;
    document.querySelector('#feedback-id').value = opinion.id; document.querySelector('#feedback-rating').value = opinion.calificacion; document.querySelector('#feedback-recommendation').value = opinion.recomendacion; document.querySelector('#feedback-submit').textContent = 'Guardar edición'; document.querySelector('#feedback-cancel').hidden = false; document.querySelector('#feedback-recommendation').focus();
  });
});
document.querySelector('#feedback-cancel').addEventListener('click', () => { document.querySelector('#feedback-form').reset(); document.querySelector('#feedback-id').value = ''; document.querySelector('#feedback-submit').textContent = 'Agregar opinión'; document.querySelector('#feedback-cancel').hidden = true; });

function openPrivacy() {
  privacyModal.classList.add('open');
  privacyModal.setAttribute('aria-hidden', 'false');
}
function closePrivacy() {
  privacyModal.classList.remove('open');
  privacyModal.setAttribute('aria-hidden', 'true');
}
document.querySelector('#privacy-link').addEventListener('click', openPrivacy);
document.querySelector('#chat-privacy').addEventListener('click', openPrivacy);
document.querySelector('#close-modal').addEventListener('click', closePrivacy);
document.querySelector('#accept-privacy').addEventListener('click', closePrivacy);
privacyModal.addEventListener('click', event => { if (event.target === privacyModal) closePrivacy(); });
applyLanguage();

let productCatalog = {};
let authUser = null;
let authMode = 'login';
const apiJson = (url, options) => fetch(url, options).then(async response => { const result = await response.json(); if (!response.ok || !result.ok) throw new Error(result.message || 'No fue posible completar la operación.'); return result; });

function renderProducts(products) {
  productCatalog = Object.fromEntries(products.map(product => [product.nombre, product]));
  document.querySelector('.product-grid').innerHTML = products.filter(product => product.estado === 'activo').map((product, index) => `<article class="product-card ${index === 0 ? 'featured' : ''}"><div class="product-visual ${index === 1 ? 'coffee-light' : index === 2 ? 'box-art' : 'coffee-bag'}"><div class="coffee-beans"></div></div><div class="product-info"><span class="tag">${product.cantidad_disponible <= product.stock_minimo ? 'Últimas unidades' : index === 0 ? 'Más pedido' : 'Disponible'}</span><h3>${product.nombre}</h3><p>${product.descripcion}</p><div class="product-bottom"><strong>${formatPrice(Number(product.precio))} <small>/ unidad</small></strong><button class="icon-button add-product" aria-label="Agregar ${product.nombre}" data-product="${product.nombre}" data-product-id="${product.id}" ${product.cantidad_disponible < 1 ? 'disabled' : ''}>+</button></div><small class="stock-note">${product.cantidad_disponible} disponibles</small></div></article>`).join('');
  document.querySelectorAll('.add-product').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.product, Number(button.dataset.productId))));
  applyLanguage();
}
function loadProducts() { apiJson('api/products.php').then(result => renderProducts(result.products)).catch(() => showToast('No fue posible cargar los productos.')); }
function addToCart(name, productId) { const product = productCatalog[name] || { id: productId, precio: cartPrices[name] }; cart[name] = (cart[name] || 0) + 1; cartProductIds[name] = Number(product.id); renderCart(); openCart(); showToast(currentLanguage === 'en' ? `${productNames[name] || name} added to cart` : `${name} agregado al carrito`); }
let cartProductIds = JSON.parse(localStorage.getItem('cafe-claro-cart-ids') || '{}');
const originalRenderCart = renderCart;
renderCart = function () { originalRenderCart(); localStorage.setItem('cafe-claro-cart-ids', JSON.stringify(cartProductIds)); };

function renderAccount() {
  document.querySelector('#account-guest').hidden = Boolean(authUser); document.querySelector('#account-active').hidden = !authUser;
  document.querySelector('#account-button').textContent = authUser ? authUser.nombre : (currentLanguage === 'en' ? 'Sign in' : 'Iniciar sesión');
  if (!authUser) return;
  document.querySelector('#account-name').textContent = `Hola, ${authUser.nombre}`; document.querySelector('#account-role').textContent = `${authUser.correo} · ${authUser.rol}`;
  document.querySelector('#administracion').hidden = authUser.rol !== 'administrador';
}
function loadSession() { apiJson('api/auth.php').then(result => { authUser = result.user; renderAccount(); if (authUser?.rol === 'administrador') loadAdmin(); }).catch(() => {}); }
document.querySelector('#auth-toggle').addEventListener('click', () => { authMode = authMode === 'login' ? 'register' : 'login'; document.querySelector('#auth-name').hidden = authMode === 'login'; document.querySelector('#auth-phone').hidden = authMode === 'login'; document.querySelector('#auth-submit').textContent = authMode === 'login' ? 'Iniciar sesión' : 'Registrarse'; document.querySelector('#auth-toggle').textContent = authMode === 'login' ? 'Crear cuenta' : 'Ya tengo cuenta'; });
document.querySelector('#auth-form').addEventListener('submit', event => { event.preventDefault(); const status = document.querySelector('#auth-status'); const payload = { action: authMode, name: document.querySelector('#auth-name').value, email: document.querySelector('#auth-email').value, phone: document.querySelector('#auth-phone').value, password: document.querySelector('#auth-password').value }; status.textContent = 'Procesando...'; apiJson('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(result => { authUser = result.user; event.target.reset(); renderAccount(); if (authUser.rol === 'administrador') loadAdmin(); }).catch(error => { status.textContent = error.message; }); });
document.querySelector('#account-button').addEventListener('click', () => { window.location.href = authUser?.rol === 'administrador' ? 'admin.html' : authUser ? '#cuenta' : 'login.html'; });
document.querySelector('#logout-button').addEventListener('click', () => apiJson('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) }).then(() => { authUser = null; renderAccount(); }));
document.querySelector('#orders-button').addEventListener('click', () => apiJson('api/orders.php').then(result => { document.querySelector('#order-list').innerHTML = result.orders.length ? result.orders.map(order => `<div class="order-row"><b>Pedido #${order.id}</b><span>${formatPrice(Number(order.total))}</span><em>${order.estado}</em></div>`).join('') : '<p>Aún no tienes pedidos.</p>'; }).catch(error => showToast(error.message)));

function loadAdmin() { loadProducts(); apiJson('api/orders.php').then(result => { const orders = result.orders; document.querySelector('#admin-stats').innerHTML = `<div><b>${orders.length}</b><span>Pedidos</span></div><div><b>${Object.keys(productCatalog).length}</b><span>Productos</span></div><div><b>${orders.filter(order => order.estado === 'recibido').length}</b><span>Por revisar</span></div>`; document.querySelector('#admin-products').innerHTML = Object.values(productCatalog).map(product => `<div class="admin-product"><span><b>${product.nombre}</b><small>${product.cantidad_disponible} unidades${product.cantidad_disponible <= product.stock_minimo ? ' · Stock bajo' : ''}</small></span><button data-edit-product="${product.id}">Editar</button><button data-delete-product="${product.id}">Eliminar</button></div>`).join(''); }).catch(error => showToast(error.message)); }
document.querySelector('#product-form').addEventListener('submit', event => { event.preventDefault(); const id = document.querySelector('#product-id').value; const payload = { id: id || undefined, nombre: document.querySelector('#product-name').value, descripcion: document.querySelector('#product-description').value, categoria_id: document.querySelector('#product-category').value, precio: document.querySelector('#product-price').value, cantidad_disponible: document.querySelector('#product-stock').value, stock_minimo: document.querySelector('#product-minimum').value }; apiJson('api/products.php', { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(() => { event.target.reset(); document.querySelector('#product-id').value = ''; loadAdmin(); showToast('Producto guardado.'); }).catch(error => showToast(error.message)); });
document.querySelector('#admin-products').addEventListener('click', event => { const id = Number(event.target.dataset.editProduct || event.target.dataset.deleteProduct); if (!id) return; if (event.target.dataset.deleteProduct) { apiJson('api/products.php', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).then(loadAdmin).catch(error => showToast(error.message)); return; } const product = Object.values(productCatalog).find(item => Number(item.id) === id); if (!product) return; document.querySelector('#product-id').value = product.id; document.querySelector('#product-name').value = product.nombre; document.querySelector('#product-description').value = product.descripcion; document.querySelector('#product-category').value = product.categoria_id; document.querySelector('#product-price').value = product.precio; document.querySelector('#product-stock').value = product.cantidad_disponible; document.querySelector('#product-minimum').value = product.stock_minimo; });

const originalSubmitPayload = document.querySelector('#contact-form');
originalSubmitPayload.addEventListener('submit', event => { if (!authUser) return; const form = event.target; const items = Object.entries(cart).map(([product, quantity]) => ({ productId: cartProductIds[product] || productCatalog[product]?.id, quantity })); if (items.some(item => !item.productId)) { event.preventDefault(); showToast('Actualiza el catálogo antes de confirmar.'); } });
document.querySelector('#auth-name').hidden = true; document.querySelector('#auth-phone').hidden = true;
loadProducts(); loadSession();
