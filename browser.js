const renderOutput = document.getElementById('render-output');
const urlInput = document.getElementById('url-input');
const tabTitle = document.getElementById('tab-title');
const goButton = document.getElementById('go-btn');
const homeButton = document.getElementById('home-btn');
const engineStatus = document.getElementById('engine-status');

/**
 * Checks if the text string typed is a pure URL domain address format
 */
function checkIsURL(str) {
    if (str.includes(" ") || !str.includes(".")) {
        return false;
    }
    return true;
}

/**
 * Custom Fetch Rendering Core Machine Engine
 */
function runEngine() {
    let input = urlInput.value.trim();
    if (!input) return;

    engineStatus.innerText = "Connecting Network...";
    renderOutput.innerHTML = "<h3>Loading data stream... Please wait...</h3>";

    if (checkIsURL(input)) {
        // Website Mode
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
            input = 'https://' + input;
        }
        tabTitle.innerText = input.replace('https://','').replace('www.','');

        // We fetch the target webpage HTML source code structure directly using an open proxy bridge bypass
        const fetchUrl = `https://allorigins.win{encodeURIComponent(input)}`;

        fetch(fetchUrl)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Network error response issue occurred.');
            })
            .then(data => {
                engineStatus.innerText = "Bypassing Security Walls...";
                // Inject the live page directly into the screen container layout safely!
                renderOutput.innerHTML = data.contents;
                engineStatus.innerText = "Page Rendered Successfully";
            })
            .catch(err => {
                renderOutput.innerHTML = `<h3 style="color:red;">Error loading website: ${input}. The host site might be private or offline. Try typing an open site like 'wikipedia.org'</h3>`;
                engineStatus.innerText = "Connection Failed";
            });

    } else {
        // Search Engine Mode (Behind the scenes query connection processing)
        tabTitle.innerText = "Search: " + input;
        
        // Connects to Wikipedia Open API Engine to pull live real search answers and data listings instantly
        const searchApi = `https://wikipedia.org{encodeURIComponent(input)}&format=json&origin=*`;

        fetch(searchApi)
            .then(res => res.json())
            .then(data => {
                const results = data.query.search;
                if(results.length === 0) {
                    renderOutput.innerHTML = `<h3>No active results found for "${input}". Try searching another topic!</h3>`;
                    return;
                }

                let htmlContent = `<h2>Search Results for: ${input}</h2><hr>`;
                results.forEach(item => {
                    htmlContent += `
                        <div class="search-item">
                            <a href="https://wikipedia.org{encodeURIComponent(item.title)}" target="_blank">${item.title}</a>
                            <p>${item.snippet}...</p>
                        </div>
                    `;
                });

                renderOutput.innerHTML = htmlContent;
                engineStatus.innerText = "Search Engine Results Ready";
            })
            .catch(err => {
                renderOutput.innerHTML = "<h3>Failed to pull search data. Check internet connection.</h3>";
                engineStatus.innerText = "Search Error";
            });
    }
}

// Button Events binding configuration
goButton.addEventListener('click', runEngine);
urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runEngine();
});

homeButton.addEventListener('click', () => {
    urlInput.value = "";
    tabTitle.innerText = "Browser Home";
    renderOutput.innerHTML = `
        <h2>Welcome to HTML Sandbox Browser</h2>
        <p>Type a topic or search string into the address bar above to browse information live without any frame blocks.</p>
    `;
    engineStatus.innerText = "Engine Status: Idle";
});

