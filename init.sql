-- CREATE PUBLICATION debezium_pub FOR ALL TABLES;
-- CREATE TABLE my_table (
--     id SERIAL PRIMARY KEY,
--     name TEXT,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication
        WHERE pubname = 'debezium_pub'
    ) THEN
        CREATE PUBLICATION debezium_pub FOR ALL TABLES;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'my_table'
    ) THEN
        CREATE TABLE my_table (
            id SERIAL PRIMARY KEY,
            name TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END $$;

