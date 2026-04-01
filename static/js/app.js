/* ============================================
   StockNotifier - Frontend App v2
   ============================================ */

// --- i18n ---
const translations = {
    en: {
        nav_dashboard: "Dashboard",
        nav_movers: "Top Movers",
        nav_settings: "Settings",
        nav_history: "History",
        dashboard_title: "Dashboard",
        dashboard_subtitle: "Your tracked stocks at a glance",
        settings_title: "Settings",
        settings_subtitle: "Configure notifications & integrations",
        history_title: "Notification History",
        history_subtitle: "Recent notifications sent",
        movers_title: "Top Movers",
        movers_subtitle: "Biggest moves among your tracked stocks",
        movers_daily: "Daily Movers",
        movers_weekly: "Weekly Movers",
        movers_notif_title: "Top Movers Digest",
        movers_hint: "Daily notification of your top movers (daily + weekly).",
        btn_add_stock: "Add Stock",
        btn_save: "Save Settings",
        btn_test: "Test Notification",
        btn_test_movers: "Test Movers",
        empty_title: "No stocks tracked yet",
        empty_subtitle: "Add your first stock to get started",
        search_placeholder: "Search stocks, indices, crypto...",
        popular_title: "Popular",
        label_user_key: "User Key",
        label_api_token: "API Token",
        label_send_at: "Send at",
        label_day: "Day",
        label_threshold: "Threshold (%)",
        label_include_monthly: "Include monthly variation",
        label_movers_count: "Number of stocks",
        daily_title: "Daily Summary",
        weekly_title: "Weekly Summary",
        alert_title: "Price Alerts",
        alert_hint: "Get notified when a stock moves more than this percentage in a day.",
        day_mon: "Monday", day_tue: "Tuesday", day_wed: "Wednesday",
        day_thu: "Thursday", day_fri: "Friday", day_sat: "Saturday", day_sun: "Sunday",
        toast_saved: "Settings saved",
        toast_added: "Stock added",
        toast_removed: "Stock removed",
        toast_test_ok: "Test notification sent!",
        toast_test_fail: "Failed to send. Check Pushover credentials.",
        toast_error: "Something went wrong",
        history_empty: "No notifications sent yet",
        loading: "Loading...",
        confirm_remove: "Remove this stock?",
        high: "H",
        low: "L",
        vol: "Vol",
        daily_change: "Day",
        weekly_change: "Week",
        monthly_change: "Month",
        chart_close: "Close",
        chart_high: "High",
        chart_low: "Low",
        chart_volume: "Volume",
        movers_empty: "Add some stocks to see top movers",
        rank: "#",
    },
    fr: {
        nav_dashboard: "Tableau de bord",
        nav_movers: "Top Movers",
        nav_settings: "Paramètres",
        nav_history: "Historique",
        dashboard_title: "Tableau de bord",
        dashboard_subtitle: "Vos actions suivies en un coup d'œil",
        settings_title: "Paramètres",
        settings_subtitle: "Configurer les notifications et intégrations",
        history_title: "Historique des notifications",
        history_subtitle: "Notifications récentes envoyées",
        movers_title: "Top Movers",
        movers_subtitle: "Les plus gros mouvements parmi vos actions",
        movers_daily: "Movers du jour",
        movers_weekly: "Movers de la semaine",
        movers_notif_title: "Digest Top Movers",
        movers_hint: "Notification quotidienne de vos plus gros mouvements (jour + semaine).",
        btn_add_stock: "Ajouter",
        btn_save: "Enregistrer",
        btn_test: "Tester la notification",
        btn_test_movers: "Tester Movers",
        empty_title: "Aucune action suivie",
        empty_subtitle: "Ajoutez votre première action pour commencer",
        search_placeholder: "Chercher actions, indices, crypto...",
        popular_title: "Populaires",
        label_user_key: "Clé utilisateur",
        label_api_token: "Jeton API",
        label_send_at: "Envoyer à",
        label_day: "Jour",
        label_threshold: "Seuil (%)",
        label_include_monthly: "Inclure la variation mensuelle",
        label_movers_count: "Nombre d'actions",
        daily_title: "Résumé quotidien",
        weekly_title: "Résumé hebdomadaire",
        alert_title: "Alertes de prix",
        alert_hint: "Recevez une notification quand une action bouge de plus de ce pourcentage en un jour.",
        day_mon: "Lundi", day_tue: "Mardi", day_wed: "Mercredi",
        day_thu: "Jeudi", day_fri: "Vendredi", day_sat: "Samedi", day_sun: "Dimanche",
        toast_saved: "Paramètres enregistrés",
        toast_added: "Action ajoutée",
        toast_removed: "Action supprimée",
        toast_test_ok: "Notification de test envoyée !",
        toast_test_fail: "Échec de l'envoi. Vérifiez vos identifiants Pushover.",
        toast_error: "Une erreur est survenue",
        history_empty: "Aucune notification envoyée",
        loading: "Chargement...",
        confirm_remove: "Supprimer cette action ?",
        high: "H",
        low: "B",
        vol: "Vol",
        daily_change: "Jour",
        weekly_change: "Semaine",
        monthly_change: "Mois",
        chart_close: "Clôture",
        chart_high: "Haut",
        chart_low: "Bas",
        chart_volume: "Volume",
        movers_empty: "Ajoutez des actions pour voir les top movers",
        rank: "#",
    },
};

