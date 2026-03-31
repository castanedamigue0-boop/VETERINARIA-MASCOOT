// ===== STORAGE =====
const Storage = {
  getSession()       { return JSON.parse(localStorage.getItem('macott_session') || 'null'); },
  clearSession()     { localStorage.removeItem('macott_session'); },
  getUsers()         { return JSON.parse(localStorage.getItem('macott_users') || '[]'); },
  saveUsers(u)       { localStorage.setItem('macott_users', JSON.stringify(u)); },
  getUserData(email) { return Storage.getUsers().find(u => u.email === email) || null; },
  updateUser(email, data) {
    const users = Storage.getUsers();
    const idx   = users.findIndex(u => u.email === email);
    if (idx !== -1) { users[idx] = { ...users[idx], ...data }; Storage.saveUsers(users); }
  }
};

// ===== SESION =====
const session = Storage.getSession();
if (!session) { window.location.href = 'auth.html'; }

let userData = Storage.getUserData(session.email) || { ...session, citas: [], mascotas: [], carrito: [], pedidos: [] };
if (!userData.citas)    userData.citas    = [];
if (!userData.mascotas) userData.mascotas = [];
if (!userData.carrito)  userData.carrito  = [];
if (!userData.pedidos)  userData.pedidos  = [];

// ===== CATALOGO (img: pon tu URL aqui) =====
const PRODUCTOS = [
  { id:1,  nombre:'Royal Canin Cachorro 3kg',          animal:'perro', etapa:'cachorro', cat:'alimento',  precio:420, precioOld:480,  marca:'Royal Canin',   img:'', badge:'oferta', desc:'Formula especial para cachorros hasta 12 meses.' },
  { id:2,  nombre:'Purina Pro Plan Cachorro 4kg',      animal:'perro', etapa:'cachorro', cat:'alimento',  precio:390, precioOld:null, marca:'Purina',        img:'', badge:'nuevo',  desc:'Proteina de pollo real como primer ingrediente.' },
  { id:3,  nombre:'Snack Dental Cachorro x20',         animal:'perro', etapa:'cachorro', cat:'snack',     precio:120, precioOld:null, marca:'Pedigree',      img:'', badge:null,     desc:'Cuida los dientes desde pequeno.' },
  { id:4,  nombre:'Collar Ajustable Cachorro',         animal:'perro', etapa:'cachorro', cat:'accesorio', precio:85,  precioOld:null, marca:'PetStyle',      img:'', badge:null,     desc:'Collar suave de nylon, ajustable 20-35 cm.' },
  { id:5,  nombre:'Hills Science Diet Adulto 7kg',     animal:'perro', etapa:'adulto',   cat:'alimento',  precio:650, precioOld:720,  marca:"Hill's",        img:'', badge:'oferta', desc:'Nutricion balanceada para perros adultos activos.' },
  { id:6,  nombre:'Eukanuba Adulto Razas Grandes',     animal:'perro', etapa:'adulto',   cat:'alimento',  precio:580, precioOld:null, marca:'Eukanuba',      img:'', badge:null,     desc:'Especial para razas grandes. Cuida articulaciones.' },
  { id:7,  nombre:'Shampoo Perro Pelo Corto 500ml',    animal:'perro', etapa:'adulto',   cat:'higiene',   precio:95,  precioOld:null, marca:'BioGroom',      img:'', badge:null,     desc:'Formula suave con aloe vera.' },
  { id:8,  nombre:'Juguete Kong Classic M',            animal:'perro', etapa:'adulto',   cat:'juguete',   precio:210, precioOld:null, marca:'Kong',          img:'', badge:'nuevo',  desc:'Resistente caucho natural. Rellenable con premios.' },
  { id:9,  nombre:'Antipulgas Spot-On Perro',          animal:'perro', etapa:'adulto',   cat:'salud',     precio:180, precioOld:200,  marca:'Frontline',     img:'', badge:'oferta', desc:'Proteccion 30 dias contra pulgas y garrapatas.' },
  { id:10, nombre:'Cama Ortopedica Perro M',           animal:'perro', etapa:'adulto',   cat:'accesorio', precio:450, precioOld:null, marca:'PetComfort',    img:'', badge:null,     desc:'Espuma viscoelastica. Ideal para artritis.' },
  { id:11, nombre:'Royal Canin Senior 8+ 3kg',         animal:'perro', etapa:'senior',   cat:'alimento',  precio:480, precioOld:520,  marca:'Royal Canin',   img:'', badge:'oferta', desc:'Formula adaptada para perros mayores de 8 anos.' },
  { id:12, nombre:'Suplemento Articular Perro',        animal:'perro', etapa:'senior',   cat:'salud',     precio:260, precioOld:null, marca:'Vetri-Science', img:'', badge:null,     desc:'Glucosamina y condroitina para articulaciones.' },
  { id:13, nombre:'Royal Canin Kitten 2kg',            animal:'gato',  etapa:'cachorro', cat:'alimento',  precio:350, precioOld:390,  marca:'Royal Canin',   img:'', badge:'oferta', desc:'Nutricion completa para gatitos hasta 12 meses.' },
  { id:14, nombre:'Juguete Raton con Catnip',          animal:'gato',  etapa:'cachorro', cat:'juguete',   precio:65,  precioOld:null, marca:'Catit',         img:'', badge:null,     desc:'Estimula el instinto cazador. Hierba gatera natural.' },
  { id:15, nombre:'Whiskas Adulto Pollo 3kg',          animal:'gato',  etapa:'adulto',   cat:'alimento',  precio:280, precioOld:null, marca:'Whiskas',       img:'', badge:null,     desc:'Croquetas con pollo real. Apoya salud urinaria.' },
  { id:16, nombre:'Arena Sanitaria Aglomerante 5kg',   animal:'gato',  etapa:'adulto',   cat:'higiene',   precio:130, precioOld:150,  marca:'Ever Clean',    img:'', badge:'oferta', desc:'Control de olores 7 dias. Aglomeracion instantanea.' },
  { id:17, nombre:'Rascador Torre Gato',               animal:'gato',  etapa:'adulto',   cat:'accesorio', precio:320, precioOld:null, marca:'Catit',         img:'', badge:'nuevo',  desc:'Sisal natural, plataforma y juguete colgante.' },
  { id:18, nombre:'Snack Temptations Gato x85g',       animal:'gato',  etapa:'adulto',   cat:'snack',     precio:75,  precioOld:null, marca:'Temptations',   img:'', badge:null,     desc:'Crujientes por fuera, suaves por dentro.' },
  { id:19, nombre:'Antipulgas Gato Spot-On',           animal:'gato',  etapa:'adulto',   cat:'salud',     precio:160, precioOld:180,  marca:'Frontline',     img:'', badge:'oferta', desc:'Proteccion mensual contra pulgas y garrapatas.' },
  { id:20, nombre:'Hills Science Diet Gato 7+ 1.5kg',  animal:'gato',  etapa:'senior',   cat:'alimento',  precio:390, precioOld:null, marca:"Hill's",        img:'', badge:null,     desc:'Cuida rinones y articulaciones en gatos mayores.' },
  { id:21, nombre:'Alimento Conejo Adulto 1.5kg',      animal:'conejo',etapa:'adulto',   cat:'alimento',  precio:150, precioOld:null, marca:'Versele-Laga',  img:'', badge:null,     desc:'Mezcla de heno, verduras y cereales. Sin colorantes.' },
  { id:22, nombre:'Jaula Conejo Mediana',              animal:'conejo',etapa:'adulto',   cat:'accesorio', precio:520, precioOld:600,  marca:'Ferplast',      img:'', badge:'oferta', desc:'Bandeja extraible y comedero incluido.' },
  { id:23, nombre:'Snack Heno Timothy Conejo',         animal:'conejo',etapa:'adulto',   cat:'snack',     precio:90,  precioOld:null, marca:'Oxbow',         img:'', badge:'nuevo',  desc:'Heno de primera calidad. Esencial para la digestion.' },
  { id:24, nombre:'Alimento Periquito Mezcla 1kg',     animal:'ave',   etapa:'adulto',   cat:'alimento',  precio:95,  precioOld:null, marca:'Versele-Laga',  img:'', badge:null,     desc:'Mezcla de semillas seleccionadas para periquitos.' },
  { id:25, nombre:'Jaula Canario Decorativa',          animal:'ave',   etapa:'adulto',   cat:'accesorio', precio:380, precioOld:420,  marca:'Ferplast',      img:'', badge:'oferta', desc:'Diseno elegante con comederos y bebederos incluidos.' },
  { id:26, nombre:'Vitaminas Aves Liquidas 30ml',      animal:'ave',   etapa:'adulto',   cat:'salud',     precio:110, precioOld:null, marca:'Nekton',        img:'', badge:null,     desc:'Complejo vitaminico para aves en epoca de muda.' },
];

