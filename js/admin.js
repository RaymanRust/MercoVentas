// Variables globales para administración
let productos = [];
let categorias = [];
let editandoCategoria = false;
let categoriaEditId = null;
let editandoProducto = false;
let productoEditId = null;

// Cargar datos del localStorage
function cargarDatosAdmin() {
    // Cargar productos
    const productosGuardados = localStorage.getItem('ferreteria_productos');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
    } else {
        // Inicializar array vacío si no hay productos
        productos = [];
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
    
    // Cargar logo
    const logoGuardado = localStorage.getItem('ferreteria_logo');
    const logoPreview = document.getElementById('current-logo-preview');
    if (logoGuardado && logoPreview) {
        logoPreview.src = logoGuardado;
    }
}

// Inicializar administración
document.addEventListener('DOMContentLoaded', function() {
    cargarDatosAdmin();
    inicializarAdmin();
});

function inicializarAdmin() {
    // Configurar menú de navegación
    configurarMenuAdmin();
    
    // Cargar sección inicial
    mostrarSeccion('logo-section');
    
    // Configurar eventos de logo
    configurarLogo();
    
    // Cargar categorías en el formulario de productos
    cargarCategoriasEnSelect();
    
    // Cargar categorías en la tabla
    cargarCategoriasTabla();
    
    // Cargar productos en la tabla
    cargarProductosTabla();
    
    // Configurar eventos de categorías
    configurarEventosCategorias();
    
    // Configurar eventos de productos
    configurarEventosProductos();
    
    // Configurar búsqueda en tabla de productos
    configurarBusquedaAdmin();
}

// Configurar menú de administración
function configurarMenuAdmin() {
    const menuItems = document.querySelectorAll('.admin-menu li');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Quitar clase activa de todos los elementos
            menuItems.forEach(i => i.classList.remove('active'));
            // Agregar clase activa al elemento clickeado
            this.classList.add('active');
            
            // Mostrar la sección correspondiente
            const sectionId = this.dataset.section;
            mostrarSeccion(sectionId);
        });
    });
}

// Mostrar sección de administración
function mostrarSeccion(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const seccion = document.getElementById(sectionId);
    if (seccion) {
        seccion.classList.add('active');
    }
}

// Configurar funcionalidad del logo
function configurarLogo() {
    const logoUploadArea = document.getElementById('logo-upload-area');
    const logoFileInput = document.getElementById('logo-file-input');
    const logoPreview = document.getElementById('logo-preview');
    const saveLogoBtn = document.getElementById('save-logo-btn');
    
    if (!logoUploadArea || !logoFileInput || !saveLogoBtn) return;
    
    // Al hacer clic en el área de subida
    logoUploadArea.addEventListener('click', function() {
        logoFileInput.click();
    });
    
    // Cuando se selecciona un archivo
    logoFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Verificar que sea una imagen
        if (!file.type.match('image.*')) {
            alert('Por favor, selecciona un archivo de imagen (JPG, PNG, etc.)');
            return;
        }
        
        // Verificar tamaño (2MB máximo)
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es demasiado grande. El tamaño máximo es 2MB.');
            return;
        }
        
        // Crear un objeto URL para la vista previa
        const reader = new FileReader();
        reader.onload = function(e) {
            if (logoPreview) {
                logoPreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa del logo">`;
            }
        };
        reader.readAsDataURL(file);
    });
    
    // Guardar logo
    saveLogoBtn.addEventListener('click', function() {
        const logoImg = logoPreview ? logoPreview.querySelector('img') : null;
        if (!logoImg) {
            alert('Primero debes seleccionar una imagen para el logo.');
            return;
        }
        
        // Guardar en localStorage
        localStorage.setItem('ferreteria_logo', logoImg.src);
        
        // Actualizar vista previa actual
        const currentLogo = document.getElementById('current-logo-preview');
        if (currentLogo) {
            currentLogo.src = logoImg.src;
        }
        
        alert('Logo guardado correctamente.');
        
        // Limpiar vista previa
        if (logoPreview) {
            logoPreview.innerHTML = '';
        }
        logoFileInput.value = '';
    });
}

