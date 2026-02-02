// Datos iniciales de productos
let products = [
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
        image: "img/products/taladro.jpg"
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
        image: "img/products/destornilladores.jpg"
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
        image: "img/products/cable.jpg"
    },
    {
        id: 4,
        name: "Llave Stillson 14\"",
        description: "Llave Stillson de 14 pulgadas para trabajos de fontanería.",
        price: 32.75,
        priceTiers: {
            base: 32.75,
            tier1: 31.25,
            tier2: 29.75,
            tier3: 28.25,
            tier4: 26.75
        },
        category: "fontaneria",
        image: "img/products/llave.jpg"
    },
    {
        id: 5,
        name: "Pintura Latex Blanco",
        description: "Galón de pintura látex de alta calidad, acabado mate, cubrimiento excelente.",
        price: 28.99,
        priceTiers: {
            base: 28.99,
            tier1: 27.49,
            tier2: 25.99,
            tier3: 24.49,
            tier4: 22.99
        },
        category: "pintura",
        image: "img/products/pintura.jpg"
    },
    {
        id: 6,
        name: "Cortadora de Césped",
        description: "Cortadora de césped eléctrica, 1400W, ancho de corte 33cm.",
        price: 159.99,
        priceTiers: {
            base: 159.99,
            tier1: 154.99,
            tier2: 149.99,
            tier3: 144.99,
            tier4: 139.99
        },
        category: "jardin",
        image: "img/products/cortadora.jpg"
    },
    {
        id: 7,
        name: "Casco de Seguridad",
        description: "Casco de seguridad industrial con ajuste ergonómico.",
        price: 18.50,
        priceTiers: {
            base: 18.50,
            tier1: 17.50,
            tier2: 16.50,
            tier3: 15.50,
            tier4: 14.50
        },
        category: "seguridad",
        image: "img/products/casco.jpg"
    },
    {
        id: 8,
        name: "Cemento Gris 50kg",
        description: "Saco de cemento gris de 50kg para construcción.",
        price: 12.99,
        priceTiers: {
            base: 12.99,
            tier1: 12.49,
            tier2: 11.99,
            tier3: 11.49,
            tier4: 10.99
        },
        category: "materiales",
        image: "img/products/cemento.jpg"
    },
    {
        id: 9,
        name: "Sierra Circular 1800W",
        description: "Sierra circular profesional de 1800W con hoja de 7-1/4 pulgadas.",
        price: 129.99,
        priceTiers: {
            base: 129.99,
            tier1: 124.99,
            tier2: 119.99,
            tier3: 114.99,
            tier4: 109.99
        },
        category: "herramientas",
        image: "img/products/sierra.jpg"
    },
    {
        id: 10,
        name: "Broca para Concreto 1/2\"",
        description: "Juego de 5 brocas para concreto de 1/2 pulgada, carburo de tungsteno.",
        price: 16.75,
        priceTiers: {
            base: 16.75,
            tier1: 15.75,
            tier2: 14.75,
            tier3: 13.75,
            tier4: 12.75
        },
        category: "herramientas",
        image: "img/products/broca.jpg"
    }
];

// Carrito de compras
let cart = [];
let currentCategory = 'all';
let currentSearchTerm = '';

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    initUI();
    displayProducts(products);
    updateProductsCount();
    updateCart();
});

