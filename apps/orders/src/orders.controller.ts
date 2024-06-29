import { OrderStatus } from '.prisma/client/orders';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDto } from './order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAll() {
    return this.ordersService.getAll();
  }

  @Post()
  create(@Body() data: OrderDto) {
    return this.ordersService.create(data);
  }

  @MessagePattern('payments')
  async complete(@Payload() message) {
    const { orderId, status } = message;

    const orderStatus =
      status === 'APPROVED' ? OrderStatus.PAYED : OrderStatus.CANCELLED;

    await this.ordersService.complete(orderId, orderStatus);
  }
}
