import { role_type } from '@prisma/client';
export declare class CreateUserDto {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    preferred_language?: string;
    roles: role_type[];
}
