let adminProducts = [];
let categories = [
    { id: 1, name: 'Herramientas', description: 'Herramientas manuales y eléctricas', productCount: 0 },
    { id: 2, name: 'Electricidad', description: 'Materiales eléctricos y cables', productCount: 0 },
    { id: 3, name: 'Fontanería', description: 'Tuberías, llaves y accesorios', productCount: 0 },
    { id: 4, name: 'Pintura', description: 'Pinturas, brochas y rodillos', productCount: 0 },
    { id: 5, name: 'Jardín', description: 'Herramientas y productos para jardinería', productCount: 0 },
    { id: 6, name: 'Seguridad', description: 'Equipos de protección personal', productCount: 0 },
    { id: 7, name: 'Materiales de construcción', description: 'Cemento, ladrillos, arena', productCount: 0 }
];

let whatsappNumber = "1 555 1234567";
let currentProductId = null;
let currentCategoryId = null;
let confirmAction = null;
let confirmCallback = null;

document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    initAdminUI();
    showSection('dashboard');
    updateStats();
    loadProductsTable();
    loadCategoriesGrid();
});

function initAdminUI() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('¿Está seguro que desea cerrar sesión?')) {
            alert('Sesión cerrada. Redirigiendo a la tienda...');
            window.location.href = 'index.html';
        }
    });
    
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
    
    document.getElementById('addProductBtn').addEventListener('click', () => openProductModal());
    document.getElementById('addCategoryBtn').addEventListener('click', () => openCategoryModal());
    document.getElementById('productSearch').addEventListener('input', function(e) {
        filterProductsTable(e.target.value);
    });
    
    document.getElementById('saveWhatsapp').addEventListener('click', saveWhatsappNumber);
    document.getElementById('logoUpload').addEventListener('change', handleLogoUpload);
    
    document.getElementById('closeProductModal').addEventListener('click', () => closeProductModal());
    document.getElementById('cancelProduct').addEventListener('click', () => closeProductModal());
    document.getElementById('saveProduct').addEventListener('click', saveProduct);
    
    document.getElementById('productImageUpload').addEventListener('change', handleProductImageUpload);
    
    document.getElementById('closeCategoryModal').addEventListener('click', () => closeCategoryModal());
    document.getElementById('cancelCategory').addEventListener('click', () => closeCategoryModal());
    document.getElementById('saveCategory').addEventListener('click', saveCategory);
    
    document.getElementById('cancelConfirm').addEventListener('click', () => closeConfirmModal());
    document.getElementById('confirmAction').addEventListener('click', executeConfirmAction);
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
        
        if (sectionId === 'dashboard') {
            updateStats();
            loadRecentProducts();
        } else if (sectionId === 'productos') {
            loadProductsTable();
        } else if (sectionId === 'categorias') {
            loadCategoriesGrid();
        } else if (sectionId === 'configuracion') {
            loadConfiguration();
        }
    }
}

function handleQuickAction(action) {
    switch(action) {
        case 'add-product':
            openProductModal();
            break;
        case 'add-category':
            openCategoryModal();
            break;
        case 'change-logo':
            document.getElementById('logoUpload').click();
            break;
        case 'view-orders':
            showSection('productos');
            break;
        default:
            console.log('Acción no implementada:', action);
    }
}

