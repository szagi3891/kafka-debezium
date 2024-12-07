import { Kafka } from 'npm:kafkajs';

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092'], // Adresy brokerów Kafka
});

const producer = kafka.producer();

const run = async () => {
  // Połącz się z brokerem
  await producer.connect();

  // Wyślij wiadomość na topic
  await producer.send({
    topic: 'your-topic', // Nazwa topicu
    messages: [
      { value: 'Hello Kafka!' }, // Treść wiadomości
      { key: 'my-key', value: 'Message with key' }, // Wiadomość z kluczem (opcjonalnie)
    ],
  });

  console.log('Message sent!');
};

await run();

