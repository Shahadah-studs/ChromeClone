// ChromeCloneX
const iframe = document.getElementById('browser-viewport');
const addressInput = document.getElementById('address-input');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const reloadBtn = document.getElementById('reload-btn');
const homeBtn = document.getElementById('home-btn');
const useProxyCheck = document.getElementById('use-proxy');
const currentStatus = document.getElementById('current-status');


const HOME_PAGE = 'https://google.com'; 


const PROXY_PREFIX = 'https://allorigins.win';

let historyStack = [];
let historyIndex = -1;

function updateNavButtons() {
    backBtn.disabled = historyIndex <= 0;
    backBtn.style.opacity = backBtn.disabled ? "0.4" : "1";
    
    forwardBtn.disabled = historyIndex >= historyStack.length - 1;
    forwardBtn.style.opacity = forwardBtn.disabled ? "0.4" : "1";
}

function navigateTo(target, addToHistory = true) {
    let url = target.trim();
    if (!url) return;

    // Détection s'il s'agit d'une URL valide ou d'une recherche textuelle
    const isUrl = url.includes('.') && !url.includes(' ');
    
    if (!isUrl) {
        url = `https://google.com{encodeURIComponent(url)}&igu=1`; 
    } else {
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        // Force le paramètre anti-X-Frame si l'utilisateur saisit l'adresse Google racine
        if (url.includes('google.com') && !url.includes('igu=1')) {
            url = url.includes('?') ? `${url}&igu=1` : `${url}?igu=1`;
        }
    }

    if (addToHistory) {
        // Si on navigue après un retour en arrière, on efface la branche supérieure future
        if (historyIndex < historyStack.length - 1) {
            historyStack = historyStack.slice(0, historyIndex + 1);
        }
        historyStack.push(url);
        historyIndex = historyStack.length - 1;
    }

    let finalUrl = url;
    if (useProxyCheck.checked && !url.includes('google.com')) {
        finalUrl = PROXY_PREFIX + encodeURIComponent(url);
        currentStatus.innerText = "Statut : Routage Proxy actif...";
    } else {
        currentStatus.innerText = "Statut : Connexion directe...";
    }

    addressInput.value = url;
    iframe.src = finalUrl;
    updateNavButtons();
}
addressInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        navigateTo(addressInput.value);
    }
});

addressInput.addEventListener('focus', () => {
    addressInput.select();
});


backBtn.addEventListener('click', () => {
    if (historyIndex > 0) {
        historyIndex--;
        navigateTo(historyStack[historyIndex], false);
    }
});


forwardBtn.addEventListener('click', () => {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        navigateTo(historyStack[historyIndex], false);
    }
});


reloadBtn.addEventListener('click', () => {
    iframe.src = iframe.src;
    currentStatus.innerText = "Statut : Actualisation...";
});


homeBtn.addEventListener('click', () => {
    navigateTo(HOME_PAGE);
});

// XD
iframe.addEventListener('load', () => {
    currentStatus.innerText = "Statut : Page chargée avec succès";
});


navigateTo(HOME_PAGE);

