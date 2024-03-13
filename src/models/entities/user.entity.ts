/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductEntity } from "./product.entity";
import { DepositEntity } from "./deposit.entity";
import { Roles } from "../interfaces/role";


@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    user_id: string

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({enum: Roles})
    role: string;

    @Column({default: false, nullable: true})
    loggedInStatus: boolean;

    @OneToMany(()=>ProductEntity, (product)=> product.sellerId)
    @JoinTable()
    product: ProductEntity[];

    @OneToOne(()=> DepositEntity, (deposit)=> deposit.buyer)
    @JoinTable()
    deposit: DepositEntity

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date
}