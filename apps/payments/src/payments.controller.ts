import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getAll() {
    return this.paymentsService.getAll();
  }

  @MessagePattern('orders')
  async payment(@Payload() message) {
    const { id, price, clientId } = message;

    await this.paymentsService.payment({
      orderId: id,
      amount: price,
      clientId,
    });
  }
}
