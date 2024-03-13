/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositEntity } from 'src/models/entities/deposit.entity';
import { ProductEntity } from 'src/models/entities/product.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from './auth/auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ProductEntity, DepositEntity])
    ],
    controllers: [UserController],

    providers: [UserService, AuthService],

    exports: [UserService]
})
export class UserModule {}