// Inicializar la interfaz de usuario
function initUI() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileCartToggle = document.getElementById('mobileCartToggle');
    const closeMobileCart = document.getElementById('closeMobileCart');
    const closeDesktopCart = document.getElementById('closeDesktopCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const mobileCheckoutBtn = document.getElementById('mobileCheckoutBtn');
    const searchInput = document.getElementById('searchInput');
    const mobileSearch = document.getElementById('mobileSearch');
    const categoryLinks = document.querySelectorAll('[data-category]');
    const categoryListItems = document.querySelectorAll('.category-list a');
    
    mobileMenuToggle.addEventListener('click', function() {
        document.getElementById('mobileSidebar').classList.add('active');
        sidebarOverlay.classList.add('active');
    });
    
    closeSidebar.addEventListener('click', closeMobileMenu);
    sidebarOverlay.addEventListener('click', closeMobileMenu);
    
    mobileCartToggle.addEventListener('click', function() {
        document.getElementById('mobileCartModal').style.display = 'flex';
        updateMobileCart();
    });
    
    closeMobileCart.addEventListener('click', function() {
        document.getElementById('mobileCartModal').style.display = 'none';
    });
    
    closeDesktopCart.addEventListener('click', function() {
        document.getElementById('desktopCart').style.display = 'none';
    });
    
    checkoutBtn.addEventListener('click', sendOrderViaWhatsApp);
    mobileCheckoutBtn.addEventListener('click', sendOrderViaWhatsApp);
    
    searchInput.addEventListener('input', function(e) {
        currentSearchTerm = e.target.value;
        filterProducts();
        showAutocomplete(currentSearchTerm);
    });
    
    mobileSearch.addEventListener('input', function(e) {
        currentSearchTerm = e.target.value;
        filterProducts();
        closeMobileMenu();
    });
    
    categoryListItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            selectCategory(category);
            categoryListItems.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            selectCategory(category);
            closeMobileMenu();
        });
    });
    
    if (window.innerWidth >= 992) {
        document.getElementById('desktopSidebar').style.display = 'block';
        document.getElementById('desktopCart').style.display = 'flex';
    }
}

// Cerrar menú móvil
function closeMobileMenu() {
    document.getElementById('mobileSidebar').classList.remove('active');
    document.getElementById('sidebarOverlay').classList.remove('active');
}

// Seleccionar categoría
function selectCategory(category) {
    currentCategory = category;
    document.getElementById('categoryTitle').textContent = getCategoryName(category);
    filterProducts();
}

// Obtener nombre de categoría para mostrar
function getCategoryName(categoryId) {
    const categoryNames = {
        'all': 'Todos los productos',
        'herramientas': 'Herramientas',
        'electricidad': 'Electricidad',
        'fontaneria': 'Fontanería',
        'pintura': 'Pintura',
        'jardin': 'Jardín',
        'seguridad': 'Seguridad',
        'materiales': 'Materiales de construcción'
    };
    return categoryNames[categoryId] || categoryId;
}

// Filtrar productos según categoría y búsqueda
function filterProducts() {
    let filteredProducts = products;
    
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === currentCategory);
    }
    
    if (currentSearchTerm.trim() !== '') {
        const searchTerm = currentSearchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filteredProducts);
    updateProductsCount(filteredProducts.length);
}

