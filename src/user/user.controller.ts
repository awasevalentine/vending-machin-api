/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from 'src/models/dto/user.dto';
import { Response } from 'express';
import { ApiResponse } from 'util/responseApi';
import { Public } from './auth/decorators/public.decorator';
import { AuthService } from './auth/auth.service';

@Controller('user')
export class UserController {
    constructor(private readonly _userService: UserService,
        private readonly _authService: AuthService
        ){}

    @Public()
    @Post('create-user')
    async createUser(@Body() payload: createUserDto, @Res() response: Response): Promise<any>{
        const _apiResponse = new ApiResponse();
        return await this._userService.createUser(payload).then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="User successfully Created"
              return response.send(_apiResponse);
          },
          (err)=> {
              _apiResponse.data = err.message;
              _apiResponse.responseCode = err.status;
              _apiResponse.responseDescription = err.error
              throw new HttpException(_apiResponse, err.status)
          }
      )
    }

    @Public()
    @Get('get-users')
    async getAllUsers(@Res() response: Response): Promise<any>{
        const _apiResponse = new ApiResponse();
        return await this._userService.getAllUsers().then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="Success!"
              return response.send(_apiResponse);
          },
          (err)=> {
              _apiResponse.data = err.message;
              _apiResponse.responseCode = err.status;
              _apiResponse.responseDescription = err.error
              throw new HttpException(_apiResponse, err.status)
          }
      )
    }


    @Public()
    @Get('get-user/:userId')
    async getAllUser(@Param('userId') userId: string, @Res() response: Response): Promise<any>{
        const _apiResponse = new ApiResponse();
        return await this._userService.findByUSerId(userId).then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="Success!"
              return response.send(_apiResponse);
          },
          (err)=> {
              _apiResponse.data = err.message;
              _apiResponse.responseCode = err.status;
              _apiResponse.responseDescription = err.error
              throw new HttpException(_apiResponse, err.status)
          }
      )
    }

    @Public()
    @Put('update-user/:userId')
    async updateUser(@Param('userId') userId: string, @Body() payload: any, @Res() response: Response): Promise<any>{
        const _apiResponse = new ApiResponse();
        return await this._userService.updateUser(userId, payload).then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="User successfully updated"
              return response.send(_apiResponse);
          },
          (err)=> {
              _apiResponse.data = err.message;
              _apiResponse.responseCode = err.status;
              _apiResponse.responseDescription = err.error
              throw new HttpException(_apiResponse, err.status)
          }
      )
    }

    @Public()
    @Delete('delete-user/:userId')
    async deleteUser(@Param('userId') userId: string, @Res() response: Response){
        const _apiResponse = new ApiResponse();
        return await this._userService.deleteUser(userId).then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="User successfully deleted"
              return response.send(_apiResponse);
          },
          (err)=> {
              _apiResponse.data = err.message;
              _apiResponse.responseCode = err.status;
              _apiResponse.responseDescription = err.error
              throw new HttpException(_apiResponse, err.status)
          }
      )
    }

    @Public()
    @Get('/reset-buyer-balance/:buyerId')
    async resetBuyerBalance(@Param('buyerId') buyerId: string, @Res() response: Response){
      const _apiResponse = new ApiResponse()
      return await this._userService.resetBuyerAccountBalance(buyerId).then((res)=>{
        _apiResponse.data = 'Successfully'
        _apiResponse.responseCode = '200'
        _apiResponse.responseDescription = 'Buyer account resetted successfully'

        return response.send(_apiResponse)
      },(error)=>{
        _apiResponse.data = error.message
        _apiResponse.responseCode = error.status
        _apiResponse.responseDescription = error.description
        throw new HttpException(_apiResponse, error.status)
      })  
    }


    @Public()
    @Get('/user-login-status/:username')
    async getUserLoggedInState(@Param('username') username: string, @Res() response: Response){
        const _apiResponse = new ApiResponse()
        return await this._userService.getUserLoggedInStatus(username).then((res)=>{
            _apiResponse.data = res
            _apiResponse.responseCode = '200'
            _apiResponse.responseDescription = 'Success'
    
            return response.send(_apiResponse)
          },(error)=>{
            _apiResponse.data = error.message
            _apiResponse.responseCode = error.status
            _apiResponse.responseDescription = error.description
            throw new HttpException(_apiResponse, error.status)
          })
    }

    @Public()
    @Post('/update-user-login-false/:username')
    async updateUserLoggedInStateToFalse(@Param('username') username: string, @Res() response: Response){
        const _apiResponse = new ApiResponse()
        return await this._userService.updateLoggedInStatusToFalse(username).then((res)=>{
            _apiResponse.data = res
            _apiResponse.responseCode = '200'
            _apiResponse.responseDescription = 'Success'
    
            return response.send(_apiResponse)
          },(error)=>{
            _apiResponse.data = error.message
            _apiResponse.responseCode = error.status
            _apiResponse.responseDescription = error.description
            throw new HttpException(_apiResponse, error.status)
          })
    }


    @Public()
    @Post('/login')
    async login(@Body() payload: any, @Res() response): Promise<any>{
      const _apiResponse = new ApiResponse();
      return await this._authService.signIn(payload.username, payload.password).then(
        (data)=> {
            this._userService.updateLoggedInStatus(payload?.username)
            _apiResponse.data = data;
            _apiResponse.responseCode = "200";
            _apiResponse.responseDescription ="User successfully Loggedin"
            return response.send(_apiResponse);
        },
        (err)=> {
            _apiResponse.data = err.message;
            _apiResponse.responseCode = err.status;
            _apiResponse.responseDescription = err.error
            throw new HttpException(_apiResponse, err.status)
        }
    )
    }

}
