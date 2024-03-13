/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */


interface createUserDto {
    readonly username: string;
    readonly password: string;
    readonly role: string
}

interface updateUserDto {
    readonly username: string;
    readonly password: string;
}

export {
    createUserDto,
    updateUserDto
}