// ===== SIDEBAR MOVIL =====
const dashSidebar = document.getElementById('dashSidebar');
const dashOverlay = document.getElementById('dashOverlay');
const dashMenuBtn = document.getElementById('dashMenuBtn');

dashMenuBtn.addEventListener('click', () => {
  const open = dashSidebar.classList.toggle('open');
  dashOverlay.classList.toggle('active', open);
  dashMenuBtn.setAttribute('aria-expanded', String(open));
});
dashOverlay.addEventListener('click', () => {
  dashSidebar.classList.remove('open');
  dashOverlay.classList.remove('active');
  dashMenuBtn.setAttribute('aria-expanded', 'false');
});

// ===== LOGOUT =====
function logout() { Storage.clearSession(); window.location.href = 'index.html'; }
document.getElementById('btnLogout').addEventListener('click', logout);
document.getElementById('btnLogoutTop').addEventListener('click', logout);

// ===== NAVEGACION =====
const allSections = document.querySelectorAll('.dash-section');
const navBtns     = document.querySelectorAll('.ds-link[data-section]');

function showSection(id) {
  allSections.forEach(function(s) { s.classList.remove('active'); s.hidden = true; });
  navBtns.forEach(function(b) { b.classList.remove('active'); b.removeAttribute('aria-current'); });
  var sec = document.getElementById('sec-' + id);
  var btn = document.querySelector('.ds-link[data-section="' + id + '"]');
  if (sec) { sec.classList.add('active'); sec.hidden = false; }
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-current', 'page'); }
  if (window.innerWidth <= 900) { dashSidebar.classList.remove('open'); dashOverlay.classList.remove('active'); }
  var renders = { inicio: renderInicio, citas: renderCitas, mascotas: renderMascotas, tienda: renderTienda, inventario: initInventario, historial: renderHistorial, perfil: renderPerfil };
  if (renders[id]) renders[id]();
  triggerReveal();
}

