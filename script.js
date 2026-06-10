// ==================== DATOS DE ARCHIVOS ====================
const archivos = [
    {
        id: 1,
        nombre: "Unidad 3 - Fundamentos de IA",
        tipo: "pdf",
        tamaño: "2.5 MB",
        descripcion: "Conceptos fundamentales y bases teóricas de la Inteligencia Artificial",
        url: "https://github.com/kpktygrmzz-source/Grupo-Paz/raw/main/Unidad%203%20IA.%20,,.pdf",
        icono: "📄"
    },
    {
        id: 2,
        nombre: "Unidad 4 - Avances en IA",
        tipo: "pdf",
        tamaño: "4.0 MB",
        descripcion: "Últimos avances y tendencias en Inteligencia Artificial y machine learning",
        url: "https://github.com/kpktygrmzz-source/Grupo-Paz/raw/main/Unidad%204%20IA.,..pdf",
        icono: "📊"
    },
    {
        id: 3,
        nombre: "Unidad 5-6 - Aplicaciones de IA",
        tipo: "pages",
        tamaño: "117 KB",
        descripcion: "Casos de estudio y aplicaciones prácticas de Inteligencia Artificial",
        url: "https://github.com/kpktygrmzz-source/Grupo-Paz/raw/main/Ia%20unidad%205-%206.pages",
        icono: "💡"
    }
];

// ==================== FUNCIONES DE UTILIDAD ====================

/**
 * Formatea el tamaño del archivo de manera legible
 */
function formatearTamaño(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Desplaza suavemente a una sección
 */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Abre el modal con detalles del archivo
 */
function abrirModal(archivoId) {
    const archivo = archivos.find(a => a.id === archivoId);
    if (!archivo) return;

    const modal = document.getElementById('archivoModal');
    document.getElementById('modalTitle').textContent = archivo.nombre;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="text-align: center; margin: 1rem 0;">
            <p style="font-size: 3rem; margin: 0;">${archivo.icono}</p>
        </div>
        <p><strong>Tipo:</strong> ${archivo.tipo.toUpperCase()}</p>
        <p><strong>Tamaño:</strong> ${archivo.tamaño}</p>
        <p><strong>Descripción:</strong> ${archivo.descripcion}</p>
    `;
    
    const modalLink = document.getElementById('modalLink');
    modalLink.href = archivo.url;
    modalLink.download = archivo.nombre + '.' + archivo.tipo;
    
    modal.style.display = 'block';
}

/**
 * Cierra el modal
 */
function cerrarModal() {
    document.getElementById('archivoModal').style.display = 'none';
}

/**
 * Renderiza las tarjetas de archivos
 */
function renderizarArchivos(filtro = 'todos') {
    const grid = document.getElementById('archivosGrid');
    grid.innerHTML = '';

    const archivosFiltrados = filtro === 'todos' 
        ? archivos 
        : archivos.filter(a => a.tipo === filtro);

    archivosFiltrados.forEach(archivo => {
        const card = document.createElement('div');
        card.className = 'archivo-card';
        card.innerHTML = `
            <div class="archivo-icon">${archivo.icono}</div>
            <h3>${archivo.nombre}</h3>
            <p>${archivo.descripcion}</p>
            <div class="archivo-size">
                <strong>Tipo:</strong> ${archivo.tipo.toUpperCase()} | 
                <strong>Tamaño:</strong> ${archivo.tamaño}
            </div>
            <button class="btn-primary" onclick="abrirModal(${archivo.id})">
                Ver Detalles
            </button>
        `;
        grid.appendChild(card);
    });

    // Añade animación a las tarjetas
    const cards = document.querySelectorAll('.archivo-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });
}

/**
 * Configura los listeners de filtros
 */
function configurarFiltros() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remueve la clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Añade la clase active al botón clickeado
            this.classList.add('active');
            // Filtra los archivos
            const filtro = this.getAttribute('data-filter');
            renderizarArchivos(filtro);
        });
    });
}

/**
 * Configura los listeners del menú hamburguesa
 */
function configurarHamburgesa() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Cierra el menú al hacer click en un link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
}

/**
 * Configura los listeners del formulario de contacto
 */
function configurarFormulario() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtiene los valores del formulario
        const formData = new FormData(this);
        
        // Muestra un mensaje de éxito
        alert('¡Gracias por tu mensaje! Pronto nos pondremos en contacto.');
        
        // Limpia el formulario
        this.reset();
    });
}

/**
 * Configura los listeners del modal
 */
function configurarModal() {
    const modal = document.getElementById('archivoModal');
    const closeBtn = document.querySelector('.close');

    // Cierra el modal al hacer click en la X
    closeBtn.addEventListener('click', cerrarModal);

    // Cierra el modal al hacer click fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    // Cierra el modal con la tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            cerrarModal();
        }
    });
}

/**
 * Añade efecto de scroll animado a la navbar
 */
function configurarScrollNavbar() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Scroll hacia abajo
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll hacia arriba
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    navbar.style.transition = 'transform 0.3s ease';
}

/**
 * Función para cargar dinamicamente los datos del repositorio
 */
async function cargarDatosRepositorio() {
    try {
        // Se podría hacer una llamada a la API de GitHub aquí
        // const response = await fetch('https://api.github.com/repos/kpktygrmzz-source/Grupo-Paz/contents');
        // const data = await response.json();
        // console.log('Datos del repositorio:', data);
    } catch (error) {
        console.error('Error al cargar datos del repositorio:', error);
    }
}

/**
 * Función de inicialización
 */
function inicializar() {
    console.log('🚀 Inicializando Grupo Paz - Inteligencia Artificial');
    
    // Renderiza los archivos inicialmente
    renderizarArchivos();
    
    // Configura todos los listeners
    configurarFiltros();
    configurarHamburgesa();
    configurarFormulario();
    configurarModal();
    configurarScrollNavbar();
    
    // Carga datos del repositorio
    cargarDatosRepositorio();
    
    console.log('✅ Aplicación lista');
}

// ==================== EVENT LISTENERS ====================

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializar);

// ==================== UTILIDADES ADICIONALES ====================

/**
 * Función para añadir más archivos dinámicamente
 */
function agregarArchivo(nombre, tipo, tamaño, descripcion, url, icono = '📄') {
    const nuevoArchivo = {
        id: archivos.length + 1,
        nombre,
        tipo,
        tamaño,
        descripcion,
        url,
        icono
    };
    
    archivos.push(nuevoArchivo);
    renderizarArchivos();
    console.log('Archivo añadido:', nuevoArchivo);
}

/**
 * Función para buscar archivos
 */
function buscarArchivos(termino) {
    const resultados = archivos.filter(archivo =>
        archivo.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        archivo.descripcion.toLowerCase().includes(termino.toLowerCase())
    );
    
    console.log(`Se encontraron ${resultados.length} resultado(s) para "${termino}"`);
    return resultados;
}

/**
 * Función para obtener estadísticas
 */
function obtenerEstadisticas() {
    const totalArchivos = archivos.length;
    const totalPDF = archivos.filter(a => a.tipo === 'pdf').length;
    const totalPages = archivos.filter(a => a.tipo === 'pages').length;
    
    return {
        totalArchivos,
        totalPDF,
        totalPages,
        archivos
    };
}

// Exporta funciones para uso en consola
window.gruposPazAPI = {
    agregarArchivo,
    buscarArchivos,
    obtenerEstadisticas,
    abrirModal,
    cerrarModal,
    scrollToSection
};

console.log('📚 API disponible: window.gruposPazAPI');
