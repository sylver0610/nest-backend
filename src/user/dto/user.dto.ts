import { Role } from 'src/user/schemas/user.schema';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';

// @Entity()
export class CreateUserDto {
    // @IsUserAlreadyExist()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    @IsOptional()
    readonly firstName: string;

    @IsString()
    @IsOptional()
    readonly lastName: string;

    @IsEnum(Role, {
        message: `Role not match`,
    })
    @IsOptional()
    readonly role: Role;
}

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'email'] as const) {
    _id: object;
    // @IsUserAlreadyExist()
    // @IsString()
    // @IsEmail()
    // @IsNotEmpty()
    // @IsOptional()
    // readonly email: string;
    // @IsString()
    // @IsNotEmpty()
    // @IsOptional()
    // readonly password: string;
    // @IsString()
    // @IsOptional()
    // readonly firstName: string;
    // @IsString()
    // @IsOptional()
    // readonly lastName: string;
    // @IsString()
    // @IsOptional()
    // readonly role: Role;
}

export class LoginUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    _id: object;
}

export class PayloadUserCreatePairTokenDto {
    @IsMongoId()
    readonly sub: object;

    @IsString()
    readonly username: string;

    @IsEnum(Role, {
        message: `Role not match`,
    })
    readonly role: Role;
}
