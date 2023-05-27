import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/auth/constant';
import { JwtStrategy } from 'src/auth/strategy/jwt/jwt.strategy';
import { KeyModule } from 'src/key/key.module';

@Module({
    imports: [
        KeyModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: jwtConstants.expiresIn,
            },
        }),
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
    exports: [UserService],
})
export class UserModule {}
