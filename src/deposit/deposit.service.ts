/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { depositDto } from 'src/models/dto/deposit.dto';
import { CentsAllowed, DepositEntity } from 'src/models/entities/deposit.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class DepositService {
    constructor(@InjectRepository(DepositEntity) private readonly _depositoRepo: Repository<DepositEntity>,
    public readonly _userService: UserService
    ){}


    async deposit(payload: depositDto){
        try {
            const {buyerId, amount} = payload
            const currentBalance = await this._depositoRepo.findOne({where: {buyer: {user_id: buyerId}}})
            if (!Object.values(CentsAllowed).includes(Number(amount))) {
                throw new Error('Invalid deposit amount. Amount should be in [5, 10, 20, 50, 100]');
              }
     
            const newDeposit = new DepositEntity()
            const foundUser = await this._userService.findByUSerId(buyerId)
            
            if(!currentBalance){
                newDeposit.amount = amount;
                newDeposit.buyer = foundUser
    
                await this._depositoRepo.save(newDeposit) 
            }else{
                currentBalance.amount = currentBalance.amount + Number(amount)
                await this._depositoRepo.save(currentBalance)
            }
            return
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async debitAccount(payload: any){
        try {
            const currentBalance = await this._depositoRepo.findOne({where: {buyer: {user_id: payload?.buyerId}}})
            if(currentBalance.amount >= Number(payload?.amount)){
                const newBalance = currentBalance.amount - Number(payload?.amount);
                currentBalance.amount = newBalance
                await this._depositoRepo.save(currentBalance)
            }else{
                throw new Error("User balance is lower than amount")
            }
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async getBalance(buyerId): Promise<number>{
        try {
            const foundUser = await this._depositoRepo.findOne({where:{buyer: {user_id: buyerId}}})
            if(foundUser){
                return foundUser.amount
            }
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}
