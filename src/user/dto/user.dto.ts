import { Role } from 'src/schemas/user.schema';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

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

  @IsString()
  @IsOptional()
  readonly role: Role;
}
