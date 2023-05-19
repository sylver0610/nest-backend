import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async createUser(
    @Body()
    user,
  ): Promise<User> {
    return this.userService.createUser(user);
  }

  @Get('/get')
  async findUserById() {
    return this.userService.findOne('admin@gmail.com');
  }
}
