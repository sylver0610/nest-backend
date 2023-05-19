import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async createUser(user: User): Promise<User> {
    const res = await this.userModel.create(user);
    return res;
  }

  async findOne(email): Promise<User> {
    const res = await this.userModel.findOne({ email }).lean();
    return res;
  }
}
