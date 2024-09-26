// script.js

document.getElementById('fetchButton').addEventListener('click', function () {
    const searchInput = document.getElementById('searchInput').value;
    const dropdownValue = document.getElementById('dropdown').value;

    // TODO: Define your API key
    const apiKey = 'YOUR_API_KEY';  // Replace with your actual Scopus API key

    // Construct the Scopus API URL with query parameters
    const apiUrl = `https://api.elsevier.com/content/search/scopus?query=${searchInput}&filed=${dropdownValue}&apiKey=${apiKey}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-ELS-APIKey': apiKey
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetching data");
            displayResults(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

function displayResults(data) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';  // Clear previous results

    if (data && data['search-results'] && data['search-results'].entry) {
        data['search-results'].entry.forEach(item => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result-item');

            // Extract relevant data
            const title = item['dc:title'] || 'No title available';
            const authors = item['dc:creator'] || 'No authors listed';
            const publicationName = item['prism:publicationName'] || 'No publication name';
            const publicationDate = item['prism:coverDate'] || 'No publication date';
            const link = item['link'] ? item['link'][0]['@href'] : '#';

            // Create HTML content for the result item
            resultDiv.innerHTML = `
                <h3><a href="${link}" target="_blank">${title}</a></h3>
                <p><strong>Authors:</strong> ${authors}</p>
                <p><strong>Publication:</strong> ${publicationName}</p>
                <p><strong>Date:</strong> ${publicationDate}</p>
            `;

            resultsContainer.appendChild(resultDiv);
        });
    } else {
        resultsContainer.textContent = 'No results found.';
    }
}

