// ==================== CONFIGURACIÓN ====================
const CONFIG = {
    API_URL: 'https://v2.jokeapi.dev/joke/',
    HISTORY_MAX: 10,
    DEFAULT_TYPE: 'any'
};

// ==================== ESTADO DE LA APLICACIÓN ====================
let appState = {
    currentJoke: null,
    currentType: 'any',
    jokeCount: 0,
    jokeHistory: [],
    isLoading: false
};

// ==================== ELEMENTOS DEL DOM ====================
const elements = {
    jokeText: document.getElementById('jokeText'),
    jokeType: document.getElementById('jokeType'),
    getJokeBtn: document.getElementById('getJokeBtn'),
    shareBtn: document.getElementById('shareBtn'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    historyList: document.getElementById('historyList'),
    jokeCount: document.getElementById('jokeCount'),
    filterBtns: document.querySelectorAll('.filter-btn')
};

// ==================== FUNCIONES PRINCIPALES ====================

/**
 * Obtiene un chiste de la API externa
 */
async function fetchJoke(type = 'any') {
    try {
        // Muestra el spinner de carga
        showLoading(true);
        appState.isLoading = true;
        
        // Construye la URL según el tipo
        let url = `${CONFIG.API_URL}${type}`;
        url += '?format=json&safe-mode';

        console.log(`📡 Fetching joke from: ${url}`);

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error('No jokes found for this category');
        }

        // Procesa el chiste
        const jokeText = data.type === 'twopart' 
            ? `${data.setup}\n\n${data.delivery}`
            : data.joke;

        const joke = {
            text: jokeText,
            type: data.category,
            id: Date.now()
        };

        // Actualiza el estado
        appState.currentJoke = joke;
        appState.jokeCount++;
        appState.jokeHistory.unshift(joke);

        // Limita el historial
        if (appState.jokeHistory.length > CONFIG.HISTORY_MAX) {
            appState.jokeHistory.pop();
        }

        // Actualiza la UI
        displayJoke(joke);
        updateStats();
        updateHistory();

        return joke;

    } catch (error) {
        console.error('❌ Error fetching joke:', error);
        showError(`Error: ${error.message}`);
    } finally {
        showLoading(false);
        appState.isLoading = false;
    }
}

/**
 * Muestra el chiste en la interfaz
 */
function displayJoke(joke) {
    if (!joke) return;

    elements.jokeText.textContent = joke.text;
    elements.jokeType.textContent = `📌 Category: ${joke.type}`;
    
    // Habilita el botón de compartir
    elements.shareBtn.disabled = false;

    // Añade animación
    elements.jokeText.style.animation = 'none';
    setTimeout(() => {
        elements.jokeText.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

/**
 * Muestra/oculta el spinner de carga
 */
function showLoading(show) {
    if (show) {
        elements.loadingSpinner.classList.add('show');
        elements.getJokeBtn.disabled = true;
    } else {
        elements.loadingSpinner.classList.remove('show');
        elements.getJokeBtn.disabled = false;
    }
}

/**
 * Muestra un mensaje de error
 */
function showError(message) {
    elements.jokeText.textContent = `⚠️ ${message}`;
    elements.jokeType.textContent = '';
    elements.shareBtn.disabled = true;
}

/**
 * Actualiza las estadísticas
 */
function updateStats() {
    elements.jokeCount.textContent = appState.jokeCount;
}

/**
 * Actualiza el historial de chistes
 */
function updateHistory() {
    if (appState.jokeHistory.length === 0) {
        elements.historyList.innerHTML = '<li class="empty">No jokes yet</li>';
        return;
    }

    elements.historyList.innerHTML = appState.jokeHistory
        .map(joke => `
            <li onclick="loadFromHistory(${joke.id})">
                ${joke.text.substring(0, 50)}...
            </li>
        `)
        .join('');
}

/**
 * Carga un chiste del historial
 */
function loadFromHistory(jokeId) {
    const joke = appState.jokeHistory.find(j => j.id === jokeId);
    if (joke) {
        appState.currentJoke = joke;
        displayJoke(joke);
    }
}

/**
 * Comparte el chiste actual
 */
function shareJoke() {
    if (!appState.currentJoke) return;

    const jokeText = appState.currentJoke.text;
    const shareText = `😂 ${jokeText}\n\n#JokeGenerator`;

    // Intenta usar la API de compartir si está disponible
    if (navigator.share) {
        navigator.share({
            title: 'Random Joke',
            text: shareText,
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Copia al portapapeles como alternativa
        copyToClipboard(shareText);
    }
}

/**
 * Copia el texto al portapapeles
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Joke copied to clipboard! 📋');
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

/**
 * Muestra una notificación
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #26de81;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Cambia el tipo de chiste seleccionado
 */
function changeJokeType(type) {
    appState.currentType = type;
    
    // Actualiza el estado visual de los botones
    elements.filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });

    // Obtiene un nuevo chiste del tipo seleccionado
    fetchJoke(type);
}

// ==================== EVENT LISTENERS ====================

/**
 * Inicializa los event listeners
 */
function initializeEventListeners() {
    // Botón de obtener chiste
    elements.getJokeBtn.addEventListener('click', () => {
        fetchJoke(appState.currentType);
    });

    // Botón de compartir
    elements.shareBtn.addEventListener('click', shareJoke);

    // Botones de filtro
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            changeJokeType(btn.dataset.type);
        });
    });
}

/**
 * Inicializa la aplicación
 */
function initializeApp() {
    console.log('🚀 Initializing Joke Generator...');
    
    initializeEventListeners();
    
    // Carga un chiste inicial
    fetchJoke(CONFIG.DEFAULT_TYPE);
    
    console.log('✅ Joke Generator ready!');
}

// ==================== EJECUCIÓN ====================

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initializeApp);

// ==================== ESTILOS DINÁMICOS ====================

// Añade estilos para las animaciones de notificación
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(styleSheet);

// ==================== API PÚBLICA ====================

/**
 * Expone funciones públicas para acceso desde consola
 */
window.jokeGeneratorAPI = {
    /**
     * Obtiene un nuevo chiste
     * @param {string} type - Tipo de chiste (any, general, programming, knock-knock)
     */
    getJoke: (type = 'any') => fetchJoke(type),

    /**
     * Obtiene el chiste actual
     */
    getCurrentJoke: () => appState.currentJoke,

    /**
     * Obtiene el historial de chistes
     */
    getHistory: () => appState.jokeHistory,

    /**
     * Obtiene estadísticas
     */
    getStats: () => ({
        totalJokes: appState.jokeCount,
        historyCount: appState.jokeHistory.length
    }),

    /**
     * Comparte el chiste actual
     */
    share: shareJoke,

    /**
     * Limpia el historial
     */
    clearHistory: () => {
        appState.jokeHistory = [];
        updateHistory();
        console.log('✅ History cleared');
    }
};

console.log('📚 Joke Generator API available: window.jokeGeneratorAPI');
