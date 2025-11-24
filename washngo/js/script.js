// Productos disponibles
const products = [
    {
        id: 1,
        name: 'Kit Limpieza Gorras Premium',
        description: 'Kit completo para limpieza profesional de gorras. Incluye cepillo especial, detergente y protector.',
        price: 29.99,
        icon: 'fas fa-hat-cowboy'
    },
    {
        id: 2,
        name: 'Kit Limpieza Zapatillas Pro',
        description: 'Productos especializados para limpieza de zapatillas deportivas. Elimina manchas y olores.',
        price: 34.99,
        icon: 'fas fa-shoe-prints'
    },
    {
        id: 3,
        name: 'Servicio Limpieza Gorra',
        description: 'Servicio profesional de limpieza de una gorra. Recogida y entrega incluida.',
        price: 15.99,
        icon: 'fas fa-spray-can'
    },
    {
        id: 4,
        name: 'Servicio Limpieza Zapatillas',
        description: 'Lavado profesional de zapatillas. Restauración completa con garantía de satisfacción.',
        price: 19.99,
        icon: 'fas fa-shoe-prints'
    },
    {
        id: 5,
        name: 'Kit Completo Premium',
        description: 'Kit completo para gorras y zapatillas. Incluye todos los productos y accesorios necesarios.',
        price: 49.99,
        icon: 'fas fa-box'
    },
    {
        id: 6,
        name: 'Servicio Express',
        description: 'Limpieza express de gorras o zapatillas. Entrega en 24 horas.',
        price: 24.99,
        icon: 'fas fa-bolt'
    }
];

// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    updateCartCount();
    setupEventListeners();
    setupTabs();
    initScrollBubbles();
});

// Renderizar productos
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price.toFixed(2)}€</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    Añadir al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Añadir al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    updateCartCount();
    showNotification('Producto añadido al carrito');
}

// Eliminar del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartCount();
    showNotification('Producto eliminado del carrito');
}

// Actualizar cantidad
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        renderCart();
        updateCartCount();
    }
}

// Renderizar carrito
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #95A5A6; padding: 40px;">Tu carrito está vacío</p>';
        cartTotal.textContent = '0.00€';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2)}€ x ${item.quantity}</div>
                <div style="display: flex; gap: 10px; margin-top: 10px; align-items: center;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="background: #f0f0f0; border: none; width: 30px; height: 30px; border-radius: 5px; cursor: pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="background: #f0f0f0; border: none; width: 30px; height: 30px; border-radius: 5px; cursor: pointer;">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2) + '€';
}

