// TOUCHLINE — player search
// Data source: TheSportsDB free public test endpoint (key "3") — no signup or API key required.
// Docs: https://www.thesportsdb.com/free_sports_api

const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
const FALLBACK_IMG = "https://placehold.co/216x216/123522/f5f3ea?text=No+Photo";

const form = document.getElementById("searchForm");
const input = document.getElementById("playerInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch();
});

async function handleSearch() {
  const name = input.value.trim();
  if (!name) {
    shake(input);
    return;
  }

  setLoading(true);
  showSkeleton();

  try {
    const res = await fetch(`${API_BASE}/searchplayers.php?p=${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();
    const player = data.players ? data.players[0] : null;

    if (!player) {
      showEmpty(`No player found for "${name}". Check the spelling and try again.`);
      return;
    }

    renderPlayer(player);
  } catch (err) {
    console.error(err);
    showError("Couldn't reach the player database. Check your connection and try again.");
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  searchBtn.querySelector("span").textContent = isLoading ? "Searching…" : "Search";
}

function showSkeleton() {
  results.innerHTML = `<div class="skeleton"></div>`;
}

function showEmpty(message) {
  results.innerHTML = `<p class="empty-state">${escapeHtml(message)}</p>`;
}

function showError(message) {
  results.innerHTML = `<p class="error-state">${escapeHtml(message)}</p>`;
}

function renderPlayer(p) {
  const photo = p.strCutout || p.strThumb || p.strRender || FALLBACK_IMG;
  const team = p.strTeam || "Free agent";
  const jersey = (p.strNumber && p.strNumber.trim()) || "—";
  const bioRaw = p.strDescriptionEN || "No scouting notes on file for this player yet.";
  const bio = bioRaw.split(". ").slice(0, 3).join(". ").trim();

  const rows = [
    ["Position", p.strPosition],
    ["Nationality", p.strNationality],
    ["Born", p.dateBorn],
    ["Height", p.strHeight],
    ["Weight", p.strWeight],
    ["Status", p.strStatus],
  ].filter(([, v]) => v && v.trim());

  results.innerHTML = `
    <div class="card">
      <div class="card-top">
        <span class="squad-number">${escapeHtml(jersey)}</span>
        <img class="card-photo" src="${photo}" alt="${escapeHtml(p.strPlayer)}"
             onerror="this.src='${FALLBACK_IMG}'">
        <div>
          <h2 class="card-name">${escapeHtml(p.strPlayer)}</h2>
          <span class="card-team">${escapeHtml(team)}</span>
        </div>
      </div>
      <div class="sheet">
        ${rows.map(([k, v]) => `
          <div class="sheet-row">
            <span class="k">${escapeHtml(k)}</span>
            <span class="v">${escapeHtml(v)}</span>
          </div>
        `).join("")}
        <p class="bio">${escapeHtml(bio)}${bio.endsWith(".") ? "" : "."}</p>
        <div class="source-note">Data via TheSportsDB</div>
      </div>
    </div>
  `;
}

function shake(el) {
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 220, easing: "ease-in-out" }
  );
  el.focus();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}