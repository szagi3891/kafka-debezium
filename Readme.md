Uruchomienie GUI
---
docker run -it -p 8080:8080 -e DYNAMIC_CONFIG_ENABLED=true provectuslabs/kafka-ui

docker run -p 8080:8080 -e KAFKA_BROKERS=127.0.0.1:9092 docker.redpanda.com/redpandadata/console:latest

