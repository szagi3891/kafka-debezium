import pg from 'npm:pg';

const client = new pg.Client({
    host: '127.0.0.1',
    user: 'debezium_user',
    password: 'my_password',
    port: 5432,
    database: 'my_database',  
});

await client.connect()
 
// const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema = 'public';`);

// console.info('res', JSON.stringify(res.rows, null, 4));

// // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
// // console.log(res.rows[0].message)


// const createPgPublication = async () => {
//     const exist = await client.query(`SELECT * FROM pg_publication WHERE pubname = 'debezium_pub'`);

//     console.info(JSON.stringify(exist.rows, null, 4));

//     if (exist.rows.length > 0) {
//         return;
//     }

//     const created = await client.query(`CREATE PUBLICATION debezium_pub FOR ALL TABLES`);
//     console.info('utworzono replikację', created.rows);
// };

// await createPgPublication();

const createTable = async () => {
    const exist = await client.query(`
        SELECT *
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'my_table'
    `);

    console.info('sprawdzam tabelę czy istnieje', JSON.stringify(exist.rows, null, 4));

    if (exist.rows.length > 0) {
        return;
    }

    const created = await client.query(`
        CREATE TABLE my_table (
            id SERIAL PRIMARY KEY,
            name TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
    console.info('utworzono tabelę', created.rows);
}

await createTable();

// const getList = async () => {
//     const resp = await fetch('http://localhost:8083/connector-plugins');
//     console.info('code', resp.status);
//     const text = await resp.text();
//     console.info('getList', text);
// };

// await getList();

// console.info('\n\n\n');

const createConnector = async () => {
    const url = "http://localhost:8083/connectors";

    //io.debezium.connector.postgresql.PostgresConnector

    const payload = {
        name: "debezium-connector-postgres",
        config: {
            /*
            "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
            "database.hostname": "localhost",
            "database.port": "5432",
            "database.user": "debezium_user",
            "database.password": "my_password",
            "database.dbname": "my_database",
            "database.server.name": "dbserver1",
            "plugin.name": "pgoutput",
            "publication.name": "debezium_pub",
            "slot.name": "debezium_slot",
            "table.include.list": "public.my_table",
            transforms: "unwrap",
            "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
            "transforms.unwrap.delete.handling.mode": "rewrite",
            "heartbeat.interval.ms": "1000",
            */

            "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
            "database.hostname": "postgres",
            "database.port": "5432",
            "database.user": "debezium_user",
            "database.password": "my_password",
            "database.dbname": "my_database",
            "database.server.id": "184054",
            "table.include.list": "public.my_table",
            "topic.prefix": "cdc-using-debezium-topic"
        },
    };

    const headers = {
        'Accept': 'application/json',
        "Content-Type": "application/json",
    };

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        console.error("Failed to create connector:", response.status, await response.text());
        return;
    }

    console.log("Connector created successfully:", await response.json());
};

await createConnector();



// const aaaa = await client.query(`CREATE PUBLICATION debezium_pub FOR ALL TABLES`);
//jeśli nie istnieje replikacja, to stwórz replikację
// jeśli nie istnieje odpowiednia tabela, to ją stwórz
//odpal konfigurację debezium

