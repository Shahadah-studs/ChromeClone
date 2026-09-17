const renderOutput = document.getElementById('render-output');
const urlInput = document.getElementById('url-input');
const tabTitle = document.getElementById('tab-title');
const goButton = document.getElementById('go-btn');
const homeButton = document.getElementById('home-btn');
const engineStatus = document.getElementById('engine-status');

const searchView = document.getElementById('search-view');
const browserFrame = document.getElementById('browser-frame');

/**
 * Loads a real live Wikipedia article cleanly inside the app frame without CORS errors
 */
function launchArticle(articleTitle) {
    engineStatus.innerText = "Opening Document...";
    
    // Hide search layer, show iframe layer
    searchView.style.display = "none";
    browserFrame.style.display = "block";
    
    // We target the official open mobile endpoint which permits framing display channels
    const targetArticleUrl = `https://wikipedia.org{encodeURIComponent(articleTitle)}`;
    
    browserFrame.src = targetArticleUrl;
    tabTitle.innerText = articleTitle;
    urlInput.value = `en.wikipedia.org/wiki/${articleTitle}`;
    engineStatus.innerText = "Live Article Loaded";
}

/**
 * Custom Search Query Pipeline Machine
 */
function executeSearch() {
    let input = urlInput.value.trim();
    if (!input) return;

    // Switch back to search screen layer
    browserFrame.style.display = "none";
    searchView.style.display = "block";

    engineStatus.innerText = "Querying Wikipedia...";
    renderOutput.innerHTML = "<h3>Fetching secure web nodes... Please wait...</h3>";
    tabTitle.innerText = "Search: " + input;

    let cleanQuery = input.replace('https://','').replace('http://','').replace('www.','').replace('en.wikipedia.org/wiki/', '');

    // Connect directly to live open api endpoint
    const apiUrl = `https://wikipedia.org{encodeURIComponent(cleanQuery)}&format=json&origin=*`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error("Network Response Failure");
            return response.json();
        })
        .then(data => {
            const resultsArray = data.query.search;
            
            if (resultsArray.length === 0) {
                renderOutput.innerHTML = `<h3>No matching active entries found for "${input}". Try searching another topic!</h3>`;
                engineStatus.innerText = "Search Completed (Empty)";
                return;
            }

            let builtHtml = `<h2>Wikipedia Search Results for: <i>${input}</i></h2><br>`;
            
            resultsArray.forEach(item => {
                // Clicking the title triggers our custom launchArticle script action function
                builtHtml += `
                    <div class="search-card">
                        <h3><button onclick="launchArticle('${item.title.replace(/'/g, "\\'")}')">${item.title}</button></h3>
                        <p>${item.snippet}...</p>
                    </div>
                `;
            });

            renderOutput.innerHTML = builtHtml;
            engineStatus.innerText = "Render Complete";
        })
        .catch(error => {
            renderOutput.innerHTML = `<h3 style="color:red;">Engine Processing Error. Please try checking your internet connection.</h3>`;
            engineStatus.innerText = "Error Hooked";
        });
}

// Map Action Controls
goButton.addEventListener('click', executeSearch);
urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeSearch();
});

homeButton.addEventListener('click', () => {
    urlInput.value = "";
    tabTitle.innerText = "Wikipedia Portal";
    browserFrame.src = "";
    browserFrame.style.display = "none";
    searchView.style.display = "block";
    renderOutput.innerHTML = `
        <div class="welcome-screen">
            <h2>Custom Wikipedia Sandbox Browser</h2>
            <p>Type any keyword or topic in the address bar above. Results and entire articles will load right here inside this app screen without errors.</p>
        </div>
    `;
    engineStatus.innerText = "Status: Ready";
});

