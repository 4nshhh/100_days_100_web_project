document.getElementById('calculate').addEventListener('click', async function () {
    const crypto = document.getElementById('crypto').value.trim().toLowerCase();
    const amountInput = document.getElementById('amount').value.trim();
    const currency = document.getElementById('currency').value.trim().toLowerCase();
    const resultElement = document.getElementById('result');

    const amount = Number(amountInput);

    // Validate amount input
    if (!amountInput || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid positive amount.');
        return;
    }

    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
                crypto
            )}&vs_currencies=${encodeURIComponent(currency)}`
        );

        // Handle HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Validate API response structure
        if (
            !data[crypto] ||
            typeof data[crypto][currency] !== 'number'
        ) {
            throw new Error('Invalid cryptocurrency or currency selection.');
        }

        const price = data[crypto][currency];
        const result = amount * price;

        resultElement.innerText =
            `${amount} ${crypto.toUpperCase()} = ` +
            `${result.toFixed(2)} ${currency.toUpperCase()}`;

    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);

        resultElement.innerText =
            'Unable to fetch cryptocurrency prices at the moment.';

        alert('Failed to fetch data. Please try again later.');
    }
});