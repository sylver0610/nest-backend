import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './user/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { KeyModule } from './key/key.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        AuthModule,
        UserModule,
        KeyModule,
    ],
    // providers: [IsUserAlreadyExist],
})
export class AppModule {}
