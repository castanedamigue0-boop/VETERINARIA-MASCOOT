// ===== STORAGE =====
const Storage = {
  getUsers()         { return JSON.parse(localStorage.getItem('macott_users') || '[]'); },
  saveUsers(u)       { localStorage.setItem('macott_users', JSON.stringify(u)); },
  setSession(user)   { localStorage.setItem('macott_session', JSON.stringify(user)); },
  getSession()       { return JSON.parse(localStorage.getItem('macott_session') || 'null'); },
  clearSession()     { localStorage.removeItem('macott_session'); },
  getUserData(email) { return Storage.getUsers().find(u => u.email === email) || null; }
};

// Si ya hay sesión activa → dashboard
if (Storage.getSession()) {
  window.location.href = 'dashboard.html';
}

// ===== TABS =====
const tabLogin    = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const panelLogin  = document.getElementById('panel-login');
const panelReg    = document.getElementById('panel-register');

function showTab(tab) {
  const isLogin = tab === 'login';
  tabLogin.classList.toggle('active', isLogin);
  tabRegister.classList.toggle('active', !isLogin);
  tabLogin.setAttribute('aria-selected', String(isLogin));
  tabRegister.setAttribute('aria-selected', String(!isLogin));
  panelLogin.classList.toggle('active', isLogin);
  panelReg.classList.toggle('active', !isLogin);
  panelLogin.hidden = !isLogin;
  panelReg.hidden   = isLogin;
}

tabLogin.addEventListener('click',    () => showTab('login'));
tabRegister.addEventListener('click', () => showTab('register'));
document.getElementById('goRegister').addEventListener('click', () => showTab('register'));
document.getElementById('goLogin').addEventListener('click',    () => showTab('login'));

if (new URLSearchParams(location.search).get('tab') === 'register') showTab('register');

// ===== TOGGLE CONTRASEÑA =====
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', function () {
    const input = document.getElementById(this.dataset.target);
    const show  = input.type === 'password';
    input.type  = show ? 'text' : 'password';
    this.textContent = show ? '🙈' : '👁';
    this.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });
});

// ===== FUERZA CONTRASEÑA =====
const rPass    = document.getElementById('r-pass');
const strength = document.getElementById('passStrength');

rPass.addEventListener('input', () => {
  const v = rPass.value;
  let level = 0;
  if (v.length >= 6)                        level++;
  if (/[A-Z]/.test(v) && /[0-9]/.test(v))  level++;
  if (/[^A-Za-z0-9]/.test(v) && v.length >= 8) level++;
  const labels = ['', 'Débil', 'Media', 'Fuerte'];
  const cls    = ['', 'weak', 'medium', 'strong'];
  strength.className = 'pass-strength ' + (cls[level] || '');
  strength.innerHTML = v.length
    ? `<div class="bar"></div><div class="bar"></div><div class="bar"></div><span>${labels[level] || ''}</span>`
    : '';
});

// ===== VALIDACIÓN =====
function validate(inputId, errId, check, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (!check(input.value)) {
    input.classList.add('invalid'); input.classList.remove('valid');
    err.textContent = msg; return false;
  }
  input.classList.remove('invalid'); input.classList.add('valid');
  err.textContent = ''; return true;
}

function clearVal(form) {
  form.querySelectorAll('input').forEach(i => i.classList.remove('invalid', 'valid'));
  form.querySelectorAll('.field-error').forEach(e => e.textContent = '');
}

// ===== LOGIN =====
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  clearVal(e.target);
  const email = document.getElementById('l-email').value.trim();
  const pass  = document.getElementById('l-pass').value;
  const msg   = document.getElementById('login-msg');
  let valid   = true;

  valid = validate('l-email', 'le-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Correo inválido.') && valid;
  valid = validate('l-pass',  'le-pass',  v => v.length >= 6, 'Mínimo 6 caracteres.') && valid;
  if (!valid) return;

  const user = Storage.getUsers().find(u => u.email === email && u.password === pass);
  if (!user) {
    msg.className = 'form-msg error';
    msg.textContent = '❌ Correo o contraseña incorrectos.';
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Entrando...';
  msg.className = 'form-msg success';
  msg.textContent = `✅ ¡Bienvenido/a ${user.nombre}!`;

  Storage.setSession({ nombre: user.nombre, apellido: user.apellido, email: user.email, tel: user.tel });
  const redirect = sessionStorage.getItem('macott_redirect');
  sessionStorage.removeItem('macott_redirect');
  setTimeout(() => {
    window.location.href = redirect === 'cita' ? 'POYECTO-MASCOTT/index.html#inicio' : 'dashboard.html';
  }, 700);
});

// ===== REGISTRO =====
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  clearVal(e.target);
  const nombre   = document.getElementById('r-nombre').value.trim();
  const apellido = document.getElementById('r-apellido').value.trim();
  const email    = document.getElementById('r-email').value.trim();
  const pass     = document.getElementById('r-pass').value;
  const pass2    = document.getElementById('r-pass2').value;
  const tel      = document.getElementById('r-tel').value.trim();
  const msg      = document.getElementById('register-msg');
  let valid      = true;

  valid = validate('r-nombre',   're-nombre',   v => v.length >= 2, 'Ingresa tu nombre.')    && valid;
  valid = validate('r-apellido', 're-apellido', v => v.length >= 2, 'Ingresa tu apellido.')  && valid;
  valid = validate('r-email',    're-email',    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Correo inválido.') && valid;
  valid = validate('r-pass',     're-pass',     v => v.length >= 6, 'Mínimo 6 caracteres.') && valid;
  valid = validate('r-pass2',    're-pass2',    v => v === pass,    'Las contraseñas no coinciden.') && valid;
  if (!valid) return;

  const users = Storage.getUsers();
  if (users.find(u => u.email === email)) {
    msg.className = 'form-msg error';
    msg.textContent = '❌ Ya existe una cuenta con ese correo.';
    return;
  }

  const newUser = {
    nombre, apellido, email, password: pass, tel,
    citas: [], mascotas: [], carrito: [],
    fechaRegistro: new Date().toISOString()
  };
  users.push(newUser);
  Storage.saveUsers(users);
  Storage.setSession({ nombre, apellido, email, tel });
  const redirect = sessionStorage.getItem('macott_redirect');
  sessionStorage.removeItem('macott_redirect');
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  msg.className = 'form-msg success';
  msg.textContent = `✅ ¡Cuenta creada! Bienvenido/a ${nombre}...`;
  setTimeout(() => {
    window.location.href = redirect === 'cita' ? 'POYECTO-MASCOTT/index.html#inicio' : 'dashboard.html';
  }, 900);
});