// Cargar categorías en el select de productos
function cargarCategoriasEnSelect() {
    const categorySelect = document.getElementById('product-category');
    const categoryFilter = document.getElementById('category-filter');
    
    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            categorySelect.appendChild(option);
        });
    }
    
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
        categorias.forEach(categoria => {
            const optionFilter = document.createElement('option');
            optionFilter.value = categoria.id;
            optionFilter.textContent = categoria.nombre;
            categoryFilter.appendChild(optionFilter);
        });
    }
}

// Cargar categorías en la tabla
function cargarCategoriasTabla() {
    const tableBody = document.getElementById('categories-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (categorias.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay categorías registradas</td></tr>';
        return;
    }
    
    categorias.forEach(categoria => {
        // Contar productos en esta categoría
        const productosEnCategoria = productos.filter(p => p.categoria === categoria.nombre).length;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${categoria.id}</td>
            <td>${categoria.nombre}</td>
            <td><i class="fas ${categoria.icono}"></i> ${categoria.icono}</td>
            <td>${productosEnCategoria}</td>
            <td class="actions">
                <button class="btn-edit edit-category" data-id="${categoria.id}"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn-delete delete-category" data-id="${categoria.id}"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Configurar eventos de categorías
function configurarEventosCategorias() {
    const saveCategoryBtn = document.getElementById('save-category-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    
    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener('click', guardarCategoria);
    }
    
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', cancelarEdicionCategoria);
    }
    
    // Delegación de eventos para botones de editar y eliminar
    const categoriesTableBody = document.getElementById('categories-table-body');
    if (categoriesTableBody) {
        categoriesTableBody.addEventListener('click', function(e) {
            const target = e.target;
            
            // Editar categoría
            if (target.classList.contains('edit-category') || target.closest('.edit-category')) {
                const button = target.classList.contains('edit-category') ? target : target.closest('.edit-category');
                const categoryId = button.dataset.id;
                if (categoryId) {
                    editarCategoria(categoryId);
                }
            }
            
            // Eliminar categoría
            if (target.classList.contains('delete-category') || target.closest('.delete-category')) {
                const button = target.classList.contains('delete-category') ? target : target.closest('.delete-category');
                const categoryId = button.dataset.id;
                if (categoryId) {
                    eliminarCategoria(categoryId);
                }
            }
        });
    }
}

// Guardar categoría (nueva o editada)
function guardarCategoria() {
    const categoryIdInput = document.getElementById('category-id');
    const categoryNameInput = document.getElementById('category-name');
    const categoryIconInput = document.getElementById('category-icon');
    
    if (!categoryNameInput || !categoryIconInput) return;
    
    const id = categoryIdInput ? categoryIdInput.value : null;
    const nombre = categoryNameInput.value.trim();
    const icono = categoryIconInput.value.trim();
    
    // Validar campos
    if (!nombre) {
        alert('Por favor, ingresa un nombre para la categoría.');
        return;
    }
    
    if (!icono) {
        alert('Por favor, ingresa un icono para la categoría.');
        return;
    }
    
    if (editandoCategoria && id) {
        // Editar categoría existente
        const index = categorias.findIndex(c => c.id == id);
        if (index !== -1) {
            // Verificar si se cambió el nombre y actualizar productos relacionados
            const nombreViejo = categorias[index].nombre;
            if (nombreViejo !== nombre) {
                productos.forEach(producto => {
                    if (producto.categoria === nombreViejo) {
                        producto.categoria = nombre;
                    }
                });
                localStorage.setItem('ferreteria_productos', JSON.stringify(productos));
            }
            
            categorias[index] = { id: parseInt(id), nombre, icono };
        }
    } else {
        // Crear nueva categoría
        const newId = categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1;
        categorias.push({ id: newId, nombre, icono });
    }
    
    // Guardar en localStorage
    localStorage.setItem('ferreteria_categorias', JSON.stringify(categorias));
    
    // Recargar datos en las tablas
    cargarCategoriasTabla();
    cargarCategoriasEnSelect();
    cargarProductosTabla();
    
    // Limpiar formulario
    limpiarFormularioCategoria();
    
    // Mostrar mensaje
    alert(editandoCategoria ? 'Categoría actualizada correctamente.' : 'Categoría creada correctamente.');
    
    // Restablecer estado
    editandoCategoria = false;
    categoriaEditId = null;
    
    // Cambiar texto del botón
    const saveBtn = document.getElementById('save-category-btn');
    if (saveBtn) {
        saveBtn.textContent = 'Guardar Categoría';
    }
}

// Editar categoría
function editarCategoria(id) {
    const categoria = categorias.find(c => c.id == id);
    if (!categoria) return;
    
    // Llenar formulario con datos de la categoría
    const categoryIdInput = document.getElementById('category-id');
    const categoryNameInput = document.getElementById('category-name');
    const categoryIconInput = document.getElementById('category-icon');
    
    if (categoryIdInput) categoryIdInput.value = categoria.id;
    if (categoryNameInput) categoryNameInput.value = categoria.nombre;
    if (categoryIconInput) categoryIconInput.value = categoria.icono;
    
    // Cambiar estado a edición
    editandoCategoria = true;
    categoriaEditId = id;
    
    // Cambiar texto del botón
    const saveBtn = document.getElementById('save-category-btn');
    if (saveBtn) {
        saveBtn.textContent = 'Actualizar Categoría';
    }
    
    // Desplazar hacia el formulario
    const categoryForm = document.querySelector('.category-form');
    if (categoryForm) {
        categoryForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Eliminar categoría
function eliminarCategoria(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría? Los productos en esta categoría quedarán sin categoría asignada.')) {
        return;
    }
    
    const categoria = categorias.find(c => c.id == id);
    if (!categoria) return;
    
    // Eliminar categoría
    categorias = categorias.filter(c => c.id != id);
    
    // Actualizar productos que tenían esta categoría
    productos.forEach(producto => {
        if (producto.categoria === categoria.nombre) {
            producto.categoria = 'Sin categoría';
        }
    });
    
    // Guardar cambios
    localStorage.setItem('ferreteria_categorias', JSON.stringify(categorias));
    localStorage.setItem('ferreteria_productos', JSON.stringify(productos));
    
    // Recargar datos
    cargarCategoriasTabla();
    cargarCategoriasEnSelect();
    cargarProductosTabla();
    
    alert('Categoría eliminada correctamente.');
}

// Cancelar edición de categoría
function cancelarEdicionCategoria() {
    limpiarFormularioCategoria();
    editandoCategoria = false;
    categoriaEditId = null;
    
    const saveBtn = document.getElementById('save-category-btn');
    if (saveBtn) {
        saveBtn.textContent = 'Guardar Categoría';
    }
}

// Limpiar formulario de categoría
function limpiarFormularioCategoria() {
    const categoryIdInput = document.getElementById('category-id');
    const categoryNameInput = document.getElementById('category-name');
    const categoryIconInput = document.getElementById('category-icon');
    
    if (categoryIdInput) categoryIdInput.value = '';
    if (categoryNameInput) categoryNameInput.value = '';
    if (categoryIconInput) categoryIconInput.value = '';
}

// Configurar subida de imagen para productos
function configurarSubidaImagenProducto() {
    const imageInput = document.getElementById('product-image-input');
    const imagePreview = document.getElementById('product-image-preview');
    
    if (!imageInput) return;
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Verificar que sea una imagen
        if (!file.type.match('image.*')) {
            alert('Por favor, selecciona un archivo de imagen (JPG, PNG, etc.)');
            return;
        }
        
        // Verificar tamaño (2MB máximo)
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es demasiado grande. El tamaño máximo es 2MB.');
            return;
        }
        
        // Crear un objeto URL para la vista previa
        const reader = new FileReader();
        reader.onload = function(e) {
            if (imagePreview) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa del producto">`;
            }
            
            // Guardar como data URL en un campo oculto
            const imageUrlInput = document.getElementById('product-image-url');
            if (imageUrlInput) {
                imageUrlInput.value = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    });
}

// Cargar productos en la tabla de administración
function cargarProductosTabla() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (productos.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hay productos registrados</td></tr>';
        return;
    }
    
    productos.forEach(producto => {
        const categoria = categorias.find(c => c.nombre === producto.categoria);
        const categoriaNombre = categoria ? categoria.nombre : producto.categoria;
        
        // Manejar imagen (usar placeholder si no hay)
        let imagenSrc = producto.imagen || 'img/default-product.jpg';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.id}</td>
            <td><img src="${imagenSrc}" alt="${producto.nombre}" style="width:50px;height:50px;object-fit:cover; border-radius:4px;"></td>
            <td>${producto.nombre}</td>
            <td>${categoriaNombre}</td>
            <td>$${producto.precio ? producto.precio.toFixed(2) : '0.00'}</td>
            <td>${producto.stock || 0}</td>
            <td class="actions">
                <button class="btn-edit edit-product" data-id="${producto.id}"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn-delete delete-product" data-id="${producto.id}"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Configurar eventos de productos
function configurarEventosProductos() {
    const saveProductBtn = document.getElementById('save-product-btn');
    const cancelProductBtn = document.getElementById('cancel-product-btn');
    
    // Configurar subida de imagen
    configurarSubidaImagenProducto();
    
    // Guardar producto
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', guardarProducto);
    }
    
    // Cancelar edición
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', cancelarEdicionProducto);
    }
    
    // Delegación de eventos para botones de editar y eliminar
    const productsTableBody = document.getElementById('products-table-body');
    if (productsTableBody) {
        productsTableBody.addEventListener('click', function(e) {
            const target = e.target;
            
            // Editar producto
            if (target.classList.contains('edit-product') || target.closest('.edit-product')) {
                const button = target.classList.contains('edit-product') ? target : target.closest('.edit-product');
                const productId = button.dataset.id;
                if (productId) {
                    editarProducto(productId);
                }
            }
            
            // Eliminar producto
            if (target.classList.contains('delete-product') || target.closest('.delete-product')) {
                const button = target.classList.contains('delete-product') ? target : target.closest('.delete-product');
                const productId = button.dataset.id;
                if (productId) {
                    eliminarProducto(productId);
                }
            }
        });
    }
}

