import { OrderStatus } from '.prisma/client/orders';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { OrderDto } from './order.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('ORDERS_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  getAll() {
    return this.prismaService.order.findMany();
  }

  async create(data: OrderDto) {
    const order = await this.prismaService.order.create({
      data: {
        ...data,
        status: OrderStatus.PENDING,
      },
    });

    await lastValueFrom(this.kafkaClient.emit('orders', order));

    return order;
  }
}
