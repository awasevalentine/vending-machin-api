/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BuyService } from './buy.service';
import { BuyController } from './buy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositEntity } from 'src/models/entities/deposit.entity';
import { ProductEntity } from 'src/models/entities/product.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { DepositService } from 'src/deposit/deposit.service';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepositEntity, ProductEntity, UserEntity])
  ],
  providers: [BuyService, DepositService, ProductService, UserService],
  controllers: [BuyController]
})
export class BuyModule {}
