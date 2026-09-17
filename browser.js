// Dom Element Declarations
const iframe = document.getElementById('browser-frame');
const urlInput = document.getElementById('url-input');
const tabTitle = document.getElementById('tab-title');
const goButton = document.getElementById('go-btn');
const homeButton = document.getElementById('home-btn');
const reloadButton = document.getElementById('reload-btn');
const engineStatus = document.getElementById('engine-status');

// Clean Open Frame URL defaults
const HOME_PAGE_URL = "https://duckduckgo.com";

/**
 * Validates whether the typed string is an active website URL format
 */
function isValidURL(string) {
    if (string.includes(" ") || !string.includes(".")) {
        return false;
    }
    return true;
}

/**
 * Core Browser Navigation Execution Machine
 */
function navigate() {
    let userInput = urlInput.value.trim();
    if (!userInput) return;

    engineStatus.innerText = "Loading...";
    let targetDestination = "";

    if (isValidURL(userInput)) {
        if (!userInput.startsWith('http://') && !userInput.startsWith('https://')) {
            userInput = 'https://' + userInput;
        }
        
        // Use a client side open-social gadget script wrap proxy to unblock x-frame headers
        targetDestination = "https://images" + Math.floor(Math.random() * 10) + "://googleusercontent.com" + encodeURIComponent(userInput);
        tabTitle.innerText = userInput.replace('https://','').replace('http://','').replace('www.','');
    } else {
        // Since Google restricts direct iframes, we stream through DuckDuckGo's official open embed search frame template
        targetDestination = "https://duckduckgo.com?q=" + encodeURIComponent(userInput);
        tabTitle.innerText = "Search: " + userInput;
    }
    
    iframe.src = targetDestination;
    urlInput.value = userInput;
}

// Attach Event Listeners to Buttons
goButton.addEventListener('click', navigate);

urlInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        navigate();
    }
});

homeButton.addEventListener('click', () => {
    urlInput.value = "";
    iframe.src = HOME_PAGE_URL;
    tabTitle.innerText = "Search Home";
    engineStatus.innerText = "Network: Connected";
});

reloadButton.addEventListener('click', () => {
    const currentLoc = iframe.src;
    iframe.src = '';
    iframe.src = currentLoc;
});

iframe.addEventListener('load', () => {
    engineStatus.innerText = "Network: Ready";
});
