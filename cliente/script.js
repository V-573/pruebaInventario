


const API_URL = 'http://localhost:3000/api/productos';
let inventario = [];

// ✅ Cargar inventario desde el backend
async function mostrar() {
  try {
    const response = await fetch(API_URL);
    inventario = await response.json();

    if (inventario.length === 0) {
      contenedor.innerHTML = "<p>No hay productos en el inventario.</p>";
      return;
    }

    let html = `
      <table>
        <tr>
          <th>Producto</th>
          <th>Código</th>
          <th>Cantidad</th>
          <th>Precio</th>
        </tr>
    `;

    inventario.forEach(p => {
      html += `
        <tr>
          <td>${p.producto}</td>
          <td>${p.codigo}</td>
          <td>${p.cantidad}</td>
          <td>$${p.precio}</td>
        </tr>
      `;
    });

    html += '</table>';
    contenedor.innerHTML = html;

  } catch (error) {
    contenedor.innerHTML = "<p>Error al conectar con el servidor.</p>";
    console.error(error);
  }
}

// ✅ Agregar producto
async function agregar() {
  const producto = prompt("Nombre del producto:");
  const codigo = prompt("Código:");
  const cantidad = parseInt(prompt("Cantidad:"), 10);
  const precio = parseFloat(prompt("Precio:"));

  if (!producto || !codigo || isNaN(cantidad) || isNaN(precio)) {
    alert("Datos inválidos.");
    return;
  }

  const nuevo = { producto, codigo, cantidad, precio };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Producto agregado correctamente ✅");
      mostrar();
    } else {
      alert("Error: " + data.mensaje);
    }
  } catch (error) {
    alert("Error de conexión con el servidor");
  }
}



// ✅ Editar producto
async function editar() {
  const codigo = prompt("Código del producto a editar:");
  const cantidad = parseInt(prompt("Nueva cantidad:"), 10);
  const precio = parseFloat(prompt("Nuevo precio:"));

  if (!codigo || isNaN(cantidad) || isNaN(precio)) {
    alert("Datos inválidos.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad, precio })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Producto actualizado ✅");
      mostrar();
    } else {
      alert("Error: " + data.mensaje);
    }
  } catch (error) {
    alert("Error de conexión con el servidor");
  }
}



// ✅ Eliminar producto
async function eliminar() {
  const codigo = prompt("Código del producto a eliminar:");

  if (!codigo) return;

  try {
    const res = await fetch(`${API_URL}/${codigo}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      alert(data.mensaje);
      mostrar();
    } else {
      alert("Error: " + data.mensaje);
    }
  } catch (error) {
    alert("Error de conexión con el servidor");
  }
}

// Cargar automáticamente la tabla al iniciar
document.addEventListener('DOMContentLoaded', mostrar);
