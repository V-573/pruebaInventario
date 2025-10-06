const API_URL = 'http://localhost:3000/api/productos';


let productos = [];
let indiceEditando = -1;

// Generar código único automáticamente
function generarCodigo() {
    return 'COD-' + Math.floor(Math.random() * 10000);
}

// Renderizar inventario

async function renderizarInventario() {

    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    cuerpoTabla.innerHTML = '';
    let totalProductos = 0;
    let totalValor = 0;

    try {
        const response = await fetch(API_URL);
        productos = await response.json();

        if (productos.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="6">No hay productos en el inventario.</td></tr>';
            document.getElementById('total-productos').textContent = '0';
            document.getElementById('total-valor').textContent = '$0';
            return;
        }

        productos.forEach((producto, index) => {
            const valorTotal = producto.precio * producto.cantidad;
            totalProductos++;
            totalValor += valorTotal;

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.cantidad}</td>
                <td>$${valorTotal.toFixed(2)}</td>
                <td>
                    <button class="editar" onclick="abrirModal(${index})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });

        document.getElementById('total-productos').textContent = totalProductos;
        document.getElementById('total-valor').textContent = '$' + totalValor.toFixed(2);
    } catch (error) {
        console.error('Error al obtener inventario:', error);
        cuerpoTabla.innerHTML = '<tr><td colspan="6">Error al conectar con el servidor.</td></tr>';
    }
}


// Limpiar campos del formulario
function limpiarCampos() {
    document.getElementById('codigo').value = generarCodigo();
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('cantidad').value = '';
}



async function agregarProducto() {
    const codigo = document.getElementById('codigo').value.trim() || generarCodigo();
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);

    if (!nombre || isNaN(precio) || isNaN(cantidad)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, nombre, precio, cantidad })

            
        });

        
    console.log('Código de respuesta:', response.status);
console.log('Respuesta JSON:', await response.clone().json());

        // 💡 Aceptamos tanto 200 como 201 como éxito
        if (response.status !== 200 && response.status !== 201) {
            const errorData = await response.json();
            alert(errorData.mensaje || 'Error al agregar producto');
            return;
        }

        // No es necesario leer el cuerpo, pero podrías hacerlo:
        // const data = await response.json();

        await renderizarInventario();
        limpiarCampos();
        alert('✅ Producto agregado correctamente.');
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('❌ No se pudo conectar con el servidor.');
    }

}



// Abrir modal para editar
function abrirModal(index) {
    indiceEditando = index;
    const producto = productos[index];
    document.getElementById('modal-titulo').textContent = 'Editar Producto';
    document.getElementById('modal-codigo').value = producto.codigo;
    document.getElementById('modal-nombre').value = producto.nombre;
    document.getElementById('modal-precio').value = producto.precio;
    document.getElementById('modal-cantidad').value = producto.cantidad;
    document.getElementById('modal').style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

// Guardar cambios en el modal


async function guardarCambios() {
    const codigo = document.getElementById('modal-codigo').value.trim();
    const nombre = document.getElementById('modal-nombre').value.trim();
    const precio = parseFloat(document.getElementById('modal-precio').value);
    const cantidad = parseInt(document.getElementById('modal-cantidad').value);

    if (!nombre || isNaN(precio) || isNaN(cantidad)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${codigo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, precio, cantidad })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.mensaje || 'Error al actualizar producto');
            return;
        }

        cerrarModal();
        await renderizarInventario();
        alert('✅ Producto actualizado correctamente.');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        alert('❌ No se pudo conectar con el servidor.');
    }
}


// Eliminar producto desde el modal


async function eliminarProductoModal() {
    const codigo = document.getElementById('modal-codigo').value.trim();
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const response = await fetch(`${API_URL}/${codigo}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.mensaje || 'Error al eliminar producto');
            return;
        }

        cerrarModal();
        await renderizarInventario();
        alert('🗑️ Producto eliminado correctamente.');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('❌ No se pudo conectar con el servidor.');
    }
}




// Buscar producto
function buscarProducto() {
    const busqueda = document.getElementById('search').value.toLowerCase();
    const resultados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.codigo.toLowerCase().includes(busqueda)
    );
    renderizarInventario(resultados);
}

// Inicializar
// document.getElementById('codigo').value = generarCodigo();
// renderizarInventario();

// Alternar entre modo claro/oscuro
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    const isDark = body.getAttribute('data-theme') === 'dark';

    if (isDark) {
        body.removeAttribute('data-theme');
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// Cargar tema guardado al iniciar
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const icon = document.getElementById('theme-icon');

    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
    } else {
        body.removeAttribute('data-theme');
        icon.className = 'fas fa-moon';
    }
}

// Cargar tema al iniciar la página
window.onload = function() {
    loadTheme();
    document.getElementById('codigo').value = generarCodigo();
    renderizarInventario();
};

