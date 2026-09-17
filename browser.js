// Dom Element Declarations
const iframe = document.getElementById('browser-frame');
const urlInput = document.getElementById('url-input');
const tabTitle = document.getElementById('tab-title');
const goButton = document.getElementById('go-btn');
const homeButton = document.getElementById('home-btn');
const reloadButton = document.getElementById('reload-btn');
const engineStatus = document.getElementById('engine-status');

// Fallback configuration
const HOME_PAGE_URL = "https://google.com";

/**
 * Validates whether the typed string is an active website URL format
 */
function isValidURL(string) {
    // Basic browser logic check: if it has spaces or no dot, it is a search query, not a URL
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
        // Fix missing protocols
        if (!userInput.startsWith('http://') && !userInput.startsWith('https://')) {
            userInput = 'https://' + userInput;
        }
        
        // Pass through a CORS API unblocker to force hard-to-load web headers into the iframe
        targetDestination = "https://allorigins.win" + encodeURIComponent(userInput);
        
        // Update browser frame directly with the smart target path
        tabTitle.innerText = userInput.replace('https://','').replace('www.','');
        
        // Use an active secondary render pipe layout fallback if the site has strict scripts
        iframe.src = `https://images${Math.floor(Math.random() * 8)}://googleusercontent.com{encodeURIComponent(userInput)}`;
    } else {
        // BEHIND THE SCENES: If it's a random link or random words, connect directly to Google Search Engine
        targetDestination = "https://google.com&q=" + encodeURIComponent(userInput);
        tabTitle.innerText = "Google Search: " + userInput;
        iframe.src = targetDestination;
    }
    
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
    tabTitle.innerText = "Google Home";
    engineStatus.innerText = "Network: Connected";
});

reloadButton.addEventListener('click', () => {
    const currentLoc = iframe.src;
    iframe.src = '';
    iframe.src = currentLoc;
});

// Event listener to monitor when frame completes standard render cycles
iframe.addEventListener('load', () => {
    engineStatus.innerText = "Network: Ready";
});
