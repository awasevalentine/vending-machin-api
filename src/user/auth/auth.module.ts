/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserModule } from '../user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';


@Module({
    
    imports: [UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [],
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService]
})
export class AuthModule {}
