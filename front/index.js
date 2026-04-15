const carritoCantidad    = document.getElementById('carrito-cantidad');
const carritoItemsDiv    = document.getElementById('carrito-item');
const totalCarritoSpan   = document.getElementById('total-carrito');
const cerrarCarritoBtn   = document.getElementById('cerrar-carrito');
const finalizarCompraBtn = document.getElementById('finalizar-compra');
const carritoPanel       = document.querySelector('.carrito-panel');
const botonCarrito       = document.querySelector('.carrito');
const arribaBtn          = document.querySelector('.arriba');
const panelCrearCuenta   = document.querySelector('.creaCuenta');
const panelInicioSesion  = document.querySelector('.inicioSesion');
const body               = document.querySelector('.body');
const opacidad           = document.querySelector('.opacidad');
const salirProductos     = document.getElementById('salirBtn');
const contenedorProductos = document.getElementById('contenedor-productos');
const paginaMujer        = document.querySelector('.pagina-mujer');
const paginaHombre       = document.querySelector('.pagina-hombre');
const paginaNiño         = document.querySelector('.pagina-niños');

let carrito = [];

// PRODUCTOS
function abrirProducto(genero) {
  contenedorProductos.style.display = 'flex';
  opacidad.style.display = 'block';
  body.style.overflow = 'hidden';
  mostrarGenero(genero);
}

function mostrarGenero(genero) {
  paginaHombre.style.display = genero === 'hombre' ? 'flex' : 'none';
  paginaMujer.style.display  = genero === 'mujer'  ? 'flex' : 'none';
  paginaNiño.style.display = genero === 'niños' ? 'flex' : 'none';
}

function mostrarMujer()  { abrirProducto('mujer');  }
function mostrarHombre() { abrirProducto('hombre'); }
function mostrarNiños()  { abrirProducto('niños');  }

salirProductos.addEventListener('click', () => {
  contenedorProductos.style.display = 'none';
  opacidad.style.display = 'none';
  body.style.overflow = 'auto';
});

// LOCAL STORAGE
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
}

// LÓGICA DEL CARRITO
function actualizarCarrito() {
  carritoItemsDiv.innerHTML = '';
  if (carrito.length === 0) {
    carritoItemsDiv.innerHTML = '<p id="carrito-vacio">Tu carrito está vacío</p>';
    carritoCantidad.textContent = '0';
    totalCarritoSpan.textContent = '0';
    return;
  }
  let total = 0;
  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;
    const div = document.createElement('div');
    div.style.cssText = `
      display: flex; justify-content: space-between; gap: 20px;
      align-items: center; padding: 8px 10px; margin: 10px 0;
      border-bottom: 1px solid #ebe7e7; background-color: #f0f0f0;
      border-radius: 5px;
    `;
    div.innerHTML = `
      <img src="${item.imagen}" style="width:auto; height:50px; object-fit:cover;">
      <span style="width:100%; text-align:start;">${item.nombre}</span>
      <span style="font-weight:bold; color:#999; background-color:#ccc; padding:0 10px; border-radius:3px;">${item.cantidad}</span>
      <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
      <button onclick="eliminarItem(${index})" style="background:none; border:none; cursor:pointer; color:red;">✕</button>
    `;
    carritoItemsDiv.appendChild(div);
  });
  carritoCantidad.textContent = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  totalCarritoSpan.textContent = total.toLocaleString();
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

function agregarAlCarrito(nombre, precio, imagen) {
  const existente = carrito.find(i => i.nombre === nombre);
  if (existente) { existente.cantidad++; }
  else { carrito.push({ imagen, nombre, precio, cantidad: 1 }); }
  guardarCarrito();
  actualizarCarrito();
}

// EVENTOS
document.querySelectorAll('.promo button').forEach(button => {
  button.addEventListener('click', () => {
    const nombre = button.dataset.nombre;
    const precio = parseInt(button.dataset.precio);
    const imagen = button.closest('.promo').querySelector('img').getAttribute('src');
    agregarAlCarrito(nombre, precio, imagen);
    carritoPanel.style.display = 'block';
  });
});

botonCarrito.addEventListener('click', () => {
  carritoPanel.style.display = carritoPanel.style.display === 'block' ? 'none' : 'block';
});

cerrarCarritoBtn.addEventListener('click', () => {
  carritoPanel.style.display = 'none';
});

arribaBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (finalizarCompraBtn) {
  finalizarCompraBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('Tu carrito esta vacio');
    } else {
      alert('¡Gracias por tu compra!');
      carrito = [];
      guardarCarrito();
      actualizarCarrito();
      carritoPanel.style.display = 'none';
    }
  });
}

// FORMULARIOS
function mostrarCrearCuenta() {
  panelCrearCuenta.style.display = 'flex';
  panelInicioSesion.style.display = 'none';
  body.style.overflow = 'hidden';
  opacidad.style.display = 'block';
}
function mostrarInicioSesion() {
  panelInicioSesion.style.display = 'flex';
  panelCrearCuenta.style.display = 'none';
  body.style.overflow = 'hidden';
  opacidad.style.display = 'block';
}
function cerrarFormularios() {
  panelCrearCuenta.style.display = 'none';
  panelInicioSesion.style.display = 'none';
  contenedorProductos.style.display = 'none'; // también cierra productos con Escape
  body.style.overflow = 'auto';
  opacidad.style.display = 'none';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarFormularios();
});

opacidad.addEventListener('click', cerrarFormularios);

arribaBtn.addEventListener('click', () => {
  window.scroll({top: 0, behavior: 'smooth'})
})
cargarCarrito();
