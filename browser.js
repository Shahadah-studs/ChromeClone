const renderOutput = document.getElementById('render-output');
const urlInput = document.getElementById('url-input');
const tabTitle = document.getElementById('tab-title');
const goButton = document.getElementById('go-btn');
const homeButton = document.getElementById('home-btn');
const engineStatus = document.getElementById('engine-status');

function executeSearch() {
    let input = urlInput.value.trim();
    if (!input) return;

    engineStatus.innerText = "Querying Database...";
    renderOutput.innerHTML = "<h3>Fetching secure web nodes... Please wait...</h3>";
    tabTitle.innerText = "Search: " + input;

    // Clean up input to handle web addresses safely by reading text layers
    let cleanQuery = input.replace('https://','').replace('http://','').replace('www.','');

    // Official open access endpoint with ZERO CORS frame restriction parameters
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

            let builtHtml = `<h2>Search Results for: <i>${input}</i></h2><br>`;
            
            resultsArray.forEach(item => {
                builtHtml += `
                    <div class="search-card">
                        <h3><a href="https://wikipedia.org{encodeURIComponent(item.title)}" target="_blank">${item.title}</a></h3>
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
    tabTitle.innerText = "Sandbox Search Engine";
    renderOutput.innerHTML = `
        <div class="welcome-screen">
            <h2>Custom HTML Sandbox Browser</h2>
            <p>Type any keyword or topic in the address bar above to safely scrape and fetch database files directly into your view container.</p>
        </div>
    `;
    engineStatus.innerText = "Status: Online";
});