// Actualizar contador del carrito
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Configurar event listeners
function setupEventListeners() {
    // Abrir/cerrar carrito
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');

    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutClose = document.getElementById('checkoutClose');
    const checkoutForm = document.getElementById('checkoutForm');

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Tu carrito está vacío', 'error');
            return;
        }
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    checkoutClose.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleCheckout();
    });

    // Cerrar modal al hacer clic fuera
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Smooth scroll para enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Cerrar carrito
function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Configurar tabs
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remover active de todos los tabs y panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Añadir active al tab y pane seleccionados
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Procesar checkout
function handleCheckout() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Simular procesamiento de pago
    showNotification('Procesando tu pedido...', 'info');
    
    setTimeout(() => {
        // Limpiar carrito
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
        
        // Cerrar modales
        closeCart();
        document.getElementById('checkoutModal').classList.remove('active');
        document.body.style.overflow = '';
        
        // Resetear formulario
        form.reset();
        
        showNotification('¡Pedido realizado con éxito! Te contactaremos pronto.', 'success');
    }, 2000);
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : type === 'info' ? '#3498db' : '#10B981'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Añadir animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    if (!document.querySelector('#notification-style')) {
        style.id = 'notification-style';
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Hacer funciones globales para onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

// Burbujas que se mueven libremente y siguen el scroll
function initScrollBubbles() {
    // Crear contenedor de burbujas
    const bubblesContainer = document.createElement('div');
    bubblesContainer.className = 'scroll-bubbles-container';
    document.body.appendChild(bubblesContainer);

    // Crear 96 burbujas que se mueven libremente (32 x 3)
    const bubbleCount = 96;
    const bubbles = [];
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = createBubble(i);
        bubblesContainer.appendChild(bubble);
        bubbles.push(bubble);
    }

    // Inicializar posiciones y velocidades aleatorias para cada burbuja
    bubbles.forEach((bubble, index) => {
        // Posición inicial aleatoria en toda la altura del documento
        const initialX = Math.random() * 100; // 0-100% del ancho
        const initialY = Math.random() * documentHeight; // Posición absoluta en el documento
        
        bubble.dataset.x = initialX;
        bubble.dataset.y = initialY; // Posición absoluta en el documento
        bubble.dataset.initialY = initialY; // Guardar posición inicial
        
        // Velocidad inicial aleatoria en todas las direcciones (más natural)
        const speed = 0.1 + Math.random() * 0.25; // Velocidad base variable
        const angle = Math.random() * Math.PI * 2; // Ángulo aleatorio (360 grados)
        
        bubble.dataset.velX = Math.cos(angle) * speed; // Componente X
        bubble.dataset.velY = Math.sin(angle) * speed; // Componente Y
        
        // Variables para movimiento natural (aceleración, cambio de dirección)
        bubble.dataset.accelX = (Math.random() - 0.5) * 0.001; // Aceleración horizontal
        bubble.dataset.accelY = (Math.random() - 0.5) * 0.001; // Aceleración vertical
        bubble.dataset.targetAngle = angle; // Ángulo objetivo para cambios suaves
        bubble.dataset.angleChange = 0; // Cambio de ángulo gradual
        bubble.dataset.time = Math.random() * Math.PI * 2; // Tiempo para ondas sinusoidales
        
        // Posición inicial en la pantalla
        bubble.style.left = initialX + '%';
        bubble.style.top = initialY + 'px';
    });

    // Animar burbujas continuamente
    let lastScrollY = window.scrollY;
    let animationFrame;

    function animateBubbles() {
        const currentScrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        bubbles.forEach((bubble) => {
            // Obtener posición actual
            let x = parseFloat(bubble.dataset.x);
            let y = parseFloat(bubble.dataset.y); // Posición absoluta en el documento
            let velX = parseFloat(bubble.dataset.velX);
            let velY = parseFloat(bubble.dataset.velY);
            let accelX = parseFloat(bubble.dataset.accelX);
            let accelY = parseFloat(bubble.dataset.accelY);
            let time = parseFloat(bubble.dataset.time) || 0;
            
            // Actualizar tiempo para ondas sinusoidales (movimiento orgánico)
            time += 0.01;
            bubble.dataset.time = time;
            
            // Aplicar aceleración variable (simula corrientes de aire)
            accelX += (Math.random() - 0.5) * 0.0005;
            accelY += (Math.random() - 0.5) * 0.0005;
            
            // Limitar aceleración para evitar movimientos bruscos
            accelX = Math.max(-0.002, Math.min(0.002, accelX));
            accelY = Math.max(-0.002, Math.min(0.002, accelY));
            
            // Actualizar velocidad con aceleración y ondas sinusoidales
            velX += accelX + Math.sin(time * 0.5) * 0.0003;
            velY += accelY + Math.cos(time * 0.7) * 0.0003;
            
            // Limitar velocidad máxima para movimiento suave
            const maxSpeed = 0.4;
            const currentSpeed = Math.sqrt(velX * velX + velY * velY);
            if (currentSpeed > maxSpeed) {
                velX = (velX / currentSpeed) * maxSpeed;
                velY = (velY / currentSpeed) * maxSpeed;
            }
            
            // Actualizar posición con velocidad
            x += velX;
            y += velY;
            
            // Rebotar suavemente en los bordes horizontales (con amortiguación)
            if (x < 0) {
                x = 0;
                velX = Math.abs(velX) * 0.7; // Amortiguación
                accelX = Math.abs(accelX) * 0.5;
            } else if (x > 100) {
                x = 100;
                velX = -Math.abs(velX) * 0.7; // Amortiguación
                accelX = -Math.abs(accelX) * 0.5;
            }
            
            // Mantener las burbujas dentro del documento (con transición suave)
            if (y < 0) {
                y = documentHeight + y; // Reaparecer abajo
                // Cambiar dirección suavemente
                velY = Math.abs(velY) * 0.8;
            } else if (y > documentHeight) {
                y = y - documentHeight; // Reaparecer arriba
                // Cambiar dirección suavemente
                velY = -Math.abs(velY) * 0.8;
            }
            
            // Guardar nueva posición y velocidades
            bubble.dataset.x = x;
            bubble.dataset.y = y;
            bubble.dataset.velX = velX;
            bubble.dataset.velY = velY;
            bubble.dataset.accelX = accelX;
            bubble.dataset.accelY = accelY;
            
            // Calcular posición en la pantalla (relativa al scroll)
            const screenY = y - currentScrollY;
            
            // Aplicar posición - left en porcentaje, top relativo al scroll
            bubble.style.left = x + '%';
            bubble.style.top = screenY + 'px'; // Posición relativa al viewport (sigue el scroll)
            
            // Añadir rotación sutil basada en la velocidad (efecto más natural)
            const rotation = Math.atan2(velY, velX) * (180 / Math.PI);
            bubble.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            
            // Mostrar/ocultar según si está en la ventana visible
            if (currentScrollY > 100 && screenY >= -100 && screenY <= windowHeight + 100) {
                bubble.classList.add('visible', 'animate');
            } else {
                bubble.classList.remove('visible', 'animate');
            }
        });
        
        lastScrollY = currentScrollY;
        animationFrame = requestAnimationFrame(animateBubbles);
    }

    // Actualizar cuando cambia el tamaño de la ventana
    window.addEventListener('resize', () => {
        // Recalcular posiciones si es necesario
    });

    // Iniciar animación inmediatamente
    animateBubbles();
}

function createBubble(index) {
    const bubble = document.createElement('div');
    bubble.className = 'scroll-bubble';
    
    // Tamaños aleatorios entre 15px y 50px
    const size = 15 + Math.random() * 35;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    
    // Colores cristalinos en paleta negro, lima y blanco
    const colors = [
        'rgba(255, 255, 255, 0.15)',   // Blanco cristalino
        'rgba(255, 255, 255, 0.12)',   // Blanco más transparente
        'rgba(50, 205, 50, 0.1)',     // Lima cristalino
        'rgba(191, 255, 0, 0.12)',     // Lima suave
        'rgba(255, 255, 255, 0.1)',    // Blanco suave
        'rgba(50, 205, 50, 0.08)',     // Lima más transparente
        'rgba(255, 255, 255, 0.08)',   // Blanco ultra transparente
        'rgba(0, 255, 0, 0.1)'         // Lima brillante
    ];
    const colorIndex = index % colors.length;
    bubble.style.background = colors[colorIndex];
    
    // Delay de animación diferente para cada burbuja
    bubble.style.animationDelay = (index * 0.1) + 's';
    
    return bubble;
}