navBtns.forEach(function(b) { b.addEventListener('click', function() { showSection(b.dataset.section); }); });

function triggerReveal() {
  setTimeout(function() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function(el) { el.classList.add('visible'); });
  }, 60);
}

// ===== POBLAR UI =====
function populateUserUI() {
  var initial = (userData.nombre || 'U')[0].toUpperCase();
  document.getElementById('dsAvatar').textContent     = initial;
  document.getElementById('dsName').textContent       = (userData.nombre + ' ' + (userData.apellido || '')).trim();
  document.getElementById('dsEmail').textContent      = userData.email;
  document.getElementById('welcomeName').textContent  = userData.nombre;
  document.getElementById('perfilAvatar').textContent = initial;
  document.getElementById('perfilName').textContent   = (userData.nombre + ' ' + (userData.apellido || '')).trim();
  var yr = userData.fechaRegistro ? new Date(userData.fechaRegistro).getFullYear() : 2026;
  document.getElementById('perfilSince').textContent  = 'Miembro desde ' + yr;
}

// ===== INICIO =====
function renderInicio() {
  var pendientes  = userData.citas.filter(function(c) { return c.estado === 'pendiente'; });
  var completadas = userData.citas.filter(function(c) { return c.estado === 'completada'; });
  document.getElementById('statCitas').textContent     = userData.citas.length;
  document.getElementById('statMascotas').textContent  = userData.mascotas.length;
  document.getElementById('statAtendidas').textContent = completadas.length;
  document.getElementById('statPedidos').textContent   = userData.pedidos.length;

  var proxWrap = document.getElementById('proximaCita');
  if (pendientes.length) {
    var c = pendientes[0];
    proxWrap.innerHTML = '<div class="cita-item"><div class="cita-info"><h4>' + c.servicio + '</h4><p>Mascota: ' + c.mascota + ' | ' + c.fecha + ' ' + c.hora + '</p></div><span class="cita-badge badge-pendiente">Pendiente</span></div><button class="btn-dash" id="btnNuevaCita" style="margin-top:.75rem">+ Agendar otra</button>';
  } else {
    proxWrap.innerHTML = '<p class="empty-msg">No tienes citas proximas.</p><button class="btn-dash" id="btnNuevaCita">+ Agendar cita</button>';
  }
  var btnNC = document.getElementById('btnNuevaCita');
  if (btnNC) btnNC.addEventListener('click', function() { showSection('citas'); });

  var mList = document.getElementById('dashMascotasList');
  mList.innerHTML = userData.mascotas.length
    ? userData.mascotas.map(function(m) { return '<span class="mascota-chip">' + m.especie.split(' ')[0] + ' ' + m.nombre + '</span>'; }).join('')
    : '<p class="empty-msg" style="font-size:.82rem">Sin mascotas aun.</p>';
  var btnAM = document.getElementById('btnAddMascotaInicio');
  if (btnAM) btnAM.addEventListener('click', function() { showSection('mascotas'); });
}