// Guardar producto (nuevo o editado) - CORREGIDO
function guardarProducto() {
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceRegularInput = document.getElementById('product-price-regular');
    const productCategorySelect = document.getElementById('product-category');
    const productImageUrlInput = document.getElementById('product-image-url');
    const productDescriptionInput = document.getElementById('product-description');
    const productStockInput = document.getElementById('product-stock');
    const productPrice200Input = document.getElementById('product-price-200');
    const productPrice500Input = document.getElementById('product-price-500');
    const productPrice1000Input = document.getElementById('product-price-1000');
    const productPrice3000Input = document.getElementById('product-price-3000');
    
    // Validar que existan los elementos
    if (!productNameInput || !productPriceRegularInput || !productCategorySelect || 
        !productDescriptionInput || !productStockInput) {
        alert('Error: No se pueden encontrar los campos del formulario.');
        return;
    }
    
    const id = productIdInput ? productIdInput.value : null;
    const nombre = productNameInput.value.trim();
    const precio = parseFloat(productPriceRegularInput.value);
    const categoriaId = productCategorySelect.value;
    const imagen = productImageUrlInput ? productImageUrlInput.value : '';
    const descripcion = productDescriptionInput.value.trim();
    const stock = parseInt(productStockInput.value);
    const precio200 = productPrice200Input && productPrice200Input.value ? parseFloat(productPrice200Input.value) : null;
    const precio500 = productPrice500Input && productPrice500Input.value ? parseFloat(productPrice500Input.value) : null;
    const precio1000 = productPrice1000Input && productPrice1000Input.value ? parseFloat(productPrice1000Input.value) : null;
    const precio3000 = productPrice3000Input && productPrice3000Input.value ? parseFloat(productPrice3000Input.value) : null;
    
    // Validar campos requeridos
    if (!nombre) {
        alert('Por favor, ingresa un nombre para el producto.');
        return;
    }
    
    if (isNaN(precio) || precio <= 0) {
        alert('Por favor, ingresa un precio base válido para el producto.');
        return;
    }
    
    if (!categoriaId) {
        alert('Por favor, selecciona una categoría para el producto.');
        return;
    }
    
    if (!descripcion) {
        alert('Por favor, ingresa una descripción para el producto.');
        return;
    }
    
    if (isNaN(stock) || stock < 0) {
        alert('Por favor, ingresa un stock válido para el producto.');
        return;
    }
    
    // Validar precios por volumen
    if (precio200 !== null && (isNaN(precio200) || precio200 <= 0)) {
        alert('Por favor, ingresa un precio válido para compras mayores a $200.');
        return;
    }
    
    if (precio500 !== null && (isNaN(precio500) || precio500 <= 0)) {
        alert('Por favor, ingresa un precio válido para compras mayores a $500.');
        return;
    }
    
    if (precio1000 !== null && (isNaN(precio1000) || precio1000 <= 0)) {
        alert('Por favor, ingresa un precio válido para compras mayores a $1000.');
        return;
    }
    
    if (precio3000 !== null && (isNaN(precio3000) || precio3000 <= 0)) {
        alert('Por favor, ingresa un precio válido para compras mayores a $3000.');
        return;
    }
    
    // Obtener nombre de la categoría
    const categoria = categorias.find(c => c.id == categoriaId);
    const categoriaNombre = categoria ? categoria.nombre : '';
    
    // Crear objeto del producto
    const nuevoProducto = {
        id: editandoProducto && id ? parseInt(id) : (productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1),
        nombre,
        descripcion,
        precio,
        precio200: precio200 !== null ? precio200 : precio,
        precio500: precio500 !== null ? precio500 : precio,
        precio1000: precio1000 !== null ? precio1000 : precio,
        precio3000: precio3000 !== null ? precio3000 : precio,
        categoria: categoriaNombre,
        imagen: imagen || 'img/default-product.jpg',
        stock
    };
    
    if (editandoProducto && id) {
        // Editar producto existente
        const index = productos.findIndex(p => p.id == id);
        if (index !== -1) {
            productos[index] = nuevoProducto;
        }
    } else {
        // Agregar nuevo producto
        productos.push(nuevoProducto);
    }
    
    // Guardar en localStorage
    localStorage.setItem('ferreteria_productos', JSON.stringify(productos));
    
    // Recargar tabla de productos
    cargarProductosTabla();
    
    // Limpiar formulario
    limpiarFormularioProducto();
    
    // Mostrar mensaje
    alert(editandoProducto ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
    
    // Restablecer estado
    editandoProducto = false;
    productoEditId = null;
    
    // Cambiar texto del botón
    const saveBtn = document.getElementById('save-product-btn');
    if (saveBtn) {
        saveBtn.textContent = 'Guardar Producto';
    }
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id == id);
    if (!producto) return;
    
    // Obtener ID de la categoría
    const categoria = categorias.find(c => c.nombre === producto.categoria);
    const categoriaId = categoria ? categoria.id : '';
    
    // Llenar formulario con datos del producto
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceRegularInput = document.getElementById('product-price-regular');
    const productCategorySelect = document.getElementById('product-category');
    const productImageUrlInput = document.getElementById('product-image-url');
    const productDescriptionInput = document.getElementById('product-description');
    const productStockInput = document.getElementById('product-stock');
    const productPrice200Input = document.getElementById('product-price-200');
    const productPrice500Input = document.getElementById('product-price-500');
    const productPrice1000Input = document.getElementById('product-price-1000');
    const productPrice3000Input = document.getElementById('product-price-3000');
    const imagePreview = document.getElementById('product-image-preview');
    
    if (productIdInput) productIdInput.value = producto.id;
    if (productNameInput) productNameInput.value = producto.nombre;
    if (productPriceRegularInput) productPriceRegularInput.value = producto.precio;
    if (productCategorySelect) productCategorySelect.value = categoriaId;
    if (productImageUrlInput) productImageUrlInput.value = producto.imagen || '';
    if (productDescriptionInput) productDescriptionInput.value = producto.descripcion;
    if (productStockInput) productStockInput.value = producto.stock || 0;
    if (productPrice200Input) productPrice200Input.value = producto.precio200 || producto.precio;
    if (productPrice500Input) productPrice500Input.value = producto.precio500 || producto.precio;
    if (productPrice1000Input) productPrice1000Input.value = producto.precio1000 || producto.precio;
    if (productPrice3000Input) productPrice3000Input.value = producto.precio3000 || producto.precio;
    
    // Mostrar vista previa de imagen
    if (imagePreview && producto.imagen) {
        imagePreview.innerHTML = `<img src="${producto.imagen}" alt="Vista previa del producto">`;
    }
    
    // Cambiar estado a edición
    editandoProducto = true;
    productoEditId = id;
    
    // Cambiar texto del botón
    const saveBtn = document.getElementById('save-product-btn');
    if (saveBtn) {
        saveBtn.textContent = 'Actualizar Producto';
    }
    
    // Desplazar hacia el formulario
    const productForm = document.querySelector('.product-form');
    if (productForm) {
        productForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Eliminar producto
function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }
    
    // Eliminar producto
    productos = productos.filter(p => p.id != id);
    
    // Guardar cambios
    localStorage.setItem('ferreteria_productos', JSON.stringify(productos));
    
    // Recargar tabla
    cargarProductosTabla();
    
    alert('Producto eliminado correctamente.');
}

