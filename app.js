// Base de datos de prendas premium estilizadas
const ropaProductos = [
    {
        id: 1,
        nombre: "Casaca Bomber Classic Minimalist",
        precioOferta: 249.90,
        precioRegular: 329.00,
        tag: "superior",
        keyword: "casaca",
        descripcion: "Casaca corte bomber estructurada, tejido técnico repellent al agua con acabados mate de alta costura.",
        imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=735&auto=format&fit=crop"
    },
    {
        id: 2,
        nombre: "Polo Knitwear Oversize",
        precioOferta: 119.90,
        precioRegular: 159.00,
        tag: "superior",
        keyword: "polo",
        descripcion: "Polo confeccionado en algodón mercerizado de alto gramaje, caída pesada y cuello redondo cerrado.",
        imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=687&auto=format&fit=crop"
    },
    {
        id: 3,
        nombre: "Pantalón Tailored Cargo",
        precioOferta: 179.90,
        precioRegular: 239.00,
        tag: "inferior",
        keyword: "pantalon",
        descripcion: "Pantalón de corte sastre adaptado con discretos bolsillos utilitarios laterales integrados.",
        imagen: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=687&auto=format&fit=crop"
    },
    {
        id: 4,
        nombre: "Hoodie Essentials Pure Cotton",
        precioOferta: 149.90,
        precioRegular: 199.00,
        tag: "superior",
        keyword: "hoodie",
        descripcion: "Polera con capucha limpia sin cordones, confeccionada en felpa francesa de tacto ultra suave.",
        imagen: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1470&auto=format&fit=crop"
    },
    {
        id: 5,
        nombre: "Short Casual Premium Comfort",
        precioOferta: 99.90,
        precioRegular: 139.00,
        tag: "inferior",
        keyword: "short",
        descripcion: "Short de sarga de algodón peinado, pretina elástica limpia y bolsillos laterales invisibles.",
        imagen: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1470&auto=format&fit=crop"
    },
    {
        id: 6,
        nombre: "Casaca Denim Minimal Wash",
        precioOferta: 219.90,
        precioRegular: 289.00,
        tag: "superior",
        keyword: "casaca",
        descripcion: "Casaca denim de calce relajado con proceso de lavado sostenible y herrajes metálicos mate.",
        imagen: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1470&auto=format&fit=crop"
    }
];

// Nodos globales de la UI
const gridProductos = document.getElementById('grid-productos');
const modal = document.getElementById('product-modal');
const closeBtn = document.querySelector('.close-btn');
const cartCount = document.getElementById('cart-count');
const contenedorSugerencias = document.getElementById('modal-recommendations');

const cartSidebar = document.getElementById('cart-sidebar');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');

let carrito = [];
let productoSeleccionadoActualmente = null;
let categoriaActiva = "todos";
let terminoBusqueda = "";

// ================= NAVEGACIÓN SPA ENTRE VISTAS =================
const enlacesMenu = document.querySelectorAll('.nav-link');
const ventanas = document.querySelectorAll('.view');

function navegarHacia(targetId) {
    ventanas.forEach(ventana => ventana.classList.remove('active'));
    enlacesMenu.forEach(enlace => enlace.classList.remove('active'));

    const ventanaDestino = document.getElementById(`view-${targetId}`);
    if(ventanaDestino) ventanaDestino.classList.add('active');

    const enlaceActivo = document.querySelector(`.nav-link[data-target="${targetId}"]`);
    if(enlaceActivo) enlaceActivo.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

enlacesMenu.forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        navegarHacia(enlace.getAttribute('data-target'));
    });
});
document.getElementById('btn-ver-coleccion').addEventListener('click', () => navegarHacia('productos'));
document.getElementById('nav-logo').addEventListener('click', () => navegarHacia('inicio'));

cartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));

// ================= MOTOR DE BÚSQUEDA Y FILTRADO INTERACTIVO =================
function renderizarTienda() {
    gridProductos.innerHTML = "";
    
    const productosFiltrados = ropaProductos.filter(producto => {
        const coincideCategoria = (categoriaActiva === "todos" || producto.tag === categoriaActiva);
        
        const busquedaLimpia = terminoBusqueda.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const nombreLimpio = producto.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const keywordLimpia = producto.keyword.toLowerCase();

        const coincideBusqueda = nombreLimpio.includes(busquedaLimpia) || keywordLimpia.includes(busquedaLimpia);
        
        return coincideCategoria && coincideBusqueda;
    });

    if(productosFiltrados.length === 0) {
        gridProductos.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 60px; font-size:0.85rem; letter-spacing:0.05em;">No se encontraron piezas con ese criterio.</p>`;
        return;
    }

    productosFiltrados.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('product-card');
        tarjeta.innerHTML = `
            <div class="product-img">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <div class="price-container">
                    <span class="price-sale">S/ ${producto.precioOferta.toFixed(2)}</span>
                    <span class="price-regular">S/ ${producto.precioRegular.toFixed(2)}</span>
                </div>
            </div>
        `;
        tarjeta.addEventListener('click', () => abrirVistaRapida(producto));
        gridProductos.appendChild(tarjeta);
    });
}

