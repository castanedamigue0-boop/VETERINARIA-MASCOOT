// ===== SIDEBAR =====
const sidebar        = document.getElementById('sidebar');
const menuToggle     = document.getElementById('menuToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
  menuToggle.classList.add('active');
  menuToggle.setAttribute('aria-expanded', 'true');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
sidebarOverlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => { if (window.innerWidth <= 900) closeSidebar(); });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeSidebar(); closeAllModals(); }
});

// ===== LINK ACTIVO EN SIDEBAR =====
const sections     = document.querySelectorAll('section[id]');
const sidebarLinks = document.querySelectorAll('.sidebar-link[href]');

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.sidebar-link[href="#${entry.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.4 }).observe && sections.forEach(s =>
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.sidebar-link[href="#${entry.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.4 }).observe(s)
);

// ===== SCROLL REVEAL =====
new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
  });
}, { threshold: 0.12 }).observe && document.querySelectorAll('.reveal').forEach(el =>
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 }).observe(el)
);

// ===== CONTADOR ANIMADO =====
document.querySelectorAll('.stat-num').forEach(el => {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const step = target / (1500 / 16);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { el.textContent = target; clearInterval(timer); }
          else el.textContent = Math.floor(current);
        }, 16);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 }).observe(el);
});

// ===== GESTIÓN DE MODALES =====
const modals = {};

function registerModal(overlayId, ...openers) {
  const overlay = document.getElementById(overlayId);
  const closeBtn = overlay.querySelector('.modal-close');
  modals[overlayId] = overlay;

  openers.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => openModal(overlayId));
  });

  closeBtn.addEventListener('click', () => closeModal(overlayId));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlayId); });
}

function openModal(id) {
  const overlay = modals[id];
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => overlay.querySelector('input, select')?.focus(), 100);
}

function closeModal(id) {
  const overlay = modals[id];
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function closeAllModals() {
  Object.keys(modals).forEach(id => closeModal(id));
}

// ===== SESIÓN =====
function estaLogueado() {
  return !!localStorage.getItem('macott_session');
}

function abrirCitaOLogin() {
  if (estaLogueado()) {
    openModal('modalCita');
    buildFechas();
  } else {
    // Guardar intención para redirigir de vuelta
    sessionStorage.setItem('macott_redirect', 'cita');
    window.location.href = 'auth.html';
  }
}

// Registrar modal cita con verificación de sesión
['btnCitaHero', 'btnCitaSidebar', 'btnCitaCard'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', abrirCitaOLogin);
});

// Cerrar modal cita
const citaOverlay = document.getElementById('modalCita');
if (citaOverlay) {
  citaOverlay.querySelector('.modal-close')?.addEventListener('click', () => closeModal('modalCita'));
  citaOverlay.addEventListener('click', (e) => { if (e.target === citaOverlay) closeModal('modalCita'); });
  modals['modalCita'] = citaOverlay;
}

registerModal('modalAdmin', 'btnAdmin');

// Botón Admin → ir directo a admin.html
document.getElementById('btnAdmin')?.addEventListener('click', () => {
  window.location.href = 'admin.html';
});

// Login y registro → redirigir a auth.html
['btnLogin', 'btnLoginTop'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', () => {
    window.location.href = 'auth.html';
  });
});

// "Regístrate" en modal login
document.getElementById('linkRegister')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'auth.html?tab=register';
});

// ===== TOGGLE CONTRASEÑA =====
function setupTogglePass(btnId, inputId) {
  document.getElementById(btnId)?.addEventListener('click', function () {
    const input = document.getElementById(inputId);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    this.textContent = show ? '🙈' : '👁';
    this.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });
}
setupTogglePass('togglePass',      'login-pass');
setupTogglePass('toggleAdminPass', 'admin-pass');

// Submit login demo — ya no aplica en index, redirige a auth.html
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault(); closeModal('modalOverlay');
});
document.getElementById('adminForm')?.addEventListener('submit', (e) => {
  e.preventDefault(); closeModal('modalAdmin');
});

// ===== TARJETA HERO =====
(function () {
  const dias  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const hoy   = new Date();
  // Próxima hora disponible (simulada)
  const horas = ['9:00','9:30','10:00','10:30','11:00'];
  const hora  = horas[Math.floor(Math.random() * horas.length)];
  const el    = document.getElementById('heroFecha');
  if (el) el.textContent = `${dias[hoy.getDay()]} ${hoy.getDate()} ${meses[hoy.getMonth()]} · ${hora} am`;

  // Contadores de la tarjeta
  document.querySelectorAll('.hcard-stat-val').forEach(num => {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(num.dataset.target, 10);
          let current = 0;
          const step = Math.max(1, target / 30);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { num.textContent = target; clearInterval(timer); }
            else num.textContent = Math.floor(current);
          }, 40);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 }).observe(num);
  });
})();
const HORARIOS_BASE = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
                       '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
