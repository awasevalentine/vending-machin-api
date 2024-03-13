/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity('product')
export class ProductEntity{
    @PrimaryGeneratedColumn('uuid')
    product_id: string;

    @Column()
    productName: string;

    @Column()
    amountAvailable: number;

    @Column()
    cost: number;

    @ManyToOne(()=> UserEntity, (user)=> user.product)
    sellerId: UserEntity

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}