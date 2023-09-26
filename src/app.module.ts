import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { Order } from './model/order.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: (process.env.DB_PORT && parseInt(process.env.DB_PORT)) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'postgres',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [AppController, OrderController],
  providers: [AppService, OrderService],
})
export class AppModule {}
