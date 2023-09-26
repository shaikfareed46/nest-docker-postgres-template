import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../model/order.model';
import { OrderDto } from '../dto/order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  private orders: Order[] = [];

  // Simulated database (you should replace this with a real database)
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(orderData: OrderDto): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
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
