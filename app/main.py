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

import math
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
        conn.execute("""
            CREATE TABLE IF NOT EXISTS custom_notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                config TEXT NOT NULL,
                enabled INTEGER DEFAULT 1,
                created_at TEXT DEFAULT (datetime('now')),
                last_triggered TEXT
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
    """Search for stocks using Yahoo Finance search API with universal coverage."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json",
        }
        url = "https://query1.finance.yahoo.com/v1/finance/search"
        params = {
            "q": query,
            "quotesCount": 10,
            "newsCount": 0,
            "listsCount": 0,
            "enableFuzzyQuery": True,
        }

        with httpx.Client(timeout=10.0) as client:
            resp = client.get(url, params=params, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        quotes = data.get("finance", {}).get("result", [{}])[0].get("quotes", [])

        results = []
        for q in quotes:
            symbol = q.get("symbol", "")
            if not symbol:
                continue
            name = q.get("longname") or q.get("shortname") or symbol
            exchange = q.get("exchDisp") or q.get("exchange") or "Unknown"
            quote_type = q.get("quoteType", "EQUITY")
            currency = q.get("currency", "")
            results.append({
                "symbol": symbol,
                "name": name,
                "exchange": exchange,
                "type": quote_type,
                "currency": currency,
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
            timeout=10.0,
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


def _compute_rsi(closes: list, period: int = 14) -> float | None:
    """Wilder's RSI from a list of closing prices."""
    if len(closes) < period + 1:
        return None
    deltas = [closes[i] - closes[i - 1] for i in range(1, len(closes))]
    gains = [d if d > 0 else 0.0 for d in deltas]
    losses = [-d if d < 0 else 0.0 for d in deltas]
    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period
    for i in range(period, len(deltas)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return round(100 - (100 / (1 + rs)), 2)


def _cooldown_ok(last_triggered: str | None, hours: int = 4) -> bool:
    """Return True if enough time has passed since last trigger."""
    if not last_triggered:
        return True
    try:
        lt = datetime.fromisoformat(last_triggered)
        return (datetime.utcnow() - lt).total_seconds() > hours * 3600
    except Exception:
        return True


def _mark_triggered(notif_id: int):
    with get_db() as conn:
        conn.execute(
            "UPDATE custom_notifications SET last_triggered = datetime('now') WHERE id = ?",
            (notif_id,),
        )


def check_custom_notifications():
    """Evaluate all enabled custom notifications and send if triggered."""
    with get_db() as conn:
        notifs = conn.execute(
            "SELECT * FROM custom_notifications WHERE enabled = 1 AND type != 'digest'"
        ).fetchall()

    for n in notifs:
        try:
            cfg = json.loads(n["config"])
            ntype = n["type"]
            if not _cooldown_ok(n["last_triggered"]):
                continue

            if ntype == "price_alert":
                _check_price_alert(n["id"], n["name"], cfg)
            elif ntype == "pct_alert":
                _check_pct_alert(n["id"], n["name"], cfg)
            elif ntype == "vol_spike":
                _check_vol_spike(n["id"], n["name"], cfg)
            elif ntype == "rsi_alert":
                _check_rsi_alert(n["id"], n["name"], cfg)
            elif ntype == "week52":
                _check_week52(n["id"], n["name"], cfg)
        except Exception as e:
            logger.error(f"Custom notification {n['id']} error: {e}")


def _check_price_alert(notif_id: int, notif_name: str, cfg: dict):
    symbol = cfg.get("symbol", "")
    condition = cfg.get("condition", "above")  # above | below
    target = float(cfg.get("price", 0))
    data = fetch_stock_data(symbol, period="1d")
    if not data:
        return
    price = data["price"]
    hit = (condition == "above" and price >= target) or (condition == "below" and price <= target)
    if hit:
        sign = ">" if condition == "above" else "<"
        msg = (
            f"💰 <b>{notif_name}</b>\n"
            f"{data['name']} ({symbol})\n"
            f"{price} {data['currency']} {sign} target {target} {data['currency']}"
        )
        send_pushover(msg, "⚡ Price Alert")
        _mark_triggered(notif_id)


def _check_pct_alert(notif_id: int, notif_name: str, cfg: dict):
    symbol = cfg.get("symbol", "")
    threshold = float(cfg.get("threshold", 3.0))
    period_key = cfg.get("period", "daily")  # daily | weekly | monthly
    data = fetch_stock_data_extended(symbol)
    if not data:
        return
    pct_map = {
        "daily": data.get("change_pct", 0),
        "weekly": data.get("weekly_change_pct", 0),
        "monthly": data.get("monthly_change_pct", 0),
    }
    pct = pct_map.get(period_key, 0)
    if abs(pct) >= threshold:
        arrow = "🚀" if pct > 0 else "⚠️"
        sign = "+" if pct >= 0 else ""
        label = {"daily": "today", "weekly": "this week", "monthly": "this month"}.get(period_key, period_key)
        msg = (
            f"{arrow} <b>{notif_name}</b>\n"
            f"{data['name']} ({symbol})\n"
            f"{sign}{pct}% {label} (threshold: ±{threshold}%)"
        )
        send_pushover(msg, "📈 % Change Alert")
        _mark_triggered(notif_id)


def _check_vol_spike(notif_id: int, notif_name: str, cfg: dict):
    symbol = cfg.get("symbol", "")
    multiplier = float(cfg.get("multiplier", 2.0))
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info or {}
        avg_vol = info.get("averageVolume") or info.get("averageDailyVolume10Day")
        if not avg_vol:
            return
        hist = ticker.history(period="1d")
        if hist.empty:
            return
        today_vol = int(hist["Volume"].iloc[-1])
        if today_vol >= avg_vol * multiplier:
            ratio = today_vol / avg_vol
            name = info.get("shortName", symbol)
            msg = (
                f"📊 <b>{notif_name}</b>\n"
                f"{name} ({symbol})\n"
                f"Volume: {formatVolume_py(today_vol)} ({ratio:.1f}× avg {formatVolume_py(int(avg_vol))})"
            )
            send_pushover(msg, "📊 Volume Spike")
            _mark_triggered(notif_id)
    except Exception as e:
        logger.error(f"Vol spike check error {symbol}: {e}")


def _check_rsi_alert(notif_id: int, notif_name: str, cfg: dict):
    symbol = cfg.get("symbol", "")
    condition = cfg.get("condition", "below")  # above | below
    level = float(cfg.get("level", 30))
    period = int(cfg.get("rsi_period", 14))
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="3mo")
        if hist.empty or len(hist) < period + 1:
            return
        closes = hist["Close"].tolist()
        rsi = _compute_rsi(closes, period)
        if rsi is None:
            return
        hit = (condition == "above" and rsi >= level) or (condition == "below" and rsi <= level)
        if hit:
            emoji = "🔴" if condition == "below" else "🟡"
            sign = ">" if condition == "above" else "<"
            label = "Oversold" if (condition == "below" and level <= 35) else "Overbought" if (condition == "above" and level >= 65) else "RSI Alert"
            name = ticker.info.get("shortName", symbol) if ticker.info else symbol
            msg = (
                f"{emoji} <b>{notif_name}</b> — {label}\n"
                f"{name} ({symbol})\n"
                f"RSI({period}) = {rsi} {sign} {level}"
            )
            send_pushover(msg, f"🎯 {label}")
            _mark_triggered(notif_id)
    except Exception as e:
        logger.error(f"RSI check error {symbol}: {e}")


def _check_week52(notif_id: int, notif_name: str, cfg: dict):
    symbol = cfg.get("symbol", "")
    direction = cfg.get("direction", "both")  # high | low | both
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info or {}
        price = info.get("currentPrice") or info.get("regularMarketPrice")
        high52 = info.get("fiftyTwoWeekHigh")
        low52 = info.get("fiftyTwoWeekLow")
        name = info.get("shortName", symbol)
        currency = info.get("currency", "USD")
        if not price:
            return
        hit_high = direction in ("high", "both") and high52 and price >= high52 * 0.995
        hit_low  = direction in ("low",  "both") and low52  and price <= low52  * 1.005
        if hit_high:
            msg = f"🏆 <b>{notif_name}</b>\n{name} ({symbol})\n{price} {currency} — Near 52W High ({high52})"
            send_pushover(msg, "🏆 52-Week High")
            _mark_triggered(notif_id)
        elif hit_low:
            msg = f"🔻 <b>{notif_name}</b>\n{name} ({symbol})\n{price} {currency} — Near 52W Low ({low52})"
            send_pushover(msg, "🔻 52-Week Low")
            _mark_triggered(notif_id)
    except Exception as e:
        logger.error(f"52W check error {symbol}: {e}")


def build_custom_digest(cfg: dict) -> str:
    """Build a custom digest notification message."""
    symbols = cfg.get("symbols", [])
    title_text = cfg.get("title", "Custom Digest")
    include_weekly = cfg.get("include_weekly", False)
    include_monthly = cfg.get("include_monthly", False)
    lang = get_setting("language") or "en"
    lines = [f"📋 <b>{title_text}</b>\n"]
    for sym in symbols:
        data = fetch_stock_data_extended(sym)
        if not data:
            continue
        arrow = "🟢" if data["change_pct"] >= 0 else "🔴"
        sign = "+" if data["change_pct"] >= 0 else ""
        line = f"{arrow} <b>{data['name']}</b>\n   {data['price']} {data['currency']} ({sign}{data['change_pct']}%)"
        if include_weekly:
            ws = "+" if data.get("weekly_change_pct", 0) >= 0 else ""
            label = "sem." if lang == "fr" else "wk"
            line += f" | {label}: {ws}{data.get('weekly_change_pct', 0)}%"
        if include_monthly:
            ms = "+" if data.get("monthly_change_pct", 0) >= 0 else ""
            label = "mois" if lang == "fr" else "mo"
            line += f" | {label}: {ms}{data.get('monthly_change_pct', 0)}%"
        lines.append(line)
    return "\n".join(lines)


def formatVolume_py(v: int) -> str:
    if v >= 1_000_000_000:
        return f"{v / 1_000_000_000:.1f}B"
    if v >= 1_000_000:
        return f"{v / 1_000_000:.1f}M"
    if v >= 1_000:
        return f"{v / 1_000:.1f}K"
    return str(v)


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


def _schedule_digest_jobs():
    """Add/refresh scheduler jobs for all enabled digest notifications."""
    try:
        with get_db() as conn:
            digests = conn.execute(
                "SELECT * FROM custom_notifications WHERE type = 'digest' AND enabled = 1"
            ).fetchall()
    except Exception:
        return
    for d in digests:
        try:
            cfg = json.loads(d["config"])
            h, m = cfg.get("time", "08:00").split(":")
            schedule_type = cfg.get("schedule", "daily")
            job_id = f"custom_digest_{d['id']}"
            title = cfg.get("title", "Custom Digest")
            cfg_copy = dict(cfg)
            if schedule_type == "weekdays":
                trigger = CronTrigger(day_of_week="mon-fri", hour=int(h), minute=int(m))
            elif schedule_type == "weekly":
                dow = int(cfg.get("day_of_week", 0))
                trigger = CronTrigger(day_of_week=dow, hour=int(h), minute=int(m))
            else:  # daily
                trigger = CronTrigger(hour=int(h), minute=int(m))
            scheduler.add_job(
                lambda c=cfg_copy, t=title: send_pushover(build_custom_digest(c), f"📋 {t}"),
                trigger,
                id=job_id,
                replace_existing=True,
            )
        except Exception as e:
            logger.error(f"Digest job {d['id']} schedule error: {e}")


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

    # Custom notifications checker (every 30min)
    scheduler.add_job(
        check_custom_notifications,
        CronTrigger(minute="*/30"),
        id="custom_notifs",
        replace_existing=True,
    )

    # Re-schedule enabled digest notifications
    _schedule_digest_jobs()

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
    results = search_stocks(q)
    # Add loading/error status for frontend
    return results


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


def _safe_float(val):
    """Convert a value to float, returning None if invalid/NaN."""
    try:
        f = float(val)
        return None if math.isnan(f) or math.isinf(f) else f
    except (TypeError, ValueError):
        return None


def _df_to_dict(df, metrics_map):
    """Convert a yfinance DataFrame to {display_name: {year: value}}."""
    result = {}
    if df is None or df.empty:
        return result
    for display_name, yf_keys in metrics_map.items():
        keys = yf_keys if isinstance(yf_keys, list) else [yf_keys]
        for key in keys:
            if key in df.index:
                row = df.loc[key]
                result[display_name] = {
                    str(col.year): _safe_float(val)
                    for col, val in row.items()
                }
                break
    return result


@app.get("/api/stock/{symbol}/financials")
async def api_stock_financials(symbol: str):
    """Return financial statements, ratios, and company overview for a symbol."""
    try:
        ticker = yf.Ticker(symbol.upper())
        info = ticker.info or {}

        # Company overview
        company = {
            "name": info.get("longName") or info.get("shortName", symbol),
            "symbol": symbol.upper(),
            "exchange": info.get("fullExchangeName") or info.get("exchange", ""),
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
            "description": info.get("longBusinessSummary", ""),
            "employees": info.get("fullTimeEmployees"),
            "website": info.get("website", ""),
            "country": info.get("country", ""),
            "city": info.get("city", ""),
            "currency": info.get("currency", "USD"),
            "market_cap": _safe_float(info.get("marketCap")),
            "enterprise_value": _safe_float(info.get("enterpriseValue")),
            "current_price": _safe_float(info.get("currentPrice") or info.get("regularMarketPrice")),
            "week52_high": _safe_float(info.get("fiftyTwoWeekHigh")),
            "week52_low": _safe_float(info.get("fiftyTwoWeekLow")),
        }

        # --- Financial Statements ---
        # Try newer yfinance attr names, fall back to older ones
        income_df = getattr(ticker, "income_stmt", None) or getattr(ticker, "financials", None)
        balance_df = getattr(ticker, "balance_sheet", None)
        cashflow_df = getattr(ticker, "cash_flow", None) or getattr(ticker, "cashflow", None)

        income_metrics = {
            "Total Revenue":           ["Total Revenue"],
            "Cost of Revenue":         ["Cost Of Revenue"],
            "Gross Profit":            ["Gross Profit"],
            "R&D Expenses":            ["Research And Development"],
            "SG&A Expenses":           ["Selling General And Administration", "Selling General Administrative"],
            "Operating Income (EBIT)": ["Operating Income", "Ebit"],
            "EBITDA":                  ["EBITDA", "Normalized EBITDA"],
            "Interest Expense":        ["Interest Expense", "Net Interest Income"],
            "Pre-tax Income":          ["Pretax Income"],
            "Income Tax":              ["Tax Provision", "Income Tax Expense"],
            "Net Income":              ["Net Income"],
            "Basic EPS":               ["Basic EPS"],
            "Diluted EPS":             ["Diluted EPS"],
            "Shares Outstanding":      ["Diluted Average Shares", "Basic Average Shares"],
        }

        balance_metrics = {
            "Cash & Equivalents":       ["Cash And Cash Equivalents"],
            "Short-term Investments":   ["Other Short Term Investments", "Available For Sale Securities"],
            "Total Current Assets":     ["Current Assets"],
            "PP&E (Net)":               ["Net PPE"],
            "Goodwill":                 ["Goodwill"],
            "Intangible Assets":        ["Other Intangible Assets", "Goodwill And Other Intangible Assets"],
            "Total Assets":             ["Total Assets"],
            "Short-term Debt":          ["Current Debt", "Current Debt And Capital Lease Obligation"],
            "Total Current Liabilities":["Current Liabilities"],
            "Long-term Debt":           ["Long Term Debt", "Long Term Debt And Capital Lease Obligation"],
            "Total Liabilities":        ["Total Liabilities Net Minority Interest"],
            "Shareholders' Equity":     ["Stockholders Equity", "Common Stock Equity"],
            "Total Debt":               ["Total Debt"],
        }

        cashflow_metrics = {
            "Operating Cash Flow":  ["Operating Cash Flow"],
            "Capital Expenditures": ["Capital Expenditure"],
            "Free Cash Flow":       ["Free Cash Flow"],
            "Acquisitions":         ["Acquisitions And Other Investing Activities", "Purchase Of Business"],
            "Investing Cash Flow":  ["Investing Cash Flow"],
            "Dividends Paid":       ["Common Stock Dividend Paid", "Payment Of Dividends"],
            "Share Buybacks":       ["Repurchase Of Capital Stock", "Common Stock Repurchase"],
            "Financing Cash Flow":  ["Financing Cash Flow"],
            "Net Change in Cash":   ["Changes In Cash", "End Cash Position"],
        }

        income_data = _df_to_dict(income_df, income_metrics)
        balance_data = _df_to_dict(balance_df, balance_metrics)
        cashflow_data = _df_to_dict(cashflow_df, cashflow_metrics)

        # Years available (most recent first)
        years = []
        for df in [income_df, balance_df, cashflow_df]:
            if df is not None and not df.empty:
                years = sorted([str(c.year) for c in df.columns], reverse=True)
                break

        # --- Ratios ---
        def pct(v):
            f = _safe_float(v)
            return round(f * 100, 2) if f is not None else None

        ratios = {
            "Valuation": {
                "Market Cap": _safe_float(info.get("marketCap")),
                "Enterprise Value": _safe_float(info.get("enterpriseValue")),
                "P/E (TTM)": _safe_float(info.get("trailingPE")),
                "Forward P/E": _safe_float(info.get("forwardPE")),
                "PEG Ratio": _safe_float(info.get("pegRatio")),
                "EV/EBITDA": _safe_float(info.get("enterpriseToEbitda")),
                "EV/Revenue": _safe_float(info.get("enterpriseToRevenue")),
                "P/B": _safe_float(info.get("priceToBook")),
                "P/S (TTM)": _safe_float(info.get("priceToSalesTrailing12Months")),
            },
            "Profitability": {
                "Gross Margin": pct(info.get("grossMargins")),
                "EBITDA Margin": pct(info.get("ebitdaMargins")),
                "Operating Margin": pct(info.get("operatingMargins")),
                "Net Margin": pct(info.get("profitMargins")),
                "ROE": pct(info.get("returnOnEquity")),
                "ROA": pct(info.get("returnOnAssets")),
            },
            "Leverage": {
                "Total Debt/Equity": _safe_float(info.get("debtToEquity")),
                "Current Ratio": _safe_float(info.get("currentRatio")),
                "Quick Ratio": _safe_float(info.get("quickRatio")),
            },
            "Per Share": {
                "EPS (TTM)": _safe_float(info.get("trailingEps")),
                "Forward EPS": _safe_float(info.get("forwardEps")),
                "Book Value/Share": _safe_float(info.get("bookValue")),
                "Dividend/Share": _safe_float(info.get("dividendRate")),
                "Dividend Yield": pct(info.get("dividendYield")),
                "Payout Ratio": pct(info.get("payoutRatio")),
            },
            "Growth (YoY)": {
                "Revenue Growth": pct(info.get("revenueGrowth")),
                "Earnings Growth": pct(info.get("earningsGrowth")),
                "EPS Growth (TTM)": pct(info.get("earningsQuarterlyGrowth")),
            },
        }

        return {
            "company": company,
            "years": years,
            "income_statement": income_data,
            "balance_sheet": balance_data,
            "cash_flow": cashflow_data,
            "ratios": ratios,
        }
    except Exception as e:
        logger.error(f"Financials error for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- Custom Notifications API ---

@app.get("/api/notifications")
async def api_get_notifications():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM custom_notifications ORDER BY created_at DESC"
        ).fetchall()
    result = []
    for r in rows:
        d = dict(r)
        d["config"] = json.loads(d["config"])
        result.append(d)
    return result


@app.post("/api/notifications")
async def api_create_notification(request: Request):
    body = await request.json()
    name = body.get("name", "").strip()
    ntype = body.get("type", "").strip()
    config = body.get("config", {})
    if not name or not ntype:
        raise HTTPException(400, "name and type required")
    allowed = {"price_alert", "pct_alert", "vol_spike", "rsi_alert", "week52", "digest"}
    if ntype not in allowed:
        raise HTTPException(400, f"Invalid type. Must be one of: {', '.join(allowed)}")
    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO custom_notifications (name, type, config) VALUES (?, ?, ?)",
            (name, ntype, json.dumps(config)),
        )
        notif_id = cursor.lastrowid
    # Schedule digest job immediately if applicable
    if ntype == "digest":
        _schedule_digest_jobs()
    return {"ok": True, "id": notif_id}


@app.patch("/api/notifications/{notif_id}")
async def api_update_notification(notif_id: int, request: Request):
    body = await request.json()
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM custom_notifications WHERE id = ?", (notif_id,)
        ).fetchone()
        if not row:
            raise HTTPException(404, "Notification not found")
        updates = {}
        if "enabled" in body:
            updates["enabled"] = int(bool(body["enabled"]))
        if "name" in body:
            updates["name"] = str(body["name"]).strip()
        if "config" in body:
            updates["config"] = json.dumps(body["config"])
        if not updates:
            return {"ok": True}
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        conn.execute(
            f"UPDATE custom_notifications SET {set_clause} WHERE id = ?",
            (*updates.values(), notif_id),
        )
    if row["type"] == "digest":
        # Remove or re-add digest job based on new enabled state
        job_id = f"custom_digest_{notif_id}"
        try:
            scheduler.remove_job(job_id)
        except Exception:
            pass
        _schedule_digest_jobs()
    return {"ok": True}


@app.delete("/api/notifications/{notif_id}")
async def api_delete_notification(notif_id: int):
    with get_db() as conn:
        row = conn.execute(
            "SELECT type FROM custom_notifications WHERE id = ?", (notif_id,)
        ).fetchone()
        if not row:
            raise HTTPException(404, "Notification not found")
        conn.execute("DELETE FROM custom_notifications WHERE id = ?", (notif_id,))
    if row["type"] == "digest":
        try:
            scheduler.remove_job(f"custom_digest_{notif_id}")
        except Exception:
            pass
    return {"ok": True}


@app.post("/api/notifications/{notif_id}/test")
async def api_test_custom_notification(notif_id: int):
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM custom_notifications WHERE id = ?", (notif_id,)
        ).fetchone()
    if not row:
        raise HTTPException(404, "Notification not found")
    if not get_setting("pushover_user_key") or not get_setting("pushover_api_token"):
        raise HTTPException(400, "Pushover not configured")
    cfg = json.loads(row["config"])
    ntype = row["type"]
    try:
        if ntype == "price_alert":
            _check_price_alert(row["id"], row["name"], cfg)
        elif ntype == "pct_alert":
            _check_pct_alert(row["id"], row["name"], cfg)
        elif ntype == "vol_spike":
            _check_vol_spike(row["id"], row["name"], cfg)
        elif ntype == "rsi_alert":
            _check_rsi_alert(row["id"], row["name"], cfg)
        elif ntype == "week52":
            _check_week52(row["id"], row["name"], cfg)
        elif ntype == "digest":
            msg = build_custom_digest(cfg)
            if not msg:
                msg = f"📋 <b>{cfg.get('title', row['name'])}</b>\nNo stocks configured."
            send_pushover(msg, f"📋 {cfg.get('title', row['name'])}")
        return {"ok": True}
    except Exception as e:
        raise HTTPException(500, str(e))
