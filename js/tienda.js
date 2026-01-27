// Datos iniciales
let productos = [];
let categorias = [];
let carrito = [];

// Cargar datos del localStorage
function cargarDatos() {
    // Cargar productos
    const productosGuardados = localStorage.getItem('ferreteria_productos');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
    } else {
        // Datos por defecto
        productos = [
            {
                id: 1,
                nombre: "Martillo de Carpintero",
                descripcion: "Martillo profesional con mango de fibra de vidrio",
                precio: 15.99,
                precio200: 15.50,
                precio500: 14.99,
                precio1000: 14.50,
                precio3000: 13.99,
                categoria: "Herramientas Manuales",
                imagen: "img/productos/martillo.jpg",
                stock: 25
            },
            {
                id: 2,
                nombre: "Taladro Inalámbrico",
                descripcion: "Taladro percutor 18V con 2 baterías y cargador",
                precio: 89.99,
                precio200: 87.50,
                precio500: 85.99,
                precio1000: 82.50,
                precio3000: 79.99,
                categoria: "Herramientas Eléctricas",
                imagen: "img/productos/taladro.jpg",
                stock: 12
            },
            {
                id: 3,
                nombre: "Juego de Llaves Mixtas",
                descripcion: "Juego de 10 llaves mixtas de 8mm a 19mm",
                precio: 24.50,
                precio200: 23.80,
                precio500: 23.00,
                precio1000: 22.20,
                precio3000: 21.50,
                categoria: "Herramientas Manuales",
                imagen: "img/productos/llaves.jpg",
                stock: 18
            }
        ];
        localStorage.setItem('ferreteria_productos', JSON.stringify(productos));
    }
    
    // Cargar categorías
    const categoriasGuardadas = localStorage.getItem('ferreteria_categorias');
    if (categoriasGuardadas) {
        categorias = JSON.parse(categoriasGuardadas);
    } else {
        // Categorías por defecto
        categorias = [
            { id: 1, nombre: "Herramientas Manuales", icono: "fa-hammer" },
            { id: 2, nombre: "Herramientas Eléctricas", icono: "fa-plug" },
            { id: 3, nombre: "Pinturas y Accesorios", icono: "fa-paint-roller" },
            { id: 4, nombre: "Materiales de Construcción", icono: "fa-cubes" },
            { id: 5, nombre: "Fijaciones y Tornillería", icono: "fa-screwdriver" },
            { id: 6, nombre: "Equipos de Seguridad", icono: "fa-hard-hat" }
        ];
        localStorage.setItem('ferreteria_categorias', JSON.stringify(categorias));
    }
    
    // Cargar carrito
    const carritoGuardado = localStorage.getItem('ferreteria_carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    
    // Cargar logo
    const logoGuardado = localStorage.getItem('ferreteria_logo');
    if (logoGuardado) {
        const logoElements = document.querySelectorAll('#store-logo, #current-logo-preview');
        logoElements.forEach(logo => {
            if (logo) logo.src = logoGuardado;
        });
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    inicializarTienda();
});

function inicializarTienda() {
    // Cargar categorías
    cargarCategorias();
    
    // Cargar productos
    cargarProductos();
    
    // Cargar carrito
    actualizarCarrito();
    
    // Configurar búsqueda
    configurarBusqueda();
    
    // Configurar eventos
    configurarEventos();
    
    // Configurar carrito móvil
    configurarCarritoMovil();
}

