import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../model/order.model';
import { OrderDto } from '../dto/order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class OrderService {
  private orders: Order[] = [];

  // Simulated database (you should replace this with a real database)
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly kafkaService: KafkaService,
  ) {}

  async createOrder(orderData: OrderDto): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    const createdOrder = await this.orderRepository.save(order);

    // Send a Kafka event when an order is created
    const orderEvent = {
      eventType: 'OrderCreated',
      order: createdOrder,

      // Add other relevant data
    };

    await this.kafkaService.send('order-events', JSON.stringify(orderEvent));

    return createdOrder;
  }

  async getAllOrders(): Promise<Order[]> {
    await this.kafkaService.consume('order-events');
    return await this.orderRepository.find();
  }

  async findOrderById(orderId: string): Promise<Order | undefined> {
    try {
      const order = await this.orderRepository.findOneBy({ id: orderId });
      return order;
    } catch (error) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  }
}
