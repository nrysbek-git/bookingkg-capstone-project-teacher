CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL,
  email text UNIQUE NOT NULL,
  joined timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  hash varchar(100) NOT NULL
);

-- Остальные таблицы создаются идемпотентной миграцией backend при запуске.
-- Такой подход одинаково работает в Docker Compose и Amazon EKS.
