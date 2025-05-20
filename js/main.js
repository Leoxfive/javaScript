const botonesComprar = document.querySelectorAll('.btn-comprar');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total');
const btnVaciar = document.getElementById('vaciar-carrito');
const carritoHeader = document.getElementById('carrito-header');
const carritoDropdown = document.getElementById('carrito-dropdown');
const contadorCarrito = document.getElementById('contador-carrito');
let carrito = [];
carritoHeader.addEventListener('click', () => {
  if (carritoDropdown.style.display === 'none' || carritoDropdown.style.display === '') {
    carritoDropdown.style.display = 'block';
  } else {
    carritoDropdown.style.display = 'none';
  }
});
document.addEventListener('click', (e) => {
  if (!carritoHeader.contains(e.target) && !carritoDropdown.contains(e.target)) {
    carritoDropdown.style.display = 'none';
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
});
botonesComprar.forEach(boton => {
  boton.addEventListener('click', () => {
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));
    agregarProducto({ nombre, precio, cantidad: 1 });
  });
});
function agregarProducto(producto) {
  const existe = carrito.find(item => item.nombre === producto.nombre);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push(producto);
  }
  guardarCarrito();
  actualizarCarrito();
}
function actualizarCarrito() {
  listaCarrito.innerHTML = '';

  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;
    listaCarrito.appendChild(li);

    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;
  });

  totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
  contadorCarrito.textContent = cantidadTotal > 0 ? cantidadTotal : '';

  guardarCarrito();
}
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}
btnVaciar.addEventListener('click', () => {
  carrito = [];
  actualizarCarrito();
  carritoDropdown.style.display = 'none';
});