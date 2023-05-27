import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { KeyService } from './key.service';
import { KeyController } from './key.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { KeySchema } from './schemas/key.schema';
import { jwtConstants } from 'src/auth/constant';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Key', schema: KeySchema }]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: jwtConstants.expiresIn,
            },
        }),
    ],
    controllers: [KeyController],
    providers: [KeyService],
    exports: [KeyService],
})
export class KeyModule {}
