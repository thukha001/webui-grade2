async function getPokemon() {
    const nameInput = document.getElementById('name');
    const resultDiv = document.getElementById('section1-result');
    const name = nameInput.value.toLowerCase().trim();
    
    if (!name) return;

    resultDiv.innerHTML = '<p>Searching...</p>';

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error('Pokemon not found');
        
        const data = await res.json();

        const stats = data.stats
            .map(s => `<li><strong>${s.stat.name.toUpperCase()}:</strong> ${s.base_stat}</li>`)
            .join('');

        const types = data.types
            .map(t => `<span class="type-badge">${t.type.name}</span>`)
            .join('');

        resultDiv.innerHTML = `
            <div class="pokemon-card">
                <img src="${data.sprites.other['official-artwork'].front_default || data.sprites.front_default}" alt="${data.name}">
                <h2 style="text-transform: capitalize;">${data.name}</h2>
                <div class="types">${types}</div>
                <ul>${stats}</ul>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: #ff4757;">Error: ${error.message}. Please try again!</p>`;
    }
}
document.getElementById('section1-btn').addEventListener('click', getPokemon);