// ===== CITAS =====
function renderCitas() {
  var list = document.getElementById('citasList');

  // Recargar datos frescos del storage
  userData = Storage.getUserData(session.email) || userData;
  if (!userData.citas) userData.citas = [];

  var citas = userData.citas;
  list.innerHTML = citas.length
    ? citas.map(function(c) {
        var badgeClass = c.estado === 'confirmada' ? 'badge-completada' : c.estado === 'cancelada' ? 'badge-cancelada' : 'badge-pendiente';
        var badgeText  = c.estado === 'confirmada' ? '✅ Confirmada' : c.estado === 'cancelada' ? '❌ Cancelada' : '⏳ Pendiente';
        var cancelBtn  = c.estado === 'pendiente'
          ? '<button class="btn-icon" data-action="cancelar" data-id="' + c.id + '">Cancelar</button>'
          : '';
        return '<div class="cita-item ' + (c.estado !== 'pendiente' ? c.estado : '') + '">' +
          '<div class="cita-info">' +
            '<h4>' + c.servicio + '</h4>' +
            '<p>🐾 ' + c.mascota + ' &nbsp;|&nbsp; 📅 ' + c.fecha + ' &nbsp;·&nbsp; 🕐 ' + c.hora + (c.notas ? ' &nbsp;|&nbsp; 📝 ' + c.notas : '') + '</p>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap">' +
            '<span class="cita-badge ' + badgeClass + '">' + badgeText + '</span>' +
            cancelBtn +
          '</div></div>';
      }).join('')
    : '<p class="empty-msg">No tienes citas registradas.</p>';

  list.querySelectorAll('[data-action="cancelar"]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      userData.citas = userData.citas.filter(function(c) { return c.id !== btn.dataset.id; });
      Storage.updateUser(userData.email, { citas: userData.citas });
      renderCitas(); renderInicio();
    });
  });

  document.getElementById('btnAbrirCita').onclick = function() {
    var wrap = document.getElementById('citaFormWrap');
    var open = wrap.style.display === 'none';
    wrap.style.display = open ? 'block' : 'none';
    if (open) {
      var manana = new Date(); manana.setDate(manana.getDate() + 1);
      document.getElementById('nc-fecha').min = manana.toISOString().split('T')[0];
    }
  };
  document.getElementById('btnCancelarCita').onclick = function() {
    document.getElementById('citaFormWrap').style.display = 'none';
  };
}

// poblarSelectMascotas eliminado — campo es input de texto libre

document.getElementById('formNuevaCita').addEventListener('submit', function(e) {
  e.preventDefault();
  var mascota  = document.getElementById('nc-mascota');
  var servicio = document.getElementById('nc-servicio');
  var fecha    = document.getElementById('nc-fecha');
  var hora     = document.getElementById('nc-hora');
  var notas    = document.getElementById('nc-notas').value.trim();
  var msg      = document.getElementById('cita-msg');
  var valid = true;
  valid = vld(mascota,  'nce-mascota',  'Selecciona una mascota.')  && valid;
  valid = vld(servicio, 'nce-servicio', 'Selecciona un servicio.')  && valid;
  valid = vld(fecha,    'nce-fecha',    'Selecciona una fecha.')    && valid;
  valid = vld(hora,     'nce-hora',     'Selecciona un horario.')   && valid;
  if (!valid) return;
  userData.citas.push({ id: Date.now().toString(), mascota: mascota.value, servicio: servicio.value, fecha: fecha.value, hora: hora.value, notas: notas, estado: 'pendiente' });
  Storage.updateUser(userData.email, { citas: userData.citas });
  msg.className = 'form-msg success'; msg.textContent = 'Cita agendada!';
  setTimeout(function() {
    document.getElementById('citaFormWrap').style.display = 'none';
    e.target.reset(); msg.textContent = ''; msg.className = 'form-msg';
    renderCitas(); renderInicio();
  }, 1200);
});

