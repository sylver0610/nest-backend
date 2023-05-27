import { IsJWT, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateKeyDto {
    @IsMongoId()
    readonly user: object;

    @IsString()
    readonly publicToken: string;

    @IsString()
    readonly privateToken: string;

    @IsJWT()
    @IsOptional()
    readonly refreshToken?: string;
}

export class RemoveKeyDto {
    @IsMongoId()
    readonly user: object;
}
