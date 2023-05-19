import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { getInfoData } from 'src/utils';
@Injectable({})
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}
  async register(user: User): Promise<User> {
    const { email } = user;
    const holderEmail = await this.userModel.findOne({ email }).lean();
    if (holderEmail) {
      throw new HttpException(`User with email ${email} already exists`, HttpStatus.BAD_REQUEST);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const res = await this.userModel.create({
      ...user,
      password: hashedPassword,
    });
    return getInfoData({ fields: ['_id', 'email', 'role'], object: res });
  }
}
//'email', 'role',
