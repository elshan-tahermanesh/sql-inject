DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
);

INSERT INTO users (username, password, role) VALUES
('admin', 'admin', 'admin'),
('elshan', 'elshan', 'admin'),
('ash', 'ash', 'admin'),
('pauline', 'pauline', 'user'),
('surbhi', 'surbhi', 'user'),
('muska', 'muska', 'admin'),
('pratham', 'pratham', 'admin'),
('matthias', 'matthias', 'user');