if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        terminoBusqueda = e.target.value;
        renderizarTienda();
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        categoriaActiva = btn.getAttribute('data-category');
        renderizarTienda();
    });
});

// ================= MANEJO DEL CARRITO PREMIUM =================
function actualizarInterfazCarrito() {
    const totalPiezas = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
    cartCount.innerText = totalPiezas;
    cartItemsContainer.innerHTML = "";

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding-top:40px; font-size:0.8rem; letter-spacing:0.05em;">La bolsa de compras está vacía.</p>';
        cartTotalPrice.innerText = "S/ 0.00";
        return;
    }

    let sumaTotal = 0;
    carrito.forEach(item => {
        sumaTotal += item.producto.precioOferta * item.cantidad;
        const cartItemRow = document.createElement('div');
        cartItemRow.classList.add('cart-item');
        cartItemRow.innerHTML = `
            <img src="${item.producto.imagen}" alt="${item.producto.nombre}">
            <div class="cart-item-details">
                <h4>${item.producto.nombre}</h4>
                <p>${item.cantidad} x S/ ${item.producto.precioOferta.toFixed(2)}</p>
            </div>
            <button class="remove-item-btn">✕</button>
        `;
        cartItemRow.querySelector('.remove-item-btn').addEventListener('click', () => {
            carrito = carrito.filter(c => c.producto.id !== item.producto.id);
            actualizarInterfazCarrito();
        });
        cartItemsContainer.appendChild(cartItemRow);
    });
    cartTotalPrice.innerText = `S/ ${sumaTotal.toFixed(2)}`;
}

// ================= MODAL DE DETALLE Y RECOMENDACIONES =================
function generarRecomendaciones(productoActual) {
    contenedorSugerencias.innerHTML = "";
    const sugerencias = ropaProductos.filter(prod => prod.tag !== productoActual.tag && prod.id !== productoActual.id);
    
    sugerencias.slice(0, 2).forEach(item => {
        const itemSugerido = document.createElement('div');
        itemSugerido.classList.add('rec-card');
        itemSugerido.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="rec-card-info">
                <h5>${item.nombre}</h5>
                <p>S/ ${item.precioOferta.toFixed(2)}</p>
            </div>
        `;
        itemSugerido.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirVistaRapida(item);
        });
        contenedorSugerencias.appendChild(itemSugerido);
    });
}

function abrirVistaRapida(producto) {
    productoSeleccionadoActualmente = producto;
    document.getElementById('modal-img').src = producto.imagen;
    document.getElementById('modal-title').innerText = producto.nombre;
    document.getElementById('modal-price-sale').innerText = `S/ ${producto.precioOferta.toFixed(2)}`;
    document.getElementById('modal-price-regular').innerText = `S/ ${producto.precioRegular.toFixed(2)}`;
    document.getElementById('modal-desc').innerText = producto.descripcion;
    generarRecomendaciones(producto);
    modal.style.display = 'flex';
}

if(closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');

document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    if (productoSeleccionadoActualmente) {
        const itemExistente = carrito.find(item => item.producto.id === productoSeleccionadoActualmente.id);
        if (itemExistente) itemExistente.cantidad++; 
        else carrito.push({ producto: productoSeleccionadoActualmente, cantidad: 1 });
        actualizarInterfazCarrito();
    }
    const btn = document.getElementById('add-to-cart-btn');
    btn.innerText = "Añadido";
    setTimeout(() => {
        btn.innerText = "Añadir a la Bolsa";
        modal.style.display = 'none';
        cartSidebar.classList.add('open');
    }, 400);
});

// ================= REGISTRO E INGRESO (CONECTADO) =================
const authModal = document.getElementById('auth-modal');
const openAuthBtn = document.getElementById('open-auth-btn');
const closeAuthBtn = document.getElementById('close-auth-btn');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const userStatusArea = document.getElementById('user-status-area');

if (openAuthBtn) openAuthBtn.addEventListener('click', () => authModal.style.display = 'flex');
if (closeAuthBtn) closeAuthBtn.addEventListener('click', () => authModal.style.display = 'none');

if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active'); tabRegister.classList.remove('active');
        loginForm.classList.add('active'); registerForm.classList.remove('active');
    });
    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active'); tabLogin.classList.remove('active');
        registerForm.classList.add('active'); loginForm.classList.remove('active');
    });
}

function iniciarSesionExitoso(nombreUsuario) {
    authModal.style.display = 'none';
    userStatusArea.innerHTML = `<span class="user-welcome">👋 Perfil: ${nombreUsuario}</span>`;
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        iniciarSesionExitoso(document.getElementById('login-email').value.split('@')[0]);
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        iniciarSesionExitoso(document.getElementById('reg-name').value);
    });
}

// Cierre global de modales
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
    if (e.target === authModal) authModal.style.display = 'none';
});

checkoutBtn.addEventListener('click', () => {
    if(carrito.length === 0) return;
    alert("Redireccionando de forma segura al checkout corporativo...");
    carrito = [];
    actualizarInterfazCarrito();
    cartSidebar.classList.remove('open');
});

document.addEventListener('DOMContentLoaded', renderizarTienda);