let currentLang = localStorage.getItem("sn_lang") || "en";

function t(key) {
    return translations[currentLang]?.[key] || translations.en[key] || key;
}

function applyLanguage() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = t(key);
    });
    const langBtn = document.getElementById("langToggle");
    if (langBtn) {
        langBtn.querySelector(".lang-flag").textContent = currentLang === "en" ? "🇬🇧" : "🇫🇷";
        langBtn.querySelector(".lang-label").textContent = currentLang.toUpperCase();
    }
    document.documentElement.setAttribute("data-lang", currentLang);
}

// --- Toast ---
function showToast(msg, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- Sparkline SVG ---
function renderSparkline(data, positive) {
    if (!data || data.length < 2) return "";
    const w = 280, h = 40, pad = 2;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
        const y = h - pad - ((v - min) / range) * (h - 2 * pad);
        return `${x},${y}`;
    });
    const color = positive ? "var(--green)" : "var(--red)";
    const areaPoints = `${pad},${h} ${points.join(" ")} ${w - pad},${h}`;
    return `
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
            <defs>
                <linearGradient id="grad-${positive ? 'g' : 'r'}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <polygon points="${areaPoints}" fill="url(#grad-${positive ? 'g' : 'r'})" />
            <polyline points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
}

// --- Format numbers ---
function formatVolume(v) {
    if (v >= 1e9) return (v / 1e9).toFixed(1) + "B";
    if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
    if (v >= 1e3) return (v / 1e3).toFixed(1) + "K";
    return v.toString();
}

function formatPrice(price, currency) {
    const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
    return `${symbol}${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatChangeBadge(pct, label) {
    const positive = pct >= 0;
    const sign = positive ? "+" : "";
    const cls = positive ? "positive" : "negative";
    return `<span class="change-badge ${cls}" title="${label}">${label} ${sign}${pct}%</span>`;
}

// --- API Helpers ---
async function api(url, options = {}) {
    try {
        const resp = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.detail || resp.statusText);
        }
        return resp.json();
    } catch (e) {
        console.error("API Error:", e);
        throw e;
    }
}

// --- Render Stocks ---
let cachedStocks = [];

async function loadStocks() {
    const grid = document.getElementById("stocksGrid");
    const empty = document.getElementById("emptyState");

    grid.innerHTML = `<div class="stock-card loading"><div class="stock-symbol" style="width:60px">&nbsp;</div><div class="stock-name" style="width:120px">&nbsp;</div><div class="stock-price" style="width:100px">&nbsp;</div></div>`.repeat(3);

    try {
        const stocks = await api("/api/stocks");
        cachedStocks = stocks;
        if (!stocks.length) {
            grid.innerHTML = "";
            empty.style.display = "block";
            return;
        }
        empty.style.display = "none";
        grid.innerHTML = stocks
            .map((s) => {
                const positive = s.change_pct >= 0;
                const sign = positive ? "+" : "";
                const wPct = s.weekly_change_pct || 0;
                const mPct = s.monthly_change_pct || 0;
                return `
                <div class="stock-card" data-symbol="${s.symbol}" onclick="openChart('${s.symbol}', '${s.name.replace(/'/g, "\\'")}')">
                    <div class="stock-card-header">
                        <span class="stock-symbol">${s.symbol}</span>
                        <button class="stock-remove" onclick="event.stopPropagation(); removeStock('${s.symbol}')" title="Remove">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <div class="stock-name">${s.name}</div>
                    <div class="stock-price-row">
                        <span class="stock-price">${s.error ? "—" : formatPrice(s.price, s.currency)}</span>
                        <span class="stock-change ${positive ? "positive" : "negative"}">${sign}${s.change_pct}%</span>
                    </div>
                    <div class="stock-sparkline">${renderSparkline(s.sparkline, positive)}</div>
                    <div class="stock-changes-row">
                        ${formatChangeBadge(s.change_pct, t("daily_change"))}
                        ${formatChangeBadge(wPct, t("weekly_change"))}
                        ${formatChangeBadge(mPct, t("monthly_change"))}
                    </div>
                    ${s.high ? `<div class="stock-meta">
                        <span>${t("high")} ${formatPrice(s.high, s.currency)}</span>
                        <span>${t("low")} ${formatPrice(s.low, s.currency)}</span>
                        <span>${t("vol")} ${formatVolume(s.volume)}</span>
                    </div>` : ""}
                </div>`;
            })
            .join("");
    } catch (e) {
        grid.innerHTML = "";
        showToast(t("toast_error"), "error");
    }
}

