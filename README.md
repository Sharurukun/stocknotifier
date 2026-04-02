# 📊 StockNotifier

> A clean, self-hosted stock monitoring dashboard with Pushover notifications — built for Docker and Synology NAS.

![Dashboard](https://img.shields.io/badge/status-active-brightgreen)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Python](https://img.shields.io/badge/python-3.11-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 📈 Dashboard
- Track **stocks, ETFs, indices, and crypto** side by side
- **Sparkline charts** showing the 5-day trend with High / Low / Volume
- Daily, weekly, and monthly change badges per card
- **Drag & drop** to reorder cards — order persists across sessions
- **Expand cards** to 2-column wide view (per-card, persistent)
- Click any card to open a full **Chart modal** with 1M / 3M / 6M / 1Y / 5Y periods — period remembered per ticker

### 🔍 Universal Search
- Powered by the **Yahoo Finance search API** — finds any ticker worldwide
- Stocks, ETFs (WPEA, CW8...), crypto (BTC, ETH...), indices (CAC 40, S&P 500...), commodities, FX
- Fuzzy search by name or symbol (e.g. "Airbus" → AIR.PA)

### 📊 Financial Modelling
Dedicated tab for deep-dive analysis on any company:
- **Company overview** — sector, industry, country, employees, website, description
- **Key metrics** — price, market cap, EV, 52W high/low
- **3 financial statements** (last 4 fiscal years):
  - Income Statement — Revenue, EBITDA, EBIT, Net Income, EPS
  - Balance Sheet — Assets, Debt, Equity, Cash
  - Cash Flow — OCF, CapEx, FCF, investing & financing flows
- **YoY growth** (▲/▼ %) displayed inline on Revenue, EBITDA, Net Income, OCF
- **IB-grade ratios** grouped by:
  - Valuation: P/E, Forward P/E, PEG, EV/EBITDA, EV/Revenue, P/B, P/S
  - Profitability: Gross Margin, EBITDA Margin, Operating Margin, Net Margin, ROE, ROA
  - Leverage: Debt/Equity, Current Ratio, Quick Ratio
  - Per Share: EPS, Forward EPS, Book Value, Dividend Yield
  - Growth: Revenue Growth, Earnings Growth, EPS Growth

### 🔔 Custom Alerts
Create, manage, and test fully custom Pushover notifications:

| Type | Trigger |
|---|---|
| 💰 **Price Alert** | Stock crosses above or below a target price |
| 📈 **% Change** | Daily / weekly / monthly move exceeds ±X% |
| 📊 **Volume Spike** | Volume is X× above the average |
| 🎯 **RSI Alert** | RSI(n) enters overbought / oversold zone |
| 🏆 **52W High/Low** | Stock approaches its 52-week extreme |
| 📅 **Scheduled Digest** | Custom digest for selected tickers at a chosen time |

- Enable/disable per alert with a toggle
- **Test** button to trigger any alert on demand
- 4-hour cooldown to prevent spam
- Checks run every 30 minutes in the background
- Digest alerts get their own independent cron job

### 📬 Built-in Notifications (Pushover)
- **Daily summary** — closing prices for all tracked stocks at a configurable time
- **Weekly recap** — weekly performance every chosen weekday
- **Price spike alerts** — configurable % threshold, checked every 30 minutes
- **Top Movers digest** — top N daily + weekly movers at a configurable time

### 🗂 Other
- **Top Movers** section — ranked daily and weekly movers across your tracked stocks
- **Notification history** — log of all sent notifications with success/failure status
- **Bilingual** — English / French interface toggle
- **Privacy first** — fully self-hosted, no accounts, data in a local SQLite file

---

## 🚀 Quick Start

### Prerequisites
- Docker (or Synology Container Manager DSM 7.2+)
- A [Pushover](https://pushover.net) account for mobile push notifications (~$5 one-time fee)
  - Create an Application → get your **API Token**
  - Note your **User Key**

### Run with Docker Compose (recommended)

Create a `docker-compose.yml`:

```yaml
services:
  stocknotifier:
    image: ghcr.io/sharurukun/stocknotifier:latest
    container_name: stocknotifier
    restart: unless-stopped
    ports:
      - "7077:8080"
    volumes:
      - ./data:/data
    environment:
      - TZ=Europe/Paris
```

Then:

```bash
docker compose up -d
```

Open **http://localhost:7077** in your browser.

### Run with Docker CLI

```bash
docker run -d \
  --name stocknotifier \
  --restart unless-stopped \
  -p 7077:8080 \
  -v $(pwd)/data:/data \
  -e TZ=Europe/Paris \
  ghcr.io/sharurukun/stocknotifier:latest
```

---

## ⚙️ Configuration

All settings are managed from the **Settings** tab inside the app. No config files needed.

| Setting | Description |
|---|---|
| Pushover User Key | Your Pushover account user key |
| Pushover API Token | Your application API token |
| Daily summary | Enable + choose send time |
| Weekly recap | Enable + choose weekday + time |
| Price spike alerts | Enable + set % threshold |
| Top Movers digest | Enable + choose time + number of stocks |
| Language | English / French |

---

## 🐳 Synology NAS Setup

1. Open **Container Manager** → **Project** → **Create**
2. Paste the `docker-compose.yml` above
3. Set the local port (e.g. `7077`) and a bind-mount path under `/volume1/docker/stocknotifier/data`
4. Start the project — the app will be available at `http://<NAS-IP>:7077`

> **Tip:** Use Synology's **Reverse Proxy** (Control Panel → Login Portal → Advanced) to expose it over HTTPS on a subdomain.

---

## 🛠 Development

### Local setup

```bash
git clone https://github.com/Sharurukun/stocknotifier.git
cd stocknotifier
pip install -r requirements.txt
DATA_DIR=./data uvicorn app.main:app --reload --port 8080
```

### Stack
- **Backend** — Python 3.11, FastAPI, APScheduler, yfinance, httpx
- **Frontend** — Vanilla JS, Chart.js, pure CSS (no build step)
- **Database** — SQLite (single file, zero config)
- **Notifications** — Pushover API

---

## 📁 Project Structure

```
stocknotifier/
├── app/
│   └── main.py          # FastAPI backend, scheduler, all logic
├── static/
│   ├── css/style.css    # Dark theme UI
│   └── js/app.js        # Frontend application
├── templates/
│   └── index.html       # Single-page app shell
├── data/                # SQLite database (bind-mounted)
├── Dockerfile
└── docker-compose.yml
```

---

## 📄 License

MIT — free to use, modify, and self-host.
