import pg from 'npm:pg';
import { timeout } from '@reactive/utils';

const pgUser = 'debezium_user';
const pgPass = 'my_password';
const pgDb   = 'my_database';

// const pgUser = 'postgres';
// const pgPass = '123';
// const pgDb   = 'cdc-using-debezium';


const client = new pg.Client({
    host: '127.0.0.1',
    user: pgUser,
    password: pgPass,
    port: 5432,
    database: pgDb, 
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

    const created2 = await client.query(`
        ALTER TABLE "my_table"
        REPLICA IDENTITY FULL;
    `);
    console.info('utworzono tabelę2', created2.rows);

}

await createTable();

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
            "database.user": pgUser,
            "database.password": pgPass,
            "database.dbname": pgDb,
            "database.server.id": "184054",
            "table.include.list": "public.my_table",
            "topic.prefix": "cdc-using-debezium-topic",

            "after.state.only": "false",
            "plugin.name": "pgoutput",
            "key.converter.schemas.enable": "false",
            "value.converter.schemas.enable": "false",
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

try {
    await createConnector();
} catch (err) {
    console.error(err);
}

await timeout(5_000);

// const check = async () => {

//     const url = 'http://localhost:8083/connector-plugins/postgresql/config/validate';

//     const headers = {
//         'Accept': 'application/json',
//         "Content-Type": "application/json",
//     };

//     const response = await fetch(url);

//     console.info('status', response.status);
//     const text = await response.text();
//     console.info('text', text);
// }

// await check();


const insert = async () => {

    const created2 = await client.query(`
        INSERT INTO my_table(name) values(
            'bar'
        );
    `);
    
    console.info('inserted', created2.rowCount);

    const updata = await client.query(`
        UPDATE my_table
        SET name = 'kopytko'
        WHERE id = 1;
    `);

    console.info('update', updata.rowCount);

    await timeout(1000);

    const updata2 = await client.query(`
        UPDATE my_table
        SET name = 'kopytko słonia'
        WHERE id = 1;
    `);

    console.info('update', updata2.rowCount);
}

await insert();


// const aaaa = await client.query(`CREATE PUBLICATION debezium_pub FOR ALL TABLES`);
//jeśli nie istnieje replikacja, to stwórz replikację
// jeśli nie istnieje odpowiednia tabela, to ją stwórz
//odpal konfigurację debezium