async function removeStock(symbol) {
    if (!confirm(t("confirm_remove"))) return;
    try {
        await api(`/api/stocks/${encodeURIComponent(symbol)}`, { method: "DELETE" });
        showToast(t("toast_removed"), "success");
        loadStocks();
    } catch (e) {
        showToast(t("toast_error"), "error");
    }
}

async function addStock(symbol, name) {
    try {
        await api("/api/stocks", {
            method: "POST",
            body: JSON.stringify({ symbol, name }),
        });
        showToast(t("toast_added"), "success");
        closeDropdown();
        loadStocks();
    } catch (e) {
        if (e.message.includes("already")) {
            showToast("Already tracking " + symbol, "info");
        } else {
            showToast(t("toast_error"), "error");
        }
    }
}

// --- Dropdown ---
function closeDropdown() {
    document.getElementById("dropdownPanel").classList.remove("open");
    document.getElementById("stockSearch").value = "";
    document.getElementById("searchResults").innerHTML = "";
}

// --- Chart ---
let stockChart = null;

async function openChart(symbol, name) {
    const modal = document.getElementById("chartModal");
    document.getElementById("chartModalTitle").textContent = name;
    document.getElementById("chartModalSymbol").textContent = symbol;
    modal.classList.add("active");

    // Reset period buttons
    document.querySelectorAll(".chart-period").forEach((b) => b.classList.remove("active"));
    document.querySelector('.chart-period[data-period="1mo"]').classList.add("active");

    await loadChartData(symbol, "1mo");
}

async function loadChartData(symbol, period) {
    try {
        const data = await api(`/api/stock/${encodeURIComponent(symbol)}/history?period=${period}`);
        renderChart(data, period);
    } catch (e) {
        console.error("Chart error:", e);
    }
}

function renderChart(data, period) {
    const ctx = document.getElementById("stockChart").getContext("2d");

    if (stockChart) {
        stockChart.destroy();
    }

    const labels = data.map((d) => d.date);
    const closes = data.map((d) => d.close);
    const highs = data.map((d) => d.high);
    const lows = data.map((d) => d.low);
    const volumes = data.map((d) => d.volume);

    const isPositive = closes.length >= 2 && closes[closes.length - 1] >= closes[0];
    const lineColor = isPositive ? "#22c55e" : "#ef4444";
    const bgColor = isPositive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)";

    stockChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: t("chart_close"),
                    data: closes,
                    borderColor: lineColor,
                    backgroundColor: bgColor,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: period === "5d" ? 4 : 0,
                    pointHoverRadius: 5,
                    pointBackgroundColor: lineColor,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false,
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#171d2b",
                    titleColor: "#e2e8f0",
                    bodyColor: "#8494a7",
                    borderColor: "#1e2738",
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (ctx) {
                            const i = ctx.dataIndex;
                            return [
                                `${t("chart_close")}: ${closes[i]}`,
                                `${t("chart_high")}: ${highs[i]}`,
                                `${t("chart_low")}: ${lows[i]}`,
                                `${t("chart_volume")}: ${formatVolume(volumes[i])}`,
                            ];
                        },
                    },
                },
            },
            scales: {
                x: {
                    grid: { color: "rgba(30, 39, 56, 0.5)" },
                    ticks: {
                        color: "#5a6a7e",
                        maxTicksLimit: 8,
                        font: { family: "JetBrains Mono", size: 11 },
                    },
                },
                y: {
                    grid: { color: "rgba(30, 39, 56, 0.5)" },
                    ticks: {
                        color: "#5a6a7e",
                        font: { family: "JetBrains Mono", size: 11 },
                    },
                },
            },
        },
    });

    // Stats
    const statsEl = document.getElementById("chartStats");
    if (data.length >= 2) {
        const first = data[0].close;
        const last = data[data.length - 1].close;
        const change = ((last - first) / first * 100).toFixed(2);
        const maxH = Math.max(...highs);
        const minL = Math.min(...lows);
        const positive = parseFloat(change) >= 0;
        const sign = positive ? "+" : "";
        statsEl.innerHTML = `
            <div class="chart-stat">
                <span class="chart-stat-label">${t("chart_close")}</span>
                <span class="chart-stat-value">${last}</span>
            </div>
            <div class="chart-stat">
                <span class="chart-stat-label">Variation</span>
                <span class="chart-stat-value ${positive ? 'positive' : 'negative'}">${sign}${change}%</span>
            </div>
            <div class="chart-stat">
                <span class="chart-stat-label">${t("chart_high")}</span>
                <span class="chart-stat-value">${maxH}</span>
            </div>
            <div class="chart-stat">
                <span class="chart-stat-label">${t("chart_low")}</span>
                <span class="chart-stat-value">${minL}</span>
            </div>
        `;
    }
}

