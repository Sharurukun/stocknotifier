/* ============================================
   StockNotifier - UI JS (Overseerr Style)
   ============================================ */

// --- i18n & State ---
const translations = {
    en: {
        nav_dashboard: "Dashboard", nav_movers: "Top Movers", nav_settings: "Settings", nav_history: "History", nav_alerts: "Alerts", nav_financials: "Financials",
        dashboard_title: "Dashboard", dashboard_subtitle: "Your tracked stocks at a glance",
        settings_title: "Settings", settings_subtitle: "System configuration",
        movers_title: "Top Movers", movers_daily: "Daily Movers", movers_weekly: "Weekly Movers",
        empty_title: "No stocks tracked yet", empty_subtitle: "Search a stock above to get started",
        search_placeholder: "Search stocks, indices, crypto...",
        btn_save: "Save Settings", btn_test: "Test", alerts_new: "New Alert", alerts_choose_type: "Choose notification type", alerts_back: "Back",
        financials_empty: "Search for a company to view its financials", fin_income: "Income Statement", fin_balance: "Balance Sheet", fin_cashflow: "Cash Flow",
        chart_close: "Close", chart_high: "High", chart_low: "Low", chart_volume: "Volume",
        toast_saved: "Settings saved", toast_added: "Stock added", toast_removed: "Stock removed", toast_test_ok: "Test OK", toast_error: "Error"
    },
    fr: {
        nav_dashboard: "Tableau de bord", nav_movers: "Top Movers", nav_settings: "Paramètres", nav_history: "Historique", nav_alerts: "Alertes", nav_financials: "Financiers",
        dashboard_title: "Tableau de bord", dashboard_subtitle: "Vos actions suivies en un coup d'œil",
        settings_title: "Paramètres", settings_subtitle: "Configuration du système",
        movers_title: "Top Movers", movers_daily: "Movers du jour", movers_weekly: "Movers de la semaine",
        empty_title: "Aucune action suivie", empty_subtitle: "Recherchez une action en haut pour commencer",
        search_placeholder: "Rechercher une action, indice, crypto...",
        btn_save: "Enregistrer", btn_test: "Tester", alerts_new: "Nouvelle Alerte", alerts_choose_type: "Choisissez le type de notification", alerts_back: "Retour",
        financials_empty: "Recherchez une entreprise", fin_income: "Compte de résultat", fin_balance: "Bilan", fin_cashflow: "Flux de trés",
        chart_close: "Clôture", chart_high: "Haut", chart_low: "Bas", chart_volume: "Volume",
        toast_saved: "Enregistré", toast_added: "Ajouté", toast_removed: "Supprimé", toast_test_ok: "Test OK", toast_error: "Erreur"
    }
};

let currentLang = localStorage.getItem("sn_lang") || "en";

function t(key) { return translations[currentLang]?.[key] || translations.en[key] || key; }

function applyLanguage() {
    document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.getAttribute("data-i18n")));
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = t(el.getAttribute("data-i18n-placeholder")));
    const langBtn = document.getElementById("langToggle");
    if (langBtn) {
        langBtn.querySelector(".lang-flag").textContent = currentLang === "en" ? "🇬🇧" : "🇫🇷";
        langBtn.querySelector(".lang-label").textContent = currentLang.toUpperCase();
    }
}

