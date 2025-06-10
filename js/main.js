const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total');
const btnVaciar = document.getElementById('vaciar-carrito');
const carritoHeader = document.getElementById('carrito-header');
const carritoDropdown = document.getElementById('carrito-dropdown');
const contadorCarrito = document.getElementById('contador-carrito');
let carrito = [];
// Evento para mostrar/ocultar el carrito al hacer clic en el ícono
carritoHeader.addEventListener('click', () => {
  if (carritoDropdown.style.display === 'none' || carritoDropdown.style.display === '') {
    carritoDropdown.style.display = 'block';
  } else {
    carritoDropdown.style.display = 'none';
  }
});
// Ocultar el carrito si se hace clic afuera del carrito
document.addEventListener('click', (e) => {
  if (!carritoHeader.contains(e.target) && !carritoDropdown.contains(e.target)) {
    carritoDropdown.style.display = 'none';
  }
});
// Cargar carrito desde localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
  cargarProductos();
});
// Cargar productos desde JSON
async function cargarProductos() {
  try {
    const res = await fetch('./data/productos.json');
    const productos = await res.json();
    const contenedores = document.querySelectorAll('.fotos-container');
    let index = 0;
    productos.forEach(producto => {
      const div = document.createElement('div');
      div.classList.add('item', 'producto');
      div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <button class="btn-comprar" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Comprar</button>
      `;
      if (contenedores[index]) {
        contenedores[index].appendChild(div);
        index = (index + 1) % contenedores.length;
      }
    });
    document.querySelectorAll('.btn-comprar').forEach(boton => {
      boton.addEventListener('click', (e) => {
        const nombre = boton.getAttribute('data-nombre');
        const precio = parseFloat(boton.getAttribute('data-precio'));
        agregarProducto({ nombre, precio, cantidad: 1 });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${nombre} agregado al carrito`,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          background: '#222',
          color: '#fff'
        });
      });
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}
// Agregar producto al carrito
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
// Actualizar HTML del carrito
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
// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}
// Botón para vaciar el carrito con confirmación SweetAlert2
btnVaciar.addEventListener('click', () => {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'El carrito ya está vacío',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }
  Swal.fire({
    title: '¿Estás seguro de vaciar el carrito?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      actualizarCarrito();
      carritoDropdown.style.display = 'none';
      Swal.fire({
        icon: 'success',
        title: 'Carrito vaciado',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
});
const btnFinalizar = document.getElementById('finalizar-compra');
btnFinalizar.addEventListener('click', () => {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Tu carrito está vacío',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }
  // Construir el resumen en formato HTML para SweetAlert2
  let resumenHTML = '<ul style="text-align:left;">';
  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    resumenHTML += `<li>${item.nombre} x${item.cantidad} - $${subtotal.toFixed(2)}</li>`;
    total += subtotal;
  });
  resumenHTML += `</ul><hr><strong>Total a pagar: $${total.toFixed(2)}</strong>`;
  Swal.fire({
    title: 'Resumen de tu compra',
    html: resumenHTML,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Confirmar compra',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      actualizarCarrito();
      carritoDropdown.style.display = 'none';
      Swal.fire({
        icon: 'success',
        title: 'Compra realizada con éxito',
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
});