// ===== MASCOTAS =====
function renderMascotas() {
  var grid = document.getElementById('mascotasList');
  grid.innerHTML = userData.mascotas.length
    ? userData.mascotas.map(function(m) {
        return '<div class="mascota-card"><span class="mascota-emoji">' + m.especie.split(' ')[0] + '</span><h4>' + m.nombre + '</h4><p>' + m.especie.split(' ').slice(1).join(' ') + (m.raza ? ' - ' + m.raza : '') + (m.edad ? ' - ' + m.edad + ' anos' : '') + '</p><button class="btn-icon" data-action="eliminar" data-id="' + m.id + '" style="margin-top:.75rem">Eliminar</button></div>';
      }).join('')
    : '<p class="empty-msg">No tienes mascotas registradas.</p>';

  grid.querySelectorAll('[data-action="eliminar"]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      userData.mascotas = userData.mascotas.filter(function(m) { return m.id !== btn.dataset.id; });
      Storage.updateUser(userData.email, { mascotas: userData.mascotas });
      renderMascotas(); renderInicio();
    });
  });
  document.getElementById('btnAbrirMascota').onclick = function() {
    var wrap = document.getElementById('mascotaFormWrap');
    wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
  };
  document.getElementById('btnCancelarMascota').onclick = function() {
    document.getElementById('mascotaFormWrap').style.display = 'none';
  };
}

document.getElementById('formMascota').addEventListener('submit', function(e) {
  e.preventDefault();
  var nombre  = document.getElementById('m-nombre');
  var especie = document.getElementById('m-especie');
  var valid = true;
  valid = vld(nombre,  'me-nombre',  'Ingresa el nombre.')     && valid;
  valid = vld(especie, 'me-especie', 'Selecciona la especie.') && valid;
  if (!valid) return;
  userData.mascotas.push({ id: Date.now().toString(), nombre: nombre.value.trim(), especie: especie.value, raza: document.getElementById('m-raza').value.trim(), edad: document.getElementById('m-edad').value });
  Storage.updateUser(userData.email, { mascotas: userData.mascotas });
  document.getElementById('mascotaFormWrap').style.display = 'none';
  e.target.reset(); renderMascotas(); renderInicio();
});

// ===== TIENDA =====
var filtroActivo = 'todos';

function renderTienda() {
  renderProductos();
  actualizarBadgeCarrito();

  document.querySelectorAll('.filtro-btn').forEach(function(btn) {
    btn.onclick = function() {
      document.querySelectorAll('.filtro-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      filtroActivo = btn.dataset.cat;
      renderProductos();
    };
  });

  document.getElementById('btnVerCarrito').onclick = function() {
    var panel = document.getElementById('carritoPanel');
    var isHidden = panel.style.display === 'none' || panel.style.display === '';
    panel.style.display = isHidden ? 'block' : 'none';
    if (isHidden) renderCarrito();
  };
  document.getElementById('btnCerrarCarrito').onclick = function() {
    document.getElementById('carritoPanel').style.display = 'none';
  };
  document.getElementById('btnComprar').onclick = confirmarPedido;
}

function renderProductos() {
  var grid  = document.getElementById('productosGrid');
  var lista = filtroActivo === 'todos' ? PRODUCTOS : PRODUCTOS.filter(function(p) { return p.cat === filtroActivo; });

  grid.innerHTML = lista.map(function(p) {
    var imgHtml   = p.img
      ? '<img src="' + p.img + '" alt="' + p.nombre + '" class="prod-img"/>'
      : '<div class="prod-img-placeholder"><span>Foto</span></div>';
    var badgeHtml = p.badge ? '<span class="inv-badge ' + p.badge + '">' + p.badge + '</span>' : '';
    var oldHtml   = p.precioOld ? '<span class="prod-precio-old">$' + p.precioOld + '</span>' : '';
    return '<div class="producto-card">'
      + '<div class="prod-img-wrap">' + imgHtml + badgeHtml + '</div>'
      + '<div class="prod-body">'
      + '<p class="prod-animal">' + p.animal + ' - ' + p.etapa + '</p>'
      + '<h4>' + p.nombre + '</h4>'
      + '<p class="prod-desc">' + p.desc + '</p>'
      + '<p class="prod-marca">' + p.marca + '</p>'
      + '</div>'
      + '<div class="producto-footer">'
      + '<div><span class="producto-precio">$' + p.precio + ' MXN</span>' + oldHtml + '</div>'
      + '<button class="btn-agregar" data-id="' + p.id + '">+ Agregar</button>'
      + '</div></div>';
  }).join('');

  grid.querySelectorAll('.btn-agregar').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var prod = PRODUCTOS.find(function(p) { return p.id === parseInt(btn.dataset.id); });
      var item = userData.carrito.find(function(i) { return i.id === prod.id; });
      if (item) {
        item.qty++;
      } else {
        userData.carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, img: prod.img, marca: prod.marca, qty: 1 });
      }
      Storage.updateUser(userData.email, { carrito: userData.carrito });
      actualizarBadgeCarrito();
      btn.textContent = 'Agregado'; btn.disabled = true;
      setTimeout(function() { btn.textContent = '+ Agregar'; btn.disabled = false; }, 1200);
    });
  });
}