// --- Movers ---
async function loadMovers() {
    const dailyEl = document.getElementById("dailyMovers");
    const weeklyEl = document.getElementById("weeklyMovers");

    dailyEl.innerHTML = `<div class="movers-loading">${t("loading")}</div>`;
    weeklyEl.innerHTML = `<div class="movers-loading">${t("loading")}</div>`;

    try {
        const data = await api("/api/movers");

        if (!data.daily.length) {
            dailyEl.innerHTML = `<div class="movers-empty">${t("movers_empty")}</div>`;
            weeklyEl.innerHTML = `<div class="movers-empty">${t("movers_empty")}</div>`;
            return;
        }

        dailyEl.innerHTML = data.daily.map((s, i) => renderMoverRow(s, i, "change_pct")).join("");
        weeklyEl.innerHTML = data.weekly.map((s, i) => renderMoverRow(s, i, "weekly_change_pct")).join("");
    } catch (e) {
        dailyEl.innerHTML = `<div class="movers-empty">${t("toast_error")}</div>`;
        weeklyEl.innerHTML = "";
    }
}

function renderMoverRow(s, index, field) {
    const pct = s[field] || 0;
    const positive = pct >= 0;
    const sign = positive ? "+" : "";
    const cls = positive ? "positive" : "negative";
    const arrow = positive ? "▲" : "▼";
    return `
        <div class="mover-row" onclick="openChart('${s.symbol}', '${s.name.replace(/'/g, "\\'")}')">
            <span class="mover-rank">${index + 1}</span>
            <div class="mover-info">
                <span class="mover-name">${s.name}</span>
                <span class="mover-symbol">${s.symbol}</span>
            </div>
            <span class="mover-price">${formatPrice(s.price, s.currency)}</span>
            <span class="mover-change ${cls}">${arrow} ${sign}${pct}%</span>
        </div>`;
}

// --- Settings ---
async function loadSettings() {
    const settings = await api("/api/settings");
    for (const [key, val] of Object.entries(settings)) {
        const el = document.getElementById(key);
        if (!el) continue;
        if (el.type === "checkbox") {
            el.checked = val === "true";
        } else {
            el.value = val;
        }
    }
}

async function saveSettings() {
    const keys = [
        "pushover_user_key", "pushover_api_token",
        "daily_enabled", "daily_time", "daily_monthly_change",
        "weekly_enabled", "weekly_day", "weekly_time",
        "alert_enabled", "alert_threshold",
        "movers_enabled", "movers_time", "movers_count",
    ];
    const data = {};
    keys.forEach((k) => {
        const el = document.getElementById(k);
        if (!el) return;
        data[k] = el.type === "checkbox" ? (el.checked ? "true" : "false") : el.value;
    });
    data.language = currentLang;
    try {
        await api("/api/settings", { method: "POST", body: JSON.stringify(data) });
        showToast(t("toast_saved"), "success");
    } catch (e) {
        showToast(t("toast_error"), "error");
    }
}

