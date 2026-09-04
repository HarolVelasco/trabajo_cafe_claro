const apiUrl = window.location.protocol === 'file:' ? 'http://localhost/guayaba-clara/api/auth.php' : 'api/auth.php';
const api = (options) => { if (window.location.protocol === 'file:') return Promise.reject(new Error('Abre esta página desde http://localhost/guayaba-clara/login.html; no funciona con doble clic porque PHP necesita Apache.')); return fetch(apiUrl, { ...options, credentials: 'include' }).then(async response => { const result = await response.json(); if (!response.ok || !result.ok) throw new Error(result.message || 'No fue posible completar la operación.'); return result; }).catch(error => { if (error instanceof TypeError) throw new Error('No se pudo conectar con XAMPP. Verifica que Apache esté encendido y usa http://localhost/guayaba-clara/login.html.'); throw error; }); };
const status = document.querySelector('#status');
const form = document.querySelector('#login-form') || document.querySelector('#register-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const isRegister = form.id === 'register-form';
  const payload = { action: isRegister ? 'register' : 'login', email: document.querySelector('#email').value, password: document.querySelector('#password').value };
  if (isRegister) { payload.name = document.querySelector('#name').value; payload.phone = document.querySelector('#phone').value; }
  status.textContent = 'Procesando...';
  api({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    .then(result => { window.location.href = result.user.rol === 'administrador' ? 'admin.html' : 'index.html'; })
    .catch(error => { status.textContent = error.message; });
});
