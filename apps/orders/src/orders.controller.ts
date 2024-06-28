import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