// Mostrar productos en la lista
function displayProducts(productsToDisplay) {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsList.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otra categoría o término de búsqueda</p>
            </div>
        `;
        return;
    }
    
    productsToDisplay.forEach(product => {
        const cartItem = cart.find(item => item.id === product.id);
        const quantityInCart = cartItem ? cartItem.quantity : 0;
        const currentPrice = getProductPrice(product);
        
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='img/products/default.jpg'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <span class="product-category">${getCategoryName(product.category)}</span>
                <div class="product-details">
                    <div class="product-price">${currentPrice.toFixed(2)} USD</div>
                    <div class="product-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" onclick="decreaseProductQuantity(${product.id})">-</button>
                            <span class="quantity-display" id="quantity-${product.id}">${quantityInCart}</span>
                            <button class="quantity-btn plus" onclick="increaseProductQuantity(${product.id})">+</button>
                        </div>
                        <button class="add-to-cart-btn ${quantityInCart > 0 ? 'added' : ''}" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                            ${quantityInCart > 0 ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        productsList.appendChild(productElement);
    });
}

// Obtener precio del producto según el total del carrito
function getProductPrice(product) {
    const totalCartValue = getCartTotal();
    
    if (totalCartValue >= 3000) {
        return product.priceTiers.tier4;
    } else if (totalCartValue >= 1000) {
        return product.priceTiers.tier3;
    } else if (totalCartValue >= 500) {
        return product.priceTiers.tier2;
    } else if (totalCartValue >= 200) {
        return product.priceTiers.tier1;
    } else {
        return product.priceTiers.base;
    }
}

// Actualizar contador de productos
function updateProductsCount(count) {
    const productsCount = document.getElementById('productsCount');
    if (count !== undefined) {
        productsCount.textContent = `${count} producto${count !== 1 ? 's' : ''}`;
    } else {
        const filteredProducts = products.filter(product => 
            (currentCategory === 'all' || product.category === currentCategory) &&
            (currentSearchTerm === '' || 
             product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
             product.description.toLowerCase().includes(currentSearchTerm.toLowerCase()))
        );
        productsCount.textContent = `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''}`;
    }
}

// Funciones del carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: getProductPrice(product),
            basePrice: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    saveToLocalStorage();
}

function increaseProductQuantity(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: getProductPrice(product),
            basePrice: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateProductQuantityDisplay(productId);
    updateCart();
    saveToLocalStorage();
}

function decreaseProductQuantity(productId) {
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        if (cart[existingItemIndex].quantity > 1) {
            cart[existingItemIndex].quantity--;
        } else {
            cart.splice(existingItemIndex, 1);
        }
        
        updateProductQuantityDisplay(productId);
        updateCart();
        saveToLocalStorage();
    }
}

function updateProductQuantityDisplay(productId) {
    const quantityDisplay = document.getElementById(`quantity-${productId}`);
    if (quantityDisplay) {
        const cartItem = cart.find(item => item.id === productId);
        quantityDisplay.textContent = cartItem ? cartItem.quantity : 0;
        
        const addToCartBtn = quantityDisplay.closest('.product-actions').querySelector('.add-to-cart-btn');
        if (cartItem && cartItem.quantity > 0) {
            addToCartBtn.classList.add('added');
            addToCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Actualizar';
        } else {
            addToCartBtn.classList.remove('added');
            addToCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Agregar';
        }
    }
}

function removeFromCart(productId) {
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        cart.splice(existingItemIndex, 1);
        updateProductQuantityDisplay(productId);
        updateCart();
        saveToLocalStorage();
    }
}

function updateCartQuantity(productId, newQuantity) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (newQuantity > 0) {
            existingItem.quantity = newQuantity;
        } else {
            removeFromCart(productId);
        }
        
        updateProductQuantityDisplay(productId);
        updateCart();
        saveToLocalStorage();
    }
}

// Actualizar carrito y totales
function updateCart() {
    updateDesktopCart();
    updateMobileCart();
    updateCartCount();
    updatePriceTierDisplay();
    
    displayProducts(products.filter(product => 
        (currentCategory === 'all' || product.category === currentCategory) &&
        (currentSearchTerm === '' || 
         product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
         product.description.toLowerCase().includes(currentSearchTerm.toLowerCase()))
    ));
}

function updateDesktopCart() {
    const cartItems = document.getElementById('cartItems');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        totalElement.textContent = '0.00 USD';
        return;
    }
    
    const total = getCartTotal();
    totalElement.textContent = total.toFixed(2) + ' USD';
    
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        const currentProductPrice = getProductPrice(product);
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='img/products/default.jpg'">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-price">${currentProductPrice.toFixed(2)} USD</div>
                <div class="cart-item-actions">
                    <div class="cart-quantity-control">
                        <button class="cart-quantity-btn minus" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="cart-quantity-display">${item.quantity}</span>
                        <button class="cart-quantity-btn plus" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItemElement);
    });
}

function updateMobileCart() {
    const mobileCartItems = document.getElementById('mobileCartItems');
    const mobileTotalElement = document.getElementById('mobileTotal');
    
    if (cart.length === 0) {
        mobileCartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        mobileTotalElement.textContent = '0.00 USD';
        return;
    }
    
    const total = getCartTotal();
    mobileTotalElement.textContent = total.toFixed(2) + ' USD';
    
    mobileCartItems.innerHTML = '';
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        const currentProductPrice = getProductPrice(product);
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='img/products/default.jpg'">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-price">${currentProductPrice.toFixed(2)} USD</div>
                <div class="cart-item-actions">
                    <div class="cart-quantity-control">
                        <button class="cart-quantity-btn minus" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="cart-quantity-display">${item.quantity}</span>
                        <button class="cart-quantity-btn plus" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        
        mobileCartItems.appendChild(cartItemElement);
    });
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

function getCartTotal() {
    let total = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            total += getProductPrice(product) * item.quantity;
        }
    });
    
    return total;
}

function updatePriceTierDisplay() {
    const total = getCartTotal();
    
    let currentTier = "Precio base";
    
    if (total >= 3000) {
        currentTier = "Precio corporativo";
    } else if (total >= 1000) {
        currentTier = "Precio especial";
    } else if (total >= 500) {
        currentTier = "Precio mayorista";
    } else if (total >= 200) {
        currentTier = "Precio reducido";
    }
    
    document.getElementById('currentTier').textContent = currentTier;
    document.getElementById('mobileCurrentTier').textContent = currentTier;
    
    const tierElements = {
        'tier1': 'Precio base',
        'tier2': `Precio reducido`,
        'tier3': `Precio mayorista`,
        'tier4': `Precio especial`,
        'tier5': `Precio corporativo`
    };
    
    for (const [id, text] of Object.entries(tierElements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }
}

// Autocompletado de búsqueda
function showAutocomplete(searchTerm) {
    const autocompleteResults = document.getElementById('autocompleteResults');
    
    if (searchTerm.trim() === '') {
        autocompleteResults.style.display = 'none';
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
    
    if (filteredProducts.length === 0) {
        autocompleteResults.style.display = 'none';
        return;
    }
    
    autocompleteResults.innerHTML = '';
    filteredProducts.forEach(product => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = product.name;
        item.addEventListener('click', function() {
            document.getElementById('searchInput').value = product.name;
            currentSearchTerm = product.name;
            filterProducts();
            autocompleteResults.style.display = 'none';
        });
        autocompleteResults.appendChild(item);
    });
    
    autocompleteResults.style.display = 'block';
}

// Enviar pedido por WhatsApp
function sendOrderViaWhatsApp() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de enviar el pedido.');
        return;
    }
    
    const phoneNumber = "15551234567";
    const total = getCartTotal();
    
    let message = `¡Hola! Quiero hacer un pedido:\n\n`;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const price = product ? getProductPrice(product) : 0;
        message += `• ${item.name} x${item.quantity}: ${price.toFixed(2)} USD c/u\n`;
    });
    
    message += `\nTotal: ${total.toFixed(2)} USD\n`;
    message += `\nGracias.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    document.getElementById('mobileCartModal').style.display = 'none';
    document.getElementById('desktopCart').style.display = 'none';
}

// LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('ferreteria_cart', JSON.stringify(cart));
    localStorage.setItem('ferreteria_products', JSON.stringify(products));
}

function loadFromLocalStorage() {
    const savedCart = localStorage.getItem('ferreteria_cart');
    const savedProducts = localStorage.getItem('ferreteria_products');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedProducts) {
        if (products.length === 0) {
            products = JSON.parse(savedProducts);
        }
    }
}

// Manejo de redimensionamiento de ventana
window.addEventListener('resize', function() {
    if (window.innerWidth >= 992) {
        document.getElementById('desktopSidebar').style.display = 'block';
        document.getElementById('desktopCart').style.display = 'flex';
    } else {
        document.getElementById('desktopSidebar').style.display = 'none';
        document.getElementById('desktopCart').style.display = 'none';
    }
});