function loadAdminData() {
    const savedProducts = localStorage.getItem('ferreteria_products');
    if (savedProducts) {
        adminProducts = JSON.parse(savedProducts);
    } else {
        adminProducts = [
            {
                id: 1,
                name: "Taladro Percutor 800W",
                description: "Taladro percutor profesional con potencia de 800W, ideal para concreto y madera.",
                price: 89.99,
                priceTiers: {
                    base: 89.99,
                    tier1: 85.99,
                    tier2: 80.99,
                    tier3: 75.99,
                    tier4: 70.99
                },
                category: "herramientas",
                image: "img/products/taladro.jpg",
                stock: 15
            },
            {
                id: 2,
                name: "Juego de Destornilladores",
                description: "Set de 20 destornilladores profesionales con puntas intercambiables.",
                price: 24.99,
                priceTiers: {
                    base: 24.99,
                    tier1: 23.99,
                    tier2: 22.49,
                    tier3: 20.99,
                    tier4: 19.49
                },
                category: "herramientas",
                image: "img/products/destornilladores.jpg",
                stock: 42
            },
            {
                id: 3,
                name: "Cable Eléctrico 12/2",
                description: "Cable eléctrico calibre 12/2, 100 pies, para instalaciones residenciales.",
                price: 65.50,
                priceTiers: {
                    base: 65.50,
                    tier1: 62.50,
                    tier2: 59.50,
                    tier3: 56.50,
                    tier4: 53.50
                },
                category: "electricidad",
                image: "img/products/cable.jpg",
                stock: 28
            }
        ];
    }
    
    const savedWhatsapp = localStorage.getItem('ferreteria_whatsapp');
    if (savedWhatsapp) {
        whatsappNumber = savedWhatsapp;
    }
    
    updateCategoryProductCount();
}

function saveAdminData() {
    localStorage.setItem('ferreteria_products', JSON.stringify(adminProducts));
    localStorage.setItem('ferreteria_whatsapp', whatsappNumber);
    localStorage.setItem('ferreteria_products', JSON.stringify(adminProducts));
}

function updateStats() {
    document.getElementById('totalProducts').textContent = adminProducts.length;
    document.getElementById('totalCategories').textContent = categories.length;
    
    const todayOrders = Math.floor(Math.random() * 15) + 5;
    const todayRevenue = (todayOrders * 75).toFixed(2);
    
    document.getElementById('totalOrders').textContent = todayOrders;
    document.getElementById('totalRevenue').textContent = `$${todayRevenue}`;
}