// Cancelar edición de producto
function cancelarEdicionProducto() {
    limpiarFormularioProducto();
    editandoProducto = false;
    productoEditId = null;
    
    const saveBtn = document.getElementById('save-product-btn');
    if (saveBtn) {
        saveBtn.textContent = 'Guardar Producto';
    }
}

// Limpiar formulario de producto
function limpiarFormularioProducto() {
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceRegularInput = document.getElementById('product-price-regular');
    const productCategorySelect = document.getElementById('product-category');
    const productImageInput = document.getElementById('product-image-input');
    const productImageUrlInput = document.getElementById('product-image-url');
    const productImagePreview = document.getElementById('product-image-preview');
    const productDescriptionInput = document.getElementById('product-description');
    const productStockInput = document.getElementById('product-stock');
    const productPrice200Input = document.getElementById('product-price-200');
    const productPrice500Input = document.getElementById('product-price-500');
    const productPrice1000Input = document.getElementById('product-price-1000');
    const productPrice3000Input = document.getElementById('product-price-3000');
    
    if (productIdInput) productIdInput.value = '';
    if (productNameInput) productNameInput.value = '';
    if (productPriceRegularInput) productPriceRegularInput.value = '';
    if (productCategorySelect) productCategorySelect.value = '';
    if (productImageInput) productImageInput.value = '';
    if (productImageUrlInput) productImageUrlInput.value = '';
    if (productImagePreview) productImagePreview.innerHTML = '';
    if (productDescriptionInput) productDescriptionInput.value = '';
    if (productStockInput) productStockInput.value = '10';
    if (productPrice200Input) productPrice200Input.value = '';
    if (productPrice500Input) productPrice500Input.value = '';
    if (productPrice1000Input) productPrice1000Input.value = '';
    if (productPrice3000Input) productPrice3000Input.value = '';
}

