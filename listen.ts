import postgres from 'postgres';


const connection = 'postgres://debezium_user:my_password@127.0.0.1:5432/my_database';

/*
POSTGRES_USER: debezium_user
POSTGRES_PASSWORD: my_password
POSTGRES_DB: my_database
*/

//CREATE PUBLICATION alltables FOR ALL TABLES

const sql = postgres(connection, {
    publications: 'alltables'
});

console.info('zaczynam nasłuchiwać ...');

const { unsubscribe } = await sql.subscribe(
    '*',
    (row, aaaa /*{ command, relation, key, old }*/) => {

        console.info('event', JSON.stringify({
            row,
            aaaa
        }, null, 4));

        // Callback function for each row change
        // tell about new event row over eg. websockets or do something else
    },
    () => {
        // Callback on initial connect and potential reconnects
    }
);

//   'insert:events',


/*
CREATE TABLE IF NOT EXISTS foo (
  id SERIAL PRIMARY KEY,
  col1 VARCHAR,
  col2 INT
);

 -- ta opcja jest potrzebna, żeby poprzednia wartość rekordu była wysyłana
ALTER TABLE "foo" REPLICA IDENTITY FULL;



 -- sprawdzenie czy publikacja istnieje
SELECT pubname FROM pg_publication WHERE pubname = 'alltables';

 -- utworzenie publikacji
CREATE PUBLICATION alltables FOR ALL TABLES



 -- jakieś normalne operacje na danych w tabeli
INSERT INTO foo (col1, col2) VALUES ('Przykładowa wartość', 234);
*/