// Cargar categorías en la lista
function cargarCategorias() {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;
    
    categoriesList.innerHTML = '';
    
    // Agregar categoría "Todas"
    const allCategory = document.createElement('li');
    allCategory.className = 'category-item active';
    allCategory.innerHTML = '<i class="fas fa-th-large"></i> Todas las categorías';
    allCategory.dataset.category = 'all';
    allCategory.addEventListener('click', function() {
        // Quitar activo de todas las categorías
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
        cargarProductos();
    });
    categoriesList.appendChild(allCategory);
    
    // Agregar cada categoría
    categorias.forEach(categoria => {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `<i class="fas ${categoria.icono}"></i> ${categoria.nombre}`;
        categoryItem.dataset.category = categoria.id;
        categoryItem.addEventListener('click', function() {
            // Quitar activo de todas las categorías
            document.querySelectorAll('.category-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            filtrarProductosPorCategoria(categoria.id);
        });
        categoriesList.appendChild(categoryItem);
    });
}

// Cargar productos en la lista
function cargarProductos(categoriaId = 'all') {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;
    
    productsList.innerHTML = '';
    
    let productosFiltrados = productos;
    
    if (categoriaId !== 'all') {
        const categoria = categorias.find(cat => cat.id == categoriaId);
        if (categoria) {
            productosFiltrados = productos.filter(producto => {
                return producto.categoria === categoria.nombre;
            });
        }
    }
    
    if (productosFiltrados.length === 0) {
        productsList.innerHTML = '<p class="no-products">No hay productos en esta categoría.</p>';
        return;
    }
    
    productosFiltrados.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Usar imagen por defecto si no hay imagen específica
        const imagenSrc = producto.imagen && producto.imagen.startsWith('data:') 
            ? producto.imagen 
            : (producto.imagen || 'img/default-product.jpg');
        
        productCard.innerHTML = `
            <img src="${imagenSrc}" alt="${producto.nombre}" class="product-image" onerror="this.onerror=null; this.src='img/default-product.jpg'">
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p class="product-description">${producto.descripcion}</p>
                <div class="product-price">$${producto.precio.toFixed(2)}</div>
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${producto.id}">-</button>
                        <input type="number" class="quantity-input" id="qty-${producto.id}" value="1" min="1" max="${producto.stock}">
                        <button class="quantity-btn plus" data-id="${producto.id}">+</button>
                    </div>
                    <button class="btn-add-cart" data-id="${producto.id}">Añadir al Carrito</button>
                </div>
            </div>
        `;
        productsList.appendChild(productCard);
    });
    
    // Agregar eventos a los botones recién creados
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const quantityInput = document.getElementById(`qty-${productId}`);
            const quantity = parseInt(quantityInput.value);
            agregarAlCarrito(productId, quantity);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const quantityInput = document.getElementById(`qty-${productId}`);
            let currentValue = parseInt(quantityInput.value);
            const producto = productos.find(p => p.id === productId);
            if (producto && currentValue < producto.stock) {
                quantityInput.value = currentValue + 1;
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const quantityInput = document.getElementById(`qty-${productId}`);
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    });
}

// Filtrar productos por categoría
function filtrarProductosPorCategoria(categoriaId) {
    cargarProductos(categoriaId);
}

// Configurar funcionalidad de búsqueda
function configurarBusqueda() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.style.display = 'none';
            return;
        }
        
        // Filtrar productos que coincidan con la búsqueda
        const resultados = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(query) || 
            producto.descripcion.toLowerCase().includes(query)
        );
        
        // Mostrar resultados
        mostrarResultadosBusqueda(resultados, query);
    });
    
    // Ocultar resultados al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (searchResults && e.target !== searchInput && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// Mostrar resultados de búsqueda
function mostrarResultadosBusqueda(resultados, query) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (resultados.length === 0) {
        searchResults.innerHTML = `<div class="search-result-item">No se encontraron productos para "${query}"</div>`;
        searchResults.style.display = 'block';
        return;
    }
    
    let html = '';
    resultados.forEach(producto => {
        html += `
            <div class="search-result-item" data-id="${producto.id}">
                <div class="search-result-name">${producto.nombre}</div>
                <div class="search-result-price">$${producto.precio.toFixed(2)}</div>
            </div>
        `;
    });
    
    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
    
    // Agregar eventos a los resultados
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            mostrarProductoModal(productId);
        });
    });
}