// --- History ---
async function loadHistory() {
    const list = document.getElementById("historyList");
    try {
        const items = await api("/api/history");
        if (!items.length) {
            list.innerHTML = `<div class="history-empty">${t("history_empty")}</div>`;
            return;
        }
        list.innerHTML = items
            .map((item) => {
                const icon = item.success ? "✓" : "✗";
                const cls = item.success ? "success" : "fail";
                const date = new Date(item.sent_at + "Z");
                return `
                <div class="history-item">
                    <div class="history-icon ${cls}">${icon}</div>
                    <div class="history-info">
                        <div class="history-type">${item.type}</div>
                        <div class="history-time">${date.toLocaleString()}</div>
                    </div>
                </div>`;
            })
            .join("");
    } catch (e) {
        list.innerHTML = `<div class="history-empty">${t("toast_error")}</div>`;
    }
}

// --- Popular ---
const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "BTC-USD", name: "Bitcoin USD" },
    { symbol: "ETH-USD", name: "Ethereum USD" },
    { symbol: "^GSPC", name: "S&P 500" },
    { symbol: "^DJI", name: "Dow Jones" },
    { symbol: "^IXIC", name: "NASDAQ" },
];

function renderPopular() {
    const container = document.getElementById("popularContainer");
    container.innerHTML = `
        <h3>${t("popular_title")}</h3>
        <div class="popular-grid">
            ${popularStocks.map((s) => `
                <div class="popular-item" onclick="addStock('${s.symbol}', '${s.name.replace(/'/g, "\\'")}')">
                    <span class="popular-symbol">${s.symbol}</span>
                    <span class="popular-name">${s.name}</span>
                </div>`
            ).join("")}
        </div>
    `;
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage();
    initSearch();
    loadStocks();
    loadMovers();
    loadSettings();
    renderPopular();
    loadHistory();

    document.getElementById("addStockBtn").addEventListener("click", () => {
        document.getElementById("stockSearch").focus();
    });

    document.getElementById("saveSettingsBtn").addEventListener("click", saveSettings);
    document.getElementById("testNotifBtn").addEventListener("click", () => testNotification());
    document.getElementById("testMoversBtn").addEventListener("click", () => testMovers());
    document.getElementById("langToggle").addEventListener("click", () => {
        currentLang = currentLang === "en" ? "fr" : "en";
        applyLanguage();
    });
});

// --- Search ---
let searchTimeout = null;

function initSearch() {
    const input = document.getElementById("stockSearch");
    const dropdown = document.getElementById("dropdownPanel");
    const results = document.getElementById("searchResults");

    input.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        const q = input.value.trim();
        if (q.length < 2) {
            closeDropdown();
            return;
        }
        searchTimeout = setTimeout(async () => {
            try {
                const results = await api(`/api/stocks/search?q=${encodeURIComponent(q)}`);
                if (!results.length) {
                    results.innerHTML = `<div class="search-result-item no-results">${t("empty_subtitle")}</div>`;
                    dropdown.classList.add("open");
                    return;
                }
                results.innerHTML = results
                    .map((r) => `
                        <div class="search-result-item" onclick="addStock('${r.symbol}', '${r.name.replace(/'/g, "\\'")}')">
                            <span class="result-symbol">${r.symbol}</span>
                            <span class="result-name">${r.name}</span>
                            <span class="result-meta">${r.exchange || "Unknown"} • ${r.type || "Stock"} • ${r.currency || "USD"}</span>
                        </div>`
                    )
                    .join("");
                dropdown.classList.add("open");
            } catch (e) {
                results.innerHTML = `<div class="search-result-item error">${t("toast_error")}</div>`;
                dropdown.classList.add("open");
            }
        }, 300);
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-dropdown")) {
            closeDropdown();
        }
    });
}

// --- Test ---
async function testNotification() {
    try {
        await api("/api/test-notification", { method: "POST" });
        showToast(t("toast_test_ok"), "success");
    } catch (e) {
        showToast(t("toast_test_fail"), "error");
    }
}

async function testMovers() {
    try {
        await api("/api/test-movers", { method: "POST" });
        showToast(t("toast_test_ok"), "success");
    } catch (e) {
        showToast(t("toast_test_fail"), "error");
    }
}

// --- Modal ---
function closeChart() {
    document.getElementById("chartModal").classList.remove("active");
}

// --- Period Buttons ---
document.querySelectorAll(".chart-period").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".chart-period").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const symbol = document.getElementById("chartModalSymbol").textContent;
        loadChartData(symbol, btn.dataset.period);
    });
});
