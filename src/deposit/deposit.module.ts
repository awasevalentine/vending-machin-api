/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositEntity } from 'src/models/entities/deposit.entity';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/models/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepositEntity, UserEntity])
  ],
  providers: [DepositService, UserService],
  controllers: [DepositController]
})
export class DepositModule {}