// --- Utils ---
function showToast(msg, type = "info") {
    const container = document.getElementById("toastContainer");
    if(!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

async function api(url, options = {}) {
    try {
        const resp = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
    } catch (e) {
        console.error("API Error:", e);
        throw e;
    }
}

function renderSparkline(data, positive) {
    if (!data || data.length < 2) return "";
    const w = 280, h = 40, pad = 2;
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => `${pad + (i / (data.length - 1)) * (w - 2 * pad)},${h - pad - ((v - min) / range) * (h - 2 * pad)}`);
    const color = positive ? "var(--green)" : "var(--red)";
    return `
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%; height:40px;">
            <polyline points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
}

// --- Navigation ---
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('data-target');
            if (!target) return;
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            
            link.classList.add('active');
            document.getElementById(`page-${target}`)?.classList.add('active');
            
            if(target === 'movers') loadMovers();
            if(target === 'alerts') loadAlerts();
            if(target === 'settings') loadSettings();
            if(target === 'history') loadHistory();
        });
    });
}

// --- Dashboard ---
async function loadStocks() {
    const grid = document.getElementById("stocksGrid");
    const empty = document.getElementById("emptyState");
    if(!grid) return;

    try {
        const stocks = await api("/api/stocks");
        if (!stocks.length) {
            grid.innerHTML = "";
            empty.style.display = "block";
            return;
        }
        empty.style.display = "none";

        grid.innerHTML = stocks.map(s => {
            const isPos = s.change_pct >= 0;
            const sign = isPos ? "+" : "";
            const sym = s.currency === "EUR" ? "€" : s.currency === "GBP" ? "£" : "$";
            
            return `
            <div class="stock-card" onclick="openChart('${s.symbol}', '${s.name.replace(/'/g, "\\'")}')">
                <div class="card-top">
                    <div>
                        <span class="stock-sym">${s.symbol}</span>
                        <div class="stock-name">${s.name}</div>
                    </div>
                    <button class="btn-icon" onclick="event.stopPropagation(); removeStock('${s.symbol}')">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="price-block">
                    <div class="current-price">${sym}${s.price.toFixed(2)}</div>
                    <div class="badge ${isPos ? 'positive' : 'negative'}">${sign}${s.change_pct}%</div>
                </div>
                <div class="stock-sparkline">${renderSparkline(s.sparkline, isPos)}</div>
            </div>`;
        }).join("");
    } catch (e) { showToast(t("toast_error"), "error"); }
}

async function removeStock(symbol) {
    if (!confirm(`Supprimer ${symbol} ?`)) return;
    try {
        await api(`/api/stocks/${encodeURIComponent(symbol)}`, { method: "DELETE" });
        showToast(t("toast_removed"), "success");
        loadStocks();
    } catch (e) { showToast(t("toast_error"), "error"); }
}

async function addStock(symbol, name) {
    try {
        await api("/api/stocks", { method: "POST", body: JSON.stringify({ symbol, name }) });
        showToast(t("toast_added"), "success");
        document.getElementById("stockSearch").value = "";
        document.getElementById("dropdownPanel").classList.remove("open");
        loadStocks();
    } catch (e) { showToast(t("toast_error"), "error"); }
}

// --- Search Global ---
let searchTimeout = null;
function initSearch() {
    const input = document.getElementById("stockSearch");
    const dropdown = document.getElementById("dropdownPanel");
    const results = document.getElementById("searchResults");
    if(!input) return;

    input.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        const q = input.value.trim();
        if (q.length < 2) { dropdown.classList.remove("open"); return; }
        
        searchTimeout = setTimeout(async () => {
            try {
                const data = await api(`/api/stocks/search?q=${encodeURIComponent(q)}`);
                if(!data.length) { results.innerHTML = `<div class="search-result-item">Aucun résultat</div>`; } 
                else {
                    results.innerHTML = data.map(r => `
                        <div class="search-result-item" onclick="addStock('${r.symbol}', '${r.name.replace(/'/g, "\\'")}')">
                            <span class="result-symbol">${r.symbol}</span>
                            <span class="result-name">${r.name}</span>
                        </div>`).join("");
                }
                dropdown.classList.add("open");
            } catch (e) { dropdown.classList.remove("open"); }
        }, 300);
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-container")) dropdown.classList.remove("open");
    });
}

// --- Chart Modal ---
let stockChart = null;
async function openChart(symbol, name) {
    const modal = document.getElementById("chartModal");
    if(!modal) return;
    document.getElementById("chartModalTitle").textContent = name;
    document.getElementById("chartModalSymbol").textContent = symbol;
    modal.classList.add("active");
    await loadChartData(symbol, "1mo");
}

function closeChart() {
    document.getElementById("chartModal").classList.remove("active");
}

async function loadChartData(symbol, period) {
    try {
        const data = await api(`/api/stock/${encodeURIComponent(symbol)}/history?period=${period}`);
        const ctx = document.getElementById("stockChart").getContext("2d");
        if (stockChart) stockChart.destroy();

        const labels = data.map(d => d.date);
        const closes = data.map(d => d.close);
        const isPos = closes[closes.length - 1] >= closes[0];
        const color = isPos ? "#10b981" : "#ef4444";

        stockChart = new Chart(ctx, {
            type: "line",
            data: { labels, datasets: [{ data: closes, borderColor: color, backgroundColor: color+"22", borderWidth: 2, fill: true, tension: 0.3, pointRadius: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: "#1e293b" } } } }
        });
    } catch (e) { console.error(e); }
}

// --- Settings ---
async function loadSettings() {
    try {
        const settings = await api("/api/settings");
        ["pushover_user_key", "pushover_api_token", "daily_enabled", "daily_time", "daily_monthly_change", "weekly_enabled", "weekly_day", "weekly_time"].forEach(k => {
            const el = document.getElementById(k);
            if (el) { if (el.type === "checkbox") el.checked = settings[k] === "true"; else el.value = settings[k] || ""; }
        });
    } catch (e) {}
}

async function saveSettings() {
    const data = {};
    ["pushover_user_key", "pushover_api_token", "daily_enabled", "daily_time", "daily_monthly_change", "weekly_enabled", "weekly_day", "weekly_time"].forEach(k => {
        const el = document.getElementById(k);
        if (el) data[k] = el.type === "checkbox" ? (el.checked ? "true" : "false") : el.value;
    });
    try {
        await api("/api/settings", { method: "POST", body: JSON.stringify(data) });
        showToast(t("toast_saved"), "success");
    } catch (e) { showToast(t("toast_error"), "error"); }
}

// --- Alert Modal Placeholder Functions (to keep functionality intact) ---
function openAlertModal() { 
    document.getElementById("alertModal").classList.add("active"); 
    document.getElementById("alertStep1").style.display = "block";
    document.getElementById("alertStep2").style.display = "none";
}
function closeAlertModal() { document.getElementById("alertModal").classList.remove("active"); }
function backToTypeSelect() { document.getElementById("alertStep1").style.display = "block"; document.getElementById("alertStep2").style.display = "none"; }
function selectAlertType(type) { 
    document.getElementById("alertStep1").style.display = "none"; 
    document.getElementById("alertStep2").style.display = "block";
    document.getElementById("alertFormContainer").innerHTML = `<p class="text-muted">Configuration pour ${type} (Placeholder)</p>`;
}
function saveAlert() { closeAlertModal(); showToast("Alerte sauvegardée (Mock)", "success"); }

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage();
    initNavigation();
    initSearch();
    loadStocks();
    
    document.getElementById("langToggle")?.addEventListener("click", () => {
        currentLang = currentLang === "en" ? "fr" : "en";
        localStorage.setItem("sn_lang", currentLang);
        applyLanguage();
    });

    document.getElementById("saveSettingsBtn")?.addEventListener("click", saveSettings);
    
    // Bind chart periods
    document.querySelectorAll(".chart-period").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".chart-period").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            loadChartData(document.getElementById("chartModalSymbol").textContent, btn.dataset.period);
        });
    });
});