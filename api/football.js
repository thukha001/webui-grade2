async function searchFootballPlayer() {
    const input = document.getElementById('playerName');
    const resultDiv = document.getElementById('playerResult');
    const name = input.value.trim();

    if (!name) return;

    resultDiv.innerHTML = '<div class="skeleton"></div><p style="text-align:center; color:var(--primary); font-weight:800; letter-spacing:2px; animation: pulse 1s infinite alternate;">SYSTEM ANALYZING...</p>';

    try {
        // TheSportsDB API v3
        const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.player) {
            resultDiv.innerHTML = '<p style="color:red;">No player found in current database.</p>';
            return;
        }

        const p = data.player[0]; // Take the best match

        resultDiv.innerHTML = `
            <div class="player-card">
                <div class="player-header">
                    <img class="player-img" src="${p.strThumb || 'https://www.thesportsdb.com/images/media/player/thumb/default_avatar.jpg'}" alt="${p.strPlayer}">
                    <div>
                        <h2 style="margin:0; font-size:2rem; letter-spacing:-1px;">${p.strPlayer}</h2>
                        <span style="color:var(--primary); font-weight:800;"><i class="fa-solid fa-shield-halved"></i> ${p.strTeam}</span>
                    </div>
                </div>
                <div class="info-section">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label"><i class="fa-solid fa-crosshairs"></i> Position</span>
                            <span class="value">${p.strPosition}</span>
                        </div>
                        <div class="info-item">
                            <span class="label"><i class="fa-solid fa-earth-americas"></i> Origin</span>
                            <span class="value">${p.strNationality}</span>
                        </div>
                        <div class="info-item">
                            <span class="label"><i class="fa-solid fa-bolt"></i> Strong Foot</span>
                            <span class="value">${p.strSide || 'Both'}</span>
                        </div>
                        <div class="info-item">
                            <span class="label"><i class="fa-solid fa-microchip"></i> Profile</span>
                            <span class="value">${p.strInstagram ? 'High Value' : 'Standard'}</span>
                        </div>
                    </div>
                    <div class="bio">
                        <span class="label"><i class="fa-solid fa-terminal"></i> Intel Summary</span>
                        <p class="bio-text">${p.strDescriptionEN ? p.strDescriptionEN.substring(0, 400) + '...' : 'Analysis complete. Bio data restricted.'}</p>
                    </div>
                    <div class="source-note">
                        CONNECTED TO GLOBAL_SPORTS_DB_v3 // SECURE_LINK
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = '<p>Error connecting to sports database.</p>';
    }
}

document.getElementById('searchBtn').addEventListener('click', searchFootballPlayer);
document.getElementById('playerName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchFootballPlayer();
});