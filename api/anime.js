async function searchCharacter() {
    const characterNameInput = document.getElementById('characterName');
    const characterResultDiv = document.getElementById('characterResult');
    const name = characterNameInput.value.toLowerCase().trim();

    if (!name) {
        characterResultDiv.innerHTML = '<p style="color: #e74c3c;">Please enter a character name.</p>';
        return;
    }

    characterResultDiv.innerHTML = '<div class="loader"></div><p>Searching for character...</p>';

    try {
        // Search for the character by name
        const searchUrl = `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(name)}&limit=1`;
        const searchRes = await fetch(searchUrl);

        if (!searchRes.ok) {
            throw new Error(`HTTP error! status: ${searchRes.status}`);
        }

        const searchData = await searchRes.json();

        if (searchData.data && searchData.data.length > 0) {
            // Take the top result
            const character = searchData.data[0]; // Get the first result
            
            const detailUrl = `https://api.jikan.moe/v4/characters/${character.mal_id}/full`;
            const detailRes = await fetch(detailUrl);

            if (!detailRes.ok) {
                throw new Error(`HTTP error fetching details! status: ${detailRes.status}`);
            }
            
            const detailData = await detailRes.json();
            const fullCharacter = detailData.data;

            // FIX: Use .anime instead of .animeography for v4
            const animeAppearances = (fullCharacter.anime || [])
                .slice(0, 5) // Limit to top 5 appearances
                .map(item => `<li><a href="${item.anime.url}" target="_blank">${item.anime.title}</a> <span class="role">(${item.role})</span></li>`)
                .join('');

            // FIX: Clean up MAL markdown like [i], [b], etc.
            let aboutText = fullCharacter.about ? fullCharacter.about.replace(/\[\/?(?:b|i|u|url|spoiler)\]/g, '') : 'No description available.';
            aboutText = aboutText.substring(0, 400) + (aboutText.length > 400 ? '...' : '');

            characterResultDiv.innerHTML = `
                <div class="character-card">
                    <img src="${fullCharacter.images.jpg.large_image_url || fullCharacter.images.jpg.image_url}" alt="${fullCharacter.name}">
                    <h2>${fullCharacter.name}</h2>
                    ${fullCharacter.name_kanji ? `<p><strong>Kanji:</strong> ${fullCharacter.name_kanji}</p>` : ''}
                    ${fullCharacter.nicknames && fullCharacter.nicknames.length > 0 ? `<p><strong>Nicknames:</strong> ${fullCharacter.nicknames.join(', ')}</p>` : ''}
                    <h3>About</h3>
                    <p class="about-text">${aboutText}</p>
                    <h3>Anime Appearances</h3>
                    <ul class="anime-list">
                        ${animeAppearances || '<li>No anime appearances found.</li>'}
                    </ul>
                </div>
            `;
        } else {
            characterResultDiv.innerHTML = `<p style="color: #e74c3c;">Character "${name}" not found. Please try another name.</p>`;
        }

    } catch (error) {
        console.error('Error fetching character data:', error);
        characterResultDiv.innerHTML = `<p style="color: #e74c3c;">Error: Could not fetch character data. ${error.message}</p>`;
    }
}

// Event listener for the search button
document.getElementById('searchBtn').addEventListener('click', searchCharacter);

// Allow searching by pressing Enter key in the input field
document.getElementById('characterName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchCharacter();
    }
});