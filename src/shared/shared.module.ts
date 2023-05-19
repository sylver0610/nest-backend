import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
// import { Controller } from './.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class SharedModule {}
