import sqlite3
from pathlib import Path
backend_folder = Path(__file__).resolve().parents[2]
database_file = backend_folder / "database" / "app.db"

def get_db_connection():
    connection = sqlite3.connect(database_file)
    connection.row_factory = sqlite3.Row
    return connection
