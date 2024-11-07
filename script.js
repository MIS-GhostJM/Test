let currencies = [];

// Function to fetch the JSON data
async function loadCurrencies() {
    try {
        const response = await fetch('currencies.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        currencies = await response.json();
    } catch (error) {
        console.error('Error loading currencies:', error);
        alert("Could not load currencies. Please check if 'currencies.json' exists and is accessible.");
    }
}

// Function to display suggestions based on input
function showSuggestions(value) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (value.trim() === '') {
        return;
    }

    const filteredCurrencies = currencies.filter(currency =>
        currency.name.toLowerCase().includes(value.toLowerCase()) ||
        currency.code.toLowerCase().includes(value.toLowerCase())
    );

    filteredCurrencies.forEach(currency => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = `${currency.name} (${currency.code})`;
        suggestionItem.dataset.code = currency.code; // Store the code for easy access

        suggestionItem.addEventListener('click', () => {
            document.getElementById('currencyInput').value = currency.code; // Set only the code
            suggestionsContainer.innerHTML = ''; // Clear suggestions
        });

        suggestionsContainer.appendChild(suggestionItem);
    });
}

// Event listener for input changes
document.getElementById('currencyInput').addEventListener('input', (event) => {
    showSuggestions(event.target.value);
});

// Initialize by loading currencies on page load
document.addEventListener('DOMContentLoaded', loadCurrencies);
