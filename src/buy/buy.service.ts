/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositService } from 'src/deposit/deposit.service';
import { buyProductDto } from 'src/models/dto/buy.dto';
import { DepositEntity } from 'src/models/entities/deposit.entity';
import { ProductEntity } from 'src/models/entities/product.entity';
import { BuyProductResponse } from 'src/models/interfaces/buy.response';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';

@Injectable()
export class BuyService {
    constructor(
        @InjectRepository(ProductEntity) private _productRepo: Repository<ProductEntity>,
        @InjectRepository(DepositEntity) private _depositRepo: Repository<DepositEntity>,
        private readonly _productService: ProductService, private readonly _depositService: DepositService
    ){}

    async buyProduct(payload: buyProductDto[]): Promise<BuyProductResponse[]> {
        const productsBought = []
        try {
            for (const item of payload) {
                const getProduct = await this._productService.getProduct(item.productId);
                const getBuyerBalance = await this._depositService.getBalance(item.buyerId);
                
                if (getProduct && getBuyerBalance >= item.totalAmount && getProduct.amountAvailable >= item.quantity) {
                    const debitPayload = {
                        buyerId: item.buyerId,
                        amount: item.totalAmount
                    };
    
                    await this._depositService.debitAccount(debitPayload);
                    await this._productService.updateProductQauntity(item.productId, item.quantity);
                    const purchase = {
                        productName: getProduct.productName,
                        quantity: item?.quantity,
                        productCost: getProduct.cost,
                        totalCost: item?.totalAmount
                    }
                    productsBought.push(purchase)
                }else{
                    throw new Error('Quantity more than available product')
                }
            }
            return productsBought
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    
}
