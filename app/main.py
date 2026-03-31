"""
StockNotifier - Backend API
A self-hosted stock monitoring dashboard with Pushover notifications.
"""

import os
import json
import sqlite3
import logging
from datetime import datetime, timedelta
from contextlib import contextmanager
from pathlib import Path

import yfinance as yf
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

# --- Config ---
DATA_DIR = Path(os.getenv("DATA_DIR", "/data"))
DB_PATH = DATA_DIR / "stocknotifier.db"
DATA_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("stocknotifier")

# --- Database ---
@contextmanager
def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS stocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symbol TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                added_at TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS price_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symbol TEXT NOT NULL,
                price REAL NOT NULL,
                change_pct REAL,
                recorded_at TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS notification_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                message TEXT,
                sent_at TEXT DEFAULT (datetime('now')),
                success INTEGER DEFAULT 1
            )
        """)
        # Default settings
        defaults = {
            "pushover_user_key": "",
            "pushover_api_token": "",
            "daily_enabled": "true",
            "daily_time": "18:00",
            "daily_monthly_change": "true",
            "weekly_enabled": "true",
            "weekly_day": "1",
            "weekly_time": "09:00",
            "alert_enabled": "true",
            "alert_threshold": "3.0",
            "movers_enabled": "true",
            "movers_time": "18:30",
            "movers_count": "5",
            "language": "en",
        }
        for k, v in defaults.items():
            conn.execute(
                "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", (k, v)
            )


def get_setting(key: str) -> str:
    with get_db() as conn:
        row = conn.execute("SELECT value FROM settings WHERE key = ?", (key,)).fetchone()
        return row["value"] if row else ""


def get_all_settings() -> dict:
    with get_db() as conn:
        rows = conn.execute("SELECT key, value FROM settings").fetchall()
        return {r["key"]: r["value"] for r in rows}


def set_setting(key: str, value: str):
    with get_db() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, value)
        )


# --- Stock Data ---


def fetch_stock_data(symbol: str, period: str = "5d") -> dict | None:
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)
        if hist.empty:
            return None
        info = ticker.info
        current = hist["Close"].iloc[-1]
        prev = hist["Close"].iloc[-2] if len(hist) > 1 else current
        change = current - prev
        change_pct = (change / prev) * 100 if prev else 0

        # Sparkline data (last 5 days)
        sparkline = hist["Close"].tolist()

        return {
            "symbol": symbol,
            "name": info.get("shortName", info.get("longName", symbol)),
            "price": round(current, 2),
            "change": round(change, 2),
            "change_pct": round(change_pct, 2),
            "currency": info.get("currency", "USD"),
            "sparkline": [round(v, 2) for v in sparkline],
            "high": round(hist["High"].iloc[-1], 2),
            "low": round(hist["Low"].iloc[-1], 2),
            "volume": int(hist["Volume"].iloc[-1]) if hist["Volume"].iloc[-1] else 0,
        }
    except Exception as e:
        logger.error(f"Error fetching {symbol}: {e}")
        return None


def fetch_stock_data_extended(symbol: str) -> dict | None:
    """Fetch stock data with monthly change included."""
    try:
        ticker = yf.Ticker(symbol)
        hist_5d = ticker.history(period="5d")
        hist_1mo = ticker.history(period="1mo")
        if hist_5d.empty:
            return None
        info = ticker.info
        current = hist_5d["Close"].iloc[-1]
        prev = hist_5d["Close"].iloc[-2] if len(hist_5d) > 1 else current
        change = current - prev
        change_pct = (change / prev) * 100 if prev else 0

        # Monthly change
        monthly_change_pct = 0.0
        if not hist_1mo.empty and len(hist_1mo) >= 2:
            month_start = hist_1mo["Close"].iloc[0]
            monthly_change_pct = ((current - month_start) / month_start) * 100 if month_start else 0

        # Weekly change
        weekly_change_pct = 0.0
        if len(hist_5d) >= 2:
            week_start = hist_5d["Close"].iloc[0]
            weekly_change_pct = ((current - week_start) / week_start) * 100 if week_start else 0

        sparkline = hist_5d["Close"].tolist()

        return {
            "symbol": symbol,
            "name": info.get("shortName", info.get("longName", symbol)),
            "price": round(current, 2),
            "change": round(change, 2),
            "change_pct": round(change_pct, 2),
            "weekly_change_pct": round(weekly_change_pct, 2),
            "monthly_change_pct": round(monthly_change_pct, 2),
            "currency": info.get("currency", "USD"),
            "sparkline": [round(v, 2) for v in sparkline],
            "high": round(hist_5d["High"].iloc[-1], 2),
            "low": round(hist_5d["Low"].iloc[-1], 2),
            "volume": int(hist_5d["Volume"].iloc[-1]) if hist_5d["Volume"].iloc[-1] else 0,
        }
    except Exception as e:
        logger.error(f"Error fetching extended {symbol}: {e}")
        return None


def search_stocks(query: str) -> list:
    """Search for stocks using yfinance."""
    try:
        results = []
        # Try direct lookup first
        ticker = yf.Ticker(query.upper())
        info = ticker.info
        if info and info.get("shortName"):
            results.append({
                "symbol": query.upper(),
                "name": info.get("shortName", query.upper()),
                "exchange": info.get("exchange", ""),
                "type": info.get("quoteType", ""),
            })

        # Common indices and popular searches
        popular = {
            "^GSPC": "S&P 500",
            "^DJI": "Dow Jones Industrial Average",
            "^IXIC": "NASDAQ Composite",
            "^FCHI": "CAC 40",
            "^GDAXI": "DAX",
            "^FTSE": "FTSE 100",
            "^N225": "Nikkei 225",
            "BTC-USD": "Bitcoin USD",
            "ETH-USD": "Ethereum USD",
        }
        q = query.upper()
        for sym, name in popular.items():
            if q in sym.upper() or q in name.upper():
                if not any(r["symbol"] == sym for r in results):
                    results.append({
                        "symbol": sym,
                        "name": name,
                        "exchange": "Index",
                        "type": "INDEX",
                    })
        return results[:10]
    except Exception as e:
        logger.error(f"Search error: {e}")
        return []


# --- Pushover ---
def send_pushover(message: str, title: str = "StockNotifier") -> bool:
    user_key = get_setting("pushover_user_key")
    api_token = get_setting("pushover_api_token")
    if not user_key or not api_token:
        logger.warning("Pushover not configured")
        return False
    try:
        resp = httpx.post(
            "https://api.pushover.net/1/messages.json",
            data={
                "token": api_token,
                "user": user_key,
                "title": title,
                "message": message,
                "html": 1,
            },
        )
        success = resp.status_code == 200
        with get_db() as conn:
            conn.execute(
                "INSERT INTO notification_log (type, message, success) VALUES (?, ?, ?)",
                (title, message[:500], int(success)),
            )
        return success
    except Exception as e:
        logger.error(f"Pushover error: {e}")
        return False


# --- Notification Builders ---
def build_daily_summary() -> str:
    with get_db() as conn:
        stocks = conn.execute("SELECT symbol, name FROM stocks").fetchall()
    if not stocks:
        return ""
    include_monthly = get_setting("daily_monthly_change") == "true"
    lang = get_setting("language") or "en"

    if lang == "fr":
        lines = ["📊 <b>Résumé quotidien</b>\n"]
    else:
        lines = ["📊 <b>Daily Summary</b>\n"]

    for s in stocks:
        data = fetch_stock_data_extended(s["symbol"]) if include_monthly else fetch_stock_data(s["symbol"], period="2d")
        if data:
            arrow = "🟢" if data["change_pct"] >= 0 else "🔴"
            sign = "+" if data["change_pct"] >= 0 else ""
            line = (
                f"{arrow} <b>{data['name']}</b>\n"
                f"   {data['price']} {data['currency']} ({sign}{data['change_pct']}%)"
            )
            if include_monthly and "monthly_change_pct" in data:
                m_sign = "+" if data["monthly_change_pct"] >= 0 else ""
                m_label = "mois" if lang == "fr" else "month"
                line += f" | {m_label}: {m_sign}{data['monthly_change_pct']}%"
            lines.append(line)
            # Save to history
            with get_db() as conn:
                conn.execute(
                    "INSERT INTO price_history (symbol, price, change_pct) VALUES (?, ?, ?)",
                    (s["symbol"], data["price"], data["change_pct"]),
                )
    return "\n".join(lines)


def build_weekly_summary() -> str:
    with get_db() as conn:
        stocks = conn.execute("SELECT symbol, name FROM stocks").fetchall()
    if not stocks:
        return ""
    lang = get_setting("language") or "en"
    if lang == "fr":
        lines = ["📈 <b>Résumé hebdomadaire</b>\n"]
    else:
        lines = ["📈 <b>Weekly Summary</b>\n"]

    for s in stocks:
        data = fetch_stock_data(s["symbol"], period="5d")
        if data and data["sparkline"] and len(data["sparkline"]) >= 2:
            week_start = data["sparkline"][0]
            week_end = data["sparkline"][-1]
            week_change = ((week_end - week_start) / week_start) * 100
            arrow = "🟢" if week_change >= 0 else "🔴"
            sign = "+" if week_change >= 0 else ""
            week_label = "cette semaine" if lang == "fr" else "this week"
            lines.append(
                f"{arrow} <b>{data['name']}</b>\n"
                f"   {data['price']} {data['currency']} ({sign}{week_change:.2f}% {week_label})"
            )
    return "\n".join(lines)


def build_movers_summary() -> str:
    """Build a summary of top movers (daily + weekly)."""
    with get_db() as conn:
        stocks = conn.execute("SELECT symbol, name FROM stocks").fetchall()
    if not stocks:
        return ""

    count = int(get_setting("movers_count") or 5)
    lang = get_setting("language") or "en"

    stock_data = []
    for s in stocks:
        data = fetch_stock_data_extended(s["symbol"])
        if data:
            stock_data.append(data)

    if not stock_data:
        return ""

    # Sort by absolute daily change
    daily_movers = sorted(stock_data, key=lambda x: abs(x["change_pct"]), reverse=True)[:count]
    # Sort by absolute weekly change
    weekly_movers = sorted(stock_data, key=lambda x: abs(x.get("weekly_change_pct", 0)), reverse=True)[:count]

    if lang == "fr":
        lines = ["🔥 <b>Top movers</b>\n", "📅 <b>Aujourd'hui :</b>"]
    else:
        lines = ["🔥 <b>Top Movers</b>\n", "📅 <b>Today:</b>"]

    for d in daily_movers:
        arrow = "🟢" if d["change_pct"] >= 0 else "🔴"
        sign = "+" if d["change_pct"] >= 0 else ""
        lines.append(f"  {arrow} {d['name']}: {sign}{d['change_pct']}%")

    if lang == "fr":
        lines.append("\n📊 <b>Cette semaine :</b>")
    else:
        lines.append("\n📊 <b>This week:</b>")

    for d in weekly_movers:
        wc = d.get("weekly_change_pct", 0)
        arrow = "🟢" if wc >= 0 else "🔴"
        sign = "+" if wc >= 0 else ""
        lines.append(f"  {arrow} {d['name']}: {sign}{wc}%")

    return "\n".join(lines)


def check_alerts():
    threshold = float(get_setting("alert_threshold") or 3.0)
    with get_db() as conn:
        stocks = conn.execute("SELECT symbol, name FROM stocks").fetchall()
    for s in stocks:
        data = fetch_stock_data(s["symbol"], period="2d")
        if data and abs(data["change_pct"]) >= threshold:
            arrow = "🚀" if data["change_pct"] > 0 else "⚠️"
            sign = "+" if data["change_pct"] >= 0 else ""
            msg = (
                f"{arrow} <b>Alert: {data['name']}</b>\n"
                f"{data['price']} {data['currency']} ({sign}{data['change_pct']}%)\n"
                f"Threshold: ±{threshold}%"
            )
            send_pushover(msg, title="⚡ StockNotifier Alert")


# --- Scheduler ---
scheduler = BackgroundScheduler()


def setup_scheduler():
    scheduler.remove_all_jobs()
    settings = get_all_settings()

    if settings.get("daily_enabled") == "true":
        h, m = settings.get("daily_time", "18:00").split(":")
        scheduler.add_job(
            lambda: send_pushover(build_daily_summary(), "📊 Daily Summary"),
            CronTrigger(hour=int(h), minute=int(m)),
            id="daily",
            replace_existing=True,
        )
        logger.info(f"Daily notification scheduled at {h}:{m}")

    if settings.get("weekly_enabled") == "true":
        h, m = settings.get("weekly_time", "09:00").split(":")
        day = int(settings.get("weekly_day", 1))
        scheduler.add_job(
            lambda: send_pushover(build_weekly_summary(), "📈 Weekly Summary"),
            CronTrigger(day_of_week=day, hour=int(h), minute=int(m)),
            id="weekly",
            replace_existing=True,
        )
        logger.info(f"Weekly notification scheduled day={day} at {h}:{m}")

    if settings.get("alert_enabled") == "true":
        scheduler.add_job(
            check_alerts,
            CronTrigger(minute="*/30"),
            id="alerts",
            replace_existing=True,
        )
        logger.info("Alert checks scheduled every 30min")

    if settings.get("movers_enabled") == "true":
        h, m = settings.get("movers_time", "18:30").split(":")
        scheduler.add_job(
            lambda: send_pushover(build_movers_summary(), "🔥 Top Movers"),
            CronTrigger(hour=int(h), minute=int(m)),
            id="movers",
            replace_existing=True,
        )
        logger.info(f"Top movers notification scheduled at {h}:{m}")

    if not scheduler.running:
        scheduler.start()


# --- FastAPI App ---
app = FastAPI(title="StockNotifier", version="2.0.0")

BASE_DIR = Path(__file__).resolve().parent.parent
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@app.on_event("startup")
def startup():
    init_db()
    setup_scheduler()


# --- Pages ---
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# --- API Routes ---
@app.get("/api/stocks")
async def api_get_stocks():
    with get_db() as conn:
        stocks = conn.execute("SELECT * FROM stocks ORDER BY added_at DESC").fetchall()
    results = []
    for s in stocks:
        data = fetch_stock_data_extended(s["symbol"])
        if data:
            results.append(data)
        else:
            results.append({
                "symbol": s["symbol"],
                "name": s["name"],
                "price": 0,
                "change": 0,
                "change_pct": 0,
                "weekly_change_pct": 0,
                "monthly_change_pct": 0,
                "currency": "USD",
                "sparkline": [],
                "error": True,
            })
    return results


@app.get("/api/stocks/search")
async def api_search_stocks(q: str = ""):
    if len(q) < 1:
        return []
    return search_stocks(q)


@app.post("/api/stocks")
async def api_add_stock(request: Request):
    body = await request.json()
    symbol = body.get("symbol", "").upper().strip()
    name = body.get("name", symbol)
    if not symbol:
        raise HTTPException(400, "Symbol required")
    with get_db() as conn:
        try:
            conn.execute(
                "INSERT INTO stocks (symbol, name) VALUES (?, ?)", (symbol, name)
            )
        except sqlite3.IntegrityError:
            raise HTTPException(409, "Stock already tracked")
    return {"ok": True, "symbol": symbol}


@app.delete("/api/stocks/{symbol}")
async def api_delete_stock(symbol: str):
    with get_db() as conn:
        conn.execute("DELETE FROM stocks WHERE symbol = ?", (symbol.upper(),))
    return {"ok": True}


@app.get("/api/settings")
async def api_get_settings():
    return get_all_settings()


@app.post("/api/settings")
async def api_save_settings(request: Request):
    body = await request.json()
    for k, v in body.items():
        set_setting(k, str(v))
    setup_scheduler()
    return {"ok": True}


@app.post("/api/test-notification")
async def api_test_notification():
    if not get_setting("pushover_user_key") or not get_setting("pushover_api_token"):
        raise HTTPException(400, "Clés Pushover manquantes. Veuillez les configurer dans les paramètres.")

    summary = build_daily_summary()
    if not summary:
        summary = "🔔 <b>Test Notification</b>\nStockNotifier is working! Add some stocks to get started."
    success = send_pushover(summary, "🔔 StockNotifier Test")
    if not success:
        raise HTTPException(500, "Failed to send. Check Pushover credentials.")
    return {"ok": True}


@app.post("/api/test-movers")
async def api_test_movers():
    if not get_setting("pushover_user_key") or not get_setting("pushover_api_token"):
        raise HTTPException(400, "Clés Pushover manquantes. Veuillez les configurer dans les paramètres.")

    summary = build_movers_summary()
    if not summary:
        summary = "🔥 <b>Top Movers Test</b>\nNo stocks tracked yet."
    success = send_pushover(summary, "🔥 Top Movers Test")
    if not success:
        raise HTTPException(500, "Failed to send. Check Pushover credentials.")
    return {"ok": True}


@app.get("/api/history")
async def api_get_history(limit: int = 20):
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM notification_log ORDER BY sent_at DESC LIMIT ?", (limit,)
        ).fetchall()
    return [dict(r) for r in rows]


@app.get("/api/stock/{symbol}/history")
async def api_stock_history(symbol: str, period: str = "1mo"):
    try:
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period=period)
        if hist.empty:
            return []
        return [
            {
                "date": d.strftime("%Y-%m-%d"),
                "close": round(row["Close"], 2),
                "high": round(row["High"], 2),
                "low": round(row["Low"], 2),
                "volume": int(row["Volume"]) if row["Volume"] else 0,
            }
            for d, row in hist.iterrows()
        ]
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/api/movers")
async def api_get_movers():
    """Get top movers among tracked stocks."""
    with get_db() as conn:
        stocks = conn.execute("SELECT symbol, name FROM stocks").fetchall()
    stock_data = []
    for s in stocks:
        data = fetch_stock_data_extended(s["symbol"])
        if data:
            stock_data.append(data)

    daily_movers = sorted(stock_data, key=lambda x: abs(x["change_pct"]), reverse=True)
    weekly_movers = sorted(stock_data, key=lambda x: abs(x.get("weekly_change_pct", 0)), reverse=True)

    return {
        "daily": daily_movers,
        "weekly": weekly_movers,
    }