// Mostrar producto en modal
function mostrarProductoModal(productId) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;
    
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-product-details');
    
    if (!modal || !modalContent) return;
    
    // Usar imagen por defecto si no hay imagen específica
    const imagenSrc = producto.imagen && producto.imagen.startsWith('data:') 
        ? producto.imagen 
        : (producto.imagen || 'img/default-product.jpg');
    
    modalContent.innerHTML = `
        <div class="modal-product">
            <img src="${imagenSrc}" alt="${producto.nombre}" class="modal-product-image" onerror="this.onerror=null; this.src='img/default-product.jpg'">
            <h2>${producto.nombre}</h2>
            <p class="modal-product-description">${producto.descripcion}</p>
            <div class="modal-product-price">Precio: $${producto.precio.toFixed(2)}</div>
            <div class="modal-product-category">Categoría: ${producto.categoria}</div>
            <div class="modal-product-stock">Disponible: ${producto.stock} unidades</div>
            <div class="modal-product-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${producto.id}">-</button>
                    <input type="number" class="quantity-input" id="modal-qty-${producto.id}" value="1" min="1" max="${producto.stock}">
                    <button class="quantity-btn plus" data-id="${producto.id}">+</button>
                </div>
                <button class="btn-add-cart" data-id="${producto.id}">Añadir al Carrito</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Configurar eventos en el modal
    const addCartBtn = modalContent.querySelector('.btn-add-cart');
    if (addCartBtn) {
        addCartBtn.addEventListener('click', function() {
            const quantityInput = document.getElementById(`modal-qty-${producto.id}`);
            const quantity = parseInt(quantityInput.value);
            agregarAlCarrito(productId, quantity);
            modal.style.display = 'none';
        });
    }
    
    const plusBtn = modalContent.querySelector('.quantity-btn.plus');
    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            const quantityInput = document.getElementById(`modal-qty-${producto.id}`);
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < producto.stock) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    const minusBtn = modalContent.querySelector('.quantity-btn.minus');
    if (minusBtn) {
        minusBtn.addEventListener('click', function() {
            const quantityInput = document.getElementById(`modal-qty-${producto.id}`);
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
}

// Configurar eventos generales
function configurarEventos() {
    // Cerrar modal
    const closeModal = document.querySelector('.close-modal');
    const modal = document.getElementById('product-modal');
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Enviar pedido por WhatsApp
    const sendOrderBtn = document.getElementById('send-order-btn');
    if (sendOrderBtn) {
        sendOrderBtn.addEventListener('click', enviarPedidoWhatsApp);
    }
    
    // Menú móvil
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const leftSidebar = document.querySelector('.left-sidebar');
            if (leftSidebar) {
                leftSidebar.style.display = leftSidebar.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
}

// Configurar carrito móvil
function configurarCarritoMovil() {
    const cartMobileToggle = document.querySelector('.cart-mobile-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartMobile = document.querySelector('.close-cart-mobile');
    
    if (cartMobileToggle && cartSidebar) {
        cartMobileToggle.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCartMobile && cartSidebar) {
        closeCartMobile.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Cerrar carrito al hacer clic fuera en móvil
    if (cartSidebar) {
        window.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024 && cartSidebar.classList.contains('active')) {
                if (cartSidebar && !cartSidebar.contains(e.target) && 
                    cartMobileToggle && !cartMobileToggle.contains(e.target)) {
                    cartSidebar.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    }
}

// Obtener precio según el nivel (corregido)
function obtenerPrecioPorNivel(producto, totalActual) {
    if (!producto) return 0;
    
    if (totalActual >= 3000 && producto.precio3000 !== undefined) {
        return producto.precio3000;
    } else if (totalActual >= 1000 && producto.precio1000 !== undefined) {
        return producto.precio1000;
    } else if (totalActual >= 500 && producto.precio500 !== undefined) {
        return producto.precio500;
    } else if (totalActual >= 200 && producto.precio200 !== undefined) {
        return producto.precio200;
    } else {
        return producto.precio;
    }
}

// Calcular total del carrito (nueva función)
function calcularTotalCarrito() {
    if (carrito.length === 0) return 0;
    
    // Primero calculamos el subtotal con precios base
    let subtotalBase = 0;
    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (producto) {
            subtotalBase += producto.precio * item.cantidad;
        }
    });
    
    // Luego recalculamos con precios por volumen
    let total = 0;
    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (producto) {
            const precioFinal = obtenerPrecioPorNivel(producto, subtotalBase);
            total += precioFinal * item.cantidad;
        }
    });
    
    return total;
}

// Carrito de compras - CORREGIDO
function agregarAlCarrito(productId, cantidad) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }
    
    // Verificar stock
    if (cantidad <= 0) {
        mostrarNotificacion('La cantidad debe ser mayor a 0', 'error');
        return;
    }
    
    if (cantidad > producto.stock) {
        mostrarNotificacion(`No hay suficiente stock. Solo quedan ${producto.stock} unidades.`, 'error');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const itemExistenteIndex = carrito.findIndex(item => item.id === productId);
    
    if (itemExistenteIndex !== -1) {
        // Producto ya existe en carrito
        const cantidadTotal = carrito[itemExistenteIndex].cantidad + cantidad;
        
        // Verificar que no exceda el stock al sumar
        if (cantidadTotal > producto.stock) {
            mostrarNotificacion(`No puedes agregar más de ${producto.stock} unidades de este producto. Ya tienes ${carrito[itemExistenteIndex].cantidad} en el carrito.`, 'error');
            return;
        }
        
        // Actualizar cantidad
        carrito[itemExistenteIndex].cantidad = cantidadTotal;
    } else {
        // Producto nuevo en carrito
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio, // Precio base inicial
            imagen: producto.imagen,
            cantidad: cantidad
        });
    }
    
    // Actualizar carrito en localStorage y en la UI
    guardarCarrito();
    actualizarCarrito();
    
    // Mostrar confirmación
    mostrarNotificacion(`Se agregó ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de "${producto.nombre}" al carrito`);
}

// Eliminar producto del carrito
function eliminarDelCarrito(productId) {
    carrito = carrito.filter(item => item.id !== productId);
    guardarCarrito();
    actualizarCarrito();
    
    mostrarNotificacion('Producto eliminado del carrito');
}

// Actualizar cantidad en carrito
function actualizarCantidadCarrito(productId, nuevaCantidad) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;
    
    if (nuevaCantidad < 1) {
        eliminarDelCarrito(productId);
        return;
    }
    
    if (nuevaCantidad > producto.stock) {
        mostrarNotificacion(`No hay suficiente stock. Solo quedan ${producto.stock} unidades.`, 'error');
        return;
    }
    
    const itemIndex = carrito.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        carrito[itemIndex].cantidad = nuevaCantidad;
        guardarCarrito();
        actualizarCarrito();
    }
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('ferreteria_carrito', JSON.stringify(carrito));
}

// Actualizar visualización del carrito - CORREGIDO
function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    
    // Actualizar contador móvil
    if (cartCountMobile) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        cartCountMobile.textContent = totalItems;
    }
    
    if (carrito.length === 0) {
        if (cartItems) cartItems.innerHTML = '<p class="empty-cart-message">El carrito está vacío</p>';
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        if (totalElement) totalElement.textContent = '$0.00';
        return;
    }
    
    // Calcular total usando la nueva función
    const total = calcularTotalCarrito();
    
    // Actualizar valores
    if (subtotalElement) subtotalElement.textContent = `$${total.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Actualizar lista de productos en el carrito
    if (cartItems) {
        let html = '';
        
        // Calcular subtotal base para determinar precios
        let subtotalBase = 0;
        carrito.forEach(item => {
            const producto = productos.find(p => p.id === item.id);
            if (producto) {
                subtotalBase += producto.precio * item.cantidad;
            }
        });
        
        carrito.forEach(item => {
            const producto = productos.find(p => p.id === item.id);
            if (producto) {
                const precioFinal = obtenerPrecioPorNivel(producto, subtotalBase);
                const imagenSrc = producto.imagen && producto.imagen.startsWith('data:') 
                    ? producto.imagen 
                    : (producto.imagen || 'img/default-product.jpg');
                
                html += `
                    <div class="cart-item">
                        <img src="${imagenSrc}" alt="${producto.nombre}" class="cart-item-image" onerror="this.onerror=null; this.src='img/default-product.jpg'">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${producto.nombre}</div>
                            <div class="cart-item-price">$${precioFinal.toFixed(2)} c/u</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <input type="number" class="cart-quantity-input" value="${item.cantidad}" min="1" max="${producto.stock}" data-id="${item.id}">
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            }
        });
        
        cartItems.innerHTML = html;
        
        // Agregar eventos a los elementos del carrito
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                eliminarDelCarrito(productId);
            });
        });
        
        document.querySelectorAll('.cart-quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.dataset.id);
                const nuevaCantidad = parseInt(this.value);
                actualizarCantidadCarrito(productId, nuevaCantidad);
            });
        });
        
        document.querySelectorAll('.cart-item .quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const item = carrito.find(item => item.id === productId);
                if (item) {
                    actualizarCantidadCarrito(productId, item.cantidad + 1);
                }
            });
        });
        
        document.querySelectorAll('.cart-item .quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const item = carrito.find(item => item.id === productId);
                if (item) {
                    actualizarCantidadCarrito(productId, item.cantidad - 1);
                }
            });
        });
    }
}

// Enviar pedido por WhatsApp - CORREGIDO
function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío. Agrega productos antes de enviar el pedido.', 'error');
        return;
    }
    
    // Calcular total
    const total = calcularTotalCarrito();
    
    // Crear mensaje para WhatsApp
    let mensaje = `¡Hola! Quiero realizar el siguiente pedido:\n\n`;
    
    // Calcular subtotal base para determinar precios
    let subtotalBase = 0;
    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (producto) {
            subtotalBase += producto.precio * item.cantidad;
        }
    });
    
    carrito.forEach((item, index) => {
        const producto = productos.find(p => p.id === item.id);
        if (producto) {
            const precioFinal = obtenerPrecioPorNivel(producto, subtotalBase);
            const subtotalItem = precioFinal * item.cantidad;
            mensaje += `${index + 1}. ${item.nombre} - ${item.cantidad} x $${precioFinal.toFixed(2)} = $${subtotalItem.toFixed(2)}\n`;
        }
    });
    
    mensaje += `\nTotal a pagar: $${total.toFixed(2)}\n\n`;
    mensaje += `Gracias.`;
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Número de WhatsApp (cambiar por el número real)
    const telefono = '+5353814548';
    
    // Crear URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp en una nueva ventana
    window.open(urlWhatsApp, '_blank');
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = mensaje;
    
    // Estilos según tipo
    const bgColor = tipo === 'error' ? '#e74c3c' : '#2ecc71';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Agregar al cuerpo
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos para la animación de notificación si no existen
if (!document.querySelector('style[data-notification-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notification-styles', 'true');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}