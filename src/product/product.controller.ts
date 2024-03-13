/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { newProductDto } from 'src/models/dto/product.dto';
import { Response } from 'express';
import { ApiResponse } from 'util/responseApi';
import { RoleGuard } from 'src/user/auth/role.guard';
import { Roles } from 'src/models/interfaces/role';
import { Public } from 'src/user/auth/decorators/public.decorator';

@Controller('product')
export class ProductController {
    constructor(private readonly _productService: ProductService){}

    @Post('create-product')
    @UseGuards(new RoleGuard([Roles.SELLER]))
    async createProduct(@Body() payload: newProductDto, @Res() response: Response){
        const _apiResponse = new ApiResponse();
        return await this._productService.createProduct(payload).then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="Product successfully Created"
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
    @Get('get-products')
    async getProducts(@Res() response: Response){
        const _apiResponse = new ApiResponse();
        return await this._productService.getProducts().then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="success"
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
    @Get('get-product/:productId')
    async getProduct(@Param('productId') productId: string, @Res() response: Response){
        const _apiResponse = new ApiResponse();
        return await this._productService.getProduct(productId).then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="success"
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
    // @Public()
    @UseGuards(new RoleGuard([Roles.SELLER]))
    @Get('get-product-by-seller/:sellerId')
    async getProductBySeller(@Param('sellerId') sellerId: string, @Res() response: Response){
        const _apiResponse = new ApiResponse();
        return await this._productService.getProductBySeller(sellerId).then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="success"
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

    @Put('update-product/:productId')
    @UseGuards(new RoleGuard([Roles.SELLER]))
    async updateProduct(@Param('productId') productId: string, @Body() payload: any,
     @Res() response: Response){
        const _apiResponse = new ApiResponse();
        return await this._productService.updateProduct(productId, payload).then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="success"
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
    @Delete('delete-product/:productId')
    @UseGuards(new RoleGuard([Roles.SELLER]))
    async deleteProduct(@Param('productId') productId: string, @Res() response: Response){
        const _apiResponse = new ApiResponse();
        return await this._productService.deleteProduct(productId).then(
          (data)=> {
              _apiResponse.data = data;
              _apiResponse.responseCode = "200";
              _apiResponse.responseDescription ="success"
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
