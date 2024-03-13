/* eslint-disable prettier/prettier */
import { Body, Controller, HttpException, Post, Res } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { depositDto } from 'src/models/dto/deposit.dto';
import { Response } from 'express';
import { ApiResponse } from 'util/responseApi';
import { Public } from 'src/user/auth/decorators/public.decorator';

@Controller('deposit')
export class DepositController {
    constructor(private readonly _depositService: DepositService){}

    @Public()
    @Post('')
    async makeDeposit(@Body() payload: depositDto, @Res() response: Response){
        const _apiResponse = new ApiResponse()
        return this._depositService.deposit(payload).then((res)=>{
            _apiResponse.data = res
            _apiResponse.responseCode = '200',
            _apiResponse.responseDescription = 'Deposit successful'
            response.send(_apiResponse)
        }, 
        (error)=>{
            _apiResponse.data = error.message
            _apiResponse.responseCode = error.status,
            _apiResponse.responseDescription = error.error

            throw new HttpException(_apiResponse, error.status)
        }
        )

    }
    
}
 