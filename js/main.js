const carrito = [];
function agregarProducto() {
    let nombre = prompt("Ingrese el nombre del producto:");
    let precio = parseFloat(prompt("Ingrese el precio de " + nombre + ":"));
    carrito.push({ nombre, precio });
}
function mostrarCarrito() {
    let total = 0;
    console.log("Carrito de Compras:");
    carrito.forEach((item, index) => {
        console.log((index + 1) + ". " + item.nombre + " - $" + item.precio);
        total += item.precio;
    });
    console.log("Total: $" + total);
    alert("Total acumulado: $" + total);
}
function iniciarSimulador() {
    alert("¡Bienvenido al Simulador de Compras!");
    let continuar = confirm("¿Querés comenzar a comprar?");
    while (continuar) {
        agregarProducto();
        mostrarCarrito();
        continuar = confirm("¿Querés agregar otro producto?");
    }
    mostrarCarrito();
    confirm("¿Querés confirmar la compra?") 
        ? alert("¡Compra confirmada! Gracias por usar el simulador.")
        : alert("Compra cancelada.");
}
iniciarSimulador();