function loadRecentProducts() {
    const tableBody = document.querySelector('#recentProductsTable tbody');
    tableBody.innerHTML = '';
    
    const recentProducts = [...adminProducts]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);
    
    recentProducts.forEach(product => {
        const category = categories.find(c => c.name.toLowerCase() === product.category);
        const categoryName = category ? category.name : product.category;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center;">
                    <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 10px;" onerror="this.src='img/products/default.jpg'">
                    <span>${product.name}</span>
                </div>
            </td>
            <td>${categoryName}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock || 0}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function loadProductsTable() {
    const tableBody = document.querySelector('#productsTable tbody');
    tableBody.innerHTML = '';
    
    if (adminProducts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 40px; color: #7f8c8d;">
                <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <p>No hay productos registrados</p>
            </td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    adminProducts.forEach(product => {
        const category = categories.find(c => c.name.toLowerCase() === product.category);
        const categoryName = category ? category.name : product.category;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td class="product-image-cell">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='img/products/default.jpg'">
            </td>
            <td>${product.name}</td>
            <td>${categoryName}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock || 0}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function filterProductsTable(searchTerm) {
    const rows = document.querySelectorAll('#productsTable tbody tr');
    
    rows.forEach(row => {
        const productName = row.cells[2].textContent.toLowerCase();
        const categoryName = row.cells[3].textContent.toLowerCase();
        
        if (productName.includes(searchTerm.toLowerCase()) || 
            categoryName.includes(searchTerm.toLowerCase()) ||
            searchTerm === '') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function loadCategoriesGrid() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        
        categoryCard.innerHTML = `
            <div class="category-header">
                <div class="category-title">
                    <h4>${category.name}</h4>
                    <span class="category-count">${category.productCount} productos</span>
                </div>
                <div class="category-actions">
                    <button onclick="editCategory(${category.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteCategory(${category.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="category-description">${category.description}</p>
        `;
        
        grid.appendChild(categoryCard);
    });
}

function updateCategoryProductCount() {
    categories.forEach(category => {
        category.productCount = 0;
    });
    
    adminProducts.forEach(product => {
        const category = categories.find(c => c.name.toLowerCase() === product.category);
        if (category) {
            category.productCount++;
        }
    });
}

function loadConfiguration() {
    document.getElementById('whatsappNumber').value = whatsappNumber;
    document.getElementById('currentLogo').src = 'img/logo.png';
}

function saveWhatsappNumber() {
    const newNumber = document.getElementById('whatsappNumber').value.trim();
    
    if (newNumber === '') {
        alert('Por favor ingrese un número de WhatsApp válido.');
        return;
    }
    
    whatsappNumber = newNumber;
    saveAdminData();
    
    alert('Número de WhatsApp actualizado correctamente.');
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        alert('Formato de archivo no válido. Use JPG, PNG o GIF.');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 2MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoImg = document.getElementById('currentLogo');
        logoImg.src = e.target.result;
        
        alert('Logo actualizado. En una aplicación real, este archivo se subiría al servidor.');
    };
    
    reader.readAsDataURL(file);
}

function openProductModal(productId = null) {
    currentProductId = productId;
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalProductTitle');
    const form = document.getElementById('productForm');
    
    const categorySelect = document.getElementById('productCategory');
    categorySelect.innerHTML = '';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name.toLowerCase();
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
    
    if (productId) {
        title.textContent = 'Editar producto';
        const product = adminProducts.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productStock').value = product.stock || 0;
            document.getElementById('basePrice').value = product.price;
            
            if (product.priceTiers) {
                document.getElementById('priceTier1').value = product.priceTiers.tier1 || '';
                document.getElementById('priceTier2').value = product.priceTiers.tier2 || '';
                document.getElementById('priceTier3').value = product.priceTiers.tier3 || '';
                document.getElementById('priceTier4').value = product.priceTiers.tier4 || '';
            }
            
            const previewImage = document.getElementById('previewImage');
            const noImagePreview = document.getElementById('noImagePreview');
            
            if (product.image) {
                previewImage.src = product.image;
                previewImage.style.display = 'block';
                noImagePreview.style.display = 'none';
            } else {
                previewImage.style.display = 'none';
                noImagePreview.style.display = 'flex';
            }
        }
    } else {
        title.textContent = 'Agregar nuevo producto';
        form.reset();
        
        document.getElementById('previewImage').style.display = 'none';
        document.getElementById('noImagePreview').style.display = 'flex';
        
        document.getElementById('productStock').value = 10;
        document.getElementById('basePrice').value = '';
        
        const newId = adminProducts.length > 0 ? Math.max(...adminProducts.map(p => p.id)) + 1 : 1;
        document.getElementById('productId').value = newId;
    }
    
    modal.style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function handleProductImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        alert('Formato de archivo no válido. Use JPG, PNG o GIF.');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 2MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImage = document.getElementById('previewImage');
        const noImagePreview = document.getElementById('noImagePreview');
        
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        noImagePreview.style.display = 'none';
    };
    
    reader.readAsDataURL(file);
}

function saveProduct() {
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
    }
    
    const productId = parseInt(document.getElementById('productId').value);
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productCategory = document.getElementById('productCategory').value;
    const productStock = parseInt(document.getElementById('productStock').value);
    const basePrice = parseFloat(document.getElementById('basePrice').value);
    
    const priceTier1 = parseFloat(document.getElementById('priceTier1').value);
    const priceTier2 = parseFloat(document.getElementById('priceTier2').value);
    const priceTier3 = parseFloat(document.getElementById('priceTier3').value);
    const priceTier4 = parseFloat(document.getElementById('priceTier4').value);
    
    const imagePreview = document.getElementById('previewImage');
    const productImage = imagePreview.style.display !== 'none' ? imagePreview.src : 'img/products/default.jpg';
    
    const productData = {
        id: productId,
        name: productName,
        description: productDescription,
        price: basePrice,
        priceTiers: {
            base: basePrice,
            tier1: priceTier1,
            tier2: priceTier2,
            tier3: priceTier3,
            tier4: priceTier4
        },
        category: productCategory,
        image: productImage,
        stock: productStock
    };
    
    const existingIndex = adminProducts.findIndex(p => p.id === productId);
    
    if (existingIndex !== -1) {
        adminProducts[existingIndex] = productData;
    } else {
        adminProducts.push(productData);
    }
    
    updateCategoryProductCount();
    saveAdminData();
    loadProductsTable();
    loadRecentProducts();
    updateStats();
    closeProductModal();
    
    alert('Producto guardado correctamente.');
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;
    
    showConfirmModal(
        'Eliminar producto',
        `¿Está seguro que desea eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
        () => {
            const index = adminProducts.findIndex(p => p.id === productId);
            if (index !== -1) {
                adminProducts.splice(index, 1);
                updateCategoryProductCount();
                saveAdminData();
                loadProductsTable();
                loadRecentProducts();
                updateStats();
                loadCategoriesGrid();
                alert('Producto eliminado correctamente.');
            }
        }
    );
}

function openCategoryModal(categoryId = null) {
    currentCategoryId = categoryId;
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('modalCategoryTitle');
    const form = document.getElementById('categoryForm');
    
    if (categoryId) {
        title.textContent = 'Editar categoría';
        const category = categories.find(c => c.id === categoryId);
        
        if (category) {
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryDescription').value = category.description;
        }
    } else {
        title.textContent = 'Agregar nueva categoría';
        form.reset();
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        document.getElementById('categoryId').value = newId;
    }
    
    modal.style.display = 'flex';
}

function closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
}

function saveCategory() {
    const categoryName = document.getElementById('categoryName').value;
    if (!categoryName.trim()) {
        alert('Por favor ingrese un nombre para la categoría.');
        return;
    }
    
    const categoryId = parseInt(document.getElementById('categoryId').value);
    const categoryDescription = document.getElementById('categoryDescription').value;
    
    const categoryData = {
        id: categoryId,
        name: categoryName,
        description: categoryDescription,
        productCount: 0
    };
    
    const existingIndex = categories.findIndex(c => c.id === categoryId);
    
    if (existingIndex !== -1) {
        categoryData.productCount = categories[existingIndex].productCount;
        categories[existingIndex] = categoryData;
        
        const oldCategoryName = categories[existingIndex].name.toLowerCase();
        adminProducts.forEach(product => {
            if (product.category === oldCategoryName) {
                product.category = categoryName.toLowerCase();
            }
        });
    } else {
        categories.push(categoryData);
    }
    
    updateCategoryProductCount();
    saveAdminData();
    loadCategoriesGrid();
    loadProductsTable();
    updateStats();
    closeCategoryModal();
    
    alert('Categoría guardada correctamente.');
}

function editCategory(categoryId) {
    openCategoryModal(categoryId);
}

function deleteCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    if (category.productCount > 0) {
        alert(`No se puede eliminar la categoría "${category.name}" porque tiene ${category.productCount} productos asociados. Reasigne los productos a otra categoría primero.`);
        return;
    }
    
    showConfirmModal(
        'Eliminar categoría',
        `¿Está seguro que desea eliminar la categoría "${category.name}"?`,
        () => {
            const index = categories.findIndex(c => c.id === categoryId);
            if (index !== -1) {
                categories.splice(index, 1);
                saveAdminData();
                loadCategoriesGrid();
                alert('Categoría eliminada correctamente.');
            }
        }
    );
}

function showConfirmModal(title, message, callback) {
    confirmAction = title;
    confirmCallback = callback;
    
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').style.display = 'flex';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    confirmAction = null;
    confirmCallback = null;
}

function executeConfirmAction() {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmModal();
}