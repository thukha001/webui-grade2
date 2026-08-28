/* ==========================================================================
   fixtures.js
   Lets the visitor pick a league and toggle between upcoming fixtures and
   recent results. Both lists come from the same match-card renderer, since
   the API shape is identical for future and past events.
   ========================================================================== */

(function initFixturesPage() {
  const select = document.getElementById("league-select");
  const list = document.getElementById("fixtures-list");
  const tabButtons = document.querySelectorAll(".tabs button");

  let currentTab = "upcoming";

  select.innerHTML = buildLeagueOptions(CONFIG.DEFAULT_LEAGUE);
  select.addEventListener("change", () => load());

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      currentTab = btn.dataset.tab;
      load();
    });
  });

  load();

  async function load() {
    const league = CONFIG.LEAGUES[select.value];
    showLoading(list, `Loading ${currentTab === "upcoming" ? "upcoming fixtures" : "recent results"}…`);

    try {
      const events = currentTab === "upcoming"
        ? await API.getUpcomingFixtures(league.id)
        : await API.getRecentResults(league.id);

      if (!events.length) {
        showEmpty(list, currentTab === "upcoming"
          ? `No upcoming fixtures scheduled yet for ${league.name}.`
          : `No recent results available for ${league.name}.`);
        return;
      }

      // Past results come back oldest-first from the API; show most recent first.
      const ordered = currentTab === "results" ? [...events].reverse() : events;
      list.innerHTML = ordered.map(matchCardHtml).join("");
    } catch (err) {
      showError(list, err.message);
    }
  }

  function matchCardHtml(event) {
    const hasScore = event.intHomeScore !== null && event.intHomeScore !== undefined && event.intHomeScore !== "";
    const scoreText = hasScore ? `${event.intHomeScore} – ${event.intAwayScore}` : "vs";
    return `
      <div class="match-card">
        <div class="team home">
          <img src="${event.strHomeTeamBadge || CONFIG.PLACEHOLDER_CREST}" alt="" loading="lazy">
          ${escapeHtml(event.strHomeTeam)}
        </div>
        <div class="score">
          ${escapeHtml(scoreText)}
          <span class="date">${escapeHtml(formatDate(event.dateEvent, event.strTime))}</span>
        </div>
        <div class="team away">
          <img src="${event.strAwayTeamBadge || CONFIG.PLACEHOLDER_CREST}" alt="" loading="lazy">
          ${escapeHtml(event.strAwayTeam)}
        </div>
      </div>`;
  }
})();