import sqlite3
from datetime import datetime

DB_PATH = "../data/sessions.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS interactions
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  timestamp TEXT,
                  query TEXT,
                  response TEXT)''')
    conn.commit()
    conn.close()

def log_interaction(query: str, response: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO interactions (timestamp, query, response) VALUES (?, ?, ?)",
              (datetime.now().isoformat(), query, response))
    conn.commit()
    conn.close()

def log_error(message: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS errors (timestamp TEXT, message TEXT)")
    c.execute("INSERT INTO errors VALUES (?, ?)", 
              (datetime.now().isoformat(), message))
    conn.commit()
    conn.close()

init_db()