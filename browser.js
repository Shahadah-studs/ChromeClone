// Global Component DOM Element Nodes Setup
const iframe = document.getElementById('browser-frame');
const urlInput = document.getElementById('url-input');
const tabTitle = document.getElementById('tab-title');
const goButton = document.getElementById('go-btn');
const homeButton = document.getElementById('home-btn');
const reloadButton = document.getElementById('reload-btn');

// Initial Core Configurations
const DEFAULT_HOME_PAGE = "https://wikipedia.org";

/**
 * Executes safe navigation routing when a request is made
 */
function handleNavigation() {
    let queryInput = urlInput.value.trim();
    if (!queryInput) return;

    let targetedUrl = "";

    // Validation Rule A: If input string doesn't look like a standard domain dot format, query it on Google
    if (!queryInput.includes('.') || queryInput.includes(' ')) {
        targetedUrl = "https://google.com" + encodeURIComponent(queryInput);
        tabTitle.innerText = "Google Search Result";
    } else {
        // Validation Rule B: Enforce explicit TLS secure transport protocols if forgotten
        if (!queryInput.startsWith('http://') && !queryInput.startsWith('https://')) {
            queryInput = 'https://' + queryInput;
        }
        
        // Validation Rule C: Wrap targeted content inside an opensocial google edge cache engine framework pipeline
        // This stops external websites from blocking your internal layout display via X-Frame security blocks
        targetedUrl = "https://images" + Math.floor(Math.random() * 10) + "://googleusercontent.com" + encodeURIComponent(queryInput);
        
        // Clean display text title configuration rules formatting
        tabTitle.innerText = queryInput.replace('https://', '').replace('http://', '').replace('www.', '');
    }

    // Set updated sandbox location target link
    iframe.src = targetedUrl;
}

// Action Listener Registrations
goButton.addEventListener('click', handleNavigation);

urlInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleNavigation();
    }
});

homeButton.addEventListener('click', () => {
    urlInput.value = "";
    iframe.src = DEFAULT_HOME_PAGE;
    tabTitle.innerText = "Wikipedia";
});

reloadButton.addEventListener('click', () => {
    const currentFrameSource = iframe.src;
    iframe.src = ''; // Temporary clear step to force frame element redraw
    iframe.src = currentFrameSource;
});
