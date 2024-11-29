IF NOT EXISTS (
    SELECT name
    FROM sys.databases
    WHERE name = 'quiz_backend'
)
BEGIN
    CREATE DATABASE quiz_backend;
END


USE quiz_backend;


IF NOT EXISTS (
    SELECT schema_name
    FROM information_schema.schemata
    WHERE schema_name = 'user_management'
)
BEGIN
    EXEC('CREATE SCHEMA user_management');
END
