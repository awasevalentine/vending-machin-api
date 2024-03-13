/* eslint-disable prettier/prettier */
import { CentsAllowed } from "../entities/deposit.entity";

/* eslint-disable prettier/prettier */
interface depositDto{
    readonly buyerId: string;
    readonly amount: CentsAllowed
}

export {
    depositDto
}