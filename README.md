# 📈 StockNotifier

A self-hosted stock monitoring dashboard with Pushover notifications.  
Built for Synology NAS (Docker/Container Manager).

![Dark theme dashboard with sparkline charts]

## Features

- **Dashboard** — Real-time stock prices with sparkline charts, daily change %, high/low/volume
- **Search & Add** — Search any stock, index, or crypto via dropdown + popular picks
- **Notifications** — Daily summary, weekly recap, price spike alerts via Pushover
- **Bilingual** — English / French toggle
- **Dark Mode** — Clean *arr-style interface
- **Self-hosted** — All data stays on your NAS

## Quick Start (Synology NAS)

### 1. Prerequisites

- Synology NAS with **Container Manager** installed (DSM 7.2+)
- **Pushover** account — [pushover.net](https://pushover.net) (~$5 one-time)
  - Create an Application to get your **API Token**
  - Note your **User Key**

### 2. Transfer Files

Copy this entire `stocknotifier/` folder to your NAS:

```
/volume1/docker/stocknotifier/
├── app/
│   └── main.py
├── static/
│   ├── css/style.css
│   └── js/app.js
├── templates/
│   └── index.html
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

**Options to transfer:**
- **File Station** — drag & drop the folder
- **SSH/SCP** — `scp -r stocknotifier/ user@nas:/volume1/docker/`
- **Synology Drive** — sync from your computer

### 3. Build & Run

**Option A — Container Manager UI:**
1. Open **Container Manager** → **Project**
2. Click **Create**
3. Set project name: `stocknotifier`
4. Set path: `/volume1/docker/stocknotifier`
5. It will auto-detect `docker-compose.yml`
6. Click **Build & Run**

**Option B — SSH:**
```bash
ssh user@your-nas-ip
cd /volume1/docker/stocknotifier
sudo docker-compose up -d --build
```

### 4. Access

Open your browser: **http://your-nas-ip:8080**

### 5. Configure

1. Go to **Settings**
2. Enter your Pushover **User Key** and **API Token**
3. Toggle notifications on/off, set times
4. Click **Save**
5. Hit **Test Notification** to verify

## Usage

- Click **Add Stock** to search and track stocks
- Popular picks (S&P 500, CAC 40, NASDAQ, Bitcoin...) are one-click
- Cards show price, daily change, sparkline, high/low/volume
- Remove stocks by hovering and clicking ✕

## Updating

```bash
cd /volume1/docker/stocknotifier
sudo docker-compose down
sudo docker-compose up -d --build
```

## Port Conflict?

Change the port in `docker-compose.yml`:
```yaml
ports:
  - "9090:8080"  # Access on port 9090 instead
```

## Stack

- **Backend**: Python, FastAPI, yfinance, APScheduler
- **Frontend**: Vanilla JS, CSS (no framework)
- **Database**: SQLite
- **Notifications**: Pushover API
