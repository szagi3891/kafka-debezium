import { Kafka } from 'npm:kafkajs';

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'], // Adresy brokerów Kafka
});

const consumer = kafka.consumer({ groupId: 'test-group2' });

await consumer.connect();
await consumer.subscribe({
    topic: 'your-topic',
    fromBeginning: true
});

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {

    console.log({
      topic,
      partition,
      offset: message.offset,
      value: message.value?.toString(),
    });
  },
});

