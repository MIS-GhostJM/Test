// Function to fetch the JSON data and populate the dropdown
async function populateCurrencyDropdown() {
    const selectElement = document.getElementById('currencySelect');
    
    try {
        const response = await fetch('currencies.json');
        const currencies = await response.json();
        
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.name} (${currency.code})`;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading currencies:', error);
    }
}

// Call the function to populate dropdown on page load
document.addEventListener('DOMContentLoaded', populateCurrencyDropdown);