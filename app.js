/* ============================================
   StockNotifier - Frontend App
   ============================================ */

// --- i18n ---
const translations = {
    en: {
        nav_dashboard: "Dashboard",
        nav_settings: "Settings",
        nav_history: "History",
        dashboard_title: "Dashboard",
        dashboard_subtitle: "Your tracked stocks at a glance",
        settings_title: "Settings",
        settings_subtitle: "Configure notifications & integrations",
        history_title: "Notification History",
        history_subtitle: "Recent notifications sent",
        btn_add_stock: "Add Stock",
        btn_save: "Save Settings",
        btn_test: "Test Notification",
        empty_title: "No stocks tracked yet",
        empty_subtitle: "Add your first stock to get started",
        modal_add_title: "Add Stock",
        search_placeholder: "Search stocks, indices, crypto...",
        popular_title: "Popular",
        label_user_key: "User Key",
        label_api_token: "API Token",
        label_send_at: "Send at",
        label_day: "Day",
        label_threshold: "Threshold (%)",
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
    },
    fr: {
        nav_dashboard: "Tableau de bord",
        nav_settings: "Paramètres",
        nav_history: "Historique",
        dashboard_title: "Tableau de bord",
        dashboard_subtitle: "Vos actions suivies en un coup d'œil",
        settings_title: "Paramètres",
        settings_subtitle: "Configurer les notifications et intégrations",
        history_title: "Historique des notifications",
        history_subtitle: "Notifications récentes envoyées",
        btn_add_stock: "Ajouter",
        btn_save: "Enregistrer",
        btn_test: "Tester la notification",
        empty_title: "Aucune action suivie",
        empty_subtitle: "Ajoutez votre première action pour commencer",
        modal_add_title: "Ajouter une action",
        search_placeholder: "Chercher actions, indices, crypto...",
        popular_title: "Populaires",
        label_user_key: "Clé utilisateur",
        label_api_token: "Jeton API",
        label_send_at: "Envoyer à",
        label_day: "Jour",
        label_threshold: "Seuil (%)",
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
    const bgColor = positive ? "var(--green-bg)" : "var(--red-bg)";
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
async function loadStocks() {
    const grid = document.getElementById("stocksGrid");
    const empty = document.getElementById("emptyState");

    grid.innerHTML = `<div class="stock-card loading"><div class="stock-symbol" style="width:60px">&nbsp;</div><div class="stock-name" style="width:120px">&nbsp;</div><div class="stock-price" style="width:100px">&nbsp;</div></div>`.repeat(3);

    try {
        const stocks = await api("/api/stocks");
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
                return `
                <div class="stock-card" data-symbol="${s.symbol}">
                    <div class="stock-card-header">
                        <span class="stock-symbol">${s.symbol}</span>
                        <button class="stock-remove" onclick="removeStock('${s.symbol}')" title="Remove">
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
        loadStocks();
    } catch (e) {
        if (e.message.includes("already")) {
            showToast("Already tracking " + symbol, "info");
        } else {
            showToast(t("toast_error"), "error");
        }
    }
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
        "daily_enabled", "daily_time",
        "weekly_enabled", "weekly_day", "weekly_time",
        "alert_enabled", "alert_threshold",
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

// --- Search ---
let searchTimeout = null;

function initSearch() {
    const input = document.getElementById("stockSearch");
    const results = document.getElementById("searchResults");

    input.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        const q = input.value.trim();
        if (q.length < 1) {
            results.innerHTML = "";
            return;
        }
        searchTimeout = setTimeout(async () => {
            try {
                const items = await api(`/api/stocks/search?q=${encodeURIComponent(q)}`);
                results.innerHTML = items
                    .map((s) => `
                        <div class="search-result-item" onclick="addStock('${s.symbol}', '${s.name.replace(/'/g, "\\'")}'); this.remove();">
                            <div class="search-result-info">
                                <span class="search-result-symbol">${s.symbol}</span>
                                <span class="search-result-name">${s.name}</span>
                            </div>
                            <span class="search-result-add">+ ADD</span>
                        </div>`)
                    .join("");
            } catch (e) {
                results.innerHTML = "";
            }
        }, 400);
    });
}

// --- Navigation ---
function navigateTo(page) {
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    const target = document.getElementById(`page-${page}`);
    const navItem = document.querySelector(`[data-page="${page}"]`);
    if (target) target.classList.add("active");
    if (navItem) navItem.classList.add("active");

    if (page === "dashboard") loadStocks();
    if (page === "settings") loadSettings();
    if (page === "history") loadHistory();
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage();

    // Navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            navigateTo(item.dataset.page);
        });
    });

    // Language toggle
    document.getElementById("langToggle").addEventListener("click", () => {
        currentLang = currentLang === "en" ? "fr" : "en";
        localStorage.setItem("sn_lang", currentLang);
        applyLanguage();
        // Re-render current page
        const activePage = document.querySelector(".nav-item.active");
        if (activePage) navigateTo(activePage.dataset.page);
    });

    // Modal
    const modal = document.getElementById("addStockModal");
    document.getElementById("addStockBtn").addEventListener("click", () => {
        modal.classList.add("active");
        document.getElementById("stockSearch").focus();
    });
    document.getElementById("closeModal").addEventListener("click", () => {
        modal.classList.remove("active");
        document.getElementById("stockSearch").value = "";
        document.getElementById("searchResults").innerHTML = "";
    });
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // Popular chips
    document.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", async () => {
            await addStock(chip.dataset.symbol, chip.dataset.name);
            chip.classList.add("added");
            chip.textContent = "✓ " + chip.textContent;
        });
    });

    // Settings save
    document.getElementById("saveSettingsBtn").addEventListener("click", saveSettings);

    // Test notification
    document.getElementById("testNotifBtn").addEventListener("click", async () => {
        try {
            await api("/api/test-notification", { method: "POST" });
            showToast(t("toast_test_ok"), "success");
        } catch (e) {
            showToast(t("toast_test_fail"), "error");
        }
    });

    // Init search
    initSearch();

    // Load dashboard
    loadStocks();
});
