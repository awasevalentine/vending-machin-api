/* eslint-disable prettier/prettier */
import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
  constructor(private readonly _userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
      const user = await this._userService.findByUserName(username);

      if(!user){
        throw new NotFoundException()
      }else{
        const passwordMatch = await bcrypt.compare(pass, user.password);
  
        if (!passwordMatch) {
          throw new UnauthorizedException();
        }
        const payload = {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
            };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
  }
}