function renderCarrito() {
  var items = document.getElementById('carritoItems');
  var total = document.getElementById('carritoTotal');
  if (!userData.carrito.length) {
    items.innerHTML = '<p class="empty-msg">Tu carrito esta vacio.</p>';
    total.textContent = '$0 MXN';
    return;
  }

  items.innerHTML = userData.carrito.map(function(i) {
    var imgHtml = i.img
      ? '<img src="' + i.img + '" alt="' + i.nombre + '" class="ci-img"/>'
      : '<div class="ci-img-placeholder">Foto</div>';
    return '<div class="carrito-item">'
      + '<div class="ci-thumb">' + imgHtml + '</div>'
      + '<div class="ci-info"><p class="ci-nombre">' + i.nombre + '</p><p class="ci-marca">' + i.marca + '</p></div>'
      + '<div class="ci-controls">'
      + '<span class="ci-precio">$' + (i.precio * i.qty) + ' MXN</span>'
      + '<div class="carrito-qty">'
      + '<button class="qty-btn" data-action="menos" data-id="' + i.id + '">-</button>'
      + '<span>' + i.qty + '</span>'
      + '<button class="qty-btn" data-action="mas" data-id="' + i.id + '">+</button>'
      + '</div>'
      + '<button class="btn-icon" data-action="quitar" data-id="' + i.id + '">Quitar</button>'
      + '</div></div>';
  }).join('');

  var sum = userData.carrito.reduce(function(a, i) { return a + i.precio * i.qty; }, 0);
  total.textContent = '$' + sum + ' MXN';

  items.querySelectorAll('[data-action]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id  = parseInt(btn.dataset.id);
      var idx = userData.carrito.findIndex(function(i) { return i.id === id; });
      if (btn.dataset.action === 'mas')    { userData.carrito[idx].qty++; }
      if (btn.dataset.action === 'menos')  { userData.carrito[idx].qty--; if (userData.carrito[idx].qty <= 0) userData.carrito.splice(idx, 1); }
      if (btn.dataset.action === 'quitar') { userData.carrito.splice(idx, 1); }
      Storage.updateUser(userData.email, { carrito: userData.carrito });
      actualizarBadgeCarrito();
      renderCarrito();
    });
  });
}

function actualizarBadgeCarrito() {
  var total = userData.carrito.reduce(function(a, i) { return a + i.qty; }, 0);
  document.getElementById('carritoBadge').textContent = total;
}

function confirmarPedido() {
  var msg = document.getElementById('compra-msg');
  if (!userData.carrito.length) { msg.className = 'form-msg error'; msg.textContent = 'Tu carrito esta vacio.'; return; }
  var pedido = {
    id: Date.now().toString(),
    fecha: new Date().toLocaleDateString('es-MX'),
    items: userData.carrito.slice(),
    total: userData.carrito.reduce(function(a, i) { return a + i.precio * i.qty; }, 0)
  };
  userData.pedidos.push(pedido);
  userData.carrito = [];
  Storage.updateUser(userData.email, { carrito: userData.carrito, pedidos: userData.pedidos });
  actualizarBadgeCarrito();
  renderCarrito();
  msg.className = 'form-msg success'; msg.textContent = 'Pedido confirmado! Nos pondremos en contacto contigo.';
  setTimeout(function() { msg.textContent = ''; msg.className = 'form-msg'; }, 4000);
}

