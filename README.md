# 📈 StockNotifier

A clean, self-hosted stock & crypto monitoring dashboard with real-time Pushover notifications.  
Perfectly suited for a Synology NAS (Docker/Container Manager) or any Docker environment.

## ✨ Features

- **Intuitive Dashboard** — Real-time tracking of stocks, ETFs, indices, and crypto.
- **Sparkline Charts** — Visualize the 5-day trend instantly with high/low & volume stats.
- **Smart Search** — Integrated Yahoo Finance search with popular quick-picks (S&P 500, CAC 40, BTC...).
- **Automated Alerts (Pushover)**:
  - 📊 Daily closing summaries
  - 📈 Weekly recaps
  - ⚡ Price spike alerts (e.g., get notified if a stock moves > 3% in a day)
- **Localization** — Bilingual interface (English / French).
- **Privacy First** — Fully self-hosted, no accounts required, data stays in a local SQLite database.

---

## 🚀 Quick Start (Docker / Synology NAS)

### 1. Prerequisites
- Docker or Synology Container Manager (DSM 7.2+)
- A [Pushover](https://pushover.net) account (~$5 one-time fee) for mobile push notifications.
  - Create an Application to get your **API Token**.
  - Keep your **User Key** handy.

### 2. Run via Docker Compose (Recommended)
Create a `docker-compose.yml` file:

```yaml
version: "3.8"
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
