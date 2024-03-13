/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createUserDto, updateUserDto } from 'src/models/dto/user.dto';
import { UserEntity } from 'src/models/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DepositEntity } from 'src/models/entities/deposit.entity';



@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) public readonly _userRepo: Repository<UserEntity>,
        @InjectRepository(DepositEntity) public readonly _depositRepo: Repository<DepositEntity>
    ){}

    
    async createUser(payload: createUserDto){
        try {
            const newUser =new UserEntity()
            newUser.username = payload.username;
            newUser.password = await bcrypt.hash(payload.password, 10);
            newUser.role = payload.role
            const savedUser = await this._userRepo.save(newUser)
            const {password, ...rest} = savedUser
            return rest
        } catch (error) {
            if (error.code === '23505') {
                throw new HttpException(
                  'A user with the same username already exists',
                  HttpStatus.CONFLICT,
                );
        }
    }
}

    async getAllUsers(): Promise<UserEntity[]>{
        try {
            return await this._userRepo.find()
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async getUser(userId: string, role: string): Promise<UserEntity>{
        switch(role){
            case 'SELLER':
                await this.findBySellerRole(userId);
                break;
            case 'BUYER':
                await this.findByBuyerRole(userId)
                break;
            default: 
                return null
        }
    }

    async findBySellerRole(userId: string): Promise<UserEntity>{
        try {
            const foundUser = await this._userRepo.findOne({where: {user_id: userId},
            relations: ['product']
            })

            if(!foundUser) throw new HttpException('User with provided ID not found', HttpStatus.NOT_FOUND)

            return foundUser
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
    async findByBuyerRole(userId: string): Promise<UserEntity>{
        try {
            const foundUser = await this._userRepo.findOne({where: {user_id: userId},
            relations: ['deposit']
            })

            if(!foundUser) throw new HttpException('User with provided ID not found', HttpStatus.NOT_FOUND)

            return foundUser
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async findByUSerId(userId: string): Promise<UserEntity>{
        const foundUSer = await this._userRepo.findOne({where:{user_id: userId}, relations:['deposit', 'product']})

        if(!foundUSer) throw new HttpException('User with provided ID not found', HttpStatus.NOT_FOUND)

        return foundUSer
    }
    async findByUserName(username: string): Promise<UserEntity>{
        const foundUSer = await this._userRepo.findOne({where:{username: username}, relations:['deposit', 'product']})

        if(!foundUSer) throw new HttpException('User with provided ID not found', HttpStatus.NOT_FOUND)

        return foundUSer
    }

    async deleteUser(userId){
        try {
            const foundUser = await this._userRepo.findOne({where:{user_id: userId}})
            if(!foundUser) throw new HttpException('User with provided ID not found', HttpStatus.NOT_FOUND)

            return await this._userRepo.remove(foundUser)
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async getUserLoggedInStatus(username: string): Promise<boolean>{
        try {
            const foundUser = await this.findByUserName(username)
            const {loggedInStatus} = foundUser
            if(loggedInStatus === true){
                return true
            }else {
                return false
            }
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }

    }

    async updateLoggedInStatus(username: string){
        try {
            const foundUser = await this.findByUserName(username)
            if(!foundUser) throw new NotFoundException()
            foundUser.loggedInStatus = true
            return await this._userRepo.save(foundUser)
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }

    }

    async updateLoggedInStatusToFalse(username: string){
        try {
            const foundUser = await this.findByUserName(username)
            foundUser.loggedInStatus = false
            return await this._userRepo.save(foundUser)
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
  
    }

    async updateUser(userId: string, updateData: updateUserDto){
        try {
            const user = await this.findByUSerId(userId)
            for (const key in updateData) {
                if (updateData.hasOwnProperty(key)) {
                    user[key] = updateData[key]
                }
            }

            return await this._userRepo.save(user);

        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    async resetBuyerAccountBalance(buyerId: string){
        try {
            const foundUser = await this._depositRepo.findOne({where: {buyer:{user_id: buyerId}}})
            if(foundUser){
                foundUser.amount = 0;
                await this._depositRepo.save(foundUser)
            }else{
                throw new HttpException(`User not found with the provided ID ${buyerId}`, HttpStatus.NOT_FOUND)
            }
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

}
