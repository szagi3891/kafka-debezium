
Szybko działający zestaw kontenerów (pełna konfiguracja)
https://docs.confluent.io/platform/current/get-started/platform-quickstart.html


kafka magic, konfiguracja startowa
https://www.kafkamagic.com/start/




sprawdzanie czy port jest otwarty:
nc -zv 192.168.1.1 80

wejście na kontener:
docker exec -it e884911f6a09 sh 

rozwiązanie hosta
ping kafka
lub
nslookup kafka



repllikacja z postgresa poprzez debezium do kafkowego tematu moze być całkowicie asynchroniczna (wiadomości mogą mieć pomieszaną kolejność)
wazne zeby rekordy miały updatedAt.
jeśli rekordy się pomieszają, to najwyzej ten starszy zostanie odrzucony po stronie widoku