// ===== INVENTARIO =====
function initInventario() {
  renderInventario();
  var invSearch = document.getElementById('invSearch');
  var invAnimal = document.getElementById('invFiltroAnimal');
  var invCat    = document.getElementById('invFiltroCat');
  if (invSearch) invSearch.addEventListener('input', renderInventario);
  if (invAnimal) invAnimal.addEventListener('change', renderInventario);
  if (invCat)    invCat.addEventListener('change', renderInventario);

  var btnExp = document.getElementById('btnExportarInv');
  if (btnExp) btnExp.addEventListener('click', function() {
    var headers = ['ID','Nombre','Animal','Etapa','Categoria','Marca','Precio','Precio anterior','Badge'];
    var rows = PRODUCTOS.map(function(p) {
      return [p.id, p.nombre, p.animal, p.etapa, p.cat, p.marca, p.precio, p.precioOld || '', p.badge || ''].join(',');
    });
    var csv = [headers.join(',')].concat(rows).join('\n');
    var a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'inventario_macott.csv';
    a.click();
  });
}

function renderInventario() {
  var search     = (document.getElementById('invSearch') ? document.getElementById('invSearch').value : '').toLowerCase();
  var filtAnimal = document.getElementById('invFiltroAnimal') ? document.getElementById('invFiltroAnimal').value : 'todos';
  var filtCat    = document.getElementById('invFiltroCat')    ? document.getElementById('invFiltroCat').value    : 'todos';

  var filtrados = PRODUCTOS.filter(function(p) {
    if (filtAnimal !== 'todos' && p.animal !== filtAnimal) return false;
    if (filtCat    !== 'todos' && p.cat    !== filtCat)    return false;
    if (search && p.nombre.toLowerCase().indexOf(search) === -1 && p.marca.toLowerCase().indexOf(search) === -1) return false;
    return true;
  });

  var tbody = document.getElementById('invBody');
  if (!tbody) return;

  tbody.innerHTML = filtrados.map(function(p) {
    var imgHtml   = p.img
      ? '<img src="' + p.img + '" alt="' + p.nombre + '" class="inv-prod-img"/>'
      : '<div class="inv-img-placeholder">Agregar foto</div>';
    var badgeHtml = p.badge ? '<span class="inv-badge ' + p.badge + '">' + p.badge + '</span>' : '-';
    return '<tr>'
      + '<td>' + p.id + '</td>'
      + '<td><div class="inv-prod-cell">' + imgHtml + '<span>' + p.nombre + '</span></div></td>'
      + '<td>' + p.animal + '</td>'
      + '<td>' + p.etapa + '</td>'
      + '<td>' + p.cat + '</td>'
      + '<td>' + p.marca + '</td>'
      + '<td>$' + p.precio + '</td>'
      + '<td>' + (p.precioOld ? '$' + p.precioOld : '-') + '</td>'
      + '<td>' + badgeHtml + '</td>'
      + '<td><button class="btn-inv-carrito" data-id="' + p.id + '">+ Carrito</button></td>'
      + '</tr>';
  }).join('');

  var countEl = document.getElementById('invCount');
  if (countEl) countEl.textContent = filtrados.length + ' de ' + PRODUCTOS.length + ' productos';

  tbody.querySelectorAll('.btn-inv-carrito').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var prod = PRODUCTOS.find(function(p) { return p.id === parseInt(btn.dataset.id); });
      var item = userData.carrito.find(function(i) { return i.id === prod.id; });
      if (item) {
        item.qty++;
      } else {
        userData.carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, img: prod.img, marca: prod.marca, qty: 1 });
      }
      Storage.updateUser(userData.email, { carrito: userData.carrito });
      actualizarBadgeCarrito();
      btn.textContent = 'Agregado!';
      setTimeout(function() { btn.textContent = '+ Carrito'; }, 1200);
    });
  });
}

