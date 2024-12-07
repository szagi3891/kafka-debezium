#!/bin/bash
curl -X POST -H "Content-Type: application/json" --data '{
  "name": "debezium-connector-postgres",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "debezium_user",
    "database.password": "my_password",
    "database.dbname": "my_database",
    "database.server.name": "dbserver1",
    "plugin.name": "pgoutput",
    "publication.name": "debezium_pub",
    "slot.name": "debezium_slot",
    "table.include.list": "public.my_table",
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.delete.handling.mode": "rewrite",
    "heartbeat.interval.ms": "1000"
  }
}' http://localhost:8083/connectors

