/* eslint-disable prettier/prettier */
import { Body, Controller, HttpException, Post, Res, UseGuards } from '@nestjs/common';
import { BuyService } from './buy.service';
import { buyProductDto } from 'src/models/dto/buy.dto';
import { Response } from 'express';
import { ApiResponse } from 'util/responseApi';
import { RoleGuard } from 'src/user/auth/role.guard';
import { Roles } from 'src/models/interfaces/role';

@Controller('buy')
export class BuyController {
    constructor(private readonly _buyService: BuyService){}

    @Post('')
    @UseGuards(new RoleGuard([Roles.BUYER]))
    async buyProduct(@Body() payload: buyProductDto[], @Res() response: Response){
        const _apiResponse = new ApiResponse()
        return await this._buyService.buyProduct(payload).then((res)=>{
            _apiResponse.data = res
            _apiResponse.responseCode = '200'
            _apiResponse.responseDescription = "Purchase successfully made"

            return response.send(_apiResponse)
        },
        (error)=>{
            _apiResponse.data = error.message
            _apiResponse.responseCode = error.status
            _apiResponse.responseDescription = error.error

            throw new HttpException(_apiResponse, error.status)
        })
    }
}