// ===== HISTORIAL =====
function renderHistorial() {
  document.querySelectorAll('.htab').forEach(function(tab) {
    tab.onclick = function() {
      document.querySelectorAll('.htab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.getElementById('citas-hist').style.display   = tab.dataset.htab === 'citas-hist'   ? 'flex' : 'none';
      document.getElementById('pedidos-hist').style.display = tab.dataset.htab === 'pedidos-hist' ? 'flex' : 'none';
    };
  });

  document.getElementById('citas-hist').innerHTML = userData.citas.length
    ? userData.citas.map(function(c) {
        return '<div class="cita-item ' + c.estado + '"><div class="cita-info"><h4>' + c.servicio + '</h4><p>' + c.mascota + ' | ' + c.fecha + ' ' + c.hora + '</p></div><span class="cita-badge badge-' + c.estado + '">' + c.estado.charAt(0).toUpperCase() + c.estado.slice(1) + '</span></div>';
      }).join('')
    : '<p class="empty-msg">No hay citas registradas.</p>';

  document.getElementById('pedidos-hist').innerHTML = userData.pedidos.length
    ? userData.pedidos.map(function(p) {
        var itemsStr = p.items.map(function(i) { return i.nombre + ' x' + i.qty; }).join(', ');
        return '<div class="cita-item"><div class="cita-info"><h4>Pedido #' + p.id.slice(-4) + '</h4><p>' + p.fecha + ' - ' + p.items.length + ' producto(s)</p><p style="margin-top:.25rem;font-size:.8rem;color:var(--muted)">' + itemsStr + '</p></div><span class="cita-badge badge-completada">$' + p.total + ' MXN</span></div>';
      }).join('')
    : '<p class="empty-msg">No hay pedidos registrados.</p>';
}

// ===== PERFIL =====
function renderPerfil() {
  document.getElementById('p-nombre').value   = userData.nombre   || '';
  document.getElementById('p-apellido').value = userData.apellido || '';
  document.getElementById('p-email').value    = userData.email    || '';
  document.getElementById('p-tel').value      = userData.tel      || '';
}

document.getElementById('formPerfil').addEventListener('submit', function(e) {
  e.preventDefault();
  var nombre   = document.getElementById('p-nombre').value.trim();
  var apellido = document.getElementById('p-apellido').value.trim();
  var email    = document.getElementById('p-email').value.trim();
  var tel      = document.getElementById('p-tel').value.trim();
  var pass     = document.getElementById('p-pass').value;
  var msg      = document.getElementById('perfil-msg');
  var updates  = { nombre: nombre, apellido: apellido, email: email, tel: tel };
  if (pass.length >= 6) updates.password = pass;
  Storage.updateUser(userData.email, updates);
  userData = Object.assign({}, userData, updates);
  localStorage.setItem('macott_session', JSON.stringify({ nombre: nombre, apellido: apellido, email: email, tel: tel }));
  populateUserUI();
  msg.className = 'form-msg success'; msg.textContent = 'Perfil actualizado.';
  setTimeout(function() { msg.textContent = ''; msg.className = 'form-msg'; }, 3000);
});

var togglePassBtn = document.querySelector('.toggle-pass[data-target="p-pass"]');
if (togglePassBtn) {
  togglePassBtn.addEventListener('click', function() {
    var input = document.getElementById('p-pass');
    var show  = input.type === 'password';
    input.type  = show ? 'text' : 'password';
    this.textContent = show ? 'Ocultar' : 'Ver';
  });
}

// ===== VALIDACION =====
function vld(input, errId, msg) {
  var err = document.getElementById(errId);
  if (!input.value.trim()) { input.classList.add('invalid'); if (err) err.textContent = msg; return false; }
  input.classList.remove('invalid'); if (err) err.textContent = ''; return true;
}

// ===== NOTIFICACIONES =====
function renderNotificaciones() {
  var notifs = JSON.parse(localStorage.getItem('macott_notif_' + userData.email) || '[]');
  if (!notifs.length) return;

  // Mostrar badge en sidebar
  var citasBtn = document.querySelector('.ds-link[data-section="citas"]');
  var noLeidas = notifs.filter(function(n) { return !n.leida; }).length;
  if (citasBtn && noLeidas > 0) {
    var badge = citasBtn.querySelector('.notif-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'notif-badge';
      badge.style.cssText = 'background:#e53935;color:#fff;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;margin-left:auto;';
      citasBtn.appendChild(badge);
    }
    badge.textContent = noLeidas;
  }

  // Mostrar toast por cada notificación no leída
  notifs.forEach(function(n, i) {
    if (!n.leida) {
      setTimeout(function() {
        mostrarToastDash(n.msg);
      }, i * 500);
      n.leida = true;
    }
  });
  localStorage.setItem('macott_notif_' + userData.email, JSON.stringify(notifs));
}

function mostrarToastDash(msg) {
  var t = document.getElementById('dashToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'dashToast';
    t.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%) translateY(80px);background:#0d47a1;color:#fff;padding:.85rem 1.75rem;border-radius:50px;font-size:.9rem;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.25);transition:transform .3s,opacity .3s;opacity:0;white-space:nowrap;max-width:90vw;text-align:center;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(function() {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(80px)';
  }, 4000);
}

// ===== INIT =====
populateUserUI();
showSection('inicio');
renderNotificaciones();
