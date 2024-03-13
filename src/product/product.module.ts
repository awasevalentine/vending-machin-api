/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/models/entities/product.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DepositEntity } from 'src/models/entities/deposit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity, DepositEntity])
  ],
  providers: [ProductService, UserService],
  controllers: [ProductController]
})
export class ProductModule {}
