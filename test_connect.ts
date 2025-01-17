import { Kafka } from 'npm:kafkajs';

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['127.0.0.1:9092'], // Adresy brokerów Kafka
});

const consumer = kafka.consumer({ groupId: 'test-group' });

await consumer.connect();
console.info('connected ...');

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

