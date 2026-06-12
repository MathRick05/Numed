SELECT 'CREATE DATABASE numed_health'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'numed_health'
)\gexec

SELECT 'CREATE DATABASE numed_reminders'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'numed_reminders'
)\gexec

SELECT 'CREATE DATABASE numed_user_auth'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'numed_user_auth'
)\gexec
