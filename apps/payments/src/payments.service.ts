import { PaymentStatus } from '.prisma/client/payments';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PaymentDto } from './payment.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('PAYMENTS_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  getAll() {
    return this.prismaService.payment.findMany();
  }

  async payment(data: PaymentDto) {
    const payment = await this.prismaService.payment.create({
      data: {
        ...data,
        status: PaymentStatus.APPROVED,
      },
    });

    await lastValueFrom(this.kafkaClient.emit('payments', payment));

    return payment;
  }
}
