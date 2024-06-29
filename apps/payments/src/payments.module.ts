import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ClientsModule.register([
      {
        name: 'PAYMENTS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payments',
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
