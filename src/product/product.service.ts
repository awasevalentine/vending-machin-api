/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { newProductDto } from 'src/models/dto/product.dto';
import { ProductEntity } from 'src/models/entities/product.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity) public readonly _productRepo: Repository<ProductEntity>,
        private readonly _userService: UserService
        ){}

    async createProduct(payload: newProductDto): Promise<any>{
        const {sellerId, ...rest} = payload
        try {
            const foundUser = await this._userService.findByUSerId(sellerId)
            const newProductEntity = new ProductEntity();
            newProductEntity.amountAvailable = rest.amountAvailable
            newProductEntity.productName = rest.productName
            newProductEntity.cost = rest.cost
            newProductEntity.sellerId = foundUser

            await this._productRepo.save(newProductEntity)
            return true
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }


    async getProducts(): Promise<ProductEntity[]>{
        try {
            return await this._productRepo.find()
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }


    async getProduct(productId: string): Promise<ProductEntity>{
        try {
            const foundProduct = await this._productRepo.findOne({where:{product_id: productId}})
            if(!foundProduct){
                throw new HttpException(`Product with ${productId} not found`, HttpStatus.NOT_FOUND)
            }

            return foundProduct
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async getProductBySeller(sellerId: string): Promise<ProductEntity[]>{

        try {
            const foundProduct = await this._productRepo.find({where:{sellerId: {user_id: sellerId}}})
            if(!foundProduct){
                throw new HttpException(`User with ${sellerId} not found`, HttpStatus.NOT_FOUND)
            }
            return foundProduct
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async getProductByIdAndUserId(productId: string, sellerId: string): Promise<ProductEntity>{
        try {
            const foundProduct = await this._productRepo.findOne({where:{product_id: productId, sellerId:{
                user_id: sellerId
            }}, relations: ['sellerId']})
            if(!foundProduct){
                throw new HttpException(`Product with ${productId} not found for the specified seller`, HttpStatus.NOT_FOUND)
            }

            return foundProduct
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async updateProductQauntity(productId: string, quantity: number){
        try {
            const foundProduct = await this.getProduct(productId)
            if(foundProduct && foundProduct.amountAvailable >= quantity){
                const newQauntity = foundProduct.amountAvailable - quantity
                foundProduct.amountAvailable = newQauntity
                await this._productRepo.save(foundProduct)
            }else{
                throw new Error("Quantity is less than available product quantity")
            }
            
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
        
    }


    async updateProduct(productId: string, payload: any): Promise<ProductEntity>{
        const {sellerId, ...rest} = payload
        try {
            const foundProduct = await this.getProductByIdAndUserId(productId, sellerId)

            for(const key in rest){
                if(rest.hasOwnProperty(key)){
                    foundProduct[key] = rest[key]
                }
            }
            return await this._productRepo.save(foundProduct)
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async deleteProduct(productId){
        try {
            const foundProduct = await this._productRepo.findOne({where:{product_id: productId}})
            if(!foundProduct) throw new HttpException('Product with provided ID not found', HttpStatus.NOT_FOUND)

            return await this._productRepo.remove(foundProduct)
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}