// Horarios "ocupados" simulados por fecha (índices)
const OCUPADOS = { 0: [1,4,7], 1: [0,3,6,9], 2: [2,5,8], 3: [1,3,10], 4: [0,4,7,11] };

const DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

let selectedFechaIdx = null;
let selectedHora     = null;

function buildFechas() {
  const grid = document.getElementById('fechasGrid');
  grid.innerHTML = '';
  const hoy = new Date();

  for (let i = 1; i <= 7; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    if (d.getDay() === 0) continue; // sin domingos

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fecha-btn';
    btn.dataset.idx = i - 1;
    btn.setAttribute('aria-label', `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`);
    btn.innerHTML = `<span class="dia-num">${d.getDate()}</span><span class="dia-nom">${DIAS[d.getDay()]}</span><span style="font-size:.7rem;color:var(--muted)">${MESES[d.getMonth()]}</span>`;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.fecha-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedFechaIdx = parseInt(btn.dataset.idx);
      selectedHora = null;
      document.getElementById('err-fecha').textContent = '';
      buildHorarios(selectedFechaIdx);
      document.getElementById('horariosWrap').style.display = 'block';
    });

    grid.appendChild(btn);
  }
}

function buildHorarios(idx) {
  const grid = document.getElementById('horariosGrid');
  grid.innerHTML = '';
  const ocupados = OCUPADOS[idx % 5] || [];

  HORARIOS_BASE.forEach((hora, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hora-btn' + (ocupados.includes(i) ? ' ocupado' : '');
    btn.textContent = hora;
    btn.setAttribute('aria-label', ocupados.includes(i) ? `${hora} no disponible` : hora);
    if (!ocupados.includes(i)) {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hora-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedHora = hora;
        document.getElementById('err-hora').textContent = '';
      });
    }
    grid.appendChild(btn);
  });
}

// ===== SESIÓN - ACTUALIZAR UI =====
(function() {
  const session = localStorage.getItem('macott_session');
  if (!session) return;
  const user = JSON.parse(session);

  // Cambiar botón login por "Mi cuenta"
  ['btnLogin', 'btnLoginTop'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.innerHTML = `<span aria-hidden="true">👤</span> ${user.nombre}`;
    btn.onclick = () => { window.location.href = 'dashboard.html'; };
  });
})();

// buildFechas se llama desde abrirCitaOLogin()

// ===== FORMULARIO CITAS =====
document.getElementById('formCita').addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre   = document.getElementById('c-nombre');
  const mascota  = document.getElementById('c-mascota');
  const servicio = document.getElementById('c-servicio');
  const formMsg  = document.getElementById('formMsg');

  let valid = true;
  valid = validate(nombre,   'err-nombre',   'Ingresa tu nombre.')               && valid;
  valid = validate(mascota,  'err-mascota',  'Ingresa el nombre de tu mascota.') && valid;
  valid = validate(servicio, 'err-servicio', 'Selecciona un servicio.')          && valid;

  if (selectedFechaIdx === null) {
    document.getElementById('err-fecha').textContent = 'Selecciona una fecha.';
    valid = false;
  }
  if (!selectedHora) {
    document.getElementById('err-hora').textContent = 'Selecciona un horario.';
    valid = false;
  }
  if (!valid) return;

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> Enviando...';

  setTimeout(() => {
    formMsg.textContent = `✅ ¡Cita confirmada para ${nombre.value} y ${mascota.value} a las ${selectedHora}!`;
    formMsg.className = 'form-msg success';
    e.target.reset();
    document.querySelectorAll('.fecha-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.hora-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('horariosWrap').style.display = 'none';
    selectedFechaIdx = null; selectedHora = null;
    btn.disabled = false;
    btn.innerHTML = '<span>✅</span> Confirmar Cita';
  }, 1000);
});

function validate(input, errId, msg) {
  const err = document.getElementById(errId);
  if (!input.value.trim()) { input.classList.add('invalid'); err.textContent = msg; return false; }
  input.classList.remove('invalid'); err.textContent = ''; return true;
}

['c-nombre','c-mascota','c-servicio'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', function () {
    this.classList.remove('invalid');
    const errId = 'err-' + id.replace('c-','');
    const el = document.getElementById(errId);
    if (el) el.textContent = '';
  });
});

// ===== SCROLL SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