// Configurar búsqueda en administración
function configurarBusquedaAdmin() {
    const productSearchInput = document.getElementById('product-search-admin');
    const categoryFilter = document.getElementById('category-filter');
    
    if (productSearchInput) {
        productSearchInput.addEventListener('input', function() {
            filtrarProductosTabla();
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filtrarProductosTabla();
        });
    }
}

// Filtrar productos en la tabla de administración
function filtrarProductosTabla() {
    const productSearchInput = document.getElementById('product-search-admin');
    const categoryFilter = document.getElementById('category-filter');
    const tableBody = document.getElementById('products-table-body');
    
    if (!productSearchInput || !categoryFilter || !tableBody) return;
    
    const searchTerm = productSearchInput.value.toLowerCase();
    const categoryId = categoryFilter.value;
    
    let productosFiltrados = productos;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm) || 
            producto.descripcion.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtrar por categoría
    if (categoryId) {
        const categoria = categorias.find(c => c.id == categoryId);
        if (categoria) {
            productosFiltrados = productosFiltrados.filter(producto => 
                producto.categoria === categoria.nombre
            );
        }
    }
    
    // Actualizar tabla con productos filtrados
    tableBody.innerHTML = '';
    
    if (productosFiltrados.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron productos</td></tr>';
        return;
    }
    
    productosFiltrados.forEach(producto => {
        const categoria = categorias.find(c => c.nombre === producto.categoria);
        const categoriaNombre = categoria ? categoria.nombre : producto.categoria;
        
        // Manejar imagen
        let imagenSrc = producto.imagen || 'img/default-product.jpg';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.id}</td>
            <td><img src="${imagenSrc}" alt="${producto.nombre}" style="width:50px;height:50px;object-fit:cover; border-radius:4px;"></td>
            <td>${producto.nombre}</td>
            <td>${categoriaNombre}</td>
            <td>$${producto.precio ? producto.precio.toFixed(2) : '0.00'}</td>
            <td>${producto.stock || 0}</td>
            <td class="actions">
                <button class="btn-edit edit-product" data-id="${producto.id}"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn-delete delete-product" data-id="${producto.id}"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}