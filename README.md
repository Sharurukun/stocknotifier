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

### 2. Install from Container Manager (recommended)

**Option A — Registry (like linuxserver images):**
1. Open **Container Manager** → **Registry**
2. Search for `ghcr.io/sharurukun/stocknotifier`
3. Download the `latest` tag
4. Go to **Image** → select `stocknotifier` → **Run**
5. Configure:
   - **Port**: local port `7077` → container port `8080`
   - **Volume**: create a folder `/volume1/docker/stocknotifier/data` and map it to `/data`
   - **Environment**: `TZ=Europe/Paris`, `DATA_DIR=/data`
6. Click **Apply**

**Option B — Docker Compose (Project):**
1. Create the folder `/volume1/docker/stocknotifier/` on your NAS
2. Copy only the `docker-compose.yml` file into it
3. Open **Container Manager** → **Project**
4. Click **Create**
5. Set project name: `stocknotifier`
6. Set path: `/volume1/docker/stocknotifier`
7. It will auto-detect `docker-compose.yml` and pull the image
8. Click **Run**

**Option C — SSH:**
```bash
ssh user@your-nas-ip
mkdir -p /volume1/docker/stocknotifier
cd /volume1/docker/stocknotifier
# Download docker-compose.yml then:
sudo docker-compose up -d
```

### 3. Build from source (advanced)

If you prefer to build locally instead of pulling from the registry:

```bash
ssh user@your-nas-ip
cd /volume1/docker/stocknotifier
# Clone the full repo, then:
sudo docker build -t stocknotifier .
sudo docker run -d --name stocknotifier -p 7077:8080 -v ./data:/data -e TZ=Europe/Paris -e DATA_DIR=/data stocknotifier
```

### 4. Access

Open your browser: **http://your-nas-ip:7077**

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
sudo docker-compose pull
sudo docker-compose up -d
```

Or from Container Manager: **Project** → `stocknotifier` → **Action** → **Build**

## Port Conflict?

Change the host port in `docker-compose.yml`:
```yaml
ports:
  - "9090:8080"  # Access on port 9090 instead of 7077
```

## Stack

- **Backend**: Python, FastAPI, yfinance, APScheduler
- **Frontend**: Vanilla JS, CSS (no framework)
- **Database**: SQLite
- **Notifications**: Pushover API
