import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), SharedModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
