/* ============================================
   StockNotifier - Frontend App v3 (*arr style)
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
        nav_alerts: "Alerts",
        alerts_subtitle: "Create and manage your custom notifications",
        alerts_new: "+ New Alert",
        alerts_choose_type: "Choose notification type",
        alerts_back: "Back",
        alerts_empty: "No alerts configured. Click + New Alert to get started.",
        alerts_enabled: "Enabled",
        alerts_last: "Last triggered:",
        alerts_never: "Never triggered",
        atype_price: "Price Alert",
        atype_price_desc: "When a stock crosses a price level",
        atype_pct: "% Change",
        atype_pct_desc: "When daily/weekly/monthly move exceeds a threshold",
        atype_vol: "Volume Spike",
        atype_vol_desc: "When volume is X times above average",
        atype_rsi: "RSI Alert",
        atype_rsi_desc: "Overbought / Oversold signal",
        atype_52w: "52W High/Low",
        atype_52w_desc: "When a stock is near its 52-week extreme",
        atype_digest: "Scheduled Digest",
        atype_digest_desc: "Custom digest for selected stocks at a chosen time",
        nav_financials: "Financials",
        financials_subtitle: "Financial statements, ratios & company overview",
        financials_empty: "Search for a company to view its financials",
        fin_income: "Income Statement",
        fin_balance: "Balance Sheet",
        fin_cashflow: "Cash Flow",
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
        nav_alerts: "Alertes",
        alerts_subtitle: "Créez et gérez vos notifications personnalisées",
        alerts_new: "+ Nouvelle alerte",
        alerts_choose_type: "Choisissez le type de notification",
        alerts_back: "Retour",
        alerts_empty: "Aucune alerte configurée. Cliquez sur + Nouvelle alerte pour commencer.",
        alerts_enabled: "Activée",
        alerts_last: "Dernier déclenchement :",
        alerts_never: "Jamais déclenchée",
        atype_price: "Alerte de prix",
        atype_price_desc: "Quand un titre dépasse ou tombe sous un niveau de prix",
        atype_pct: "Variation %",
        atype_pct_desc: "Quand la variation jour/semaine/mois dépasse un seuil",
        atype_vol: "Pic de volume",
        atype_vol_desc: "Quand le volume est X fois supérieur à la moyenne",
        atype_rsi: "Alerte RSI",
        atype_rsi_desc: "Signal de surachat / survente",
        atype_52w: "Haut/Bas 52S",
        atype_52w_desc: "Quand un titre approche son extrême sur 52 semaines",
        atype_digest: "Digest planifié",
        atype_digest_desc: "Digest personnalisé pour des titres choisis à une heure donnée",
        nav_financials: "Financiers",
        financials_subtitle: "États financiers, ratios & présentation de l'entreprise",
        financials_empty: "Recherchez une entreprise pour voir ses financiers",
        fin_income: "Compte de résultat",
        fin_balance: "Bilan",
        fin_cashflow: "Flux de trésorerie",
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
    if(!container) return;
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

// --- localStorage helpers ---
function getCardOrder() { return JSON.parse(localStorage.getItem("sn_card_order") || "[]"); }
function saveCardOrder(order) { localStorage.setItem("sn_card_order", JSON.stringify(order)); }
function getCardSizes() { return JSON.parse(localStorage.getItem("sn_card_sizes") || "{}"); }
function saveCardSize(symbol, wide) { const s = getCardSizes(); s[symbol] = wide; localStorage.setItem("sn_card_sizes", JSON.stringify(s)); }
function getStoredPeriods() { return JSON.parse(localStorage.getItem("sn_periods") || "{}"); }
function saveStoredPeriod(symbol, period) { const p = getStoredPeriods(); p[symbol] = period; localStorage.setItem("sn_periods", JSON.stringify(p)); }

async function loadStocks() {
    const grid = document.getElementById("stocksGrid");
    const empty = document.getElementById("emptyState");
    if(!grid) return;

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

        // Apply saved card order
        const savedOrder = getCardOrder();
        if (savedOrder.length) {
            stocks.sort((a, b) => {
                const ai = savedOrder.indexOf(a.symbol);
                const bi = savedOrder.indexOf(b.symbol);
                if (ai === -1 && bi === -1) return 0;
                if (ai === -1) return 1;
                if (bi === -1) return -1;
                return ai - bi;
            });
        }

        grid.innerHTML = stocks
            .map((s) => {
                const positive = s.change_pct >= 0;
                const sign = positive ? "+" : "";
                const wPct = s.weekly_change_pct || 0;
                const mPct = s.monthly_change_pct || 0;
                return `
                <div class="stock-card" data-symbol="${s.symbol}" draggable="true" onclick="openChart('${s.symbol}', '${s.name.replace(/'/g, "\\'")}')">
                    <div class="stock-card-header">
                        <div class="stock-card-header-left">
                            <span class="stock-drag-handle" onclick="event.stopPropagation()" title="Drag to reorder">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none">
                                    <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
                                    <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                                    <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
                                </svg>
                            </span>
                            <span class="stock-symbol">${s.symbol}</span>
                        </div>
                        <div class="stock-card-actions">
                            <button class="stock-expand" onclick="event.stopPropagation(); toggleCardSize('${s.symbol}')" title="Expand">
                                <svg class="icon-expand" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                                    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                                </svg>
                                <svg class="icon-compress" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="display:none">
                                    <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
                                    <line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>
                                </svg>
                            </button>
                            <button class="stock-remove" onclick="event.stopPropagation(); removeStock('${s.symbol}')" title="Remove">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
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

        // Apply saved wide sizes
        const sizes = getCardSizes();
        for (const [sym, wide] of Object.entries(sizes)) {
            if (wide) {
                const card = grid.querySelector(`.stock-card[data-symbol="${sym}"]`);
                if (card) {
                    card.classList.add("stock-card--wide");
                    card.querySelector(".icon-expand").style.display = "none";
                    card.querySelector(".icon-compress").style.display = "";
                }
            }
        }

        setupDragAndDrop();
    } catch (e) {
        grid.innerHTML = "";
        showToast(t("toast_error"), "error");
    }
}

function toggleCardSize(symbol) {
    const card = document.querySelector(`.stock-card[data-symbol="${symbol}"]`);
    if (!card) return;
    const isWide = card.classList.toggle("stock-card--wide");
    card.querySelector(".icon-expand").style.display = isWide ? "none" : "";
    card.querySelector(".icon-compress").style.display = isWide ? "" : "none";
    saveCardSize(symbol, isWide);
}

let dragSrc = null;

function setupDragAndDrop() {
    const grid = document.getElementById("stocksGrid");
    const cards = grid.querySelectorAll(".stock-card[data-symbol]");

    cards.forEach((card) => {
        card.addEventListener("dragstart", (e) => {
            dragSrc = card;
            e.dataTransfer.effectAllowed = "move";
            setTimeout(() => card.classList.add("dragging"), 0);
        });

        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
            grid.querySelectorAll(".stock-card").forEach((c) => c.classList.remove("drag-over"));
            const order = [...grid.querySelectorAll(".stock-card[data-symbol]")].map((c) => c.dataset.symbol);
            saveCardOrder(order);
        });

        card.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            if (card !== dragSrc) {
                grid.querySelectorAll(".stock-card").forEach((c) => c.classList.remove("drag-over"));
                card.classList.add("drag-over");
            }
        });

        card.addEventListener("dragleave", (e) => {
            if (!card.contains(e.relatedTarget)) card.classList.remove("drag-over");
        });

        card.addEventListener("drop", (e) => {
            e.preventDefault();
            card.classList.remove("drag-over");
            if (!dragSrc || dragSrc === card) return;
            const cards = [...grid.querySelectorAll(".stock-card[data-symbol]")];
            const srcIdx = cards.indexOf(dragSrc);
            const dstIdx = cards.indexOf(card);
            if (srcIdx < dstIdx) {
                grid.insertBefore(dragSrc, card.nextSibling);
            } else {
                grid.insertBefore(dragSrc, card);
            }
        });
    });
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
    const dropdownPanel = document.getElementById("dropdownPanel");
    const stockSearch = document.getElementById("stockSearch");
    const searchResults = document.getElementById("searchResults");
    
    if(dropdownPanel) dropdownPanel.classList.remove("open");
    if(stockSearch) stockSearch.value = "";
    if(searchResults) searchResults.innerHTML = "";
}

// --- Chart ---
let stockChart = null;

async function openChart(symbol, name) {
    const modal = document.getElementById("chartModal");
    if(!modal) return;
    document.getElementById("chartModalTitle").textContent = name;
    document.getElementById("chartModalSymbol").textContent = symbol;
    modal.classList.add("active");

    const period = getStoredPeriods()[symbol] || "1mo";
    document.querySelectorAll(".chart-period").forEach((b) => b.classList.remove("active"));
    const activeBtn = document.querySelector(`.chart-period[data-period="${period}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    await loadChartData(symbol, period);
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
    if (data.length >= 2 && statsEl) {
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
    if(!dailyEl || !weeklyEl) return;

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
    try {
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
    } catch (e) {
        // Handle error gracefully if settings haven't loaded yet
    }
}

async function saveSettings(e) {
    if(e) e.preventDefault();
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
    if(!list) return;
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
    if(!container) return;
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

// --- Alerts ---

const ALERT_ICONS = {
    price_alert: "💰",
    pct_alert:   "📈",
    vol_spike:   "📊",
    rsi_alert:   "🎯",
    week52:      "🏆",
    digest:      "📅",
};

const ALERT_TYPE_LABELS = {
    price_alert: () => t("atype_price"),
    pct_alert:   () => t("atype_pct"),
    vol_spike:   () => t("atype_vol"),
    rsi_alert:   () => t("atype_rsi"),
    week52:      () => t("atype_52w"),
    digest:      () => t("atype_digest"),
};

function alertDescription(type, cfg) {
    const sym = cfg.symbol ? `<b>${cfg.symbol}</b>` : "";
    switch (type) {
        case "price_alert":
            return `${sym} ${cfg.condition === "above" ? "≥" : "≤"} <b>${cfg.price}</b>`;
        case "pct_alert": {
            const pmap = { daily: t("daily_change"), weekly: t("weekly_change"), monthly: t("monthly_change") };
            return `${sym} — ${pmap[cfg.period] || cfg.period} ±${cfg.threshold}%`;
        }
        case "vol_spike":
            return `${sym} — volume ≥ ${cfg.multiplier}× average`;
        case "rsi_alert":
            return `${sym} — RSI(${cfg.rsi_period || 14}) ${cfg.condition === "above" ? "≥" : "≤"} ${cfg.level}`;
        case "week52": {
            const d = { high: "52W High", low: "52W Low", both: "52W High or Low" };
            return `${sym} — ${d[cfg.direction] || cfg.direction}`;
        }
        case "digest": {
            const smap = { daily: "Every day", weekdays: "Mon–Fri", weekly: "Weekly" };
            const stocks = (cfg.symbols || []).join(", ") || "—";
            return `${smap[cfg.schedule] || "Daily"} at ${cfg.time || "—"} · ${stocks}`;
        }
        default: return "";
    }
}

async function loadAlerts() {
    const list = document.getElementById("alertsList");
    if (!list) return;
    try {
        const alerts = await api("/api/notifications");
        if (!alerts.length) {
            list.innerHTML = `<div class="alerts-empty">${t("alerts_empty")}</div>`;
            return;
        }
        list.innerHTML = alerts.map(a => {
            const icon = ALERT_ICONS[a.type] || "🔔";
            const typeLabel = (ALERT_TYPE_LABELS[a.type] || (() => a.type))();
            const desc = alertDescription(a.type, a.config);
            const lastTrig = a.last_triggered
                ? `${t("alerts_last")} ${new Date(a.last_triggered + "Z").toLocaleString()}`
                : t("alerts_never");
            return `
            <div class="alert-card${a.enabled ? "" : " disabled"}" id="alert-card-${a.id}">
                <div class="alert-card-icon">${icon}</div>
                <div class="alert-card-body">
                    <div class="alert-card-name">${a.name}</div>
                    <div class="alert-card-desc">${desc}</div>
                    <div class="alert-card-meta">
                        <span class="alert-badge type-${a.type}">${typeLabel}</span>
                        <span class="alert-last-triggered">${lastTrig}</span>
                    </div>
                </div>
                <div class="alert-card-actions">
                    <label class="toggle-switch" title="${t("alerts_enabled")}">
                        <input type="checkbox" ${a.enabled ? "checked" : ""} onchange="toggleAlert(${a.id}, this.checked)">
                        <span class="toggle-track"></span>
                        <span class="toggle-thumb"></span>
                    </label>
                    <button class="btn-icon" onclick="openAlertModal(${a.id})" title="Edit">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="testAlert(${a.id})" title="Test now">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                    </button>
                    <button class="btn-icon danger" onclick="deleteAlert(${a.id})" title="Delete">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                    </button>
                </div>
            </div>`;
        }).join("");
    } catch (e) {
        list.innerHTML = `<div class="alerts-empty">${t("toast_error")}</div>`;
    }
}

async function toggleAlert(id, enabled) {
    try {
        await api(`/api/notifications/${id}`, { method: "PATCH", body: JSON.stringify({ enabled }) });
        document.getElementById(`alert-card-${id}`)?.classList.toggle("disabled", !enabled);
    } catch (e) { showToast(t("toast_error"), "error"); }
}

async function deleteAlert(id) {
    if (!confirm(currentLang === "fr" ? "Supprimer cette alerte ?" : "Delete this alert?")) return;
    try {
        await api(`/api/notifications/${id}`, { method: "DELETE" });
        showToast(currentLang === "fr" ? "Alerte supprimée" : "Alert deleted", "success");
        loadAlerts();
    } catch (e) { showToast(t("toast_error"), "error"); }
}

async function testAlert(id) {
    try {
        await api(`/api/notifications/${id}/test`, { method: "POST" });
        showToast(t("toast_test_ok"), "success");
    } catch (e) { showToast(t("toast_test_fail"), "error"); }
}

// ---- Alert Modal ----
let _alertEditId = null;
let _alertEditType = null;
let _digestSymbols = [];  // for digest stock picker
let _digestSearchTimeout = null;

function openAlertModal(editId = null) {
    _alertEditId = editId;
    _alertEditType = null;
    _digestSymbols = [];
    const modal = document.getElementById("alertModal");
    const title = document.getElementById("alertModalTitle");
    if(!modal) return;
    title.textContent = editId ? (currentLang === "fr" ? "Modifier l'alerte" : "Edit Alert") : t("alerts_new");
    document.getElementById("alertStep1").style.display = "";
    document.getElementById("alertStep2").style.display = "none";
    modal.classList.add("active");

    // If editing, skip type step and show form directly
    if (editId) {
        api(`/api/notifications`).then(alerts => {
            const a = alerts.find(x => x.id === editId);
            if (a) {
                _alertEditType = a.type;
                _digestSymbols = a.config.symbols || [];
                document.getElementById("alertStep1").style.display = "none";
                document.getElementById("alertStep2").style.display = "";
                document.getElementById("alertFormContainer").innerHTML = buildAlertForm(a.type, a.config, a.name);
                if (a.type === "digest") initDigestPicker();
            }
        });
    }
}

function closeAlertModal() {
    document.getElementById("alertModal").classList.remove("active");
    _alertEditId = null;
    _alertEditType = null;
    _digestSymbols = [];
}

function backToTypeSelect() {
    _alertEditType = null;
    document.getElementById("alertStep1").style.display = "";
    document.getElementById("alertStep2").style.display = "none";
}

function selectAlertType(type) {
    _alertEditType = type;
    document.getElementById("alertStep1").style.display = "none";
    document.getElementById("alertStep2").style.display = "";
    document.getElementById("alertFormContainer").innerHTML = buildAlertForm(type, {}, "");
    if (type === "digest") initDigestPicker();
}

function buildAlertForm(type, cfg, name) {
    const nameField = `
        <div class="alert-form-group">
            <label>${currentLang === "fr" ? "Nom de l'alerte" : "Alert name"}</label>
            <input type="text" id="af_name" value="${name || ""}" placeholder="${currentLang === "fr" ? "Ex: AAPL sous 150$" : "E.g. AAPL below $150"}">
        </div>`;

    const stockField = (label) => `
        <div class="alert-form-group">
            <label>${label || (currentLang === "fr" ? "Titre (symbole)" : "Stock (symbol)")}</label>
            <input type="text" id="af_symbol" value="${cfg.symbol || ""}" placeholder="AAPL, AIR.PA, BTC-USD...">
        </div>`;

    switch (type) {
        case "price_alert":
            return `<div class="alert-form">${nameField}${stockField()}
                <div class="alert-form-row">
                    <div class="alert-form-group">
                        <label>${currentLang === "fr" ? "Condition" : "Condition"}</label>
                        <select id="af_condition">
                            <option value="above" ${cfg.condition === "above" ? "selected" : ""}>${currentLang === "fr" ? "Au-dessus de" : "Above"}</option>
                            <option value="below" ${cfg.condition === "below" ? "selected" : ""}>${currentLang === "fr" ? "En-dessous de" : "Below"}</option>
                        </select>
                    </div>
                    <div class="alert-form-group">
                        <label>${currentLang === "fr" ? "Prix cible" : "Target price"}</label>
                        <input type="number" id="af_price" step="0.01" value="${cfg.price || ""}" placeholder="150.00">
                    </div>
                </div>
            </div>`;

        case "pct_alert":
            return `<div class="alert-form">${nameField}${stockField()}
                <div class="alert-form-row">
                    <div class="alert-form-group">
                        <label>${currentLang === "fr" ? "Seuil (%)" : "Threshold (%)"}</label>
                        <input type="number" id="af_threshold" step="0.1" min="0.1" value="${cfg.threshold || 3}" placeholder="3.0">
                    </div>
                    <div class="alert-form-group">
                        <label>${currentLang === "fr" ? "Période" : "Period"}</label>
                        <select id="af_period">
                            <option value="daily"   ${cfg.period === "daily"   ? "selected" : ""}>${t("daily_change")}</option>
                            <option value="weekly"  ${cfg.period === "weekly"  ? "selected" : ""}>${t("weekly_change")}</option>
                            <option value="monthly" ${cfg.period === "monthly" ? "selected" : ""}>${t("monthly_change")}</option>
                        </select>
                    </div>
                </div>
            </div>`;

        case "vol_spike":
            return `<div class="alert-form">${nameField}${stockField()}
                <div class="alert-form-group">
                    <label>${currentLang === "fr" ? "Multiplicateur (×)" : "Multiplier (×)"}</label>
                    <input type="number" id="af_multiplier" step="0.5" min="1" value="${cfg.multiplier || 2}" placeholder="2">
                </div>
            </div>`;

        case "rsi_alert":
            return `<div class="alert-form">${nameField}${stockField()}
                <div class="alert-form-row">
                    <div class="alert-form-group">
                        <label>${currentLang === "fr" ? "Condition" : "Condition"}</label>
                        <select id="af_condition">
                            <option value="below" ${cfg.condition === "below" ? "selected" : ""}>${currentLang === "fr" ? "RSI en dessous de (survente)" : "RSI below (oversold)"}</option>
                            <option value="above" ${cfg.condition === "above" ? "selected" : ""}>${currentLang === "fr" ? "RSI au-dessus de (surachat)" : "RSI above (overbought)"}</option>
                        </select>
                    </div>
                    <div class="alert-form-group">
                        <label>${currentLang === "fr" ? "Niveau RSI" : "RSI level"}</label>
                        <input type="number" id="af_level" min="1" max="99" value="${cfg.level || 30}" placeholder="30">
                    </div>
                </div>
                <div class="alert-form-group">
                    <label>${currentLang === "fr" ? "Période RSI" : "RSI period"}</label>
                    <input type="number" id="af_rsi_period" min="2" max="50" value="${cfg.rsi_period || 14}" placeholder="14">
                </div>
            </div>`;

        case "week52":
            return `<div class="alert-form">${nameField}${stockField()}
                <div class="alert-form-group">
                    <label>${currentLang === "fr" ? "Déclencheur" : "Trigger"}</label>
                    <select id="af_direction">
                        <option value="high" ${cfg.direction === "high" ? "selected" : ""}>${currentLang === "fr" ? "Haut 52 semaines" : "52W High"}</option>
                        <option value="low"  ${cfg.direction === "low"  ? "selected" : ""}>${currentLang === "fr" ? "Bas 52 semaines" : "52W Low"}</option>
                        <option value="both" ${cfg.direction === "both" ? "selected" : ""}>${currentLang === "fr" ? "Haut ou Bas" : "High or Low"}</option>
                    </select>
                </div>
            </div>`;

        case "digest": {
            const inc_weekly  = cfg.include_weekly  ? "checked" : "";
            const inc_monthly = cfg.include_monthly ? "checked" : "";
            return `<div class="alert-form">
                <div class="alert-form-group">
                    <label>${currentLang === "fr" ? "Titre du digest" : "Digest title"}</label>
                    <input type="text" id="af_title" value="${cfg.title || ""}" placeholder="${currentLang === "fr" ? "Mon digest matin" : "Morning digest"}">
                </div>
                <div class="alert-form-group">
                    <label>${currentLang === "fr" ? "Titres à inclure" : "Stocks to include"}</label>
                    <div class="digest-stock-picker">
                        <div class="digest-stock-list" id="digestTagList"></div>
                        <div class="digest-add-row">
                            <input type="text" id="digestStockInput" placeholder="${t("search_placeholder")}">
                            <div id="digestStockResults" class="digest-stock-results"></div>
                        </div>
                    </div>
                </div>
                <div class="alert-form-row">
                    <div class="alert-form-group">
                        <label>${currentLang === "fr" ? "Fréquence" : "Schedule"}</label>
                        <select id="af_schedule" onchange="updateDigestDayField()">
                            <option value="daily"    ${cfg.schedule === "daily"    ? "selected" : ""}>${currentLang === "fr" ? "Chaque jour" : "Every day"}</option>
                            <option value="weekdays" ${cfg.schedule === "weekdays" ? "selected" : ""}>${currentLang === "fr" ? "Jours ouvrés (Lun–Ven)" : "Weekdays (Mon–Fri)"}</option>
                            <option value="weekly"   ${cfg.schedule === "weekly"   ? "selected" : ""}>${currentLang === "fr" ? "Hebdomadaire" : "Weekly"}</option>
                        </select>
                    </div>
                    <div class="alert-form-group" id="af_dow_group" style="display:none">
                        <label>${t("label_day")}</label>
                        <select id="af_dow">
                            ${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => `<option value="${i}" ${(cfg.day_of_week == i) ? "selected" : ""}>${d}</option>`).join("")}
                        </select>
                    </div>
                    <div class="alert-form-group">
                        <label>${currentLang === "fr" ? "Heure d'envoi" : "Send at"}</label>
                        <input type="time" id="af_time" value="${cfg.time || "08:00"}">
                    </div>
                </div>
                <div class="alert-form-row">
                    <div class="alert-form-group" style="flex-direction:row;align-items:center;gap:10px">
                        <input type="checkbox" id="af_inc_weekly" ${inc_weekly} style="width:auto">
                        <label style="text-transform:none;letter-spacing:0;font-weight:500;font-size:0.82rem">${currentLang === "fr" ? "Inclure variation semaine" : "Include weekly change"}</label>
                    </div>
                    <div class="alert-form-group" style="flex-direction:row;align-items:center;gap:10px">
                        <input type="checkbox" id="af_inc_monthly" ${inc_monthly} style="width:auto">
                        <label style="text-transform:none;letter-spacing:0;font-weight:500;font-size:0.82rem">${currentLang === "fr" ? "Inclure variation mensuelle" : "Include monthly change"}</label>
                    </div>
                </div>
            </div>`;
        }
        default: return "";
    }
}

function updateDigestDayField() {
    const sched = document.getElementById("af_schedule")?.value;
    const dow = document.getElementById("af_dow_group");
    if (dow) dow.style.display = sched === "weekly" ? "" : "none";
}

function initDigestPicker() {
    _renderDigestTags();
    updateDigestDayField();
    const input = document.getElementById("digestStockInput");
    const results = document.getElementById("digestStockResults");
    if (!input) return;
    input.addEventListener("input", () => {
        clearTimeout(_digestSearchTimeout);
        const q = input.value.trim();
        if (q.length < 2) { results.classList.remove("open"); return; }
        _digestSearchTimeout = setTimeout(async () => {
            const res = await api(`/api/stocks/search?q=${encodeURIComponent(q)}`).catch(() => []);
            if (!res.length) { results.classList.remove("open"); return; }
            results.innerHTML = res.map(r => `
                <div class="search-result-item" onclick="_addDigestSymbol('${r.symbol}')">
                    <span class="result-symbol">${r.symbol}</span>
                    <span class="result-name">${r.name}</span>
                </div>`).join("");
            results.classList.add("open");
        }, 300);
    });
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".digest-add-row")) results.classList.remove("open");
    });
}

function _renderDigestTags() {
    const list = document.getElementById("digestTagList");
    if (!list) return;
    list.innerHTML = _digestSymbols.map(sym => `
        <span class="digest-stock-tag">${sym}
            <button onclick="_removeDigestSymbol('${sym}')" type="button">×</button>
        </span>`).join("");
}

function _addDigestSymbol(sym) {
    if (!_digestSymbols.includes(sym)) {
        _digestSymbols.push(sym);
        _renderDigestTags();
    }
    const input = document.getElementById("digestStockInput");
    const results = document.getElementById("digestStockResults");
    if (input) input.value = "";
    if (results) results.classList.remove("open");
}

function _removeDigestSymbol(sym) {
    _digestSymbols = _digestSymbols.filter(s => s !== sym);
    _renderDigestTags();
}

function _collectAlertConfig(type) {
    const g = (id) => document.getElementById(id);
    const v = (id) => g(id)?.value?.trim();
    switch (type) {
        case "price_alert":
            return { symbol: v("af_symbol")?.toUpperCase(), condition: v("af_condition"), price: parseFloat(v("af_price")) };
        case "pct_alert":
            return { symbol: v("af_symbol")?.toUpperCase(), threshold: parseFloat(v("af_threshold")), period: v("af_period") };
        case "vol_spike":
            return { symbol: v("af_symbol")?.toUpperCase(), multiplier: parseFloat(v("af_multiplier")) };
        case "rsi_alert":
            return { symbol: v("af_symbol")?.toUpperCase(), condition: v("af_condition"), level: parseFloat(v("af_level")), rsi_period: parseInt(v("af_rsi_period")) };
        case "week52":
            return { symbol: v("af_symbol")?.toUpperCase(), direction: v("af_direction") };
        case "digest":
            return {
                title: v("af_title"),
                symbols: [..._digestSymbols],
                schedule: v("af_schedule"),
                day_of_week: parseInt(v("af_dow") || "0"),
                time: v("af_time") || "08:00",
                include_weekly:  g("af_inc_weekly")?.checked  || false,
                include_monthly: g("af_inc_monthly")?.checked || false,
            };
        default: return {};
    }
}

async function saveAlert() {
    const name = document.getElementById("af_name")?.value?.trim();
    if (!name) { showToast(currentLang === "fr" ? "Nom requis" : "Name required", "error"); return; }
    const config = _collectAlertConfig(_alertEditType);
    const body = { name, type: _alertEditType, config };
    try {
        if (_alertEditId) {
            await api(`/api/notifications/${_alertEditId}`, { method: "PATCH", body: JSON.stringify({ name, config }) });
        } else {
            await api("/api/notifications", { method: "POST", body: JSON.stringify(body) });
        }
        showToast(_alertEditId ? (currentLang === "fr" ? "Alerte mise à jour" : "Alert updated") : (currentLang === "fr" ? "Alerte créée" : "Alert created"), "success");
        closeAlertModal();
        loadAlerts();
    } catch (e) {
        showToast(t("toast_error"), "error");
    }
}

// --- Financials ---

function formatFinNum(val, currency) {
    if (val === null || val === undefined) return "—";
    const abs = Math.abs(val);
    const sign = val < 0 ? "-" : "";
    const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
    if (abs >= 1e12) return `${sign}${sym}${(abs / 1e12).toFixed(2)}T`;
    if (abs >= 1e9)  return `${sign}${sym}${(abs / 1e9).toFixed(2)}B`;
    if (abs >= 1e6)  return `${sign}${sym}${(abs / 1e6).toFixed(2)}M`;
    if (abs >= 1e3)  return `${sign}${sym}${(abs / 1e3).toFixed(1)}K`;
    return `${sign}${sym}${abs.toFixed(2)}`;
}

function formatRatioVal(val, key) {
    if (val === null || val === undefined) return { text: "—", cls: "na" };
    // Large market-cap / EV values
    if (["Market Cap", "Enterprise Value"].includes(key)) {
        const abs = Math.abs(val);
        let text;
        if (abs >= 1e12) text = `$${(abs / 1e12).toFixed(2)}T`;
        else if (abs >= 1e9) text = `$${(abs / 1e9).toFixed(2)}B`;
        else text = `$${(abs / 1e6).toFixed(0)}M`;
        return { text, cls: "" };
    }
    // Percentages
    if (["Gross Margin","EBITDA Margin","Operating Margin","Net Margin","ROE","ROA",
         "Dividend Yield","Payout Ratio","Revenue Growth","Earnings Growth","EPS Growth (TTM)"].includes(key)) {
        const cls = val >= 0 ? "positive" : "negative";
        return { text: `${val >= 0 ? "+" : ""}${val.toFixed(1)}%`, cls };
    }
    // Multiples
    if (["P/E (TTM)","Forward P/E","PEG Ratio","EV/EBITDA","EV/Revenue","P/B","P/S (TTM)"].includes(key)) {
        return { text: `${val.toFixed(1)}x`, cls: "" };
    }
    return { text: val.toFixed(2), cls: "" };
}

function calcYoYGrowth(data, year, prevYear) {
    const curr = data[year], prev = data[prevYear];
    if (curr == null || prev == null || prev === 0) return null;
    return ((curr - prev) / Math.abs(prev)) * 100;
}

// Rows that should be visually highlighted (totals/subtotals)
const HIGHLIGHT_ROWS = new Set([
    "Total Revenue", "Gross Profit", "Operating Income (EBIT)", "EBITDA", "Net Income",
    "Total Assets", "Total Liabilities", "Shareholders' Equity",
    "Operating Cash Flow", "Free Cash Flow",
]);

// Rows where a separator line should appear above
const SEPARATOR_ROWS = new Set([
    "Operating Income (EBIT)", "EBITDA", "Pre-tax Income", "Net Income",
    "Total Assets", "Short-term Debt", "Total Liabilities", "Shareholders' Equity",
    "Operating Cash Flow", "Free Cash Flow", "Financing Cash Flow",
]);

function renderFinTable(stmtData, years, currency) {
    if (!stmtData || !Object.keys(stmtData).length) {
        return `<div class="fin-empty">No data available</div>`;
    }
    const cols = years.slice(0, 4); // max 4 years
    let html = `<table class="fin-table"><thead><tr>
        <th>Metric</th>
        ${cols.map(y => `<th>${y}</th>`).join("")}
    </tr></thead><tbody>`;

    for (const [metric, values] of Object.entries(stmtData)) {
        const highlight = HIGHLIGHT_ROWS.has(metric) ? " fin-row-highlight" : "";
        const separator = SEPARATOR_ROWS.has(metric) ? " fin-row-separator" : "";
        html += `<tr class="${highlight}${separator}">`;
        html += `<td>${metric}</td>`;
        cols.forEach((yr, i) => {
            const val = values?.[yr];
            const formatted = formatFinNum(val, currency);
            let cls = "";
            // Color negative values like Net Income, Free Cash Flow
            if (val !== null && val !== undefined && ["Net Income","Free Cash Flow","Operating Cash Flow"].includes(metric)) {
                cls = val >= 0 ? "positive" : "negative";
            }
            // Show YoY growth on Revenue and Net Income
            let growth = "";
            if (["Total Revenue","Net Income","EBITDA","Operating Cash Flow"].includes(metric) && i < cols.length - 1) {
                const g = calcYoYGrowth(values, yr, cols[i + 1]);
                if (g !== null) {
                    const gc = g >= 0 ? "positive" : "negative";
                    growth = `<br><span class="growth ${gc}">${g >= 0 ? "▲" : "▼"} ${Math.abs(g).toFixed(1)}%</span>`;
                }
            }
            html += `<td class="${cls}">${formatted}${growth}</td>`;
        });
        html += `</tr>`;
    }
    html += `</tbody></table>`;
    return html;
}

function renderFinRatios(ratios) {
    return Object.entries(ratios).map(([group, items]) => {
        const rows = Object.entries(items).map(([key, val]) => {
            const { text, cls } = formatRatioVal(val, key);
            return `<div class="fin-ratio-row">
                <span class="fin-ratio-name">${key}</span>
                <span class="fin-ratio-val ${cls}">${text}</span>
            </div>`;
        }).join("");
        return `<div class="fin-ratio-group">
            <div class="fin-ratio-group-title">${group}</div>
            ${rows}
        </div>`;
    }).join("");
}

function renderFinCompany(c) {
    const fmtCap = c.market_cap ? formatFinNum(c.market_cap, c.currency) : "—";
    const fmtEV  = c.enterprise_value ? formatFinNum(c.enterprise_value, c.currency) : "—";
    const price  = c.current_price != null ? `${c.current_price.toFixed(2)} ${c.currency}` : "—";
    const hi52   = c.week52_high != null ? c.week52_high.toFixed(2) : "—";
    const lo52   = c.week52_low  != null ? c.week52_low.toFixed(2)  : "—";

    const badges = [
        c.exchange && `<span class="fin-badge accent">${c.exchange}</span>`,
        c.sector   && `<span class="fin-badge">${c.sector}</span>`,
        c.industry && `<span class="fin-badge">${c.industry}</span>`,
        c.country  && `<span class="fin-badge">${c.country}</span>`,
        c.employees && `<span class="fin-badge">${Number(c.employees).toLocaleString()} employees</span>`,
    ].filter(Boolean).join("");

    const website = c.website
        ? `<a href="${c.website}" target="_blank" rel="noopener" class="fin-badge" style="text-decoration:none;color:var(--accent)">${c.website.replace(/^https?:\/\//, "")}</a>`
        : "";

    return `
        <div class="fin-company-top">
            <div>
                <div class="fin-company-name">${c.name} <span style="color:var(--text-muted);font-size:0.9rem;font-weight:400">${c.symbol}</span></div>
                <div class="fin-company-meta">${badges}${website}</div>
            </div>
            <div class="fin-key-metrics">
                <div class="fin-metric"><span class="fin-metric-label">Price</span><span class="fin-metric-value">${price}</span></div>
                <div class="fin-metric"><span class="fin-metric-label">Market Cap</span><span class="fin-metric-value">${fmtCap}</span></div>
                <div class="fin-metric"><span class="fin-metric-label">EV</span><span class="fin-metric-value">${fmtEV}</span></div>
                <div class="fin-metric"><span class="fin-metric-label">52W High</span><span class="fin-metric-value">${hi52}</span></div>
                <div class="fin-metric"><span class="fin-metric-label">52W Low</span><span class="fin-metric-value">${lo52}</span></div>
            </div>
        </div>
        ${c.description ? `<div class="fin-description" onclick="this.classList.toggle('expanded')">${c.description}</div>` : ""}
    `;
}

async function loadFinancials(symbol, name) {
    document.getElementById("finEmpty").style.display = "none";
    document.getElementById("finContent").style.display = "none";
    document.getElementById("finLoading").style.display = "flex";

    // Close dropdown
    document.getElementById("finDropdownPanel").classList.remove("open");
    document.getElementById("finSearch").value = name || symbol;
    document.getElementById("finSearchResults").innerHTML = "";

    try {
        const data = await api(`/api/stock/${encodeURIComponent(symbol)}/financials`);
        const cur = data.company.currency || "USD";

        document.getElementById("finCompanyHeader").innerHTML = renderFinCompany(data.company);
        document.getElementById("finRatios").innerHTML = renderFinRatios(data.ratios);
        document.getElementById("finTableIncome").innerHTML   = renderFinTable(data.income_statement, data.years, cur);
        document.getElementById("finTableBalance").innerHTML  = renderFinTable(data.balance_sheet, data.years, cur);
        document.getElementById("finTableCashflow").innerHTML = renderFinTable(data.cash_flow, data.years, cur);

        document.getElementById("finLoading").style.display = "none";
        document.getElementById("finContent").style.display = "block";

        // Scroll to section
        document.getElementById("financials")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
        document.getElementById("finLoading").style.display = "none";
        document.getElementById("finEmpty").style.display = "block";
        showToast(t("toast_error"), "error");
    }
}

function initFinSearch() {
    const input = document.getElementById("finSearch");
    const dropdown = document.getElementById("finDropdownPanel");
    const results = document.getElementById("finSearchResults");
    if(!input) return;
    
    let timeout = null;

    input.addEventListener("input", () => {
        clearTimeout(timeout);
        const q = input.value.trim();
        if (q.length < 2) { dropdown.classList.remove("open"); return; }
        timeout = setTimeout(async () => {
            try {
                const res = await api(`/api/stocks/search?q=${encodeURIComponent(q)}`);
                if (!res.length) {
                    results.innerHTML = `<div class="search-result-item no-results">${t("empty_subtitle")}</div>`;
                } else {
                    results.innerHTML = res.map(r => `
                        <div class="search-result-item" onclick="loadFinancials('${r.symbol}', '${r.name.replace(/'/g, "\\'")}')">
                            <span class="result-symbol">${r.symbol}</span>
                            <span class="result-name">${r.name}</span>
                            <span class="result-meta">${r.exchange || ""} • ${r.type || ""} • ${r.currency || ""}</span>
                        </div>`).join("");
                }
                dropdown.classList.add("open");
            } catch (e) {
                results.innerHTML = `<div class="search-result-item error">${t("toast_error")}</div>`;
                dropdown.classList.add("open");
            }
        }, 300);
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest("#finSearchDropdown")) dropdown.classList.remove("open");
    });
}

// Financial statement tab switching
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".fin-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".fin-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const tab = btn.dataset.tab;
            document.getElementById("finTableIncome").style.display   = tab === "income"   ? "" : "none";
            document.getElementById("finTableBalance").style.display  = tab === "balance"  ? "" : "none";
            document.getElementById("finTableCashflow").style.display = tab === "cashflow" ? "" : "none";
        });
    });
});

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage();
    initSearch();
    initFinSearch();
    loadStocks();
    loadAlerts();
    loadMovers();
    loadSettings();
    renderPopular();
    loadHistory();

    const addBtn = document.getElementById("addStockBtn");
    if(addBtn) {
        addBtn.addEventListener("click", () => {
            document.getElementById("stockSearch").focus();
        });
    }

    const saveBtn = document.getElementById("saveSettingsBtn");
    if(saveBtn) saveBtn.addEventListener("click", saveSettings);
    
    const testNotifBtn = document.getElementById("testNotifBtn");
    if(testNotifBtn) testNotifBtn.addEventListener("click", () => testNotification());
    
    const testMoversBtn = document.getElementById("testMoversBtn");
    if(testMoversBtn) testMoversBtn.addEventListener("click", () => testMovers());
    
    const langBtn = document.getElementById("langToggle");
    if(langBtn) {
        langBtn.addEventListener("click", () => {
            currentLang = currentLang === "en" ? "fr" : "en";
            localStorage.setItem("sn_lang", currentLang);
            applyLanguage();
        });
    }

    // --- Navigation Arr-style ---
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                e.preventDefault();
                // Retirer la classe active partout
                document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                
                // Activer l'élément cliqué
                link.classList.add('active');
                const targetPage = document.getElementById('page-' + targetId);
                if(targetPage) targetPage.classList.add('active');
            }
        });
    });
});

// --- Search ---
let searchTimeout = null;

function initSearch() {
    const input = document.getElementById("stockSearch");
    const dropdown = document.getElementById("dropdownPanel");
    const results = document.getElementById("searchResults");
    if(!input) return;

    input.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        const q = input.value.trim();
        if (q.length < 2) {
            closeDropdown();
            return;
        }
        searchTimeout = setTimeout(async () => {
            try {
                const results_data = await api(`/api/stocks/search?q=${encodeURIComponent(q)}`);
                if (!results_data.length) {
                    results.innerHTML = `<div class="search-result-item no-results">${t("empty_subtitle")}</div>`;
                    dropdown.classList.add("open");
                    return;
                }
                results.innerHTML = results_data
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
    const modal = document.getElementById("chartModal");
    if(modal) modal.classList.remove("active");
}

// --- Period Buttons ---
document.querySelectorAll(".chart-period").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".chart-period").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const symbol = document.getElementById("chartModalSymbol").textContent;
        const period = btn.dataset.period;
        saveStoredPeriod(symbol, period);
        loadChartData(symbol, period);
    });
});