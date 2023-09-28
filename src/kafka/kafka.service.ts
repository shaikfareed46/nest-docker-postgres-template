// kafka.service.ts

import { Injectable } from '@nestjs/common';
import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'my-nestjs-app',
      brokers: ['kafka:9092'], // Replace with your Kafka broker address
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
  }

  async send(topic: string, message: string): Promise<void> {
    try {
      console.log('sending---------------');
      await this.producer.connect();
      await this.producer.send({
        topic,
        messages: [{ value: message }],
      });
      await this.producer.disconnect();
    } catch (error) {
      console.error('Kafka send error:', error);
    } finally {
      await this.producer.disconnect();
    }
  }

  async consume(topic: string): Promise<void> {
    try {
      console.log('consuming---------------');

      const consumer: Consumer = this.kafka.consumer({ groupId: 'my-group' });
      console.log('consuming---------------consumer', consumer);

      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ message }) => {
          // Handle the consumed message here
          console.log(`Received message: ${message.value.toString()}`);
        },
      });
    } catch (error) {
      console.error('Kafka consume error:', error);
    }
  }
}
