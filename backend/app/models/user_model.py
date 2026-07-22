from app.models.db import get_db_connection
def check_login(username, password):
    connection = get_db_connection()
    user = connection.execute(
        """
        SELECT id, username, role
        FROM users
        WHERE username = ? AND password = ?
        """,
        (username, password),
    ).fetchone()

    connection.close()
    return user