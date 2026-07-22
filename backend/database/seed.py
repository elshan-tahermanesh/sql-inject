import sqlite3
from pathlib import Path

database_folder = Path(__file__).parent
database_file = database_folder / "app.db"
schema_file = database_folder / "schema.sql"

def create_database():
    with sqlite3.connect(database_file) as connection:
        schema = schema_file.read_text()
        connection.executescript(schema)

        users = [
            ('admin', 'admin', 'admin'),
            ('elshan', 'elshan', 'admin'),
            ('ash', 'ash', 'admin'),
            ('pauline', 'pauline', 'user'),
            ('surbhi', 'surbhi', 'user'),
            ('muska', 'muska', 'admin'),
            ('pratham', 'pratham', 'admin'),
            ('matthias', 'matthias', 'user'), ]

        connection.executemany(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            users, )

        connection.commit()

    print("Database created successfully")

if __name__ == "__main__":
    create_database()