/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

export enum CentsAllowed{
    cent5 = 5,
    cent10 = 10,
    cent20 = 20,
    cent50 = 50,
    cent100 =100
}

@Entity('deposit')
export class DepositEntity{
    @PrimaryGeneratedColumn('uuid')
    deposit_id: string;

    @Column({enum: CentsAllowed,  default: CentsAllowed.cent5})
    amount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(()=> UserEntity, (user)=> user.deposit)
    @JoinColumn()
    buyer: UserEntity
}